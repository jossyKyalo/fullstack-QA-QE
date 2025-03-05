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
//creating a server
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})
//soc- separation of concern

