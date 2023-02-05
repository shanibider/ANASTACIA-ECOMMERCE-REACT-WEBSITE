import jwt from 'jsonwebtoken'; //import jsonwebtoken module

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  //use jwt object from jsonwebtoken and call sign func from it
  //2nd parameter- jwt secret (secret string to encrypt the data)
  //3rd parameter- options
};
