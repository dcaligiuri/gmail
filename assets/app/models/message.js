var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    content: {type: String, required: true},
    fromEmail: {type: String, required: true},
    toEmail: {type: String, required: true},
    starred: {type: String, required: true},
    subject: {type: String, required: true},
    read: {type: String, required: true},
    spam: {type: String, required: true},
    timeStamp: {type: Date, required: true},
    labels: {type: Object, required: true},
    trash: {type: String, required: true},
    isChecked: {type: Boolean, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Email', schema);