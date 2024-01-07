//adding environment variable
import dotenv from "dotenv"
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import mongoose, {Schema, Types} from "mongoose";
import UserModel from "./models/user.model";
import CustomeResponse from "./dtos/custome.response";
import ArticleModel from "./models/article.model";
import {ObjectId} from "mongodb";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken'

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
        if (user) {
            console.log("a")
            if (user.password === req.body.password) {
                user.password = "";

                //token gen
                let expiresIn = "1w"
                jwt.sign({user},process.env.SECRET as Secret, {expiresIn},(error:any , token:any) => {

                    if (error){
                        res.status(100).send(new CustomeResponse(100,"something wen wrong"));
                    }else{
                        let res_body = {
                            user:user,
                            accessToken:token
                        }
                        res.send(new CustomeResponse(200, "access", res_body).toJson());
                    }
                });

            } else {
                res.send(new CustomeResponse(401, "wrong credentials").toJson())

            }
        } else {
            res.send(new CustomeResponse(404, "user not found"))

        }

    } catch (error) {
        res.status(500).send(error)
    }

});


/* -------------------------------------------------article---------------------------------------------------------- */


/*
    decoding and verify the JWT token through middleware functions
    custom middlewear
*/
const verifyToken = (req:express.Request,res:any,next:express.NextFunction) => {

}

app.post("/article", verifyToken,async (req: express.Request, res: express.Response) => {
    try {

        let req_body = req.body;
        const articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(req_body.user)
        })

        await articleModel.save().then(r => {

            res.status(200).send(
                new CustomeResponse(200, "article saved success")
            )
        }).catch(error => {
            res.status(500).send(new CustomeResponse(500, "can not create article").toJson())
        });


    } catch (error) {
        res.status(500).send(new CustomeResponse(500, "can not create article").toJson())
    }
})

app.get("/article", async (req: express.Request, res: express.Response) => {
    try {

        //catching the query param
        // console.log(req.query);
        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        //add pagination
        let articles = await ArticleModel.find().limit(size).skip(size * (page - 1));
        let documentCount = await ArticleModel.countDocuments();
        let pageCount = Math.ceil(documentCount / size);
        res.status(200).send(
            new CustomeResponse(200, "success", articles, pageCount)
        );
    } catch (e) {

    }
})

app.get("/articles/:userName", async(req, res) => {
    try {

        //console.log(req.params)
        const username: any = req.params.userName;
        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        //find the user avaialbel with the user name
        let users = await UserModel.findOne({username:username});
        if (!users) {
            res.send(new CustomeResponse(404,"user not found"))//new CustomeResponse(404,"user not found");
        }else {


           // @ts-ignore
            let articles = await ArticleModel.find({user: users._id}).limit(size).skip(size * (page-1));
            let documentCount = await ArticleModel.countDocuments({user: users._id})
            let pageCount = Math.ceil(documentCount/size);

            res.status(200).send(new CustomeResponse(200,
                'articles found success',articles,pageCount));
        }

        res.send("ok")


    } catch (error) {

    }
})


// create connection with mongodb using mongoose
mongoose.connect(process.env.MONGO_URL as string);
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