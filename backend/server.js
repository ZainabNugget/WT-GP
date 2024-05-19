const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Routes = require('./routes/authRoutes');

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:4200', // Your Angular app's URL
  credentials: true, // Allow credentials (cookies)
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed methods
  allowedHeaders: 'Content-Type, Authorization, Content-Length, X-Requested-With' // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", Routes);

app.get('/*', function(req, res) {
  res.status(200).sendFile(path.resolve(__dirname + "/public/index.html"));
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// MongoDB connection
const url = "mongodb+srv://root:h2zTFXG46IeMf15X@cluster0.qolmxew.mongodb.net/blog-WT?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
