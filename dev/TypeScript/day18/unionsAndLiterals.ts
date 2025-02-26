//union
let value: string | number
value= 'Hello'

//declaring union types
//use pipe symbol
const logID= (id: string | number) =>{
    console.log(id)
}
logID('abc123')
logID(12345)

//types aliases with unions
type ID= string | number

const userID: ID= "user123abc"
const orderID: ID= 234

//literal types in unions
type Direction= "up"| "left"| "right"
type mpesaState= "success"| "failed"| "pending"
function smsService(transState: mpesaState){}

//combining unions with unions
type DigitalFormat="MP3"|"FLAC"
type PhysicalFormat="LP"|"CD"|"Casette"
type AlbumFormat= DigitalFormat|PhysicalFormat

//narrowing union types
//typeof
const printValue= (value: string | number)=>{
    if(typeof value ==='string'){
        console.log(value.toUpperCase())
    }else{
        console.log(value.toFixed(2))
    }
}

//literal narrowing
//discriminated unions
//unknown vs never in unions
