//defining object literal
const person={
    name: 'Jossy',
    age: 21
}
//by default TS infers object- Type inference

//explicit type annotation- Inline type
const personn:{name: string; age:number}={
    name: 'Alice',
    age: 21
}

//using type to define object shapes
type Person={
    name: string,
    age: number
}

//passing optional properties using ? operator
type PersonOptionalProps={
    name: string;
    age?: number;
}
const Green1: PersonOptionalProps={
    name: 'Green',
    //age: 30- commenting this did not bring an error
}

//Intersection
type Employee={
    employeeID: number;
    employeeName: string
}
type Department={
    department: string;
}
type Manager= Employee & Department

const manager: Manager={
    employeeID: 123,
    employeeName: 'Jina',
    department: 'HR'
}

//Interfaces- similar to types but with more capabilities like extending from other interfaces
//no equal sign
interface Animall{
    name: string;
    age: number;
}
//extending the properties
interface Dog extends Animall{
    breed: string;
}
const myDog: Dog={
    name: 'Rex',
    age: 4,
    breed: 'German shepherd'
}
//Intersection- 2
type A_={
    propA: string,
}
type B_= A_ & {
    propB: number;
}
//Dynamic keys with index signatures
//const  syntax: {[key: string]: anyType}--the syntax
const dynamicKeyShape: {[key: string]: string}={}
dynamicKeyShape["age"]= "30"

//keys with fixed properties
type User= {
    id: number;
    name: string;
    [key: string]: string | number
}
//there will be no error if you don't pass in a dynamic key declared
const user1: User={
    id: 1,
    name: 'John'
}
console.log(user1)

//utility types
type Person1={
    name: string;
    age: number;
    location: string;
};
//partial<T>
type PartialPerson= Partial<Person1>;
const partialPerson: PartialPerson={
    name: 'Alice'
}
//Required<T>
type RequiredPerson= Required<Person1>;

//omit and pick
type Person2={
    name: string;
    age: number;
    location: string;
}
//pick- name and age
type NameAndAge= Pick<Person2, "name"|"age">
//create name and age type by ommitting location
type WithoutLocation= Omit<Person2, "location">

//combining known and dynamic keys using intersection
//type assertion and casting
const someValue: unknown= "Hello world"
const strLength: number= (someValue as string).length
console.log(strLength)//16

const fullName={
    name: 'Jossy'
}as {name: string}