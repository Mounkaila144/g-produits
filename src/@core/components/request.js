import axios from 'axios';
import jwt_decode from "jwt-decode";
import themeConfig from "../../configs/themeConfig";
import authConfig from "../../configs/auth";

const MyRequest = async (route, method = 'GET', data = null, headers = {}) => {

    const token=window.localStorage.getItem(authConfig.storageTokenKeyName)
    var decoded = jwt_decode(token);
    const currentTime = new Date().getTime() / 1000; // Obtenez le temps actuel en secondes
    if (decoded.exp < currentTime) {
        localStorage.clear()
      authConfig.onTokenExpiration = 'logout'
        window.location.reload();
    } else {
          return axios({
            method:method,
            data:data,
            baseURL:`${themeConfig.url}${route}` ,
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            },
        });
    }
};

export default MyRequest;
