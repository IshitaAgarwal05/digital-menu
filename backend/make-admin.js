const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_menu');
    const user = await User.findOneAndUpdate({}, { role: 'admin' }, { new: true });
    if (user) {
        console.log(`User ${user.phone} is now an ADMIN! ⚙️`);
    } else {
        console.log('No user found to make admin.');
    }
    await mongoose.disconnect();
};

makeAdmin();
