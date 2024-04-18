import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt';
export const getUsers = async(req, res)=>{
   
   try{
      const users = await prisma.user.findMany();
      res.status(200).json(users);
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to get users"});
   }
}

export const getUser = async(req, res)=>{
   const id = req.params.id;
   try{
      const user = await prisma.user.findUnique({
         where:{id}
      })
      res.status(200).json(user);
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to get user"});
   }
}

export const updateUser = async(req, res)=>{
   const id = req.params.id;
   const tokenUserId =  req.userId;
   const {password, avatar, ...inputs} = req.body;

   if(id !== tokenUserId){
      return res.status(403).json({message:"Not Authorized"})
   }

   let updatePassword = null;

   try{

      if(password){
         updatePassword = await bcrypt.hash(password, 10);
      }

      const updateUser = await prisma.user.update({
         where:{id},
         data:{
            ...inputs,
            ...(updatePassword && {password: updatePassword}),
            ...(avatar && {avatar: avatar}),
         },
      });
      const {password:userPassword, ...rest} = updateUser;
      res.status(200).json(rest);

   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to update user"});
   }
}

export const deleteUser = async(req, res)=>{
   const id = req.params.id;
   const tokenUserId = req.userId;
   if(id !== tokenUserId){
      return res.status(403).json({message: "Not Authorized"})
   }
   try{
      await prisma.user.delete({
         where:{id},
      })
      res.status(200).json({message:"user deleted successfully"})
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to delete user"});
   }
}

export const savePost = async(req, res)=>{
   const postId = req.body.postId;
   const tokenUserId = req.userId;
   
   try{
      
      const savePost = await prisma.savePost.findUnique({
         where:{
            userId_postId:{
               userId: tokenUserId,
               postId,
            }
         }
      })

      if(savePost){
         await prisma.savePost.delete({
            where:{
               id: savePost.id,
            }
         })
         res.status(200).json({message:"Post removed from save list"})

      }else{
         await prisma.savePost.create({
            data:{
               userId: tokenUserId,
               postId,
            }
         })
         res.status(200).json({message:"Post  saved "})
      }
      
   }catch(err){
      console.log(err);
      res.status(500).json({message: "fail to delete user"});
   }
}


export const profilePosts = async(req, res)=>{
   const tokenUserId = req.userId;
   try {
     const userPosts = await prisma.post.findMany({
       where: { userId: tokenUserId },
     });
     const saved = await prisma.savedPost.findMany({
       where: { userId: tokenUserId },
       include: {
         post: true,
       },
     });
 
     const savedPosts = saved.map((item) => item.post);
     res.status(200).json({ userPosts, savedPosts });
   } catch (err) {
     console.log(err);
     res.status(500).json({ message: "Failed to get profile posts!" });
   }
}


export const getNotificationNumber = async (req, res) => {
   const tokenUserId = req.userId;
   try {
     const number = await prisma.chat.count({
       where: {
         userIDs: {
           hasSome: [tokenUserId],
         },
         NOT: {
           seenBy: {
             hasSome: [tokenUserId],
           },
         },
       },
     });
     console.log(number);
     res.status(200).json(number);
   } catch (err) {
     console.log(err);
     res.status(500).json({ message: "Failed to get profile posts!" });
   }
 };