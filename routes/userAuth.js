const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

router.post('/signup', (req,res)=>{
    bcrypt.hash(req.body.Password, 10, async(err,hash)=>{
        if(err){
            console.log(err);
            return res.status(500).json({Error:err});
            
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
            res.status(200).json({
                Message:'user created'
            });
        }
        catch(err){
            res.status(500).json({Error:err});
            throw err;
        }

    })
    
});

router.post('/login', async(req,res)=>{
    try{
        const getUser = await User.findOne({email:req.body.email});
        console.log(getUser);
        if(getUser==null){
            console.log("Auth failed");
            return res.status(401).json("Auth failed");
        }
        const authenticator = await bcrypt.compare(req.body.Password, getUser.Password);
        console.log(authenticator);
        if(authenticator!=true){
            console.log("Auth failed");
            return res.status(401).json("Auth failed");
        }
        const token = jwt.sign({
            email: getUser.email,
            Name : getUser.Name,
            PhoneNumber : getUser.PhoneNumber,
            isAdmin: getUser.isAdmin
        }, process.env.PRIVATE_KEY, { expiresIn: "1day"});
        console.log("Auth Successful");
        res.status(200).json({message:"Auth successful",token:token});
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});


router.delete('/deleteUser', async(req,res)=>{
    try{
        if(req.body.email==undefined){
            console.log("no email passed");
            return res.status(400).json({Message:"No email passed"})
        }
        const deleteUser = await User.findOneAndDelete({email:req.body.email});
        console.log(deleteUser)
        if(deleteUser==null){
            console.log(new Error('no account failed')) ;
            return res.status(404).json({Message:"No account found"});
        }
        console.log(deleteUser);
        res.status(204).json({Message:"User Deleted"});
    }
    catch(err){
        res.status(500).json({Error:err}));
        throw err;
    }
    

});




module.exports = router;