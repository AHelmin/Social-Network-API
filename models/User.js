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
    validator: function(v) {
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v)
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
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;