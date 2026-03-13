const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.createCheckoutSession = catchAsync(async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: req.user.email,
        line_items: [{
            price: 'price_your_stripe_price_id_here', 
            quantity: 1,
        }],
        success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
        client_reference_id: req.user.id 
    });

    res.json({ url: session.url });
});

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        await User.findByIdAndUpdate(userId, { 
            isPro: true,
            stripeCustomerId: session.customer 
        });
    }

    res.json({ received: true });
};