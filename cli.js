const axios = require('axios').default;

const IP = `127.0.0.1`;
const mxviewURL = `http://${IP}`;
const loginURL = `${mxviewURL}/login`;
const logoutURL = `${mxviewURL}/api/logout`;
const cliURL = `${mxviewURL}/api/devices/run_cli_object`;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let main = async () => {
    let login = async (userInfo) => {
        try {
            const doLogin = await axios.post(loginURL, userInfo);
            return doLogin.data;
        } catch (error) {
            throw new Error(error)
        }
    }

    let logout = async () => {
        try {
            const doLogout = await axios.post(logoutURL);
            return doLogout;
        } catch (error) {
            throw new Error(error)
        }
    }

    let execCLI = async (postBody) => {
        try {
            const cli = await axios.post(cliURL, postBody);
            return cli.data;
        } catch (error) {
            throw new Error(error)
        }
    }

    // login to get user token and assign it to http header
    // ======================================================================================================================================================
    // The token you get by login MXview can only be used in 30 minutes. 
    // You have to either refresh the token every 30 minutes.
    // If you need a long period token, you have to generate your own API key via API Key Management.
    // ======================================================================================================================================================
    const userToken = await login({ 'username': 'admin', 'password': 'moxa' });
    axios.defaults.headers.common = { 'Authorization': `Bearer ${userToken.mxviewGateway}` }

    // build ws connection
    const io = require("socket.io-client");
    const socket = io(`ws://${IP}/?token=${userToken.mxviewGateway}`
        , {
            reconnectionDelay: 10000,
            reconnection: true,
            transports: ['websocket'],
            agent: false,
            upgrade: false,
            rejectUnauthorized: false
        });

    socket.on("connect", () => {
        console.log('connect');
    });

    // handle MXview TRIGGER Event
    socket.on("TRIGGER", data => {
        // console.log('TRIGGER', data);
        if (typeof data.trigger_detail.cli_ticket_status !== 'undefined') {
            let cli_ticket_status = data.trigger_detail.cli_ticket_status;
            console.log('cli trigger result', cli_ticket_status);
        }

    });

    socket.on('connect_error', err => {
        console.log('connect_error', err);
    })

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    // CLI object name
    const CLI_ObjectName = {"name": "CLI_Devices_CMD"};
    // exec CLI object
    let result = await execCLI(CLI_ObjectName);
    console.log('cli response', result);

    // MUST logout to release mxview connections !!
    setTimeout(async () => {
        const logoutRet = await logout();
        console.log(logoutRet.status, logoutRet.statusText);
        socket.close()
    }, 60000)

}

main();
