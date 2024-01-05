import express from "express";

//invoking the express
const app =express();


//in node js this is not the endpoint this called as the routes
//Because routes are coming with the express
app.get('/user/all', (req:express.Request , res:express.Response) => {

});











// assign server port and tell the express to listen that poprt
app.listen(8080 , ()=>{
    console.log("server is started");
})