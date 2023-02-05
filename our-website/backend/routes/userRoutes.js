import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    //sign in func implementation-
    //get the user by email (return one document from user collection based on the email)
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //compare the password
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //generate token
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return; //stop the function after sendind data
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

export default userRouter;
