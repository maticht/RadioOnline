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

export const getRadios = async (country_id, genre_id, page, limit = 5, searchName) =>{
    const {data} = await $host.get('api/radio', {params:
            {
                country_id, genre_id, page, limit, searchName
            }
    })
    return data
}
export const fetchOneProduct = async (id) =>{
    const {data} = await $host.get('api/product/' + id)
    return data
}
