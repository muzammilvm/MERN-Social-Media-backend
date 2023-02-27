const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
useNewUrlParser: true

mongoose.connect('mongodb://localhost:27017/Social-media', () => {
    console.log('Database Connected Successfully...')
})

const User=mongoose.model('User',{
    name:String,
    email:String,
    password:String,
    mobile:Number,
    profilePictureUrl:String,
    gender:String
})

const Notification=mongoose.model('Notification',{
    userId:String,
    notifications:Array
})

const Friend=mongoose.model('Friend',{
    userId:String,
    friendReq:Array,
    friendList:Array
})

const Post=mongoose.model('Post',{
    userId:String,
    imageUrl:String,
    caption:String,
    likes:Array,
    comments:Array
})

const Message=mongoose.model('Message',{
    userIds:String,
    messages:Array
})

module.exports={
    User,
    Notification,
    Friend,
    Post,
    Message
}