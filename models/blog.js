const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
        title: { type: String, required: true },
        author: { type: String, required: true },
        url: String,
        likes: { type: Number, default: '0' },
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
        },
});

module.exports = mongoose.model('Blog', blogSchema);
