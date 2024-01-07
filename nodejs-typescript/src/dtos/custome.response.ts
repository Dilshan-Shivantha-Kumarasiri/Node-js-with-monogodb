export default class CustomeResponse {

    private _status:number;
    private _message:string;
    private _data:any
    private _totalPages?:any


    constructor(status: number, message: string, data?: any, totalPages?:any) {
        this._status = status;
        this._message = message;
        this._data = data;
        this._totalPages = totalPages;
    }


    get status(): number {
        return this._status;
    }

    set status(value: number) {
        this._status = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    toJson(){
        return {
            status:this._status,
            message:this._message,
            data:this._data,
            totalPages:this._totalPages
        }
    }
}