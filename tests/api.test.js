const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
        await Blog.deleteMany({});
        let blogObject = new Blog(helper.initialBlogs[0]);
        await blogObject.save();
        blogObject = new Blog(helper.initialBlogs[1]);
        await blogObject.save();
});

test('returned as json', async () => {
        await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/);

        const res = await api.get('/api/blogs');
        expect(res.body).toHaveLength(2);
});

test('blog can be added', async () => {
        const newBlog = {
                title: 'Heippa',
                author: 'jyrkkä',
                url: 'jotain.com',
                likes: 5,
        };
        await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201);

        const res = await api.get('/api/blogs');
        expect(res.body).toHaveLength(helper.initialBlogs.length + 1);
});

test('no likes to zero likes', async () => {
        const newBlog = {
                title: 'No likes',
                author: 'jarppa',
                url: 'jarppa.net',
        };
        await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201);
        const response = await api.get('/api/blogs');
        expect(response.body[2].likes).toBe(0);
});

test('no title', async () => {
        const newBlog = {
                title: 'no author',
                url: 'what.net',
                likes: 0,
        };

        await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
});

test('no author', async () => {
        const newBlog = {
                author: 'no title',
                url: 'takethat.com',
                likes: 2,
        };
        await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
});

afterAll(() => {
        mongoose.connection.close();
});
