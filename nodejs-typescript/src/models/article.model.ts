import mongoose, {ObjectId, SchemaType, Types} from "mongoose";
import * as schemaType from "../types/schem.types"




 const articleSchema = new mongoose.Schema<schemaType.IArticle>({
    title:{type:String , required:true},
    description:{type:String , required:true},
    publishedData:{type:Date , required:true, default:Date.now()},
    //set the object id of the user
    user:{type:mongoose.Schema.Types.ObjectId , required:true, ref:'user'}
});

const articleModel = mongoose.model('Article' , articleSchema)
export default articleModel