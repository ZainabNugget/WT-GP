const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

// Database schema
const Login = require('./models/loginSchema')
const Posts = require('./models/postsSchema')

// Session requirements
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Router setup
const Routes = require('./routes/authRoutes')

const app = express()
app.use(cookieParser())
// Session
app.use(session({
  secret: 'cat', // Secret used to sign the session ID cookie
  resave: false, // Whether to save the session even if it's not modified
  saveUninitialized: false, // Whether to save uninitialized sessions
  cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // Session duration (1 day)
  }
}));

app.get('/', function(req, res){
  if(req.session.page_views){
     req.session.page_views++;
     res.send("You visited this page " + req.session.page_views + " times");
  } else {
     req.session.page_views = 1;
     res.send("Welcome to this page for the first time!");
  }
});

// CORS setup
app.use(cors({
  credentials: true,
  // origin: 'http://localhost:4200/', // Allow requests from this origin
  origin: true, 
  methods: 'POST,GET,PUT,OPTIONS,DELETE'
}));

app.use(express.json())

app.use("/api", Routes)

app.get('/',  (req, res) =>{
  res.send('Hello, World!');
})

// Mongodb connection
const url = "mongodb+srv://root:h2zTFXG46IeMf15X@cluster0.qolmxew.mongodb.net/blog-WT?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(url)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Atlas");
})

// Cookies and session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});