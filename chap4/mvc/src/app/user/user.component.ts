import { Component, OnInit } from '@angular/core';
import { UserModel } from './../models/user.model'
import { APIService } from './../services/api.service'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private model:UserModel;

  constructor(api: APIService) {

    this.model = new UserModel(api);
  }

  ngOnInit() {
  }

  public signinClick(email:string, password:string){
    this.model.signin(email, password);
  }

  public signupClick(email:string, password:string){
    this.model.signup(email, password);
  }
}
