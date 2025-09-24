import Subscription from '../models/subscriptionModel.js';

// @desc    Add a new email subscription
// @route   POST /api/subscribe
// @access  Public
const addSubscription = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const alreadySubscribed = await Subscription.findOne({ email });

    if (alreadySubscribed) {
        return res.status(200).json({ message: 'Thank you for your interest!' });
    }
    
    try {
        const subscription = await Subscription.create({ email });
        res.status(201).json({ message: 'Subscription successful!', email: subscription.email });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

export { addSubscription };