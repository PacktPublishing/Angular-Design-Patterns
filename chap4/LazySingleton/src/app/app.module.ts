import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MySingleton } from './singleton';


import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';

import { ApiService } from './api.service';


@NgModule({
  declarations: [
    AppComponent,
    OtherComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
