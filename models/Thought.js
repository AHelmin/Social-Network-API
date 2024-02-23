const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
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
    }
)

const thoughtSchema = new mongoose.Schema(
    {
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
        },
        username: {
            type: String,
            required: true
        },
        reactions: [{
            type: reactionSchema
        }]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);



thoughtSchema
.virtual('reactionCount')
.get(function () {
    return this.reactions.length
})

// thoughtSchema
// .virtual('formattedDate')
// .get(function () {
//     return this.date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     });
// })



const Thought = mongoose.model("Thought", thoughtSchema);
module.exports = Thought;