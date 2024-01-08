import express from "express";
import ArticleModel from "../models/article.model";
import {ObjectId} from "mongodb";
import CustomeResponse from "../dtos/custome.response";
import UserModel from "../models/user.model";

export const createArticle = async (req: express.Request, res: any|express.Response) => {
    try {

        //console.log(res);
        const user_id = res.tokenData.user._id;

        let req_body = req.body;
        const articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(user_id)
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
}
export const getArticles = async (req: express.Request, res: express.Response) => {
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
}
export const getMyArticle = async(req:express.Request, res:any) => {
    try {

        //console.log(req.params)
        const username: any = req.params.userName;
        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let user_id = res.tokenData.user._id;

        //find the user avaialbel with the user name
        let users = await UserModel.findOne({_id:user_id});
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
}
export const updateArticles =  async (req: express.Request, res:any) =>{

    const article_id = req.body.id;

    try{
        let user_id = res.tokenData.user._id;
        const article = await ArticleModel.find({_id:article_id , user:user_id})

        if(article){

            await ArticleModel.findOneAndUpdate({_id:article_id},{title:req.body.titile , description:req.body.description}).
            then(r => {
                res.status(200).send(new CustomeResponse(200,"article update success"))
            }).
            catch(e => {
                res.status(100).send(new CustomeResponse(100,"something went wrong"))
            });

        }else {
            res.status(401).send(new CustomeResponse(401,"can not access"))
        }

    }catch (error) {
        res.status(500).json("error");
    }


}