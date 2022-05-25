const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ja4gbpw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// start the main backend code

async function run() {

    try {
        await client.connect();
        const serviceCollection = client.db('parts').collection('services');
        const reviewsCollection = client.db('parts').collection('reviews');
        const userCollection = client.db('parts').collection('users');
        const ordersCollection = client.db('parts').collection('orders');

       
//update quantity
app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const object = req.body;
    
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        Aquantity: object.updatedQuantity,
      },
    };
    console.log(updateDoc);
    const result = await serviceCollection.updateOne(
      filter,
      updateDoc,
      options
    );
    res.send(result);
  });


  // post add items
  app.post("/order", async (req, res) => {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    res.send(result);
  });

  app.get('/order', async (req, res) => {
    const users= await ordersCollection.find().toArray();
    res.send(users);  
   })

  app.put("/user/admin/:email", async (req, res) => {
    const email = req.params.email;
    const filter = { email: email };
    const updateDoc = {
      $set: { role: "admin" },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });





            // user email 
        app.put('/user/:email',async(req,res)=>{
            const email = req.params.email;
            const user = req.body;
            const filter = {email:email};
            const options = {upsert : true  };
            const updateDoc = {           
            $set:user,
        };
        const result  = await userCollection.updateOne(filter,updateDoc,options);
        const token = jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'})
        res.send({result,token});
        })

        app.get('/user', async (req, res) => {
         const users= await userCollection.find().toArray();
         res.send(users);  
        })


       



        // home 6 card data load 
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        await client.connect();

        // dashboard review data 
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


                //get single parts by id
                app.get("/service/:id", async (req, res) => {
                    const id = req.params.id;
                    const query = { _id: ObjectId(id) };
                    const tool = await serviceCollection.findOne(query);
                    res.send(tool);
                });



        // post / add review
        app.post('/review',async(req,res)=>{
            const newService = req.body;
            const result = await reviewsCollection.insertOne(newService);
            res.send(result);
          });



        // post / add parts
        app.post('/service',async(req,res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
          });



    }
    finally {

    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hellow word')
})

app.listen(port, () => {
    console.log(` VAI AYBAR PERA DIDS NA ${port}`);
})