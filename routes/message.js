//heroku logs -n 200
//git push heroku master
//git add .
//git commit -m "changes"
///lalala 

var express = require('express');
var router = express.Router();

var Email = require('../assets/app/models/message');
var User = require('../assets/app/models/user');
var jwt = require('jsonwebtoken');


router.post('/inbox/star', function (req, res, next) {

        Email.find({"_id": req.body.messageId})
        .update({"starred": true})
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: "dan"
            });
        });
});





router.post('/moveEmail', function (req, res, next) {

    var arrIdToMove = [];

    for (var key in req.body) {
        if (key != 'auth'){
            arrIdToMove.push(key);
        }
    }

    //don't change anything if 
    if (req.query.oldLocation === req.query.newLocation){
        arrIdToMove = [];
    }


    var decoded = jwt.decode(req.body.auth);
    var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };


          Email.update( { _id: { $in: arrIdToMove } }, {$addToSet: { "labels": req.query.newLocation } } , {multi: true} 
        , function(err,docs) 
        { 
            Email.update( { _id: { $in: arrIdToMove } }, {$pull: { "labels": req.query.oldLocation }} , {multi: true} 
        , function(err,docs) 
        { 
            Email.find(queryCodes[req.query.oldLocation])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            console.log(messages);
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });

        });

        });



          





    


    //Email.find({username: oldUsername}, function (err, email) {
        //email.username = newUser.username;
        //email.password = newUser.password;
        //email.rights = newUser.rights;

        //email.save(function (err) {
        //    if(err) {
        //        console.error('ERROR!');
        //    }
        //});
//});









/*
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // Get the size of an object
    var size = Object.size(req.body);

    console.log("size " + size);

    movingEmail = function(callback){
        var goAhead = 0;
        for (var key in req.body) {
            Email.find({ _id: key }).update({"labels": req.body[key]}).exec(function (err, data) { goAhead++; })
        }
        console.log("goAhead " + goAhead);
        if (goAhead == size){
           callback();
        }
        
    }

    movingEmail(function() {
        console.log("AFTER");
        var decoded = jwt.decode(req.query.token);
        var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };
        Email.find(queryCodes[req.query.oldLocation])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
    });


*/
    


    //setSource = function(callback) {
    // do editor things
    
        //console.log("FIRST");
        //callback();
    //}

    //setSource(function() {
        //console.log("LATER");
    //});




    
});


router.post('/inbox/unstar', function (req, res, next) {

        Email.find({"_id": req.body.messageId})
        .update({"starred": false})
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: "false"
            });
        });
});


router.post('/search/:searchTerm', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    var searchTerm = req.params.searchTerm;
    Email.find( { "user": decoded.user._id, $or:[ { "content": { "$regex": searchTerm, "$options": "i" }}, { "fromEmail": { "$regex": searchTerm, "$options": "i" }}, { "toEmail": { "$regex": searchTerm, "$options": "i" }}, { "subject": { "$regex": searchTerm, "$options": "i" }} ]})
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});


router.post('/primary', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }})
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});


router.post('/social', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }})   
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

router.post('/promotions', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
     Email.find({ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }})   
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});



router.post('/forums', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }})   
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});



router.post('/updates', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
     Email.find({ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }})   
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});





router.post('/starred', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({"user": decoded.user._id, "starred": "true"})
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});


router.post('/sent', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({"fromEmail": decoded.user.email})
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});


router.post('/spam', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({"user": decoded.user._id, "spam": "true"})
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

router.post('/trash', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({"user": decoded.user._id, "trash":"true"})
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});

router.post('/all', function (req, res, next) {
    var decoded = jwt.decode(req.body.auth);
    Email.find({"user": decoded.user._id, "trash":"false", "spam":"false"})
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});


router.get('/:id', function (req, res, next) {
        Email.findOneAndUpdate({"_id": req.params.id}, {$set:{"read":true}}, {new: true}
        , function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});




router.get('/countSpam', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Email.find({"user": decoded.user._id, "spam": "true"})
        .exec(function (err, results) {
            var count = results.length
            console.log(results);
            console.log(count);
        });
});


router.post('/changeLabelHighlighted', function (req, res, next) {

    for (var key in req.body) {
        let primary = ['primary'];
        if (key != 'labels'){
            if (req.body[key].labels.includes('primary')){
                Email.find({ _id: req.body[key].messageId }).update({"labels": req.body['labels'].concat(primary)}).exec();
            }
            else{
                Email.find({ _id: req.body[key].messageId }).update({"labels": req.body['labels']}).exec();
            }
       }
    }

    res.status(200).json({
        message: 'Success'
    });


});


router.post('/trashHighlighted', function (req, res, next) {


    var decoded = jwt.decode(req.body.auth);
    var trashThese = [];

    var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };


    for (var key in req.body) {
        if (key != 'auth'){
            trashThese.push(req.body[key]); 
        } 
    }

    Email.update( { _id: { $in: trashThese } }, {"trash":"true"} , {multi: true} 
        , function(err,docs) 
        { 
            Email.find(queryCodes[req.query.target])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });

        });

});


router.post('/deleteHighlighted', function (req, res, next) {


    var decoded = jwt.decode(req.body.auth);
    var deleteThese = [];

    var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };


    for (var key in req.body) {
        if (key != 'auth'){
            deleteThese.push(req.body[key]); 
        } 
    }

    Email.remove( { _id: { $in: deleteThese } } 
        , function(err,docs) 
        { 
            Email.find(queryCodes[req.query.target])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });

        });

   //for (var key in req.body) {
       // Email.find({ _id: req.body[key] }).remove().exec();
    //}

    //res.status(200).json({
      //  message: 'Success'
  //  });


});





router.post('/markAsSpamHighlighted', function (req, res, next) {

    var decoded = jwt.decode(req.body.auth);
    var spamThese = [];

    var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };


    for (var key in req.body) {
        if (key != 'auth'){
            spamThese.push(req.body[key]);  
        }
    }

    Email.update( { _id: { $in: spamThese } }, {"spam":"true"} , {multi: true} 
        , function(err,docs) 
        { 
            Email.find(queryCodes[req.query.target])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });

        });

        
});

router.post('/markAsNotSpamHighlighted', function (req, res, next) {

    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).update({"spam": "false"}).exec();
    }

    res.status(200).json({
        message: 'Success'
    });
    
});


































router.post('/starHighlighted', function (req, res, next) {

    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).update({"starred": true}).exec();
    }

    res.status(200).json({
        message: 'Success'
    });

        
});







router.post('/markAllRead', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Email.find({"user": decoded.user._id, "read":"false"})
        .updateMany({"read":"true"})
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});


router.post('/compose', function (req, res, next) {
    User.findOne({"email": req.body.email.toEmail}, function (err, user){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var email = new Email({
            content: req.body.email.content,
            fromEmail: req.body.email.fromEmail,
            toEmail: req.body.email.toEmail,
            starred: req.body.email.starred,
            subject: req.body.email.subject,
            read: req.body.email.read,
            spam: req.body.email.spam,
            timeStamp: req.body.email.timeStamp,
            labels: req.body.email.labels,
            trash: req.body.email.trash,
            isChecked: req.body.email.isChecked,
            user: user._id
        });


        email.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            user.messages.push(result);
            user.save();
            res.status(201).json({
                email: 'Saved message',
                obj: user.messages
            });
        });
    });
});




router.post('/markAsUnreadHighlighted', function (req, res, next) {

    var arrToUnread = [];

    var decoded = jwt.decode(req.body.auth);
    var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };


    for (var key in req.body) {
        if (key != 'auth'){
            arrToUnread.push(req.body[key]);
        }
    }

    Email.update( { _id: { $in: arrToUnread } }, {"read":false} , {multi: true} 
        , function(err,docs) 
        { 
            Email.find(queryCodes[req.query.target])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });

        });

        
});



router.post('/markAsReadHighlighted', function (req, res, next) {

    //addy = "left/right";
//var streetaddress= addy.substr(0, addy.indexOf('/')); 
//console.log(streetaddress);

    var decoded = jwt.decode(req.body.auth);
    var arrToRead = [];

    console.log(req.query.target);

    var queryCodes = {'starred':{"user": decoded.user._id, "starred": "true"},
              'primary':{ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ "primary" ] }},
              'social':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "social" ] }},
              'promotions':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "promotions" ] }},
              'updates':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "updates" ] }},
              'forums':{ "user": decoded.user._id, "trash":"false", "spam": "false", "labels" : { $in: [ "forums" ] }},
              'sent':{"fromEmail": decoded.user.email},
              'spam':{"user": decoded.user._id, "spam": "true"},
              'trash':{"user": decoded.user._id, "trash":"true"},
              'all':{"user": decoded.user._id, "trash":"false", "spam":"false"}
          };

    for (var key in req.body) {
        if (key != 'auth'){
            arrToRead.push(req.body[key]);  
        }
    }

    Email.update( { _id: { $in: arrToRead } }, {"read":true} , {multi: true} 
        , function(err,docs) 
        { 
            Email.find(queryCodes[req.query.target])
        .populate('user', 'firstName')
        .exec(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });

        });


    

});








module.exports = router;