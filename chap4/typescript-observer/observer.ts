export interface Observer{
    notify(value?:any, subject?:Subject);
}

export class HumanObserver implements Observer{

    constructor(private name:string){}

    notify(value?:any, subject?:Subject){
        console.log(this.name, 'received', value, 'from', subject);
    }
}

export class Subject{

    private obervers:Observer[] = [];

    attachObserver(oberver:Observer):void{
        this.obervers.push(oberver);
    }

    detachObserver(oberver:Observer):void{

        let index:number = this.obervers.indexOf(oberver);
        if(index > -1){
            this.obervers.splice(index, 1);
        }else{
            throw "Unknown oberver";
        }
    }

    protected notifyObservers(value?:any){

        for (var i = 0; i < this.obervers.length; ++i) {
            this.obervers[i].notify(value, this);
        }
    }
}

export class IMDB extends Subject{

    private movies:string[] = [];

    public addMovie(movie:string){
        this.movies.push(movie);
        this.notifyObservers(movie);
    }

}

let imbd:IMDB = new IMDB();
let mathieu:HumanObserver = new HumanObserver("Mathieu");

imbd.attachObserver(mathieu);
imbd.addMovie("Jaws");
imbd.detachObserver(mathieu);
imbd.addMovie("Die Hard");