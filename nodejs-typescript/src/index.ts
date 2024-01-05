import express from "express";
import bodyParser from "body-parser";
import mongoose, {mongo} from "mongoose";

//invoking the express
const app =express();

//applying middleware
//invoking bodyparser
app.use(bodyParser.json())
interface user{
    _id:string
    fName:string
    lName:string
    email:string
    password:string
}

let user:user[]=[];

//in node js this is not the endpoint this called as the routes
//Because routes are coming with the express
app.get('/user/all', (req:express.Request , res:express.Response) => {

    // let data ={
    //     _id:"M-001",
    //     fName:"Dilshan",
    //     lName:"Shivantha",
    //     email:"dilshan@3002.com"
    // }


    //the response that we need to send back when request is coming
    //res.send("Hello");
    res.send(user);
});


//post method
/*
*
*Crate new user
*/
app.post('/user' ,(req:express.Request , res: express.Response) =>{

    //if you want to install out 3rd party library because after 2020 we can not use this directly
    //Because it needs to convert to the format for that we use body-parser lib
    //console.log(req.body);
    user.push(req.body) // get request body and set that values to the user array at line [17]

    //set the response with the status code
    res.status(500).send("ok")
})

// create connection with mongodb using mongoose
mongoose.connect("mongodb://localhost/blog");
const db = mongoose.connection;

//show error if not connected to the mongodb
db.on('error', (error) =>{
    console.log(error);
})

//show success if connected to the mongodb
db.on('open', () =>{
    console.log("DB connected success");
})

// assign server port and tell the express to listen that port
app.listen(8080 , ()=>{
    console.log("server is started");
})