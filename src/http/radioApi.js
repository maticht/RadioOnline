import {$authHost, $host} from "./index";

export const createCountry = async (country) =>{
    const {data} = await $authHost.post('api/country', country)
    return data
}

export const deleteCountry = async (id) =>{
    const {data} = await $authHost.get('api/country/' + id)
    return data
}

export const getAllCountries = async () =>{
    const {data} = await $host.get('api/country')
    return data
}

export const createLanguage = async (language) =>{
    const {data} = await $authHost.post('api/language', language)
    return data
}

export const deleteLanguage = async (id) =>{
    const {data} = await $authHost.get('api/language/' + id)
    return data
}

export const getAllLanguages = async () =>{
    const {data} = await $host.get('api/language')
    return data
}

export const createGenre = async (genre) =>{
    const {data} = await $authHost.post('api/genre', genre)
    return data
}

export const getAllGenres = async () =>{
    const {data} = await $host.get('api/genre', )
    return data
}

export const deleteGenre = async (id) =>{
    const {data} = await $authHost.get('api/genre/' + id)
    return data
}

export const createRadio = async (radio) =>{
    const {data} = await $authHost.post('api/radio', radio)
    return data
}

export const getRadios = async (country_id, genre_id, page, limit, searchName) =>{
    const {data} = await $host.get('api/radio', {params:
            {
                country_id, genre_id, page, limit, searchName
            }
    })
    console.log('запрос отработал')
    return data
}



export const deleteRadio = async (id) => {
    const {data} = await $authHost.post('api/radio/delete/'  + id, id)
    return data
}

export const updateRadio = async (radio) => {
    console.log('popal2')
    const {data} = await $authHost.post('api/radio/upd', radio)
    return data
}

export const fetchOneRadio = async (id) =>{
    const {data} = await $host.get('api/radio/' + id)
    return data
}

export const fetchCurrentMusicName = async (radio) =>{
    const {data} = await $host.post('api/radio/musicName/' + radio.id, radio)
    return data
}

export const fetchMinusOnline = async (id) =>{
    const {data} = await $host.get('api/radio/onlineM/' + id)
    return data
}

export const fetchExitMinusOnline = async (id) =>{
    const {data} = await $host.get('api/radio/ExitOnlineM/' + id)
    return data
}

export const fetchPlusOnline = async (id) =>{
    const {data} = await $host.get('api/radio/onlineP/' + id)
    return data
}