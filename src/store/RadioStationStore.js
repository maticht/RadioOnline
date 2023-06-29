import {makeAutoObservable} from "mobx";

export default class RadioStationStore {
    constructor() {
        this._searchName = ''
        this._countries = []
        this._genres = []
        this._languages =[]
        this._radios = []
        this._selectedCountry = {}
        this._selectedGenre = {}
        this._selectedLanguage = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 5
        makeAutoObservable(this)
    }

    setGenres(genres){
        this._genres = genres
    }
    setCountries(countries){
        this._countries = countries
    }

    setLanguages(languages){
        this._languages = languages
    }

    setRadios(radios){
        this._radios = radios
    }

    setSelectCountry(country){
        this.setPage(1)
        this._selectedCountry = country
    }

    setSelectGenre(genre){
        this.setPage(1)
        this._selectedGenre = genre
    }

    setSelectLanguage(language){
        this.setPage(1)
        this._selectedLanguage = language
    }

    setPage(page){
        this._page = page
    }

    setTotalCount(totalCount){
        this._totalCount = totalCount
    }

    setSearchName(searchName){
        this._searchName = searchName
    }

    get genres(){
        return this._genres
    }
    get countries(){
        return this._countries
    }

    get radios(){
        return this._radios
    }

    get languages(){
        return this._languages
    }

    get selectedCountry(){
        return this._selectedCountry
    }

    get selectedGenre(){
        return this._selectedGenre
    }

    get selectedLanguage(){
        return this._selectedLanguage
    }
    get page(){
        return this._page
    }
    get totalCount(){
        return this._totalCount
    }
    get limit(){
        return this._limit
    }

    get searchName(){
        return this._searchName
    }


}