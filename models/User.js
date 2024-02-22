const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    unique: true,
    required: true,
    trim: true
 },
 email: { 
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    validator: function(email) {
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email)
    }, message: props => `${props.value} is not a valid email.`
 },
 thoughts: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Thought'
 }],
 friends: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
 }]
},
{
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });

const User = mongoose.model("User", userSchema);
module.exports = User;