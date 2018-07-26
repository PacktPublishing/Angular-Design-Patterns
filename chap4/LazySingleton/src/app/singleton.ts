export class MySingleton{
    
    //The constructor is private so we 
    //can't do `let singleton:MySingleton = new MySingleton();`
    private static instance:MySingleton = null;

    private constructor(){

    }

    public static getInstance():MySingleton{
        if(MySingleton.instance == null){
            MySingleton.instance = new MySingleton();
        }

        return MySingleton.instance;
    }

}