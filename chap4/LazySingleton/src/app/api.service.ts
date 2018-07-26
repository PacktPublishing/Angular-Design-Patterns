import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

  private static increment:number = 0;
  
  private constructor(){
    ApiService.increment++;
  }
  
  public toString() :string {
    return "Current instance: " + ApiService.increment;
  }

}