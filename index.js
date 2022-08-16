const axios = require('axios').default;

const mxviewURL   = `http://192.168.56.101`;
const loginURL    = `${mxviewURL}/login`;
const logoutURL   = `${mxviewURL}/api/logout`;
const sitesURL    = `${mxviewURL}/api/sites`;

let main = async () => {
    let login = async (userInfo) =>{
        try {
            const doLogin = await axios.post(loginURL,userInfo);
            const { data } = doLogin // 資料在 data 屬性
            return data;
        } catch (error) {
            throw new Error(error)
        }
    }

    let logout = async () =>{
        try {
            const doLogout = await axios.post(logoutURL);
            return doLogout;
        } catch (error) {
            throw new Error(error)
        }
    }

    let getSite = async () =>{
        try {
            const doGetSite = await axios.get(sitesURL)
            const { data } = doGetSite 
            return data;
        } catch (error) {
            throw new Error(error)
        }
    }

    let getDeviesByIP = async (ip) =>{
        try {
            const doGetDevies = await axios.get(`${mxviewURL}/api/devices/ip/${ip}`)
            const { data } = doGetDevies 
            return data;
        } catch (error) {
            throw new Error(error)
        }
    }

    // get user token and assign to default header
    const userToken = await login({ 'password': 'moxa', 'username': 'admin' });
    axios.defaults.headers.common = {'Authorization': `Bearer ${userToken.mxviewGateway}`}

    // target devices ip
    const LLDP_DeviceIP = '192.168.127.106';
    
    // get siteId
    let sites = await getSite();
    for(siteInfo of sites){
        console.log('siteInfo', siteInfo.site_id, siteInfo.site_name);

        // Get device information by its IP address
        let devices = await getDeviesByIP(LLDP_DeviceIP);
        if(devices!=null&&Array.isArray(devices)&&devices.length>0){
            console.log('devices', devices);
            let aDeviceInfo = devices[0];
            let lldpRemPortId = aDeviceInfo.device_components.lldpRemPortId;
            let lldpRemSysName = aDeviceInfo.device_components.lldpRemSysName;
            console.log('lldpRemPortId', JSON.stringify(lldpRemPortId));
            console.log('lldpRemSysName', JSON.stringify(lldpRemSysName));
        } 
    }

    // MUST logout to release mxview connections !!
    const logoutRet = await logout();
    console.log(logoutRet.status, logoutRet.statusText);
}

main();
