const express = require('express')
const cors = require('cors')
const data_services = require('./services/data-services')

const server = express()

server.use(cors({
    origin: 'http://localhost:3000'
}))

server.use(express.json())

server.listen(3050, () => {
    console.log('server started at 3050');
})

server.post('/signup', (req, res) => {
    data_services.signup(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

server.post('/login', (req, res) => {
    data_services.login(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// send friend request
server.post('/addFriend', (req, res) => {
    data_services.addfriend(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// to get notifications
server.get('/get-notification/:userId', (req, res) => {
    data_services.getNotification(req.params.userId).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// to get friend request
server.get('/get-friend-request/:userId', (req, res) => {
    data_services.getFriendReq(req.params.userId).then((result)=>{
        console.log(result.request[2]);
        res.status(result.statusCode).json(result)
    })
})

// accept friend request
server.post('/accept-friend-request', (req, res) => {
    data_services.acceptReq(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// reject friend request
server.post('/reject-req', (req, res) => {
    data_services.rejectReq(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})
 
// add post
server.post('/add-post', (req, res) => {
    data_services.addPost(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// like post 
server.post('/like-post', (req, res) => {
    data_services.likePost(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// comment post 
server.post('/comment-post', (req, res) => {
    data_services.addComment(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// send message 
server.post('/send-message', (req, res) => {
    data_services.sendMessage(req.body).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// to get all posts
server.get('/get-all-posts', (req, res) => {
    data_services.getAllPost().then((result)=>{
        console.log(result.posts);
        res.status(result.statusCode).json(result)
    })
})

// to get user posts
server.get('/get-user-posts/:userId', (req, res) => {
    data_services.getUserPost(req.params.userId).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

// to get friend posts
server.get('/get-friends-posts/:userId', (req, res) => {
    data_services.getFriendsPost(req.params.userId).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})









