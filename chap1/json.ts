class User{

	constructor(private lastName:string, private firstName:string){

	}

	hello(){
		console.log("Hi I am", this.firstName, this.lastName);
	}
}


class InstanceLoader {
    static getInstance<T>(context: Object, name: string, rawJson:any): T {
        var instance:T = Object.create(context[name].prototype);

        for(var attr in instance){
        	instance[attr] = rawJson[attr];
        	console.log(attr);
        }

        return <T>instance;
    }
}

let userFromUJSONAPI: User = JSON
	.parse('[{"lastName":"Nayrolles","firstName":"Mathieu"}]')
	.map(
	(json: any): User => {
		return new User(json.lastName, json.firstName);
	}
	)[0];


userFromUJSONAPI.hello();