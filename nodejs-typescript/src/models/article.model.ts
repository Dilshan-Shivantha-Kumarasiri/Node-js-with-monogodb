import mongoose, {ObjectId, Types} from "mongoose";


interface IArticle extends mongoose.Document{
    title:string
    description:string
    publishedData:Date
    user:ObjectId
}

 const articleSchema = new mongoose.Schema<IArticle>({
    title:{type:String , required:true},
    description:{type:String , required:true},
    publishedData:{type:Date , required:true, default:Date.now()},
    //set the object id of the user
    user:{type:mongoose.Schema.Types.ObjectId , required:true, ref:'user'}
});

const articleModel = mongoose.model('Article' , articleSchema)
export default articleModel