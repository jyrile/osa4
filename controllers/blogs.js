const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (request, response) => {
        const authorization = request.get('authorization');
        if (authorization && authorization.toLowerCase().startsWith('bearer')) {
                return authorization.substring(7);
        }
        return null;
};

blogsRouter.get('/', async (request, response) => {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
        response.json(blogs.map(b => b.toJSON()));
});

blogsRouter.get('/:id', async (request, response) => {
        const blog = await Blog.findById(request.params.id);
        if (blog) {
                response.json(blog.toJSON());
        } else {
                response.status(404).end();
        }
});

blogsRouter.post('/', async (request, response) => {
        const { body } = request;
        const token = getTokenFrom(request);

        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!token || !decodedToken.id) {
                return response.status(401).json({ error: 'token missing or invalid' });
        }

        const user = await User.findById(decodedToken.id);
        const blog = new Blog({
                title: body.title,
                author: body.author,
                url: body.url,
                likes: body.likes,
                user: user._id,
        });

        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();
});

// Toimii periaatteessa, mutta tarvitsee requestin mukana kaikki kentät täytettynä, muuten
// päivittämättä jäänyt kenttä tallentuu = null
blogsRouter.put('/:id', async (request, response, next) => {
        const { body } = request;

        const blog = {
                title: body.title,
                author: body.author,
                url: body.url,
                likes: body.likes,
        };

        try {
                await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
                response.status(201).json(blog);
        } catch (exception) {
                next(exception);
        }
});

module.exports = blogsRouter;
