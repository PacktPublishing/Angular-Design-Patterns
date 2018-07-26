import { Action } from 'redux';
import { LoginAction } from './app.actions';

export interface IAppState {
    logged: boolean;
}

export const INITIAL_STATE: IAppState = {
  logged: false,
};

export function rootReducer(lastState: IAppState, action: Action): IAppState {
  switch(action.type) {
    case LoginAction.LOGIN: return { logged: !lastState.logged };
    case LoginAction.LOGOUT: return { logged: !lastState.logged };
  }

  // We don't care about any other actions right now.
  return lastState;
}