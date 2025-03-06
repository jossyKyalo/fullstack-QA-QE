import express from "express"
import dotenv from "dotenv"
import {readFileSync} from "fs"
import path from 'path'
import cors from 'cors'

//configure dotenv
dotenv.config()
//instance of express
const app= express()
//load the variables
const port= process.env.PORT
console.log(port)

//enables cors for all origins
//app.use(cors())
//enable cors with options- RECOMMENDED
//to allow only: http://localhost:5173
app.use(cors({
    origin: "http://localhost:5173",
    //passing methods
    methods: "GET, PUT, DELETE",
    credentials: true//allow cookies and auth headers
}))
//get the current dir
const _dirname= path.resolve()

//synchronously read the file
const eventData= readFileSync(
    path.join(_dirname, "src", "db", "eventsData.json"), "utf-8"
)
//console.log(eventData)
//simple get request
app.get('/',(req, res)=>{
    res.send('Hello World, Be humble to us😭😂')
})

app.get('/events',(req, res)=>{
    res.send(eventData)
})

//create a new event---POST
//create server
app.put('api/v1/users', (req:Request, res: Response)=>{
    const userId= Number(req.params.id)
    const {userName, displayName}=req.body
    //validat the input
    if(isNaN(userId)){
        res.status(400).json({message: "Invalid user id"})
        return
    }
    const userIndex= userData.findIndex((user)=>user.userID===userId)
    //if the user index is unavailable
    if(userIndex===-1){
        res.status(404).json({message: "User not found"})
        return 
    }
    //replace the user at that index with new data
    userData[userIndex]={userID: userId, userName, displayName}
    res.json({message: "user successfully updated", user: userData[userIndex]})
}
)
//patch implementation
//partially update a user
// app.patch('api/v1/users', (req:Request, res: Response)=>{})
//creating a server

//DELETE
//remove user from the list
userData.splice(userIndex,1)
res.json({message: 'User successfully deleted'})
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})
//soc- separation of concern

