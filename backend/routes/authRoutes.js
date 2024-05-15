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
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.json({ message: 'Login & sessions successful' });
});
// =========== END OF LOGIN =================

// =========== LOGS USER OUT  =================
router.post('/logout', async (req, res) => {
    res.clearCookie('jwt').send('Cookie cleared successfully');
})
// =========== END OF LOG OUT =================

// =========== GET USER  =================
router.get('/user', async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        if (!token) {
            console.log("Error, missing JWT")
        }

        const claims = jwt.verify(token, "secret");
        if (!claims) {
            console.log("Invalid, missing JWT")
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            res.json('User not found, try signing up!');
            console.log("Invalid, missing JWT")
        }

        const { password, ...data } = user.toJSON();

        res.send(data);

    } catch (err) {
        // console.log("Error while verifying JWT token:", err);
        return res.status(401).json({
            message: "Unauthorized"
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

        const post = new Post({
            title: title,
            body: body,
            summary: summary
        })

        const result = await post.save();

        console.log(result)
  
        let id = result._id.toString(); // Assuming `result` contains the post document
        const commentSection = new Comment({
            postId : id // Ensure postId is correctly assigned
        });
        const commentResult = await commentSection.save();
        console.log(commentResult)
        
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

        // Find if postId is in the database
        const post = await Comment.findOne({postId: postId});
        if (!post) { //not likely...
            return res.status(404).json({ message: 'Post not found' });
        }

        // Push the new comment to the comments array
        post.comments.push({ username: username, comment: commentText });

        // Save the updated post
        await post.save();

        res.json({ message: 'Comment added successfully!' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// =========== END OF COMMENT SECTION =================

// =========== COMMENTS =================
router.post('/post-comments', async (req, res) => {
    try {
        console.log(req.body.postId);
        const postId = req.body.postId;
        const comments = await Comment.findOne({ postId: postId });
        console.log(comments)
        res.send(comments); // Send the comments as a JSON response
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
});
// =========== END OF COMMENTS =================

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
    let title = "";
    const findPost = await Post.findOne({ title: req.body.title });
    console.log(findPost);
    if (findPost == null) {
        console.log("Post doesnt exist!")
    } else {
        findPost.collection.deleteOne(findPost);
    }
})
// =========== END OF DELETE POST =================

module.exports = router;
