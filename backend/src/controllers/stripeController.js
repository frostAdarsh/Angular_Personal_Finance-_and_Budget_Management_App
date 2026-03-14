const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.createCheckoutSession = catchAsync(async (req, res) => {
    // 1. SAFETY CHECK: This will print your exact ID to the terminal to prove it loaded
    console.log("🚨 Current STRIPE_PRICE_ID in memory:", process.env.STRIPE_PRICE_ID);

    if (!process.env.STRIPE_PRICE_ID || !process.env.STRIPE_PRICE_ID.startsWith('price_')) {
        console.error("❌ ERROR: STRIPE_PRICE_ID is missing or invalid in your .env file!");
        return res.status(400).json({ message: "Server configuration error: Invalid Price ID." });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: req.user.email,
            // 2. INDIA REGULATORY FIX: Required for INR transactions
            billing_address_collection: 'required', 
            line_items: [{
                price: process.env.STRIPE_PRICE_ID, 
                quantity: 1,
            }],
            success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
            client_reference_id: req.user._id.toString() 
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("🔥 STRIPE CHECKOUT ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`🔥 Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        try {
            await User.findByIdAndUpdate(userId, { 
                isPro: true,
                stripeCustomerId: session.customer 
            });
            console.log(`✅ SUCCESS: User ${userId} upgraded to PRO!`);
        } catch (error) {
            console.error("🔥 Error updating user in database:", error);
        }
    }

    res.json({ received: true });
};