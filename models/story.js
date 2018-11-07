var mongoose = require('mongoose');

var storySchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    title: String,
    image: String,
    content: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    time: String,
});

module.exports = mongoose.model("Story", storySchema);