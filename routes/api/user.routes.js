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
        res.json({ result })
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
router.put('/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id)
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully', user: result })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params
        const result = await User.findByIdAndUpdate(userId,
            {
                $push: {
                    friends: friendId
                }
            },
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
            {
                $pull: {
                    friends: friendId
                }
            },
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