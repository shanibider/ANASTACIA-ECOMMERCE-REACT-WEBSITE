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

const userRouter = express.Router();

//for Admin user list
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    //sign in with email and password with firebase
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);

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

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then(async (userCredential) => {
        try {
          const FullName = req.body.name;
          const docRef = await addDoc(collection(db, 'users'), {
            FullName,
            userId: `${userCredential.user.uid}`,
            is_admin: false,
          });
          console.log('Document written with ID: ', docRef.id);

          //firebase
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
        // already exist?
        console.log('Error:', err);
        res.status(401).send({ message: err });
      });
  })
);

//Profile Screen
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    signInWithEmailAndPassword(auth, req.body.email, req.body.oldPassword)
      .then((userCredential) => {
        updatePassword(auth.currentUser, req.body.password).then(() => {
          // Update successful.
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
