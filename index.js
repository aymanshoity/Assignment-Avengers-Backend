const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const app=express()
const port = process.env.PORT || 5000;
const dotenv=require('dotenv')
dotenv.config()

// middleware
app.use(express.json())
app.use(cors({
    origin:['http://localhost:5174','http://localhost:5173'],
    credentials: true
}))
app.use(cookieParser())



app.get('/', (req,res)=>{
    res.send('Assignment Avengers are coming Soon!!!')
})


// ${process.env.DB_USER}
// ${process.env.DB_PASSWORD}
console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je93mhd.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const assignmentCollection= client.db("Assignment-Avengers").collection("assignments")
    const myAssignmentCollection= client.db("Assignment-Avengers").collection("myAssignments")
    // Auth related 
    app.post('/jwt',async(req,res)=>{
        const user=req.body
        console.log('loggedIn User',user)
        const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none'

        })
        res.send({success:true})
    })

    app.post('/logout',async(req,res)=>{
        const user=req.body;
        console.log('logout user',user)
        res.clearCookie('token',{maxAge:0}).send({success:true})

    })
    
    // create Assignment
    app.post('/assignments',async(req,res)=>{
        const newAssignment=req.body
        console.log(newAssignment)
        const result=await assignmentCollection.insertOne(newAssignment)
        res.send(result)

    })

    app.get('/assignments',async(req,res)=>{
        const result=await assignmentCollection.find().toArray()
        res.send(result)
    })
    app.get('/assignments/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await assignmentCollection.findOne(query)
        res.send(result)
    })

    app.delete('/assignments/:id',async(req,res)=>{
        const id=req.params.id
        console.log('the id u want to delete',id)
        const query={_id: new ObjectId(id)}
        const result=await assignmentCollection.deleteOne(query)
        res.send(result)
    })
    
    app.put('/assignments/:id',async(req,res)=>{
        const id=req.params.id
        const filter={_id :new ObjectId(id)}
        const options = { upsert: true };
        const existingAssignment=req.body
        const updatedAssignment={
            $set:{
                title:existingAssignment.title,
                image:existingAssignment.image,
                details:existingAssignment.details,
                level:existingAssignment.level,
                marks:existingAssignment.marks,
                date:existingAssignment.date
            }
        }
        const result=await assignmentCollection.updateOne(filter,updatedAssignment,options)
        res.send(result)
    })

    app.post('/myAssignments',async(req,res)=>{
        const myListedAssignment=req.body
        console.log(myListedAssignment)
        const result=await myAssignmentCollection.insertOne(myListedAssignment)
        res.send(result)

    })
    app.get('/myAssignments',async(req,res)=>{
        const result=await myAssignmentCollection.find().toArray()
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Assignment Avengers is running on port: ${port}`)
})