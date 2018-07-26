/// <reference path="./movie.ts"/>

class Model{
    
    private movies:Movie[] = [];

    constructor(){
    }

    public addMovie(title:string, year:number){
        let movie:Movie = new Movie(title, year);
        this.movies.push(movie);
        this.appendView(movie);
    }

    private appendView(movie:Movie){
        var node = document.createElement("LI"); 
        var textnode = document.createTextNode(movie.getTitle() + "-" + movie.getReleaseYear()); 
        node.appendChild(textnode);
        document.getElementById("movies").appendChild(node);
    }

}
    