const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

router.post('/signup', (req,res)=>{
    bcrypt.hash(req.body.Password, 10, async(err,hash)=>{
        if(err){
            res.json("err");
            throw err;
        }
        const user = new User({
            Name: req.body.Name,
            email: req.body.email,
            PhoneNumber: req.body.PhoneNumber,
            Password: hash
        });
        if(req.body.AdminCode == process.env.ADMIN_KEY)
        {
            user.isAdmin = true;
        }
        try{
            const createUser = await user.save();
            console.log(createUser);
            res.json({
                message:'user created'
            });
        }
        catch(err){
            res.json("err");
            throw err;
        }

    })
    
});

router.post('/login', async(req,res)=>{
    try{
        
        const getUser = await User.findOne({email:req.body.email});
        console.log(getUser);
        if(getUser==null){
            res.json("Auth failed");
            throw new Error('Auth failed');
        }
        const authenticator = await bcrypt.compare(req.body.Password, getUser.Password);
        console.log(authenticator);
        if(authenticator!=true){
            console.log("Auth failed");
            res.json("Auth failed");
        }
        const token = jwt.sign({
            email: getUser.email,
            Name : getUser.Name,
            PhoneNumber : getUser.PhoneNumber,
            isAdmin: getUser.isAdmin
        }, process.env.PRIVATE_KEY, { expiresIn: "1day"});
        console.log("Auth Successful");
        res.json({message:"Auth successful",token:token});
    }
    catch(err){
        res.json(err);
        throw err;
    }
});


router.delete('/deleteUser', async(req,res)=>{
    try{
        const deleteUser = await User.findOneAndDelete({email:req.body.email});
        console.log(deleteUser)
        if(deleteUser==null){
            res.json("Delete failed");
            throw new Error('no account failed');
        }
        console.log(deleteUser);
        res.json("Deleted");
    }
    catch(err){
        res.json("err");
        throw err;
    }
    

});




module.exports = router;