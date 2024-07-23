const app = require('./app')

// listen on PORT if it's set, otherwise use 8080
app.listen(process.env.PORT || 8080, () => console.log(`blog/podcast app listening on ${process.env.PORT || 8080}`))

