const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        const decode = jwt.verify(req.headers.token.split(" ")[1], process.env.PRIVATE_KEY);
        req.UserData = decode;
        console.log(decode);
        next();
    }
    catch(err){
        res.json("Token failed");
        throw err;
    }
}