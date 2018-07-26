import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AngularObservableAppComponent, environment } from './app/';
import { IMDBAPIService } from './app/services/imdbapi.service';
import { HTTP_PROVIDERS }  from '@angular/http';


if (environment.production) {
  enableProdMode();
}

bootstrap(AngularObservableAppComponent, 
    [IMDBAPIService , HTTP_PROVIDERS]
);

