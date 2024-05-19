const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');
const Post = require('../models/postsSchema');
const Comment = require('../models/commentsSchema');

// =========== REGISTER =================
router.post('/register', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    const nameExists = await User.findOne({ username: username })
    const emailExists = await User.findOne({ email: email });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (emailExists || nameExists) {
        res.status(500).json({ message: 'An error occurred during user registration' });
    } else {
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        const result = await user.save()

        //JWT
        const { _id } = await result.toJSON()
        const token = jwt.sign({ _id: _id }, "secret")

        // creates the cookie...
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.json({
            user: result
        })
    }
});
// =========== END OF REGISTER  =================

// =========== LOGIN =================
router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Find if user exists
    let user = await User.findOne({ email: email });
    if (!user) {
        // Return error message if user not found
        return res.status(401).json({ message: 'User not found' });
    }

    // Find if password matches
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        // return invalid password
        res.status(401).json({ message: 'Invalid password' });
    }

    //JWT
    const token = jwt.sign({ _id: user._id }, "secret")
    // creates the cookie...
    res.cookie('jwt', token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.json({ message: 'Login & sessions successful' });
});
// =========== END OF LOGIN =================

// =========== LOGS USER OUT  =================
router.post('/logout', async (req, res) => {
    console.log('Logout request received');
    res.clearCookie('jwt').send('Cookie cleared successfully');
})
// =========== END OF LOG OUT =================

// =========== GET USER  =================
// router.get('/user', async (req, res) => {
//     try {
//         const token = req.cookies['jwt'];
//         const claims = jwt.verify(token, "secret");
//         if (!claims) {
//             console.log("Invalid, missing JWT")
//         }

//         const user = await User.findOne({ _id: claims._id });
//         if (!user) {
//             res.json('User not found, try signing up!');
//             console.log("Invalid, missing JWT")
//         }

//         const { password, ...data } = user.toJSON();

//         res.send(data);

//     } catch (err) {
//         // console.log("Error while verifying JWT token:", err);
//         return res.status(401).json({
//             message: "Unauthorized"
//         });
//     }
// });
router.get('/user', async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const claims = jwt.verify(token, "secret");
        if (!claims) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            return res.status(404).json({ message: "User not found, try signing up!" });
        }

        const { password, ...data } = user.toJSON();
        res.status(200).send(data);

    } catch (err) {
        console.error("Error while verifying JWT token:", err);
        return res.status(401).json({
            message: "Unauthorized: Error verifying token"
        });
    }
});
// =========== END OF GET USERS  =================

// =========== MAKE A POST (ADMIN ONLY) =================
router.post("/post", async (req, res) => {
    try {
        let title = req.body.title;
        let body = req.body.body;
        let summary = req.body.summary;
        let username = req.body.username;
        console.log(req.body)
        const post = new Post({
            title: title,
            body: body,
            summary: summary,
            username: username
        })

        const result = await post.save();

        res.status(200).json({message: "Post successfully made!"});

    } catch (err) {
        console.log("Error" + err)
    }
})
// =========== END OF MAKE POST =================

// ===========  COMMENT SECTION  =================
router.post('/comments', async (req, res) => {
    try {
        const postId = req.body.postId;
        const username = req.body.username;
        const commentText = req.body.comment;
        console.log(req.body);
        // Find if postId is in the database
        const post = await Post.findOne({ _id: postId });
        if (!post) { //not likely...
            return res.status(404).json({ message: 'Post not found' });
        }

        // Push the new comment to the comments array
        post.comments.push({ username: username, comment: commentText });

        // Save the updated post
        await post.save();

        res.json({ message: 'Comment added successfully!' });
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

// =========== END OF COMMENT SECTION =================

// =========== BLOG POSTS =================
router.get('/blog-post', async (req, res) => {
    const post = await Post.find({})
    res.send(post);
})
// =========== END OF BLOG POST =================

// ===========  POST SLUG (ROUTE)=================
router.get('/:slug', async (req, res) => {
    const findPost = await Post.findOne({ slug: req.params.slug });
    if (findPost == null) {
        res.json('Post not found!');
    } else {
        res.send(findPost);
    }
})
// =========== END OF POST SLUG =================

// =========== DELETE POST =================
router.post('/delete', async (req, res) => {
    const findPost = await Post.findOne({ title: req.body.title });
    if (findPost == null) {
        console.log("Post doesnt exist!")
    } else {
        findPost.collection.deleteOne(findPost);
    }
})
// =========== END OF DELETE POST =================

// =========== LIKE POST =================

router.post('/like', async (req, res) => {
    const findPost = await Post.findById(req.body.postId);
    console.log("This worksss midd")
    findPost.comments.forEach(comment => {
        if (comment._id == req.body.commentId) {
            comment.likes++;
            console.log(comment.likes);
        }
    });
    console.log("This worksss finalll")
    await findPost.save();

});


// =========== END OF LIKE POST =================

// =========== APPROVE POST =================
router.post('/approve', async (req,res)=>{
    const findPost = await Post.findById(req.body._id)
    findPost.approved = req.body.approved;
})
// =========== END OF APPROVE POST =================

// =========== APPROVE COMMENT =================
router.post('/approve-comment', async (req,res)=>{
    const findPost = await Post.findById(req.body.postId)
    findPost.comments.forEach(comment =>{
        if(comment._id == req.body.commentId){
            comment.userApproved = true;
            console.log("So we found the comment..." + comment.userApproved);
        }
    })
   await findPost.save();
})
// =========== END OF APPROVE COMMENT =================

module.exports = router;
