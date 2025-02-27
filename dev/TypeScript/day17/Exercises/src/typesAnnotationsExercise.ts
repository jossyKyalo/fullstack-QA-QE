//exercise 1: basic types with function parameters
export const add= (a: any, b: any)=>{
    return a + b;
}
const result= add(1,2);
console.log(result)

//exercise 2: Annotating Empty Parameters
const concatTwoStrings=(a: string, b: string)=>{
    return [a, b].join(" ");
};
const result2 = concatTwoStrings("Hello","World");
console.log(result2)

//exercise 3: Basic types
export let example1: string= "Hello Wolrd!";
export let example2: number= 42;
export let example3: boolean= true;
export let example4: symbol=Symbol();
export let example5: bigint= 123n;

//exercise 4: The any type
export const handleFormData = (e: any) => {
    e.preventDefault();
  
    const data = new FormData(e.target); 
  
    const value = Object.fromEntries(data.entries());
  
    return value;
  };
 
  //Object Literal types
  //1. Object Literal types
export const concatName=(user:{first: string; last: string}):string=>{
    return `${user.first} ${user.last}`
};

//2. optional property types
function concatName(user: {first: string; last?: string}){
    if(!user.last){
        return user.first;
    }
    return `${user.first} ${user.last}`;
}