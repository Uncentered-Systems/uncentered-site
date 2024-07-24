const request = require('supertest');
const server = require('./app'); 
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')

const db = new sqlite3.Database('./db.test.sqlite')
const passwordHash = bcrypt.hashSync('password123', 10)
const fs = require('fs')
const path = require('path')

const postTitle = 'test title';
const postContent = 'test content';
const postHeaderImage = 'test header image';
const postThumbnailImage = 'test thumbnail image';
const userCredentials = {
    username: 'testUser', 
    password: 'password123'
};
let jwt = '';

if (process.env.NODE_ENV === 'production') {
    throw new Error('Tests cannot be run in production mode')
}

describe('JWT Authentication', () => {
    describe('Login Endpoint', () => {
        test('can add user to db and verify user is in db', async () => {
            db.run('INSERT INTO users (username, passwordHash) VALUES (?, ?)', 
                [userCredentials.username, passwordHash],
                async (err) => {
                    if (err) {
                        console.log(err)
                    }
                    db.get('SELECT * FROM users WHERE username = ?', [userCredentials.username], (err, row) => {
                        expect(row.username).toBe(userCredentials.username)
                        expect(bcrypt.compareSync(userCredentials.password, row.passwordHash)).toBe(true)
                    })
                })
        });

        test('should return 200 and a token for valid credentials', async () => {
            const response = await request(server)
                .post('/api/blog/login')
                .send(userCredentials);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        test('should return 401 for invalid credentials', async () => {
            const response = await request(server)
                .post('/api/blog/login')
                .send({ username: 'wrongUser', password: 'wrongPassword' });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('Accessing Protected Route', () => {
        let token;

        beforeAll(async () => {
            const response = await request(server)
                .post('/api/blog/login')
                .send(userCredentials);
            
            token = response.body.token;
        });

        test('should allow access to a protected route with valid token', async () => {
            const response = await request(server)
                .get('/protected')
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.statusCode).toBe(200);
        });

        test('should deny access to a protected route with no token', async () => {
            const response = await request(server).get('/protected');
            expect(response.statusCode).toBe(401);
        });
    });
});

describe('Blog Posts', () => {
    describe('login', () => {
        test('should return 200 and a token for valid credentials', async () => {
            const response = await request(server)
                .post('/api/blog/login')
                .send(userCredentials);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
            jwt = response.body.token;
        });

        test('should return 401 for invalid credentials', async () => {
            const response = await request(server)
                .post('/api/blog/login')
                .send({ username: 'wrongUser', password: 'wrongPassword' });

            expect(response.statusCode).toBe(401);
        });
    })

    describe('create', () => {
        test('should return 401 without token', async () => {
            const response = await request(server)
                .post('/api/blog/posts')
                .send({ title: postTitle, content: postContent });

            expect(response.statusCode).toBe(401);
        });

        let timeAtPost = +(dayjs().toDate())
        test('should return 201 with token', async () => {
            const response = await request(server)
                .post('/api/blog/posts')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ title: postTitle, content: postContent, headerImage: postHeaderImage, thumbnailImage: postThumbnailImage, date: timeAtPost });

            expect(response.statusCode).toBe(201);
        });

        test('blog post should be in db', async () => {
            const post = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM blogPosts WHERE title = ?', [postTitle], (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            })

            expect(post.title).toBe(postTitle)
            expect(post.content).toBe(postContent)
            expect(post.headerImage).toBe(postHeaderImage)
            expect(post.thumbnailImage).toBe(postThumbnailImage)
            expect(post.date).toBe(timeAtPost)
        })

        test('can get blogpost by slug', async () => {
            const response = await request(server)
                .get('/api/blog/posts/test-title')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(200);
            expect(response.body.title).toBe(postTitle)
            expect(response.body.content).toBe(postContent)
            expect(response.body.headerImage).toBe(postHeaderImage)
            expect(response.body.thumbnailImage).toBe(postThumbnailImage)
            expect(response.body.slug).toBe('test-title')
        })

        test('can get blogposts', async () => {
            const response = await request(server)
                .get('/api/blog/posts')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1)
            expect(response.body[0].title).toBe(postTitle)
            expect(response.body[0].content).toBe(postContent)
            expect(response.body[0].headerImage).toBe(postHeaderImage)
            expect(response.body[0].thumbnailImage).toBe(postThumbnailImage)
            expect(response.body[0].slug).toBe('test-title')
            expect(response.body[0].date).toBe(timeAtPost)
        })

        test('can add post with date in the future', async () => {
            const response = await request(server)
                .post('/api/blog/posts')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ title: 'future date', content: 'future content', date: +(dayjs().add(1, 'day').toDate()) })

            expect(response.statusCode).toBe(201);
        })

        test('future blogposts DO show up in all posts when logged in', async () => {
            const response = await request(server)
                .get('/api/blog/posts')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2)
        })

        test('future blogposts DO NOT show up in all posts when NOT logged in', async () => {
            const response = await request(server)
                .get('/api/blog/posts')

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1)
        })

        test('remove future blogpost from db', async () => {
            db.run('DELETE FROM blogPosts WHERE title = ?', ['future date'])
            const post = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM blogPosts WHERE title = ?', ['future date'], (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            })

            expect(post).toBe(undefined)
        })
    })

    describe('edit', () => {
        let timeAtPost = +(dayjs().toDate())
        test('original post is unedited', async () => {
            const post = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM blogPosts WHERE title = ?', [postTitle], (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            })

            expect(post.title).toBe(postTitle)
            expect(post.content).toBe(postContent)
            expect(post.headerImage).toBe(postHeaderImage)
            expect(post.thumbnailImage).toBe(postThumbnailImage)
            expect(post.date).toBeLessThanOrEqual(timeAtPost)
            expect(post.deleted).toBe(0)
        })

        test('can edit blogpost', async () => {
            const response = await request(server)
                .put('/api/blog/posts/test-title')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ title: 'new title', content: 'new content', headerImage: 'new header image', thumbnailImage: 'new thumbnail image', date: timeAtPost })

            expect(response.statusCode).toBe(201);
        })

        test('blog post should be updated in db', async () => {
            const post = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM blogPosts WHERE title = ?', ['new title'], (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            })

            expect(post.title).toBe('new title')
            expect(post.content).toBe('new content')
            expect(post.headerImage).toBe('new header image')
            expect(post.thumbnailImage).toBe('new thumbnail image')
            expect(post.date).toBe(timeAtPost)
            expect(post.deleted).toBe(0)
        })

        test('can restore original post', async () => {
            const response = await request(server)
                .put('/api/blog/posts/new-title')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ title: postTitle, content: postContent, headerImage: postHeaderImage, thumbnailImage: postThumbnailImage, date: timeAtPost })

            expect(response.statusCode).toBe(201);
        })

        test('original post is restored', async () => {
            const post = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM blogPosts WHERE title = ?', [postTitle], (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            })

            expect(post.title).toBe(postTitle)
            expect(post.content).toBe(postContent)
            expect(post.headerImage).toBe(postHeaderImage)
            expect(post.thumbnailImage).toBe(postThumbnailImage)
            expect(post.date).toBe(timeAtPost)
            expect(post.deleted).toBe(0)
        })
    })

    describe('image upload', () => {
        test('can upload image', async () => {
            const response = await request(server)
                .post('/api/blog/images')
                .set('Authorization', `Bearer ${jwt}`)
                .attach('file', path.join(process.cwd(), 'test/test.jpg'))

            expect(response.statusCode).toBe(201);
        })

        test('cannot upload without token', async () => {
            const response = await request(server)
                .post('/api/blog/images')
                .attach('file', path.join(process.cwd(), 'test/test.jpg'))

            expect(response.statusCode).toBe(401);
        })

        test('image filenames are served by filenames endpoint', async () => {
            const response = await request(server)
                .get('/api/blog/images')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('length')
            expect(response.body.length).toBe(1)
        })
    })

    describe('delete', () => {
        test('can delete blogpost', async () => {
            const response = await request(server)
                .delete('/api/blog/posts/test-title')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(201);
        })

        test('blog post should be in db with deleted=1', async () => {
            const post = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM blogPosts WHERE title = ? AND deleted = 1', [postTitle], (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            })

            expect(post.title).toBe(postTitle)
            expect(post.content).toBe(postContent)
            expect(post.headerImage).toBe(postHeaderImage)
            expect(post.thumbnailImage).toBe(postThumbnailImage)
        })

        test('deleted post should not show up in all posts (unauthed)', async () => {
            const response = await request(server)
                .get('/api/blog/posts')

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(0)
        })

        test('deleted post should show up in all posts (authed)', async () => {
            const response = await request(server)
                .get('/api/blog/posts')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1)
        })
    
        test('can undelete post', async () => {
            const response = await request(server)
                .put('/api/blog/posts/test-title')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ title: postTitle, content: postContent, headerImage: postHeaderImage, thumbnailImage: postThumbnailImage, date: +(dayjs().toDate()), deleted: 0 })
    
            expect(response.statusCode).toBe(201);
        })

        test('undeleted post should show up in all posts', async () => {
            const response = await request(server)
                .get('/api/blog/posts')
                .set('Authorization', `Bearer ${jwt}`)

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1)
        })
    })
});


describe('teardown', () => {
    test('can remove user from db', async () => {
        db.run('DELETE FROM users')
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users', (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve(row)
            })
        })

        expect(user).toBe(undefined)
    })

    test('can remove all blog posts from db', async () => {
        db.run('DELETE FROM blogPosts')
        const post = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM blogPosts', (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve(row)
            })
        })

        expect(post).toBe(undefined)
    })

    test('can close db', async () => {
        db.close()
    })

    test('can delete images from test/images', async () => {
        const fs = require('fs')
        // filenames are randomized, so we need to read the directory and delete each file
        const files = fs.readdirSync(path.join(process.cwd(), 'test/images'))
        files.forEach(file => {
            fs.unlinkSync(`test/images/${file}`)
        })
    })

    test('images were deleted', async () => {    
        const files = fs.readdirSync(path.join(process.cwd(), 'test/images'))
        expect(files.length).toBe(0)
    })
})

