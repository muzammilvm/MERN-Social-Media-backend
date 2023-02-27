const { response } = require('express');
const { get } = require('mongoose');
const db = require('./db')
const ObjectId = require('mongodb').ObjectId

const signup = (userDetails) => {
    console.log('user signup api');
    return db.User.findOne({ email: userDetails.email }).then((result) => {
        console.log(result);
        if (result) {
            return {
                statusCode: 403,
                message: 'User Already exist'
            }
        } else {
            return db.User.insertMany({
                name: userDetails.name,
                email: userDetails.email,
                password: userDetails.password,
                mobile: userDetails.mobile,
                profilePictureUrl: userDetails.profilePictureUrl,
                gender: userDetails.gender,
            }).then((result) => {
                console.log(result);
                if (result) {
                    return db.Notification.insertMany({ userId: result[0]._id }).then((response) => {
                        return db.Notification.updateOne({ userId: result[0]._id },
                            {
                                $push: { notifications: "hello " + result[0].name }
                            }).then((data) => {
                                if (data) {
                                    return {
                                        statusCode: 200,
                                        message: 'Registration Successfull'
                                    }
                                }
                            })
                    })

                }
            })
        }
    })

}



const login = (loginDetails) => {
    console.log('login function')
    return db.User.findOne({
        email: loginDetails.email,
        password: loginDetails.password
    }).then((result) => {
        console.log(result);
        if (result) {
            console.log(result);
            return {
                statusCode: 200,
                message: 'login Successfull',
                name: result.name,
                email: result.email,
                id: result._id,
            }
        } else {
            return {
                statusCode: 403,
                message: 'Invalid Account or password'
            }
        }
    })
}

const addfriend = (details) => {
    console.log('add friend function');
    console.log(details);

    // fromUser={
    //     from:ObjectId(details.fromuserId)
    // }

    return db.Friend.findOne({ userId: details.touserId }).then((result) => {
        if (result) {
            let fromUserExist = result.friendReq.findIndex(fromuser => fromuser == details.fromuserId)
            console.log(fromUserExist);
            if (fromUserExist == -1) {

                return db.Friend.updateOne({ userId: details.touserId }, {
                    $push: { friendReq: ObjectId(details.fromuserId) }
                }).then((data) => {
                    if (data) {
                        return db.Notification.updateOne({ userId: details.touserId }, {
                            $push: { notifications: details.fromuserName + " has sent you a friend request" }
                        }).then((response) => {
                            if (response) {
                                return {
                                    statusCode: 200,
                                    message: 'friend request sent'
                                }
                            }
                        })
                    }
                })
            } else {
                return {
                    statusCode: 403,
                    message: "friend request already sent"
                }
            }
        } else {
            // const newReq = new db.Friend({
            //     userId: details.touserId
            // })
            // newReq.save()
            return db.Friend.insertMany({ userId: details.touserId }).then((result) => {
                if (result) {
                    return db.Friend.updateOne({ userId: details.touserId }, {
                        $push: { friendReq: ObjectId(details.fromuserId) }
                    }).then((data) => {
                        if (data) {
                            return db.Notification.updateOne({ userId: details.touserId }, {
                                $push: { notifications: details.fromuserName + " has sent you a friend request" }
                            }).then((response) => {
                                if (response) {
                                    return {
                                        statusCode: 200,
                                        message: 'created new friends collection and final step notification updated'
                                    }
                                }
                            })
                        }

                    })
                }
            })
        }
    })

}

const getNotification = (userId) => {
    return db.Notification.findOne({ userId }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                message: 'fetched notifications',
                notifications: result.notifications
            }

        } else {
            return {
                statusCode: 403,
                message: 'invalid userId'
            }
        }
    })
}

const getFriendReq = (userId) => {
    return db.Friend.findOne({ userId }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                message: 'fetched friend request',
                request: result.friendReq
            }

        } else {
            return {
                statusCode: 403,
                message: 'invalid userId'
            }
        }
    })
}

const acceptReq = (details) => {
    return db.Friend.findOne({ userId: details.fromuserId }).then((result) => {
        if (result) {
            let fromUserExist = result.friendReq.findIndex(fromuser => fromuser == details.touserId)
            console.log(fromUserExist);
            if (fromUserExist != -1) {
                return db.Friend.updateOne({ userId: details.fromuserId }, {
                    $push: {
                        friendList: ObjectId(details.touserId)
                    },
                    $pull: {
                        friendReq: ObjectId(details.touserId)
                    }
                }).then((result) => {
                    if (result) {
                        return db.Notification.updateOne({ userId: details.touserId }, {
                            $push: { notifications: details.fromuserName + " has Accepted your friend request" }
                        }).then((res) => {
                            return db.Friend.findOne({ userId: details.touserId }).then((toFrndList) => {
                                if (toFrndList) {
                                    return db.Friend.updateOne({ userId: details.touserId }, {
                                        $push: {
                                            friendList: ObjectId(details.fromuserId)
                                        }
                                    }).then((status) => {
                                        if (status) {
                                            return {
                                                statusCode: 200,
                                                message: "friend request status changed and notification updated"
                                            }
                                        }
                                    })
                                } else {
                                    return db.Friend.insertMany({ userId: details.touserId }).then((newFrnd) => {
                                        if (newFrnd) {
                                            return db.Friend.updateOne({ userId: details.touserId }, {
                                                $push: { friendList: ObjectId(details.fromuserId) }
                                            }).then((data) => {
                                                if (data) {
                                                    if (data) {
                                                        return {
                                                            statusCode: 200,
                                                            message: "friend request status changed and notification updated"
                                                        }
                                                    }
                                                    // return db.Notification.updateOne({ userId: details.touserId }, {
                                                    //     $push: { notifications: details.fromuserName + " has sent you a friend request" }
                                                    // }).then((response) => {
                                                    //     if (response) {
                                                    //         return {
                                                    //             statusCode: 200,
                                                    //             message: 'created new friends collection and final step notification updated'
                                                    //         }
                                                    //     }
                                                    // })
                                                }

                                            })
                                        }
                                    })
                                }
                            })
                        })
                    } else {
                        return {
                            statusCode: 403,
                            message: "invalid from userId"
                        }
                    }
                })
            } else {
                return {
                    statusCode: 403,
                    message: "no request found"
                }
            }
        }
    })
}

const rejectReq = (details) => {
    return db.Friend.findOne({ userId: details.fromId }).then((friend) => {
        if (friend) {
            let fromUserExist = friend.friendReq.findIndex(fromuser => fromuser == details.touserId)
            if (fromUserExist != -1) {
                return db.Friend.updateOne({ userId: details.fromId }, {
                    $pull: {
                        friendReq: ObjectId(details.touserId)
                    }
                }).then((data) => {
                    if (data) {
                        return db.Notification.updateOne({ userId: details.touserId }, {
                            $push: { notifications: details.fromuserName + " has Rejected your friend request" }
                        }).then((result) => {
                            if (result) {
                                return {
                                    statusCode: 200,
                                    message: "friend request rejected and notification updated"
                                }
                            }
                        })
                    } else {
                        return {
                            statusCode: 403,
                            message: "friend req rejected but notification not changed"
                        }
                    }
                })
            } else {
                return {
                    statusCode: 403,
                    message: "no friend req found"
                }
            }

        } else {
            return {
                statusCode: 403,
                message: "no friend document found"
            }
        }
    })
}

const addPost = (details) => {
    return db.Post.insertMany({
        userId: details.userId,
        imageUrl: details.imageUrl,
        caption: details.caption
    }).then((post) => {
        if (post) {
            return db.Friend.findOne({ userId: details.userId }).then((result) => {
                if (result) {
                    console.log(result);
                    return db.Notification.updateMany({ userId: result.friendList }, {
                        $push: { notifications: details.userName + " added a new post" }
                    }).then((data) => {
                        if (data) {
                            return {
                                statusCode: 200,
                                message: "post added and notification updated",
                            }
                        } else {
                            return {
                                statusCode: 403,
                                message: "post added but notification not updated"
                            }
                        }
                    })

                } else {
                    return {
                        statusCode: 403,
                        message: "no friends found"
                    }
                }
            })
        } else {
            return {
                statusCode: 403,
                message: "invalid datas"
            }
        }
    })
}

const likePost = (details) => {
    return db.Post.findOne({ _id: ObjectId(details.postId) }).then((posts) => {
        if (posts) {
            let likeExist = posts.likes.findIndex(likes => likes == details.likedId)
            console.log(likeExist);
            if (likeExist == -1) {
                return db.Post.updateOne({ _id: details.postId }, {
                    $push: { likes: ObjectId(details.likedId) }
                }).then((result) => {
                    if (result) {
                        return db.Notification.updateOne({ userId: details.touserId }, {
                            $push: { notifications: details.fromuserName + " liked your post" }
                        }).then((response) => {
                            if (response) {
                                return {
                                    statusCode: 200,
                                    message: "liked and notification updated"
                                }
                            }
                        })

                    }
                })
            } else {
                return db.Post.updateOne({ _id: details.postId }, {
                    $pull: { likes: ObjectId(details.likedId) }
                }).then((result) => {
                    if (result) {
                        return db.Notification.updateOne({ userId: details.touserId }, {
                            $push: { notifications: details.fromuserName + " unliked your post" }
                        }).then((response) => {
                            if (response) {
                                return {
                                    statusCode: 200,
                                    message: "unliked and notification updated"
                                }
                            }
                        })

                    }
                })
            }
        } else {
            return {
                statusCode: 403,
                message: "no post found"
            }
        }
    })
}

const addComment = (details) => {
    let commentDetails = {
        commentedId: ObjectId(details.commentedId),
        comment: details.comment
    }
    return db.Post.findOne({ _id: ObjectId(details.postId) }).then((posts) => {
        if (posts) {
            return db.Post.updateOne({ _id: details.postId }, {
                $push: { comments: commentDetails }
            }).then((result) => {
                if (result) {
                    return db.Notification.updateOne({ userId: details.touserId }, {
                        $push: { notifications: details.fromuserName + " has commented to your post" }
                    }).then((response) => {
                        if (response) {
                            return {
                                statusCode: 200,
                                message: "commented and notification updated"
                            }
                        } else {
                            return {
                                statusCode: 403,
                                message: "to userId not found"
                            }
                        }
                    })
                } else {
                    return {
                        statusCode: 403,
                        message: "somethng went wrong"
                    }
                }
            })
        } else {
            return {
                statusCode: 403,
                message: "no post found"
            }
        }
    })

}

const sendMessage = (details) => {
    let message = {
        userId: details.fromId,
        message: details.message
    }

    return db.Message.findOne(
        { $or: [{ userIds: details.fromId + "," + details.toId }, { userIds: details.toId + "," + details.fromId }] }
    ).then((result) => {
        if (result) {
            return db.Message.updateOne({ userIds: result.userIds }, {
                $push: { messages: message }
            }).then((msg) => {
                if (msg) {
                    return {
                        statusCode: 200,
                        message: "message added to existing document"
                    }
                } else {
                    return {
                        statusCode: 403,
                        message: "message document found but message not inserted"
                    }
                }
            })

        } else {
            return db.Message.insertMany({
                userIds: details.fromId + "," + details.toId,
                messages: message
            }).then((result) => {
                if (result) {
                    return {
                        statusCode: 200,
                        message: "new document created and message added"
                    }
                } else {
                    return {
                        statusCode: 403,
                        message: "something went wrong"
                    }
                }
            })

        }
    })
}

const getAllPost = () => {
    return db.Post.find().then((posts) => {
        if (posts) {
            return {
                statusCode: 200,
                message: "posts fetched succesfully",
                posts: posts
            }
        } else {
            return {
                statusCode: 403,
                message: "no posts to display"
            }
        }
    })
}

const getUserPost = (userId) => {
    return db.Post.find({ userId }).then((posts) => {
        if (posts) {
            return {
                statusCode: 200,
                message: "posts from user fetched",
                posts: posts
            }
        } else {
            return {
                statusCode: 403,
                message: "no posts from this userId"
            }
        }
    })
}

const getFriendsPost = (userId) => {
    return db.Friend.findOne({ userId }).then((friends) => {
        if (friends) {
            return db.Post.find({ userId: friends.friendList }).then((posts) => {
                if (posts) {
                    return{
                        statusCode:200,
                        message:"fetch posts from the friend list",
                        posts:posts
                    }
                } else {
                    return {
                        statusCode: 403,
                        message: "no posts found"
                    }
                }
            })
        } else {
            return {
                statusCode: 403,
                message: "no friends found"
            }
        }
    })
}






module.exports = {
    signup,
    login,
    addfriend,
    getNotification,
    getFriendReq,
    acceptReq,
    addPost,
    likePost,
    addComment,
    sendMessage,
    rejectReq,
    getAllPost,
    getUserPost,
    getFriendsPost
}