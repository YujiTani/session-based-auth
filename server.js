const express = require("express");
const session = require('express-session')
const {RedisStore} = require("connect-redis")
const {createClient} = require("redis")

const app = express();

const redisClient = createClient({
    url: 'redis://localhost:6379'
})
redisClient.connect().catch(console.error)

// initialize redis client
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session-auth:'
})

app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(4567, () => {
    console.log('Server is running on port 4567')
})