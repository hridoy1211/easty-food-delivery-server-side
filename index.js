const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwpis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      const database = client.db("Eatsy_Delivery_Service");
      const serviceCollection = database.collection("services");
      const cartCollection = database.collection("cart");
      
    
      //  POST API for add Services/Offers
      app.post('/addServices', async(req,res) =>{
        const result = await serviceCollection.insertOne(req.body);
        res.json(result)
      })


      //   GET API for displaying Services
      app.get('/services', async(req,res) => {
          const result = await serviceCollection.find({}).toArray();
          res.json(result)
      })


      //   GET API for displaying dynamically single Service
      app.get('/services/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const service = await serviceCollection.findOne(query)
        res.json(service);
      })


      // DELETE API for deleting services
      app.delete('/deletedServices/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const deletedService = await serviceCollection.deleteOne(query);
        res.json(deletedService);
      })




      // Cart

      // GET API for Cart
      app.get('/cart', async(req,res) => {
        let query = {};
        const email = req.query.email;

        if(email){
          query = {email : email};
        }
        const result = await cartCollection.find(query).toArray();
        res.send(result)
      })
      


      // POST API for Cart
      app.post('/cart', async(req, res) =>{
        const cart = req.body
        cart.createdAt = new Date()
        const result = await cartCollection.insertOne(cart)
        console.log(req.body);
        console.log(result);
        res.json(result)
      })
      

      // DELETE API for deleting orders
      app.delete('/deletedOrder/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const deletedOrder = await cartCollection.deleteOne(query);
        console.log(deletedOrder);
        res.json(deletedOrder);
      })

      


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Running at : ${port}`)
})