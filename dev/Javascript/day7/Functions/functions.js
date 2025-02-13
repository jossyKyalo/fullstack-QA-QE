function average(marksArray){
    let total=0;
    for(const mark of marksArray){
        total+=mark;
    }
   
    let average=0;
    average= total/marksArray.length;
    return 'total is ${total} and average is ${average}';
}

//arrow function
const circleArea= (radius) =>{
    return 'The rea of a circle is: ${Math.PI*radius**2}'
}
console.log(circleArea(7))
//immediately invoked function
(function fnName() {})