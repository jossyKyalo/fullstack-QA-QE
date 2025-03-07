import express, {Request, Response} from "express"
import dotenv from "dotenv"
import {readFileSync} from "fs"
import path from 'path'
import cors from 'cors'
import { Pool } from 'pg'
 
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
//create a user (post /api/v1/users)
//reading an external thing like a file, a database, etc, cloud
//these things need time to connect to them- so making the request asynchronous will help the logic
app.post('/api/v1/users', async(req:Request, res: Response)=>{
    try{
        const {name, email, password}= req.body
        //check email exists
        const emailExists= await Pool.query("SELECT id FROM users WHERE email= $1", [email])
        if (emailExists.rows.length>0){
            res.status(400).json({
                message: "User already exists"
            })
        }
        //insert user
        const userResult= await Pool.query(
            "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *;",[name, email, password]
        )
        res.status(201).json({
            message: "User successfully created",
        })
    }catch(error){

    }
})
//creating a server
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})
//soc- separation of concern

