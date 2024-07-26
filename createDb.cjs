const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db.sqlite')

db.serialize(() => {
    // create new table
    db.run(`CREATE TABLE IF NOT EXISTS blogPosts (
        id INTEGER PRIMARY KEY, 
        slug TEXT, 
        content TEXT, 
        title TEXT, 
        date DATE, 
        headerImage TEXT, 
        thumbnailImage TEXT,
        tags TEXT,
        deleted INTEGER
    )`)

    db.run(`ALTER TABLE blogPosts ADD COLUMN byline TEXT`)

    // create new users table
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, passwordHash TEXT)')

    // create emails table
    db.run('CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY, email TEXT, dateRegistered DATE)')
})

