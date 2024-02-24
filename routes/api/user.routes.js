const router = require('express').Router()
const User = require('../../models/User')
const Thought = require('../../models/Thought')

//GET all users
router.get('/', async (req, res) => {
    try {
        const result = await User.find()
        res.json({ result })
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message })
    }
});

//GET a user by id and populate thoughts and friends
router.get('/:id', async (req, res) => {
    try {
        const result = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ user: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Create a new user
router.post("/", async (req, res) => {
    try {
        const result = await User.create(req.body);
        res.status(200).json({ message: 'User added successfully', user: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Update user by id
router.put('/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User updated successfully', user: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Delete user by id
router.delete('/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id)
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        const removeThoughtsFromUser = await Thought.deleteMany({ userId: req.params.id });

        if (removeThoughtsFromUser.deletedCount === 0) {
            res.status(404).json({ message: 'User deleted successfully. No thoughts found to delete', user: result });
        } else {
            res.status(200).json({ message: 'User deleted successfully', user: result, thoughtsDeleted: removeThoughtsFromUser.deletedCount });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params

        if (userId === friendId) {
            return res.status(400).json({ message: "Cannot add yourself as a friend" });
        }
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Friend already added' });
        }
        const result = await User.findByIdAndUpdate(userId,
            { $push: { friends: friendId } },
            { new: true })
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'Friend added successfully', user: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

//Delete a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params
        const result = await User.findByIdAndUpdate(userId,
            { $pull: { friends: friendId } },
            { new: true })
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'Friend removed successfully', user: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

module.exports = router;