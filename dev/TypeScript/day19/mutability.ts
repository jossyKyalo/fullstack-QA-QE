//state is immutable
let isAdmin= true
isAdmin= false

//mutability- ability of a value to be changed after it has been created
//primitive types are immutable==string, number, boolean, null, undefined, symbol
let str= "Hello"
console.log(str.toUpperCase())//HELLO
console.log(str)//Hello

//objects and arrays are mutable
const arr: number[]=[1,2,3,4,5]
arr.push(6)
console.log(arr)//6 is included

const obj={name:"Jossy", age:37}
obj.age= 21
console.log(obj)//age is updated

//making objs to be immutable
//use readonly--property
type User= {
    readonly name:string;
    age:number;
}
const user: User={name: "Jossy", age: 30}
//changing the name property
user.name="Kathini"//Cannot assign to 'name' because it is a read-only property.ts(2540)
//but we can change the age
user.age=56//age is not readonly

//utility readonly
const readonlyObj: Readonly<User>={name: "Jossy", age:40}
readonlyObj.age=12//Cannot assign to 'age' because it is a read-only property.ts(2540)

//passing types to functions
function greet(name:string):string{
    return `Hello ${name}`
}
console.log(greet("Alice"))

//Generics in functions
function identity<T>(value: T){
    return value
}
console.log(identity<string>("Hello"))
console.log(identity<{name: string; age:number}>({name:"John", age:34}))

//passing multiple generics
function merge<T, U>(obj1:T, obj2:U): T&U{
    return {...obj1, ...obj2}
}
const mergedbj = merge({name: "Green"}, {age: 33})
console.log(mergedbj)//{name: 'Green', age:34}

//Arrays in TS
const fruits: Array<string>= ["Apple", "Banana", "Cherry"]
const marks: number[]=[1,2,3,4,5]

//promises in typescript
type UserType={
    uid: string;
    uName: string;
    isAdmin: boolean;
}
const data: UserType={
    uid: 'dfghjk2134',
    uName:'245mimi',
    isAdmin: false
}
const fetchData= async (/*id: string*/):Promise<UserType>=>{
    const user_data= await data
    return user_data
}
fetchData().then((user)=> console.log(user))

//sets in ts
//collection of unique values- JS
//in TS it is typed using Set<Type>
const mySet: Set<number>= new Set([1,2,3,4,5])
mySet.add(6)
console.log(mySet)
console.log(mySet.has(3))//true

//creating an empty set with specific types
const emptySet= new Set<string>()
emptySet.add('Hello')
console.log(emptySet)

//type assertions and casting
//use as / use angle bracket syntax

const jsonString= '{"name":"Alice","age":30}';
const parsedData= JSON.parse(jsonString) as {name: string; age:number}
console.log('xxx', parsedData)
//using angle brackets
const parsedData2= <{name: string; age:number}>JSON.parse(jsonString);

//default parameters

//rest parameters
/*
const sun= {...numbers: number[]}=>{
    return  numbers.reduce((prev, next)=> prev + next, 0)
}*/