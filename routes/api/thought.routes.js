const router = require('express').Router()
const User = require('../../models/User')
const Thought = require('../../models/Thought')

//GET all thoughts
router.get('/', async (req, res) => {
    try {
        const result = await Thought.find()
        res.json({ result })
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message })
    }
});

//GET a thought by id 
router.get('/:id', async (req, res) => {
    try {
        const result = await Thought.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Thought not found' })
        }
        res.status(200).json({ user: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Create a new thought
router.post("/", async (req, res) => {
    try {
        const { userId, thoughtText } = req.body
        const newThought = await Thought.create(req.body);
        const checkUser = await User.findById(userId)
        if(!checkUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        const addToUser = await User.findByIdAndUpdate(userId,
            { $push: { thoughts: newThought._id }},
            { new: true })
        res.json({ result, addToUser })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Update thought by id
router.put('/:id', async (req, res) => {
    try {
        const result = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!result) {
            return res.status(404).json({ message: 'Thought not found' })
        }
        res.status(200).json({ message: 'Thought updated successfully', thought: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Delete thought by id
router.delete('/:id', async (req, res) => {
    try {
        const result = await Thought.findByIdAndDelete(req.params.id)
        if (!result) {
            return res.status(404).json({ message: 'Thought not found' })
        }
        res.status(200).json({ message: 'Thought deleted successfully', thought: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Add a new friend to a user's friend list
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const { thoughtId }= req.params
        const { addReaction } = req.body
        const result = await Thought.findByIdAndUpdate(thoughtId,
            { $push: { reactions: addReaction }},
            { new: true })
        if (!result) {
            return res.status(404).json({ message: 'Thought not found' })
        }
        res.status(200).json({ message: 'Reaction added successfully', thought: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

//Delete a friend from a user's friend list
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params
        const result = await Thought.findByIdAndUpdate(thoughtId,
            { $pull: { reactions: { _id: reactionId }}},
            { new: true })
        if (!result) {
            return res.status(404).json({ message: 'Thought not found' })
        }
        res.status(200).json({ message: 'Reaction removed successfully', thought: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

module.exports = router;