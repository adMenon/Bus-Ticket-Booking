const express = require('express');
const bcrypt = require('bcrypt');

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
        console.log("Auth Successful");
        res.json("Auth successful");
    }
    catch(err){
        res.json(err);
        throw err;
    }
});


router.delete('/deleteUser', async(req,res)=>{
    try{
        const deleteUser = await User.findOneAndDelete({email:req.body.UserID});
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