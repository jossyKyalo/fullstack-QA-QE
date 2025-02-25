// defining types and reusable
type Animal = {
    name: string;
    type: string;
    age?: number;
}
//we can add it as a type annotation to a new variable
let cow: Animal = {
    name: 'cow',
    type: 'mammal',
    age: 12
}
//lets reuse it
let cat: Animal = {
    name: 'Snake',
    type: 'Reptile',
    age: 6
}

const getAnimalDescription = (animal: Animal) => {

}
getAnimalDescription(cat)


//The type keyword
type Rectangle = {
    width: number;
    height: number;
}
const getRectangleArea = (rectangle: { width: number; height: number }) => {
    return rectangle.width * rectangle.height;
};
const getRectanglePerimeter = (rectangle: {
    width: number;
    height: number;
}) => {
    return 2(rectangle.width + rectangle.height);
};

//Exercise:

let newrectangle: Rectangle= {
    width: 20,
    height: 30
}
console.log(getRectangleArea(newrectangle))