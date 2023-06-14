const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.PAYMENT_SK);
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if(!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access'});
  }
  //bearer token
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodede) => {
    if(err){
      return res.status(401).send({error: true, message: 'unauthorized access'})
    }
    req.decoded = decodede;
    next();
  })
}


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

    // jwt
    app.post('/jwt', (req, res) =>{
      const saveduser = req.body;
      const token = jwt.sign(saveduser, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'1h' })
      res.send({token})
    })

    // warning: use verifyJwt before using verifyAdmin
    const verifyAdmin = async(req, res, next) => {
      const email = req.decoded.email;
      const query = {email: email}
      const user = await savedusersCollection.findOne(query);
      if(user?.role !== 'admin'){
        return res.status(403).send({error: true, message: 'forbidden message'});
      }
      next();
    }

    const verifyInstructor = async(req, res, next) => {
      const email = req.decoded.email;
      const query = {email: email}
      const user = await savedusersCollection.findOne(query);
      if(user?.role !== 'instructor'){
        return res.status(403).send({error: true, message: 'forbidden message'});
      }
      next();
    }

    //savedusers related APIs
    app.get('/savedusers', verifyJWT, verifyAdmin, async(req, res) => {
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
    });

    app.put('/users/instructors/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          role: 'instructor'
        },
      };
      const result = await savedusersCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.get('/savedusers/admin/:email', verifyJWT, async(req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email){
        res.send({admin: false})
      }

      const query = {email: email}
      const user = await savedusersCollection.findOne(query);
      const result = {admin: user?.role === 'admin'}
      res.send(result);
    })
    
    app.patch('/savedusers/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      };

      const result = await savedusersCollection.updateOne(query, updateDoc);
      res.send(result);
    })


    // classes related APIs
    app.get('/classes', async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    app.post('/classes', verifyJWT, verifyAdmin, async(req, res) => {
      const classItem = req.body;
      console.log(classItem)
      const result = await classCollection.insertOne(classItem)
      res.send(result);
    })

    app.put('/classes/approved/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          status: 'approved'
        },
      };
      const result = await classCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.put('/classes/denied/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          status: 'denied'
        },
      };
      const result = await classCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    // users related APIs
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // cart collection apis
    app.get('/carts', verifyJWT, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }

      const decodedEmail = req.decoded.email;
      if(email !== decodedEmail){
        return res.status(401).send({error: true, message: 'forbidden access'})
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
