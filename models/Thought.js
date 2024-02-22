const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 128
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        get: (date) => {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }
    
});

thoughtSchema
.get(function () {
    return 
})



const Thought = mongoose.model("Thought", thoughtSchema);
module.exports = Thought;