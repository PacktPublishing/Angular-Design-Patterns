import { Component, OnDestroy } from '@angular/core';

import { NgRedux } from '@angular-redux/store';
import { LoginAction } from './app.actions';
import { IAppState } from "./store";
import { APIService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy { 
  title = 'app';
  subscription;
  logged: boolean;

  constructor(                          
    private ngRedux: NgRedux<IAppState>,
    private api:APIService) {

      this.subscription = ngRedux.select<boolean>('logged')
      .subscribe(logged => this.logged = logged);   
    } 

  login(email:string, password:string) {
    this.api.login(email, password);
  }

  logout() {
    this.api.logout();
  }

  ngOnDestroy() {                    
    this.subscription.unsubscribe(); 
  }    
}
