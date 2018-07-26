var Movie = /** @class */ (function () {
    function Movie(title, release_year) {
        this.title = title;
        this.release_year = release_year;
    }
    Movie.prototype.getTitle = function () {
        return this.title;
    };
    Movie.prototype.getReleaseYear = function () {
        return this.release_year;
    };
    return Movie;
}());
/// <reference path="./movie.ts"/>
var Model = /** @class */ (function () {
    function Model() {
        this.movies = [];
    }
    Model.prototype.addMovie = function (title, year) {
        var movie = new Movie(title, year);
        this.movies.push(movie);
        this.appendView(movie);
    };
    Model.prototype.appendView = function (movie) {
        var node = document.createElement("LI");
        var textnode = document.createTextNode(movie.getTitle() + "-" + movie.getReleaseYear());
        node.appendChild(textnode);
        document.getElementById("movies").appendChild(node);
    };
    return Model;
}());
/// <reference path="./model.ts"/>
var Controller = /** @class */ (function () {
    function Controller() {
        this.model = new Model();
    }
    Controller.prototype.click = function (title, year) {
        console.log(title, year);
        this.model.addMovie(title, year);
    };
    return Controller;
}());
var controller = new Controller();
