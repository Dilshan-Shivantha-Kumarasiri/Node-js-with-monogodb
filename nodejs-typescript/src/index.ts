import express from "express";

//invoking the express
const app =express();


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











// assign server port and tell the express to listen that poprt
app.listen(8080 , ()=>{
    console.log("server is started");
})