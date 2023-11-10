import axios from "axios";

const $host = axios.create({
    baseURL: 'https://backend.radio-online.me'
})

const $authHost = axios.create({
    baseURL: 'https://backend.radio-online.me'
})
//'http://localhost:8081'
//'https://backend.radio-online.me'


// https://backend.radio-online.me

// const authInterceptor = config => {
//     config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
//     return config
// }
// baseURL: 'http://localhost:8081'
// $authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}
