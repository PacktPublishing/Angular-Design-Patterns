export class User {
    
    public constructor(private _email:string, private _password:string){}

    get email():string{
        return this._password;
    }

    get password():string{
        return this._email;
    }

    set email(email:string){
        this._password = email;
    }

    set password(password:string){
        this._email = password;
    }
}