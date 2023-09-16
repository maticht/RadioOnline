import axios from "axios";

const $host = axios.create({
    baseURL: 'http://test.server757413.nazwa.pl'
})

const $authHost = axios.create({
    baseURL: 'http://test.server757413.nazwa.pl'
})

// const authInterceptor = config => {
//     config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
//     return config
// }
//
// $authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}
