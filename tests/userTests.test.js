const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('initially one user in db', () => {
        beforeEach(async () => {
                await User.deleteMany({});
                const passwordHash = await bcrypt.hash('sala', 10);
                const user = new User({
                        username: 'root',
                        name: 'Superuser',
                        passwordHash,
                });

                await user.save();
        });

        test('creation succeeds with fresh username', async () => {
                const usersAtStart = await helper.usersInDb();

                const newUser = {
                        username: 'jyrile',
                        name: 'Jyri Lehtinen',
                        password: 'sala',
                };

                await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(200)
                        .expect('Content-Type', /application\/json/);

                const usersAtEnd = await helper.usersInDb();
                expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

                const usernames = usersAtEnd.map(u => u.username);

                expect(usernames).toContain(newUser.username);
        });

        test('creation fail + catch if username already in use', async () => {
                const usersAtStart = await helper.usersInDb();

                const newUser = {
                        username: 'root',
                        name: 'Superuser',
                        password: 'sala',
                };

                const result = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/);

                expect(result.body.error).toContain('to be unique');

                const usersAtEnd = await helper.usersInDb();
                expect(usersAtEnd).toHaveLength(usersAtStart.length);
        });

        test('no password set', async () => {
                const usersAtStart = await helper.usersInDb();

                const newUser = {
                        username: 'heikki',
                        name: 'SuperHeikki',
                };

                await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400);

                const usersAtEnd = await helper.usersInDb();
                expect(usersAtEnd).toHaveLength(usersAtStart.length);
        });

        test('password length less than 3', async () => {
                const usersAtStart = await helper.usersInDb();

                const newUser = {
                        username: 'heikki',
                        name: 'SuperHeikki',
                        password: 'ab',
                };

                await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400);

                const usersAtEnd = await helper.usersInDb();
                expect(usersAtEnd).toHaveLength(usersAtStart.length);
        });

        test('username length less than 3', async () => {
                const usersAtStart = await helper.usersInDb();

                const newUser = {
                        username: 'ab',
                        name: 'SuperHeikki',
                        password: 'sala',
                };

                const result = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400);

                expect(result.body.error).toContain('shorter than');

                const usersAtEnd = await helper.usersInDb();
                expect(usersAtEnd).toHaveLength(usersAtStart.length);
        });
});
