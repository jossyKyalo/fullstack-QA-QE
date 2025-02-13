//empty object
const myObect={}

//insertion
myObject.firstName="Kyalo"
myObject.secondName="Josephine"
myObject.info={idNum:000000, country:'Kenya'}
//example
const Bruno={
    fname: 'Kyalo',
    age: 25,
    marks:[123,45,67,78]
}
//access modifiers
//1.dot notation
console.log(Bruno.age)
//2.index string type
console.log(Bruno["age"])
//3. object.keys
console.log(Object.keys(Bruno))
//lets access the age key
console.log(Objects.keys(Bruno)[1])

//this keyword- used to refer to current context
const myInfo={
    name: 'Kathini',
    age: 21,
    hobbies: ["Reading","Coding"]
    isMarried: false,
    meanGrade: function grades(meanGrade){
        return "Your mean grade is:" + meanGrade
    },
    keyFn: function(n){
        return this[Object.keys(this)[n]]
    }

}
console.log(myInfo.keyFn(1))