const axios = require('axios').default;

const mxviewURL = `http://192.168.56.101`;
const loginURL  = `${mxviewURL}/login`;
const logoutURL = `${mxviewURL}/api/logout`;
const sitesURL  = `${mxviewURL}/api/sites`;

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

    let getSite = async () => {
        try {
            const doGetSite = await axios.get(sitesURL)
            return doGetSite.data;
        } catch (error) {
            throw new Error(error)
        }
    }

    let getDeviesByIP = async (ip, siteId) => {
        try {
            const doGetDevies = await axios.get(`${mxviewURL}/api/devices/ip/${ip}/site/${siteId}`)
            return doGetDevies.data;
        } catch (error) {
            console.error(`getDeviesByIP not found ! ${ip} , ${siteId} `);
            console.error(error);
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

    // target devices ip
    const LLDP_IPs = ['192.168.127.105'];

    // get siteId
    let sites = await getSite();
    for (siteInfo of sites) {
        console.log(JSON.stringify(siteInfo));
        for (deviceIP of LLDP_IPs) {
            // Get device information by its IP address
            let devices = await getDeviesByIP(deviceIP, siteInfo.site_id);
            if (devices != null && Array.isArray(devices) && devices.length > 0) {
                console.log('devices', devices);
                let aDeviceInfo = devices[0];
                let lldpRemPortId = aDeviceInfo.device_components.lldpRemPortId;
                let lldpRemSysName = aDeviceInfo.device_components.lldpRemSysName;
                console.log('lldpRemPortId', JSON.stringify(lldpRemPortId));
                console.log('lldpRemSysName', JSON.stringify(lldpRemSysName));
            }
        }
    }

    // MUST logout to release mxview connections !!
    const logoutRet = await logout();
    console.log(logoutRet.status, logoutRet.statusText);
}

main();
