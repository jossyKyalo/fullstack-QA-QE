"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import express from "express"
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
//configure dotenv---top most level
dotenv_1.default.config();
//instance of express--second most top level
const app = (0, express_1.default)();
//load the variables
const port = process.env.PORT;
const secret = process.env.SECRET;
console.log(port);
console.log(secret);
//enables cors for all origins
//app.use(cors())
//enable cors with options- RECOMMENDED
//to allow only: http://localhost:5173
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    //passing methods
    methods: "GET, PUT, DELETE",
    credentials: true //allow cookies and auth headers
}));
//get the current dir
const _dirname = path_1.default.resolve();
//synchronously read the file
const eventData = (0, fs_1.readFileSync)(path_1.default.join(_dirname, "src", "db", "eventsData.json"), "utf-8");
//console.log(eventData)
//sample event data
const events = [
    { id: 1, title: "Summer Music Festival", price: 50, location: "New York", company: "Music Festivals Inc." },
    { id: 2, title: "Food and Wine Expo", price: 75, location: "San Francisco", company: "Food and Wine Events LLC" },
    { id: 3, title: "Comic Con", price: 35, location: "Los Angeles", company: "Comic Con International" },
    { id: 4, title: "Art and Design Fair", price: 20, location: "Chicago", company: "Art and Design Expo LLC" },
    { id: 5, title: "Holiday Market", price: 5, location: "New York", company: "Holiday Markets Inc." }
];
//simple get request
app.get('/', (req, res) => {
    res.send('Hello World, Be humble to us😭😂');
});
app.get('/api/eventsData', (req, res) => {
    //res.send(eventData)
});
//Now, let's create a GET API route that filters events based on query parameters
app.get('/api/eventsFilter', (req, res) => {
    try {
        const { title, location, company, price } = req.query;
        //on the first filters, the whole evets havent been filtered
        let filteredEvents = [...events];
        //filtering logic
        if (title) {
            filteredEvents = filteredEvents.filter((event) => event.title.toLowerCase().includes(title.toLowerCase()));
        }
        if (location) {
            filteredEvents = filteredEvents.filter((event) => event.location.toLowerCase().includes(location.toLowerCase()));
        }
        if (company) {
            filteredEvents = filteredEvents.filter((event) => event.company.toLowerCase().includes(company.toLowerCase()));
        }
        if (price) {
            const priceNum = parseFloat(price);
            filteredEvents = filteredEvents.filter((event) => event.price === priceNum);
        }
        res.send(filteredEvents);
    }
    catch (error) {
    }
});
//fetch specific event by id
//1.extract ID
app.get('/api/events/:id', (req, res) => {
    try {
        const eventId = parseInt(req.params.id, 10);
        //convert it to a number
        //find events with that ID in the dataset
        if (isNaN(eventId)) {
            res.status(400).json({ message: "Invalid event ID" });
            return;
        }
        const event = events.find((eventObj) => eventObj.id === eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
//handling multiple route params
//we can combine multiple route params
// app.get('/api/events/:id',(req, res)=>{
//     const (category, id)=
// })
//creating GET API route
//creating a server
// app.get('/api/events/:id',(req, res)=>{
//        const eventId= req.params.id  
//     })
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
//soc- separation of concern
