const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express()
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())


app.get('/', (req,res)=>{
    res.send('Assignment Avengers are coming Soon!!!')
})


// ${process.env.DB_USER}
// ${process.env.DB_PASSWORD}
const uri = `mongodb+srv://Assignment-Avengers:Ic8jAQIw9gYAFNsX@cluster0.je93mhd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Assignment Avengers is running on port: ${port}`)
})