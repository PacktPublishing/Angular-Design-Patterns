import { Injectable } from '@angular/core';
import { Http }  from '@angular/http';
import { Movie, MovieFields } from '../models/movie';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class IMDBAPIService {

  private moviesUrl:string = "app/marvel-cinematic-universe.json";

  constructor(private http: Http) { }

  /**
   * Return a Promise to a Movie matching id
   * @param  {number}            id
   * @return {Promise<Movie>}   
   */
  public fecthOneById(id:number):Promise<Movie>{
      console.log('fecthOneById', id);

        return this.http.get(this.moviesUrl)
        /**
         * Transforms the result of the http get, which is observable
         * into one observable by item.
         */
        .flatMap(res => res.json().movies)
        /**
         * Filters movies by their movie_id
         */
        .filter((movie:any)=>{
            console.log("filter", movie);
            return (movie.movie_id === id)
        })
        .toPromise()
        /**
         * Map the json movie item to the Movie model
        */
        .then((movie:any) => {
            console.log("map", movie); 
            return new Movie(
                movie.movie_id,
                movie.title,
                movie.phase,
                movie.category_name,
                movie.release_year,
                movie.running_time,
                movie.rating_name,
                movie.disc_format_name,
                movie.number_discs,
                movie.viewing_format_name,
                movie.aspect_ratio_name,
                movie.status,
                movie.release_date,
                movie.budget,
                movie.gross,
                movie.time_stamp
            )
        });
  } 

  /**
   * Private member storing pending promises
   */
  private promises:Promise<Movie[]>[] = [];

  /**
   * Register one promess for field/value. Returns this
   * for chaining i.e.
   *
   *  byField(Y, X)
   * .or(...)
   * .fetch()
   * 
   * @param  {MovieFields}    field
   * @param  {any}            value
   * @return {IMDBAPIService}      
   */
  public byField(field:MovieFields, value:any):IMDBAPIService{
      this.promises.push(this.fetchByField(field, value));
      return this;
  }

  /**
   * Convenient method to make the calls more readable, i.e.
   * 
   *  byField(Y, X)
   * .or(...)
   * .fetch()
   *
   * instead of 
   *
   *  byField(Y, X)
   * .byField(...)
   * .fetch()
   * 
   * @param  {MovieFields}    field
   * @param  {any}            value
   * @return {IMDBAPIService}      
   */
  public or(field:MovieFields, value:any):IMDBAPIService{
      return this.byField(field, value);
  }

  /**
   * Join all the promises and return the aggregated result.
   * 
   * @return {Promise<Movie[]>}
   */
  public fetch():Promise<Movie[]>{
      return Promise.all(this.promises).then((results:any) => {
            //result is am array of movie arrays. One array per 
            //promise. We need to flatten it.
            return [].concat.apply([], results);
      });
  }

  public fetchByField(field:MovieFields, value:any):Promise<Movie[]>{
      console.log('fetchByField', field, value);

      return this.http.get(this.moviesUrl)
        /**
         * Transforms the result of the http get, which is observable
         * into one observable by item.
         */
        .map(res => res.json().movies.filter(
            (movie)=>{
                return (movie[MovieFields[field]] === value)
            })
        )
        .toPromise()
        /**
         * Map the json movie item to the Movie model
        */
        .then((jsonMovies:any[]) => {

            console.log("map", jsonMovies); 
            let movies:Movie[] = [];

            for (var i = 0; i < jsonMovies.length; i++) {
                movies.push(
                    new Movie(
                        jsonMovies[i].movie_id,
                        jsonMovies[i].title,
                        jsonMovies[i].phase,
                        jsonMovies[i].category_name,
                        jsonMovies[i].release_year,
                        jsonMovies[i].running_time,
                        jsonMovies[i].rating_name,
                        jsonMovies[i].disc_format_name,
                        jsonMovies[i].number_discs,
                        jsonMovies[i].viewing_format_name,
                        jsonMovies[i].aspect_ratio_name,
                        jsonMovies[i].status,
                        jsonMovies[i].release_date,
                        jsonMovies[i].budget,
                        jsonMovies[i].gross,
                        jsonMovies[i].time_stamp
                    )
                )
            }
            return movies;
        });

  }
}
