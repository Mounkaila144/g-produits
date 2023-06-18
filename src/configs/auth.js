import themeConfig from "./themeConfig";

export default {
  meEndpoint: themeConfig.url + 'me',
  loginEndpoint: themeConfig.url + 'login',
  registerEndpoint:themeConfig.url + 'register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
