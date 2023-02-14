import jwt from 'jsonwebtoken'; //import jsonwebtoken module

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  //use jwt object from jsonwebtoken and call sign func from it
  //2nd parameter- jwt secret (secret string to encrypt the data)
  //3rd parameter- options
};

//isAuth- middleware from OrderRoutes
//here we check authorization header and verify the token
export const isAuth = (req, res, next) => {
  //check if the authorization header exist
  const authorization = req.headers.authorization;
  if (authorization) {
    //if it does exist we split the string to get the token
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX (7 characters)
    //verify the token. 1st parameter- the token, 2nd parameter- the secret string, 3rd parameter- callback func
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
        //if the token is valid decode is the decrypted version of the token that include user information
      } else {
        //so we fill req.user with the data and go to the next
        req.user = decode;
        //by calling next we go to the next middleware (expressAsyncHandler function from OrderRoutes)
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

//here we check req.user (because it come after isAuth, and there req.user filled by userInfo(decode))
export const isAdmin = (req, res, next) => {
  /*if req.user exist and isAdmin is true- go to the next middleware 
  /it means everything is ok, and continue the api
  */
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    //it means that this token is only for regular user costumers, not for admin

    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
