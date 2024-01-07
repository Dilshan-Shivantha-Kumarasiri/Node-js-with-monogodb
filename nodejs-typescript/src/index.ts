import express from "express";
import bodyParser from "body-parser";
import mongoose, {Schema, Types} from "mongoose";
import UserModel from "./models/user.model";
import CustomeResponse from "./dtos/custome.response";
import ArticleModel from "./models/article.model";
import {ObjectId} from "mongodb";

//invoking the express
const app = express();

//applying middleware
//invoking body-parser
app.use(bodyParser.json())

interface user {
    _id: string
    fName: string
    lName: string
    email: string
    password: string
}


/*-------------------------------------------------------- users ---------------------------------------------------- */
//let user: user[] = [];

//in node js this is not the endpoint this called as the routes
//Because routes are coming with the express
app.get('/user/all', async (req: express.Request, res: express.Response) => {

    try {
        // let data ={
        //     _id:"M-001",
        //     fName:"Dilshan",
        //     lName:"Shivantha",
        //     email:"dilshan@3002.com"
        // }


        //the response that we need to send back when request is coming
        //res.send("Hello");

        const users = await UserModel.find();

        res.send(
            new CustomeResponse(200, "suceess", users)
        );
    } catch (error) {
        res.status(500).send(error);
    }
});


//post method
/*
*
*Crate new user
*/
app.post('/user', async (req: express.Request, res: express.Response) => {

    try {
        //if you want to install out 3rd party library because after 2020 we can not use this directly
        //Because it needs to convert to the format for that we use body-parser lib
        //console.log(req.body);
        //user.push(req.body) // get request body and set that values to the user array at line [17]

        const userModel = new UserModel({
            username: req.body.username,
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: req.body.password
        })

        const user = await userModel.save();
        user.password = "" /* set password to empty string to send response */
        //set the response with the status code
        res.status(201).send("user created success")
    } catch (error) {
        res.status(500).send("can not save the user");
    }

})


app.post("/user/auth", async (req: express.Request, res: express.Response) => {

    try {
        const user = await UserModel.findOne({email: req.body.email})
        console.log("a")
        if (user) {
            console.log("a")
            if (user.password === req.body.password) {
                res.send(new CustomeResponse(200, "access", user).toJson());
                // new CustomeResponse(200,"access")
            } else {
                res.send(new CustomeResponse(401, "wrong credentials").toJson())
                //new CustomeResponse(200,"wrong credentials")
            }
        } else {
            res.send(new CustomeResponse(404, "user not found"))
            // new CustomeResponse(200,"user not found")
        }

    } catch (error) {
        res.status(500).send(error)
    }

});


/* -------------------------------------------------article---------------------------------------------------------- */


app.post("/article", async (req: express.Request, res: express.Response) => {
    try {

        let req_body = req.body;
        const articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(req_body.user)
        })

        await articleModel.save();
        res.status(200).send(
            new CustomeResponse(200,"article saved success")
        )


    } catch (error) {
        res.status(500).send(new CustomeResponse(500, "can not create article").toJson())
    }
})


// create connection with mongodb using mongoose
mongoose.connect("mongodb://localhost/blog");
const db = mongoose.connection;

//show error if not connected to the mongodb
db.on('error', (error) => {
    console.log(error);
})

//show success if connected to the mongodb
db.on('open', () => {
    console.log("DB connected success");
})

// assign server port and tell the express to listen that port
app.listen(8080, () => {
    console.log("server is started");
})