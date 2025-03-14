//dotenv
//express instance
//load variables
//enable all important middleware
//create all routes
//load more middleware- eg error handlers
//start server

import express from 'express';
import dotenv from 'dotenv'
//1.dotenv
dotenv.config()
//2. instance of express
const app=express()
//3. 

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true,
  })
);
//routes
//middlewares