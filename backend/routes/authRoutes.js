const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');
const Post = require('../models/postsSchema');
const Comment = require('../models/commentsSchema');
const multer = require('multer');
const imageUrl = "images/";
const path = require('path');

// Create diskstorage for the images 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../frontend/src/assets/images/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

// Path to images folder '../frontend/src/assets/images'
const upload = multer({ storage: storage});
// const upload = multer({ dest : "../../frontend/src/assets/images/" });

// =========== REGISTER =================
router.post('/register', async (req, res) => {
    // Get the user information from req.body
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    // Check if the username or email exists
    const nameExists = await User.findOne({ username: username })
    const emailExists = await User.findOne({ email: email });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Some erro rhandling if the name or email exists
    if (emailExists || nameExists) {
        res.status(500).json({ message: 'An error occurred during user registration' });
    } else {
        // Otherwise, create the user and yay
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        // Save the changes
        const result = await user.save()

        //JWT creating the cookie
        const { _id } = await result.toJSON()
        const token = jwt.sign({ _id: _id }, "secret")

        // creates the cookie...
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // return 
        res.json({
            user: result
        });
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
    // Encountered many issues with this.
    console.log('Logout request received');

    // Clears cookie after logout is requested
    res.clearCookie('jwt').send('Cookie cleared successfully');
})
// =========== END OF LOG OUT =================

// =========== GET USER  =================
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

// =========== GET ALL USERS  =================
router.get('/get-users', async (req, res) => {
    // Get all the users
    const users = await User.find({})
    res.send(users);
})
// =========== END OF GET USERS  =================

// =========== MAKE A QUESTION =================
router.post("/post", async (req, res) => {
    try {
        // Get all information from the request body
        let title = req.body.title;
        let body = req.body.body;
        let summary = req.body.summary;
        let username = req.body.username;
        let image = req.body.filename;

        // Error logging to check if the information is being transferred properly
        // console.log(req.body)

        // Create a new post document to input into the Posts collection.
        const post = new Post({
            title: title,
            body: body,
            summary: summary,
            username: username,
            image:image
        })

        // Create a result variable to save post for error logging
        const result = await post.save();

        // Log the result to check for errors
        // console.log(result);

        // After post successfully made, return this status code
        res.status(200).json({message: "Post successfully made!"});

    } catch (err) {
        console.log("Error" + err)
    }
})
// =========== END OF MAKE QUESTION =================

// ===========  COMMENT SECTION  =================
router.post('/comments', async (req, res) => {
    try {
        // Get all information from the req.body
        const postId = req.body.postId;
        const username = req.body.username;
        const commentText = req.body.comment;

        // Error logging to check if info is proper.
        // console.log(req.body);

        // Find if postId is in the database
        const post = await Post.findOne({ _id: postId });
        if (!post) { //not likely...
            return res.status(404).json({ message: 'Post not found' });
        }

        // Push the new comment to the comments array
        post.comments.push({ username: username, comment: commentText });

        // Save the updated post
        await post.save();

        // Return a message for successful added comment
        res.json({ message: 'Comment added successfully!' });
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

// =========== END OF COMMENT SECTION =================

// =========== BLOG POSTS =================
router.get('/blog-post', async (req, res) => {
    // Fetch all the blog posts fromt he collection
    const post = await Post.find({})
    res.send(post);
})
// =========== END OF BLOG POST =================

// ===========  POST SLUG (ROUTE)=================
router.get('/:slug', async (req, res) => {
    // Find the post by the slug, which is stored in the database
    const findPost = await Post.findOne({ slug: req.params.slug });
    if (findPost == null) {
        // Post not found oops
        res.json('Post not found!');
    } else {
        // For error logging
        res.send(findPost);
    }
})
// =========== END OF POST SLUG =================

// =========== DELETE POST =================
router.post('/delete', async (req, res) => {
    // Find the post to delete
    const findPost = await Post.findOne({ title: req.body.title });
    if (findPost == null) {
        // Error logging and to prevent server crash
        console.log("Post doesnt exist!")
    } else {
        // Delete the post after finding it.
        findPost.collection.deleteOne(findPost);
    }
})
// =========== END OF DELETE POST =================

// =========== LIKE POST =================

router.post('/like', async (req, res) => {
    // Find the post based on the post id 
    const findPost = await Post.findById(req.body.postId);

    // error logging, as i had problems with http requests :(
    // console.log("This worksss midd")

    // For loop to get the specific comment through the comment id.
    findPost.comments.forEach(comment => {
        // if statement to check for the comment id
        if (comment._id == req.body.commentId) {
            // Increment likes by one after button click
            comment.likes++;
            // error logging
            // console.log(comment.likes);
        }
    });
    // error log
    // console.log("This worksss finalll");

    // Save it to the collection after youre done.
    await findPost.save();

});

// =========== END OF LIKE POST =================

// =========== APPROVE POST =================
router.post('/approve', async (req,res)=>{
    // Find the post to approve by post id 
    const findPost = await Post.findById(req.body._id);
    // Get the boolean from the client side
    findPost.approved = req.body.approved;
})
// =========== END OF APPROVE POST =================

// =========== APPROVE COMMENT =================
router.post('/approve-comment', async (req,res)=>{
    // Find post first from post id
    const findPost = await Post.findById(req.body.postId)

    // Then find the comment by comment id
    findPost.comments.forEach(comment =>{
        if(comment._id == req.body.commentId){
            comment.userApproved = true;
            // Error log
            // console.log("So we found the comment..." + comment.userApproved);
        }
    })

    // Save changes to the collection
   await findPost.save();
})
// =========== END OF APPROVE COMMENT =================

// =========== SAVE FILE/IMAGE =================
router.post("/file", upload.single("file"), function (req, res, next) {
    // Get the file using the req.file
    const file = req.file;
    if (file) { // if there
      res.json(file);
    } else { // error logging
      throw "File not found";
    }
  });
// =========== END OF SAVE FILE/IMAGE =================
  
// Export router for server use.
module.exports = router;
