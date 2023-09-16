import {$authHost, $host} from "./index";

export const createCountry = async (country) => {
    const {data} = await $authHost.post('api/country', country)
    return data
}

export const deleteCountry = async (id) => {
    const {data} = await $authHost.post('api/country/delete', id)
    return data
}

export const getAllCountries = async () => {
    const {data} = await $host.get('api/country')
    return data
}

export const createLanguage = async (language) => {
    const {data} = await $authHost.post('api/language', language)
    return data
}

export const deleteLanguage = async (id) => {
    const {data} = await $authHost.post('api/language/delete', id)
    return data
}

export const getAllLanguages = async () => {
    const {data} = await $host.get('api/language')
    return data
}

export const createGenre = async (genre) => {
    const {data} = await $authHost.post('api/genre', genre)
    return data
}

export const getAllGenres = async () => {
    const {data} = await $host.get('api/genre',)
    return data
}

export const deleteGenre = async (id) => {
    const {data} = await $authHost.post('api/genre/delete', id)
    return data
}

export const createRadio = async (radio) => {
    const {data} = await $authHost.post('api/radio', radio)
    return data
}

export const getRadios = async (country_id, genre_id, page, limit, searchName) => {
    const {data} = await $host.get('api/radio', {
        params:
            {
                country_id, genre_id, page, limit, searchName
            }
    })
    return data
}

<<<<<<< HEAD

=======
export const getFavoritesRadios = async(ids)=>{
    const {data} = await $host.post('api/radio/favorites', {ids})
    console.log('запрос отработал')
    return data
}
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31

export const deleteRadio = async (id) => {
    const {data} = await $authHost.post('api/radio/delete/' + id, id)
    return data
}

export const updateRadio = async (radio) => {
    console.log('popal2')
    const {data} = await $authHost.post('api/radio/upd', radio)
    return data
}

export const fetchOneRadio = async (id) => {
    const {data} = await $host.get('api/radio/' + id)
    return data
}

<<<<<<< HEAD
export const fetchCurrentMusicName = async (radio) =>{
=======
export const fetchOneRadioByLink = async (link) => {
    const {data} = await $host.get('api/radio/link/' + link)
    return data
}

export const fetchCurrentMusicName = async (radio) => {
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31
    const {data} = await $host.post('api/radio/musicName/' + radio.id, radio)
    return data
}

<<<<<<< HEAD
export const fetchMinusOnline = async (id) =>{
    const {data} = await $host.get('api/radio/onlineM/' + id)
    return data
}

export const fetchPlusOnline = async (id) =>{
    const {data} = await $host.get('api/radio/onlineP/' + id)
    return data
}
=======
export const createCustomError = async (customError) => {
    const {data} = await $authHost.post('api/customError', customError)
    return data
}

export const deleteCustomError = async (id) => {
    const {data} = await $authHost.post('api/customError/delete', id)
    return data
}

export const getAllCustomErrors = async () => {
    const {data} = await $host.get('api/customError')
    return data
}

export const createCustomRating = async (customError) => {
    const {data} = await $authHost.post('api/customRating', customError)
    return data
}

export const deleteCustomRating = async (id) => {
    const {data} = await $authHost.post('api/customRating/delete', id)
    return data
}

export const getAllCustomRating = async () => {
    const {data} = await $host.get('api/customRating')
    return data
}

// export const calculateAudioBitrate = async (radio)=>{
//     const {data} = await $host.post('api/radio/bitrate/'+radio.id, radio)
//     return data
// }
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31
