const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    },
    user_id: {
        type: String,
        required: true
    },
});

const Todo = mongoose.model("ToDo", TodoSchema);
module.exports = Todo;