//generics work with variety of types....they act as placeholders for types
function getFirstElement<T>(arr: T[]):T{
    return arr[0];
}
const numbers=[1,2,3]
const strings=['mimi','wewe','sisi']
const firstNumber=getFirstElement(numbers)
const firstString=getFirstElement(strings)
console.log(firstNumber)
console.log(firstString)

//single generic parameter
function reverseArray<T>(arr: T[]){
    return arr.reverse()
}
const numArr= [1,2,3]
console.log(reverseArray(numArr))

//multiple generic parameters
function mergeObjs<T, U>(obj1:T, obj2: U){
    return {...onj1, ...obj2}
}
const objA= {name:'Tiony', age: 22}
const objB={country: 'Kenya', county:'Uasin Gishu'}

console.log(mergeObjs(objA, objB))

//generic constraints
//can limit the types to be passed
function getProperty<T, K extends keyof T>(obj: T, key: K){
    return obj[key]
}
const person= {name: 'Jossy', age: 30}
const name1= getProperty(person, "name")
console.log(name1)
// const name2= getProperty(person, "Jane")

//default type generics
function createPair<T=string, U=number>(value1: T, value2: U): (T|U)[]{
    return [value1, value2]
}
console.log(createPair('hello', 45))
//default parameters will be overwritten
console.log(createPair(100, true))

//Generics with interfaces and types
//interface
interface KeyValuePairs<K, V>{
    key: K;
    value: V;
}
const numPairs: KeyValuePairs<string, number>={
    key: 'id',
    value: 123
}

//Type aliases with generics
type EmployeeType={
    name: string;
    age: number;
}

//generic type
type Result<T>={
    success: boolean;
    data: T;
    error?: string
}
const successResponse: Result<string>={
    success: true,
    data: 'Operation was successful'
}

//conditional type with generics
type IsString<T>= T extends string? 'Yes': 'No'
function IsString<T>(value: T){
    if(typeof value === 'string'){
        console.log('yes')
    }else{
        console.log('No')
    }
}
const Result1= IsString('Hi')
console.log(Result1)

//Mapped types with generics