import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { auth, db } from '../firebase.js';
import {
  addDoc,
  collection,
  limit,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { isAuth, isAdmin, generateToken } from '../utils.js';


// Server-side route is responsible for handling user-related functionalities, like user registration, login, authentication, and user profile management.

// Create an Express router for handling user-related routes
const userRouter = express.Router();


// Route to fetch all users (Admin only)
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);


// Route to handle user sign-in
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    //sign in with email and password with firebase
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);

        // Retrieve user details from Firestore based on userId
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          limit(1),
          where('userId', '==', userCredential.user.uid)
        );
        getDocs(q).then((querySnapshot) =>
          querySnapshot.forEach((doc) => {
            const refUser = doc.data();
            const user = {
              _id: refUser.userId,
              name: refUser.FullName,
              email: req.body.email,
              isAdmin: refUser.is_admin,
              password: req.body.password,
            };
            console.log(user);
            console.log('Login Success');

             // Send user details along with a token as a response
            res.send({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              password: user.password,
              token: generateToken(user),
            });
          })
        );

      })
      .catch((error) => {
        console.log(error);
        res.status(401).send({ message: 'Invalid email or password' });
      });
  })
);





// Route to handle user sign-up
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    // Create user with email and password using Firebase authentication
    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then(async (userCredential) => {
        try {
          // Add user details to Firestore
          const FullName = req.body.name;
          const docRef = await addDoc(collection(db, 'users'), {
            FullName,
            userId: `${userCredential.user.uid}`,
            is_admin: false,
          });
          console.log('Document written with ID: ', docRef.id);

          // Retrieve user details from Firestore based on userId
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            limit(1),
            where('userId', '==', userCredential.user.uid)
          );
          getDocs(q).then((querySnapshot) =>
            querySnapshot.forEach((doc) => {
              const refUser = doc.data();
              const user = {
                _id: refUser.userId,
                name: refUser.FullName,
                email: req.body.email,
                isAdmin: refUser.is_admin,
                password: req.body.password,
              };

              // Send user details along with a token as a response
              res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                password: user.password,
                token: generateToken(user),
              });
            })
          );
        } catch (e) {
          console.log('Error adding document: ', e);
          res.status(401).send({ message: e });
        }
      })

      .catch((err) => {
        // Handle errors, e.g., user already exists
        console.log('Error:', err);
        res.status(401).send({ message: err });
      });
  })
);




// Route to update user profile (Change password)
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // Sign in with email and old password using Firebase authentication
    signInWithEmailAndPassword(auth, req.body.email, req.body.oldPassword)
      .then((userCredential) => {
        // Update password in Firebase authentication
        updatePassword(auth.currentUser, req.body.password).then(() => {
          // Update successful. Retrieve updated user details from Firestore based on userId
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            limit(1),
            where('userId', '==', req.user._id)
          );

          getDocs(q).then((querySnapshot) =>
            querySnapshot.forEach((doc) => {
              const refUser = doc.data();
              const user = {
                _id: refUser.userId,
                name: refUser.FullName,
                email: req.body.email,
                isAdmin: refUser.is_admin,
                password: req.body.password,
              };

              // Send updated user details along with a token as a response
              res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                password: user.password,
                token: generateToken(user),
              });
            })
          );
        });
      })

      .catch((error) => {
        console.log(error);
        res.status(401).send({ message: error });
      });
  })
);




export default userRouter;