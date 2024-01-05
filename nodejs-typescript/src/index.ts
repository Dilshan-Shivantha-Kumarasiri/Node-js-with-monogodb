import express from "express";
import bodyParser from "body-parser";
//invoking the express
const app =express();

//applying middleware
//invoking bodyparser
app.use(bodyParser.json())

//in node js this is not the endpoint this called as the routes
//Because routes are coming with the express
app.get('/user/all', (req:express.Request , res:express.Response) => {

    let data ={
        _id:"M-001",
        fName:"Dilshan",
        lName:"Shivantha",
        email:"dilshan@3002.com"
    }


    //the response that we need to send back when request is coming
    //res.send("Hello");
    res.send(data);
});


//post method
/*
*
*Crate new user
*/
app.post('/user' ,(req:express.Request , res: express.Response) =>{

    //if want to install out 3rd party library because after 2020 we can not use this directly
    //Becaue it need to convert to the format for that we use bodyparser lib
    console.log(req.body);

    //set the response with the status code
    res.status(500).send(req.body)
})


// assign server port and tell the express to listen that poprt
app.listen(8080 , ()=>{
    console.log("server is started");
})