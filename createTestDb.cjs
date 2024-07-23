const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db.test.sqlite')

db.serialize(() => {
    // drop old table
    db.run('DROP TABLE IF EXISTS blogPosts')
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

    // drop old users table
    db.run('DROP TABLE IF EXISTS users')
    // create new users table
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, passwordHash TEXT)')

    // drop old emails table
    db.run('DROP TABLE IF EXISTS emails')
    // create emails table
    db.run('CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY, email TEXT, dateRegistered DATE)')
})