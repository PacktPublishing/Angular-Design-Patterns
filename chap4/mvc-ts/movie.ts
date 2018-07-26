class Movie{
    
    constructor(private title:string, private release_year:number){}
    
    public getTitle():string{
        return this.title;
    }
    public getReleaseYear():number{
        return this.release_year;
    }
}
