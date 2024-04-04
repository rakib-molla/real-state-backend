import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import httpStatus from 'http-status';

export const register = async(req, res)=>{
   // db operations
   try {
      const {username, email, password} = req.body;

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
   
      const newUser = await prisma.user.create({
         data:{
            username,
            email,
            password: hashedPassword,
         }
      })

      res.status(httpStatus.OK).json({
         success: true,
         message: httpStatus['201_MESSAGE'],
      })

      console.log(newUser)
      
   } catch (err) {
      console.log(err.message);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         success: false,
         message: httpStatus['501_MESSAGE'],
      })
   }
   
}

export const login = async(req, res)=>{
   // db operations
   const {username, password} = req.body;
   try {
      // check if the user exist
      const user = await prisma.user.findUnique({
         where:{username},
      })
      if(!user){
         res.status(httpStatus.NOT_ACCEPTABLE).json({message: httpStatus['401_MESSAGE']});
      }
      // check if the password is correct 

      // generate cookie token and send to the user
      
   } catch (err) {
      console.log(err);
   }

}

export const logout = (req, res)=>{
   // db operations

   console.log('logout endpoints');

}