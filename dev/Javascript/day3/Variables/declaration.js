let name;//used for variables that can be reassigned later
//const marks; //const must be initialized & cannot be changed

//Naming conventions
//1.use camelCaase
let isLoggedIn= true
//2.start with a letter, underscore, or a dollar sign.
let $dollars=234
let _dollars=123
let dollars=345

//3. be descriptive

//Types of data structures:
//numbers, strings, booleans, nulls, undefined, objects, arrays, bigInts

//bolean -true or false
const isAuthourized= false

//isAuthorized ? <ShowProfile/>:<ShowAuthPage/>
//undefined= have not defined the variable
let student;
console.log(student)

//data is empty, returns null-nullable
const noData={number: null}
console.log(noData.number)

//object
//{}- empty object
let myData={}
console.log(myData)
//to add data to object you use . notation
myData.name="Jkk"
myData.university="Dekut"
console.log(myData)
//Arrays
//[]
isMarried=true
const info=["Josephine Kyalo", 20, "DeKUT", {IdNO: 23456700, nationality:"Kenyan"}, isMarried]
console.log(info)

//type coacion
//Type coercion
console.log("5"+3);//string concatenation