const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const slugify = require('./src/utils/slugify.cjs')
const fs = require('fs')
const path = require('path')
const multer = require('multer');
const sharp = require('sharp');

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  console.log(`
  ::::::::   ::::::::     ::::::   :::::::: 
  :+:    :+: :+:    :+: :+:    :+: :+:    :+:
  +:+    +:+ +:+    +:+ +:+    +:+ +:+    +:+
  +#++:++#   +#++:++#   +#+    +#+ +#+    +#+
  +#+        +#+    +#+ +#+    +#+ +#+    +#+
  #+#        #+#    #+# #+#    #+# #+#    #+#
  ###        ###    ###   ######   ########
  `)
  console.log('running in production mode')
} else {
  console.log('running in development mode')
}

const upload = multer({ dest: isProd ? 'public/images/' : 'test/images/' });

app.use('/api/', express.static(path.join(__dirname, isProd ? 'public' : 'test')));
app.use(express.json())
const db = new sqlite3.Database(isProd ? './db.sqlite' : './db.test.sqlite')

// blogin 
app.post('/api/blog/login', async (req, res) => {
  const { username, password } = req.body;
  // Here, you would look up the user in your database
  const user = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err)
      }
      resolve(row)
    })
  })
  if (!user) {
    return res.status(401).send('No user found');
  }
  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return res.status(401).send('Invalid credentials')
  }
  const token = jwt.sign({ userID: user.userID }, process.env.SECRET_KEY, { expiresIn: '6h' })
  res.send({ token })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authenticateTokenIfPresentButNextAnyway(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return next();

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next();
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.send('success')
})

// create post
app.post('/api/blog/posts', authenticateToken, (req, res) => {
  // replace all non-alphanumerics
  const slug = slugify(req.body.title)

  // write the post to db
  db.run('INSERT INTO blogPosts (slug, content, title, headerImage, thumbnailImage, date, deleted, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      slug,
      req.body.content,
      req.body.title,
      req.body.headerImage,
      req.body.thumbnailImage,
      req.body.date || +(new Date()),
      0,
      req.body.tags,
    ],
    (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('error writing to db')
      }
      res.status(201).send({ success: true })
    })
})

// all posts
app.get('/api/blog/posts', authenticateTokenIfPresentButNextAnyway, (req, res) => {
  const now = +(new Date())
  let seeDeleted = req.user ? true : false
  let seeFuture = req.user ? true : false
  db.all(`SELECT * FROM blogPosts 
    ${seeFuture ? '' : `WHERE date <= ${now}`}
    ${seeDeleted ? '' : 'AND deleted = 0'} 
    ORDER BY date`,
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).send('error reading from db')
      }
      res.json(rows)
    })
})

// get post by id
app.get('/api/blog/posts/:slug', (req, res) => {
  db.get('SELECT * FROM blogPosts WHERE slug = ? AND deleted = 0', [req.params.slug], (err, row) => {
    if (err) {
      return res.status(500).send('error reading from db')
    }
    res.json(row)
  })
})

// delete post
app.delete('/api/blog/posts/:slug', authenticateToken, (req, res) => {
  db.run('UPDATE blogPosts SET deleted = 1 WHERE slug = ?', [req.params.slug], (err) => {
    if (err) {
      return res.status(500).send('error deleting from db')
    }
    res.status(201).send('success')
  })
})

// edit post
app.put('/api/blog/posts/:slug', authenticateToken, (req, res) => {
  // replace all non-alphanumerics
  const newSlug = slugify(req.body.title)
  db.run('UPDATE blogPosts SET content = ?, title = ?, headerImage = ?, thumbnailImage = ?, slug = ?, date = ?, tags = ?, deleted = ? WHERE slug = ?',
    [
      req.body.content,
      req.body.title,
      req.body.headerImage,
      req.body.thumbnailImage,
      newSlug,
      req.body.date,
      req.body.tags,
      req.body.deleted || 0,
      req.params.slug
    ],
    (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('error writing to db')
      }
      res.status(201).send('success')
    })
})

// upload images for blog posts
app.post('/api/blog/images', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.status(201).send('File uploaded successfully');

    try {
      // also save a 100x100 copy of the image
      const sizes = [['thumbnail', 100], ['medium', 200]]
      for (const [size, width] of sizes) {
        const filename = `${req.file.filename}-${size}`
        const filepath = path.join(process.cwd(), isProd ? 'public/images' : 'test/images', filename)
        sharp(req.file.path).resize(width, width).toFile(filepath)
      }
    } catch (error) {
      console.error('Error saving thumbnail: ', error)
      res.status(500).send('error saving thumbnail')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('error uploading file')
  }
});

// fetch image filenames for blog posts
app.get('/api/blog/images', (req, res) => {
  // send back a list of filenames in /public/images
  const filenames = fs
    .readdirSync(path.join(process.cwd(), isProd ? 'public/images' : 'test/images'))
    .filter(filename => !filename.includes('-thumbnail'))
  res.json(filenames)
})

app.post('/api/sign-up-for-newsletter', (req, res) => {
  try {
    const { email } = req.body
    db.run('INSERT INTO emails (email, dateRegistered) VALUES (?, ?)', [email, +(new Date())])
    res.status(201).send('success')
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

module.exports = app

