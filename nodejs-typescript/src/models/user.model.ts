import mongoose from "mongoose";
import * as schemaType from "../types/schem.types"


//we need to define schema
//schema is the definition of the document



const userSchema = new mongoose.Schema({
    username:{type:String , required: true},
    fName:{type:String , required: true},
    lName:{type:String , required: true},
    email:{type:String , required: true},
    password:{type:String , required: true},
});

//creating model using the schema
//adding s to the user by mongoose
const userModel = mongoose.model<schemaType.Iuser>("user",userSchema);

export default userModel;