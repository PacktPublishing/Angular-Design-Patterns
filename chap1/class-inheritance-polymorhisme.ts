
interface Animal{

	eat():void;
	sleep():void;
}

class Mammal implements Animal{

	constructor(private name:string){
		console.log(this.name, "is alive");
	}

	eat(){
		console.log("Like a mammal");
	}

	sleep(){
		console.log("Like a mammal");
	}
}

class Dog extends Mammal{

	eat(){
		console.log("Like a dog")
	}

}

class SmallDog extends Dog{
	eat() {
		console.log("Like a dog")
	}
}



function makeThemEat<T extends Dog>(dog:T):void{
	dog.eat();
}


let mammal: Mammal = new Mammal("Mammal");
let dolly: Dog = new Dog("Dolly");
let prisca: Mammal = new Dog("Prisca"); 
let abobination: Dog = new Mammal("abomination"); //-> Wait. WHAT ?!

makeThemEat(mammal);
makeThemEat(dolly);
makeThemEat(prisca);
makeThemEat<Mammal>(abobination);