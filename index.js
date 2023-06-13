const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cv3dsgq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const savedusersCollection = client.db('summerDb').collection('savedusers');
    const classCollection = client.db('summerDb').collection('classes');
    const userCollection = client.db('summerDb').collection('users');
    const cartCollection = client.db('summerDb').collection('carts');

    //savedusers related APIs
    app.get('/savedusers', async(req, res) => {
      const result = await savedusersCollection.find().toArray();
      res.send(result);
    })
    
    app.post('/savedusers', async(req, res) =>{
      const saveduser = req.body;
      const query = {email: saveduser.email}
      const existingUser = await savedusersCollection.findOne(query);
      if(existingUser) {
        return res.send({message: 'User already exists'})
      }

      const result = await savedusersCollection.insertOne(saveduser);
      res.send(result);
    })


    // classes related APIs
    app.get('/classes', async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    // users related APIs
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // cart collection
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      console.log(email);
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts', async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Summer camp is running');
});

app.listen(port, () => {
  console.log(`Summer camp is running on port ${port}`);
});
