import { User } from '../poto/user';
import { APIService } from '../services/api.service';

export class UserModel{
    
    private user:User;
    private _loading:boolean = false;
    
    public constructor(private api:APIService){}

    public signin(email:string, password:string){

        this._loading = true;

        this.api.getUser(email, password).then(

            user => {
                this.user = user;
                this._loading = false;
            }
        );
    }

    public signup(email:string, password:string){

        this._loading = true;
        this.api.postUser(email, password).then(
            user => {
                this.user = user;
                this._loading = false;
            }   
        );
    }

    get loading():boolean{
        return this._loading;
    }

}