import { Injectable } from '@angular/core';

@Injectable()
export class TriangleService {
  
    private static startOfAlphabet = 97;
  
    constructor() {}
  
    /**
     * Computes a Floyd Triangle of letter. 
     * Here's an example for rows = 5
     * 
     * a 
     * b c 
     * d e f 
     * g h i j 
     *
     * Adapted from http://www.programmingsimplified.com/c-program-print-floyd-triangle
     * 
     * @param  {number} rows
     * @return {string}     
     */
    public floydTriangle(rows:number):string{
  
      let currentLetter = TriangleService.startOfAlphabet;
      let resultString = "";
  
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < i; j++) {
          resultString += String.fromCharCode(currentLetter) + " ";
          currentLetter++;
        }
        resultString += "\n\r";
      }
  
      return resultString;
    }
  
    /**
     * Computes a Even Floyd Triangle of letter. 
     * Here's an example for rows = 7
     * 	     a 
     *      b c 
     *     d e f 
     *    g h i j 
     *   k l m n o 
     *  p q r s t u 
     * v w x y z { |
     * 
     * @param  {number} rows
     * @return {string}     
     */
    public evenFloydTriangle(rows:number):string{
  
      let currentLetter = TriangleService.startOfAlphabet;
      let resultString = "";
  
      for (let i = 0; i < rows; i++) {
  
        for (let j = 0; j <= (rows-i-2); j++) {
          resultString += " ";
        }
  
        for (let j = 0; j <= i; j++) {
          resultString += String.fromCharCode(currentLetter) + " ";
          currentLetter++;
        }
  
        resultString+="\n\r";
      }
  
      return resultString;
    }
  }
  