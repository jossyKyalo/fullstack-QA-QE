//ES6 Syntax:
let mark=0;
let grade='';
const myGrade1 = (mark) => {
    return mark = 100 ? 'A' :
        mark >= 70 ? 'B' :
        mark >= 50 ? 'C' :
        mark >= 30 ? 'D' :
        'Invalid input marks'
}
console.log(myGrade1(934))