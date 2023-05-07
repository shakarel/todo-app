const jwt = require("jsonwebtoken");
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    console.log('Checking authentication');
    const { authorization } = req.headers;

    if (!authorization) {
      console.log('Authorization token missing');
      return res.status(401).json({error: 'Authorization token required'});
    }

    const token = authorization.split(" ")[1];

    console.log('Verifying token:', token);
    const decodedToken = jwt.verify(token, process.env.SECRET);

    console.log('Retrieving user:', decodedToken);
    const user = await User.findOne({_id: decodedToken._id});

    if (!user) {
      console.log('User not found');
      return res.status(401).json({error: "User not found"});
    }

    console.log('User authenticated: ', user);
    req.user = user;
    next();

  } catch (error) {
    console.error(error);
    res.status(401).json({error: "Request is not authorized"})
  }
};

module.exports = requireAuth;
