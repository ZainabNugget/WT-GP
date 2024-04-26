const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb+srv://root:h2zTFXG46IeMf15X@cluster0.qolmxew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Atlas");
  })

const PORT = process.env.PORT || 5038;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});