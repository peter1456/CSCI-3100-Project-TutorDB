// tutorial record defintion 

var mongoose = require('mongoose')

var tutRecordSchema = mongoose.Schema({
    tutor = {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    student = {type: Schema.Types.ObjectId, ref: 'User'},
    rated = {type: boolean, default: false}
},
{
    timestamps: true
})

module.exports = mongoose.model('tutorialRecords', tutRecordSchema);