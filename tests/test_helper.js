const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
        {
                title: 'eka',
                author: 'jaska',
                url: 'jaska.com',
                likes: 0,
        },
        {
                title: 'toka',
                author: 'pekka',
                url: 'pekkis.com',
                likes: 123,
        },
];

const nonExistingId = async () => {
        const blog = new Blog({ content: 'willremovethissoon' });
        await blog.save();
        await blog.remove();

        return blog._id.toString();
};

const blogsInDb = async () => {
        const blogs = await Blog.find({});
        return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
        const users = await User.find({});
        return users.map(user => user.toJSON());
};

module.exports = {
        initialBlogs,
        nonExistingId,
        blogsInDb,
        usersInDb,
};
