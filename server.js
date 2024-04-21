const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
// const { MongoClient, ServerApiVersion } = require('mongodb');
const {Server}=require("socket.io")
const app = require('./App');
const DB  = process.env.DATABASE_DEV.replace('<PASSWORD>', process.env.DB_PASSWORD);
const cors=require("cors")

mongoose.set('useCreateIndex',true)
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://careerclassroom4:tfBaqqv34nS9LbQu@cluster0.vd6vmgk.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser:true,
  useUnifiedTopology:true
},(err)=>{
  if(err){
    console.log("mongoose error is " + err)
  }else{
    console.log("suceesss your db is connected")
  }
})


// const uri = 
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
const io = new Server(server);


// Apply CORS middleware to Socket.IO server

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data)
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED, Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
