import prisma from "../lib/prisma.js";

export const getPosts = async(req, res)=>{
   const query = req.query;
   console.log(query);
   try{
      const post = await prisma.post.findMany({
         where:{
            city: query.city || undefined,
            type: query.type || undefined,
            property: query.property || undefined,
            bedroom: parseInt(query.bedroom) || undefined,
            bathroom: parseInt(query.bathroom) || undefined,
            price:{
               gte: parseInt(query.minPrice) || 0,
               lte: parseInt(query.maxPrice) || 10000000,
            }
         }
      });
      res.status(200).json(post);
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to get all post"})
   }
}

export const getPost = async(req, res)=>{
   const id = req.params.id;
   try{
      const post = await prisma.post.findUnique({
         where: { id },
         include: {
           postDetail: true,
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
         },
       });
      res.status(200).json(post);
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to get single post"})
   }
}
export const addPost = async(req, res)=>{
   const body = req.body;
   const tokenUserId = req.userId;
   const postDetail = req.body.postDetail
   
   try{
      const newPost = await prisma.post.create({
         data: {
           ...body.postData,
           userId: tokenUserId,
           postDetail: {
             create: body.postDetail,
           },
         },
       });
      res.status(200).json(newPost);
      console.log(newPost);
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to get single post"})
   }
}


export const updatePost = async(req, res)=>{
   const id = req.params.id;
   const tokenUserId = req.userId;
   try{

   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to update post"})
   }
}
export const deletePost = async(req, res)=>{
   const id = req.params.id;
   const tokenUserId = req.userId;


   try{
      const post = await prisma.post.findUnique({
         where:{id},
      })
      // if(post.userId !== tokenUserId){
      //    return res.status(403).json({message:"Not Authorized"})
      // }

      await prisma.post.delete({
         where:{id},
      })
      res.status(200).json({message: "Post Deleted"})

   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to delete post"})
   }
}