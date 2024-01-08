import mongoose, {ObjectId} from "mongoose";

export interface IArticle extends mongoose.Document{
    title:string
    description:string
    publishedData:Date
    user:ObjectId
}

export interface Iuser{
    username:string
    fName:string
    lName:string
    email:string
    password:string
}