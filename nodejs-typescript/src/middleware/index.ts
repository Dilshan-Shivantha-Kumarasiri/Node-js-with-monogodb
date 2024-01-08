import express from "express";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";


export const verifyToken = (req:express.Request , res:any, next:express.NextFunction) => {
    //get the access token from the header
    const token = req.headers.authorization;

    if (!token){
        //check the token is available
        return res.status(401).json('authorized denied')
    }

    try {
        const data = jwt.verify(token, process.env.SECRET as Secret);
        // console.log(data);
        res.tokenData = data;
        next();
    }catch (e) {
        return res.staus(401).json('authorized denied')
    }


}