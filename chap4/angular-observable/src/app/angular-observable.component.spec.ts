import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { AngularObservableAppComponent } from '../app/angular-observable.component';

beforeEachProviders(() => [AngularObservableAppComponent]);

describe('App: AngularObservable', () => {
  it('should create the app',
      inject([AngularObservableAppComponent], (app: AngularObservableAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'angular-observable works!\'',
      inject([AngularObservableAppComponent], (app: AngularObservableAppComponent) => {
    expect(app.title).toEqual('angular-observable works!');
  }));
});
