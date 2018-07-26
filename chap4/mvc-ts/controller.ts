/// <reference path="./model.ts"/>

class Controller{
    
    private model:Model;

    constructor(){

        this.model = new Model();
    }

    click(title:string, year:number){

        console.log(title, year);
        this.model.addMovie(title, year);

    }

}
let controller = new Controller();
    