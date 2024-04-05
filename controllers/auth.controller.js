import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

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
   try {
      const {username, email, password} = req?.body;
      
      // check if the user exist
      const user = await prisma.user.findUnique({
         where: { 
            email: email,
          },
      })

      // console.log('all data',user);

      if(!user){
         res.status(401).json({message: "Invalid Credential"});
      }

      // // check if the password is correct 
      const isPasswordMatch = await bcrypt.compare(password, user?.password);

      if(!isPasswordMatch) return res.status(401).json({message: "Invalid Credential"})

      const age = 1000 * 60 *60 * 24*7;

     const jwtToken = jwt.sign({
      id: user?.id,
      isAdmin: true,
     }, process.env.JWT_SECRET_KEY, {expiresIn: age})

     const {password:userPassword, ...userInfo} = user;

      // generate cookie token and send to the user
      
      // res.setHeader('set-cookie', 'test=' + 'myValue').status(200).json({message: 'success'})

      res.cookie("token", jwtToken,{
         httpOnly: true,
         // secure: true,
         maxAge: age
      }).status(httpStatus.OK).json({
         userInfo,
         token: jwtToken
      })
      
   } catch (err) {
      console.log(err);
   }

}

export const logout = (req, res)=>{
   // db operations
   res.clearCookie('token').status(httpStatus.OK).json({message: "Logout Successful"});
}