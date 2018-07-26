import { Injectable } from '@angular/core';
import { Action } from 'redux';

@Injectable()
export class LoginAction {
  static LOGIN = 'LOGIN';
  static LOGOUT = 'LOGOUT';

  loggin(): Action {
    return { type: LoginAction.LOGIN };
  }

  logout(): Action {
    return { type: LoginAction.LOGOUT };
  }
}