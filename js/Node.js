const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Secure express headers and limit request frequencies
app.use(helmet({
    contentSecurityPolicy: false // Allows canvas rendering from third-party scripts easily
}));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limits each IP to 100 requests per window
});
app.use('/api/', limiter);

// Establish MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to STX WIN MongoDB Database instance.'))
    .catch(err => console.error('MongoDB database initialization error: ', err));

// MongoDB Schemas
const UserProfileSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID link
    username: String,
    balance: { type: Number, default: 5000.00 },
    tier: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    achievements: [String]
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

// API Endpoints
app.get('/api/profile/:uid', async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ uid: req.params.uid });
        if (!profile) return res.status(404).json({ error: "Profile not found" });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: "Server Database error" });
    }
});

app.post('/api/profile', async (req, res) => {
    const { uid, username } = req.body;
    try {
        let profile = await UserProfile.findOne({ uid });
        if (!profile) {
            profile = new UserProfile({ uid, username });
            await profile.save();
        }
        res.status(201).json(profile);
    } catch (err) {
        res.status(500).json({ error: "Database creation error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`STX WIN Gateway backend is active on port ${PORT}`));
