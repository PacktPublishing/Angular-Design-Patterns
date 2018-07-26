import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FloydComponent } from './floyd/floyd.component';
import { AngularPreDirective } from './angular-pre.directive';
import { ParagraphPipe } from './paragraph.pipe';
import { ReplaceAllPipe } from './replace-all.pipe';


@NgModule({
  declarations: [
    AppComponent,
    FloydComponent,
    AngularPreDirective,
    ParagraphPipe,
    ReplaceAllPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
