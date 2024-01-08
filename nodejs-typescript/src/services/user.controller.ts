// get all user

import express from "express";
import UserModel from "../models/user.model";
import * as schemaType from "../types/schem.types";
import CustomeResponse from "../dtos/custome.response";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
// @ts-ignore
import bcrypt from "bcryptjs"
export const saveUser = async (req: express.Request, res: express.Response) => {

    try {
        //if you want to install out 3rd party library because after 2020 we can not use this directly
        //Because it needs to convert to the format for that we use body-parser lib
        //console.log(req.body);
        //user.push(req.body) // get request body and set that values to the user array at line [17]


        await bcrypt.hash(req.body.password, 8, async function (error:null|string , hash:string) {
            if(error){
                res.status(100).json("something wrong");
            }else {
                const userModel = new UserModel({
                    username: req.body.username,
                    fName: req.body.fName,
                    lName: req.body.lName,
                    email: req.body.email,
                    password: hash
                })
                let user:schemaType.Iuser = await userModel.save();
                // user.password = ""
                res.status(201).send(
                    new CustomeResponse(201,"success",user).toJson()
                )
            }
        })

        // const userModel = new UserModel({
        //     username: req.body.username,
        //     fName: req.body.fName,
        //     lName: req.body.lName,
        //     email: req.body.email,
        //     password: req.body.password
        // })

        // const user:schemaType.Iuser = await userModel.save();
        /* set password to empty string to send response */
        //set the response with the status code
        //res.status(201).send("user created success")
    } catch (error) {
        res.status(500).send("can not save the user");
    }

}
export const getAllUser = async (req: express.Request, res: express.Response) => {

    try {
        // let data ={
        //     _id:"M-001",
        //     fName:"Dilshan",
        //     lName:"Shivantha",
        //     email:"dilshan@3002.com"
        // }


        //the response that we need to send back when request is coming
        //res.send("Hello");

        const users:schemaType.Iuser[] = await UserModel.find();

        res.send(
            new CustomeResponse(200, "suceess", users)
        );
    } catch (error) {
        res.status(500).send(error);
    }
}
export const authUser = async (req: express.Request, res: express.Response) => {

    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (user) {

            let isMatch = await bcrypt.compare(req.body.password , user.password)
            if (isMatch) {
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

}

