import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._ping = {}
        makeAutoObservable(this)
    }

    setPing(ping){
        this._ping = ping
    }

    get ping(){
        return this._ping
    }

}
