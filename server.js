const express = require("express");
const session = require('express-session')
const redis = require('redis')
const connectRedis = require('connect-redis')

const app = express();
const RedisStore = connectRedis(session)

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
})

redisClient.connect().catch(console.error)

app.use(session({
    store: new RedisStore(redisClient),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    }
}))


app.listen(4567, () => {
    console.log('Server is running on port 4567')
})