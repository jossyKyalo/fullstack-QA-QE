//exercise 1: basic types with function parameters
export const add = (a: any, b: any) => {
    return a + b;
}
const result = add(1, 2);
console.log(result)

//exercise 2: Annotating Empty Parameters
const concatTwoStrings = (a: string, b: string) => {
    return [a, b].join(" ");
};
const result2 = concatTwoStrings("Hello", "World");
console.log(result2)

//exercise 3: Basic types
export let example1: string = "Hello Wolrd!";
export let example2: number = 42;
export let example3: boolean = true;
export let example4: symbol = Symbol();
export let example5: bigint = 123n;

//exercise 4: The any type
export const handleFormData = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const value = Object.fromEntries(data.entries());

    return value;
};

//Object Literal types
//1. Object Literal types
// export const concatName=(user:{first: string; last: string}):string=>{
//     return `${user.first} ${user.last}`
// };

// //2. optional property types
// function concatName(user: {first: string; last?: string}){
//     if(!user.last){
//         return user.first;
//     }
//     return `${user.first} ${user.last}`;
// }

//Type aliases
//exercise 1: The type keyword
type Rectangle = {
    width: number;
    height: number;
}
const getRectangleArea = (rectangle: Rectangle) => {
    return rectangle.width * rectangle.height;
};
const getRectanglePerimeter = (rectangle: Rectangle) => {
    return 2 * (rectangle.width + rectangle.height);
};

const result1: number = getRectangleArea({
    width: 10,
    height: 20,
});
console.log(result1)

const result22: number = getRectanglePerimeter({
    width: 10,
    height: 20,
});
console.log(result22)

//Arrays  and Tuples
//Exercise 1: Array Type
type ShoppingCart = {
    userId: string;
    items: string[];
};
const processCart = (cart: ShoppingCart) => {
    console.log(cart)
};
processCart({
    userId: "user123",
    items: ["items1", "items2", "items3"]
});
//Exercise 2: Arrays of Objects
type Ingredient = {
    name: string;
    quantity: string;
}
type Recipe = {
    title: string;
    instructions: string;
    ingredients: Ingredient[];
};
const processRecipe = (recipe: Recipe) => {
    console.log(recipe)
};
processRecipe({
    title: "Chocolate Chip Cookies",
    ingredients: [
        { name: "Flour", quantity: "2 cups" },
        { name: "Sugar", quantity: "1 cup" },
    ],
    instructions: "...",
});

//Exercise 3: Tuples
const setRange = (range: [number, number]) => {
    const x = range[0];
    const y = range[1];

    // type Tests=[
    //     Expect<Equal<typeof x, number>>, 
    //     Expect<Equal<typeof y, number>>
    // ];
};


//Exercise 4: Optimal Members of Tuples
const goToLocation = (coordinates: [number, number, number?]) => {
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    const elevation = coordinates[2];
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Elevation:", elevation ?? "No elevation provided");
}
goToLocation([40.7128, -74.0060]);
goToLocation([40.7128, -74.0060, 10]); 

//passing types to functions
