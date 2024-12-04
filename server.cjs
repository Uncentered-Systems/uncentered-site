const app = require('./app.cjs')
const fs = require('fs')
const path = require('path')

// listen on PORT if it's set, otherwise use 8080
app.listen(process.env.PORT || 8080, () => console.log(`blog/podcast app listening on ${process.env.PORT || 8080}`))

// every hour, backup the database
const makeBackup = () => {
  const isProd = process.env.NODE_ENV === 'production'
  const homeDir = process.cwd()
  const sourceFile = isProd ? `${homeDir}/db.sqlite` : `${homeDir}/db.test.sqlite`
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = `${homeDir}/backups/backup-${timestamp}.sqlite`

  console.log(`Backing up database to ${backupFile}`)

  fs.copyFile(sourceFile, backupFile, (err) => {
    if (err) {
      console.error('Error creating backup:', err)
      return
    }
    console.log('Backup completed successfully')
  })
}

makeBackup()
setInterval(makeBackup, 1000 * 60 * 60)
