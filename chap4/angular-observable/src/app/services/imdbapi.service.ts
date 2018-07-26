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
   * Return an Observable to a Movie matching id
   * @param  {number}            id
   * @return {Observable<Movie>}   
   */
  public fecthOneById(id:number):Observable<Movie>{
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
        /**
         * Map the json movie item to the Movie model
         */
        .map((movie:any) => {
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
            );
        });
  } 

  public fetchByField(field:MovieFields, value:any){
      console.log('fetchByField', field, value);

      return this.http.get(this.moviesUrl)
        /**
         * Transforms the result of the http get, which is observable
         * into one observable by item.
         */
        .flatMap(res => res.json().movies)
        /**
         * Filters movies by their field
         */
        .filter((movie:any)=>{
            console.log("filter", movie);
             var now = new Date().getTime();
            while(new Date().getTime() < now + 2000){ /* do nothing */ } 

            return (movie[MovieFields[field]] === value)
        })
        /**
         * Map the json movie item to the Movie model
         */
        .map((movie:any) => {
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
            );
        });

  }
}
