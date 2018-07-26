var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mammal = (function () {
    function Mammal() {
    }
    Mammal.prototype.eat = function () {
        console.log("Like a mammal");
    };
    Mammal.prototype.sleep = function () {
        console.log("Like a mammal");
    };
    return Mammal;
}());
var Dog = (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        _super.apply(this, arguments);
    }
    Dog.prototype.eat = function () {
        console.log("Like a dog");
    };
    return Dog;
}(Mammal));
function makeThemEat(animal) {
    animal.eat();
}
var mammal = new Mammal();
var dog = new Dog();
var labrador = new Mammal();
makeThemEat(mammal);
makeThemEat(dog);
makeThemEat(labrador);
