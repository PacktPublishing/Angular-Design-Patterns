import { Injectable } from '@angular/core';
import { Http }  from '@angular/http';
import { User } from '../poto/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { resolve } from 'dns';
import { reject } from 'q';

@Injectable()
export class APIService {

  private userURL:string = "assets/users.json";

  constructor(private http: Http) { }

  /**
   * Return a Promise to a USer matching id
   * @param  {string}            email
   * @param  {string}            password
   * @return {Promise<User>}   
   */
  public getUser(email:string, password:string):Promise<User>{
      console.log('getUser', email, password);

        return this.http.get(this.userURL)
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
            return new User(
                email,
                password
            )
        });
  } 

   /**
   * Post an user Promise to a User
   * @param  {string}            email
   * @param  {string}            password
   * @return {Promise<User>}   
   */
  public postUser(email:string, password:string):Promise<User>{
    
    return new Promise<User>((resolve, reject) => {
        resolve(new User(
            email,
            password
        ));
    });
  }

}