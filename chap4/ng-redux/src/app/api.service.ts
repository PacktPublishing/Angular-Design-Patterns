import { Injectable } from '@angular/core';
import { Http }  from '@angular/http';
import { User } from './user';
import 'rxjs/Rx';
import { NgRedux } from '@angular-redux/store';
import { LoginAction } from './app.actions';
import {IAppState } from './store';

@Injectable()
export class APIService {

  private userURL:string = "assets/users.json";

  constructor(
      private http: Http, 
      private ngRedux: NgRedux<IAppState>, 
      private actions: LoginAction) { }

  /**
   * Return a Promise to a USer matching id
   * @param  {string}            email
   * @param  {string}            password
   * @return {Promise<User>}   
   */
  public login(email:string, password:string){
        console.log('login', email, password);

        this.http.get(this.userURL)
        /**
         * Transforms the result of the http get, which is observable
         * into one observable by item.
         */
        .flatMap(res => res.json().users)
        /**
         * Filters users by their email & password
         */
        .filter((user:any)=>{
            console.log("filter", user);
            return (user.email === email && user.password == password)
        })
        .toPromise()
        /**
         * Map the json user item to the User model
        */
        .then((user:any) => {
            console.log("map", user); 
            this.ngRedux.dispatch(this.actions.loggin());
        });
  } 

   /**
   * Post an user Promise to a User
   * @param  {string}            email
   * @param  {string}            password
   */
  public logout(){
        this.ngRedux.dispatch(this.actions.logout());
  }

}