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

    for (var key in req.body) {
        Email.find({ _id: key }).update({"labels": req.body[key]}).exec();
    }

    res.status(200).json({
        message: 'Success'
    });
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


router.get('/search/:searchTerm', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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


router.get('/primary', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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


router.get('/social', function (req, res, next) {
    var decoded = jwt.decode(req.query.token); 
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

router.get('/promotions', function (req, res, next) {
    var decoded = jwt.decode(req.query.token); 
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



router.get('/forums', function (req, res, next) {
    var decoded = jwt.decode(req.query.token); 
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



router.get('/updates', function (req, res, next) {
    var decoded = jwt.decode(req.query.token); 
    //Email.find({"user": decoded.user._id, "spam": "false", "labels": {"$in" : ["Primary"]}})
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





router.get('/starred', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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


router.get('/sent', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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


router.get('/spam', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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

router.get('/trash', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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

router.get('/all', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
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


    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).update({"trash": "true"}).exec();
    }

    var decoded = jwt.decode(req.query.token);
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


router.post('/deleteHighlighted', function (req, res, next) {


    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).remove().exec();
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



router.post('/markAsReadHighlighted', function (req, res, next) {

    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).update({"read": true}).exec(function (err) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            
        });
    }

    var decoded = jwt.decode(req.query.token);

    console.log(req.query);

    Email.find({ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ req.query.target ] }})
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


router.post('/markAsUnreadHighlighted', function (req, res, next) {

    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).update({"read": false}).exec(function (err) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            
        });
    }
    var decoded = jwt.decode(req.query.token);
    console.log(req.query);
    Email.find({ "user": decoded.user._id, "spam": "false", "trash":"false", "labels" : { $in: [ req.query.target ] }})
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

router.post('/markAsSpamHighlighted', function (req, res, next) {

    for (var key in req.body) {
        Email.find({ _id: req.body[key] }).update({"spam": "true"}).exec();
    }


    res.status(200).json({
        message: 'Success'
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



router.post('/compose', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findOne({"email": req.body.toEmail}, function (err, user){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var email = new Email({
            content: req.body.content,
            fromEmail: req.body.fromEmail,
            toEmail: req.body.toEmail,
            starred: req.body.starred,
            subject: req.body.subject,
            read: req.body.read,
            spam: req.body.spam,
            timeStamp: req.body.timeStamp,
            labels: req.body.labels,
            trash: req.body.trash, 
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
                obj: result
            });
        });
    });
});

module.exports = router;