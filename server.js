const express = require("express");
const session = require('express-session')
const {RedisStore} = require("connect-redis")
const {createClient} = require("redis")
require('dotenv').config();

const app = express();

// アプリケーションがプロキシの後ろで動く場合、信頼できるプロキシとして設定しないと、プロトコルのご認識などが発生する
// app.set('trust proxy', 1)

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
        maxAge: 1000 * 60 * 30 // 30 minutes
    }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const users = []

app.post('/admin/register', (req, res) => {
    // request validation

    // already registered user check

    // password hash
    // const password = req.body.password
    // const hashedPassword = await bcrypt.hash(password, 10)

    // create user session

    // end point で admin と user を切り替える
    req.session.roles = 'admin'
    // random client id
    req.session.clientId = '1234567890'

    res.status(201).json({
        message: 'User registered successfully'
    })
})

app.post('/user/register', (req, res) => {
    // request validation

    // already registered user check

    // password hash

    // create user session

    // end point で admin と user を切り替える
    req.session.roles = 'user'
    // random client id
    req.session.clientId = '1234567890'
})

app.post('/login', (req, res) => {
    // request validation

    // user check

    req.session.roles = 'user'
    req.session.clientId = '1234567890'

    res.status(200).json({
        message: 'User logged in successfully'
    })
})

const sessionCheck = (req, res, next) => {
    // session check
    if (!req.session || !req.session.roles || !req.session.clientId) {
        return res.status(401).json({
            message: 'session is not valid'
        })
    }

    next()
}

app.get('/hobby', sessionCheck, (req, res) => {
    // request validation

    res.status(200).json({
        message: 'hobby is valid'
    })
})

app.listen(4567, () => {
    console.log('Server is running on port 4567')
})