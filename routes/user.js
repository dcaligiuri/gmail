var express = require('express');
var router = express.Router();

//var Email = require('../assets/app/models/message');
var jwt = require('jsonwebtoken');
var User = require('../assets/app/models/user');


router.post('/login', function (req, res, next) {
    User.findOne({"email": req.body.email}, function (err, user){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Please enter a valid user'}
            });
        }
        if (user.password != req.body.password){
              return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Please enter a valid password'}
            });
        }
        var token = jwt.sign({user: user}, 'thisIsSecretKey', {expiresIn: 7200});
        res.status(200).json({
            message: 'Login was a success',
            token: token,
            userId: user._id,
            loggedEmail: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
        
    });
});


router.get('/sayHi', function (req, res, next) {
    User.findOne({"email": req.query.email}, function (err, user){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Please enter a valid user'}
            });
        }
        res.status(200).json({
            message: 'Login was a success',
            firstName: user.firstName,
        });
    });
        
});


router.post('/signup', function (req, res, next) {

        var user = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });


        user.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            var token = jwt.sign({user: user}, 'thisIsSecretKey', {expiresIn: 7200});
            res.status(200).json({
            message: 'Login was a success',
            token: token,
            userId: user._id,
            loggedEmail: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
           
    });
        
});











module.exports = router;