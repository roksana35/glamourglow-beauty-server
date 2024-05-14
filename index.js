const express =require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express();
const port=process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://beauty-services-935c4.web.app",
      "https://beauty-services-935c4.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmgfwvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const serviceCollection=client.db('beautyDb').collection('services')
    const purchaseCollection=client.db('beautyDb').collection('purchase')

    app.get('/services',async(req,res)=>{
      const cursor=serviceCollection.find();
      const result=await cursor.toArray();
      res.send(result)
    })

    // booking
    app.get('/booking/:email',async(req,res)=>{
      const cursor=purchaseCollection.find({currentUserEmail:req.params.email});
      const result=await cursor.toArray();
      res.send(result)

    })
    app.get('/purchase',async(req,res)=>{
      const cursor=purchaseCollection.find()
      const result=await cursor.toArray();
      res.send(result)
    })
    app.put('/updatestatus/:id',async(req,res)=>{
      const quary={_id:new ObjectId(req.params.id)}
      const data={
        $set:{
          status:req.body.status
        },
      }
      const result=await purchaseCollection.updateOne(quary,data)
      res.send(result)
    })


    app.get('/services/:id',async(req,res)=>{
      // console.log(req.params.id)
      const result=await serviceCollection.findOne({_id:new ObjectId(req.params.id)})
      res.send(result)
    })

    app.get('/manageservice/:email',async(req,res)=>{
      // console.log(req.params.email)
      const result=await serviceCollection.find({
        useremail:req.params.email}).toArray()
      res.send(result)
    })
    app.delete('/delete/:id',async(req,res)=>{
      const result=await serviceCollection.deleteOne({_id:new ObjectId(req.params.id)})
      console.log(result);
      res.send(result)
    })

    app.put('/update/:id',async(req,res)=>{
      const quary={_id:new ObjectId(req.params.id)}
      const data={
        $set:{
          
          servicename:req.body.servicename,
          serviceimage:req.body.serviceimage,
          providername:req.body.providername,
          provideremail:req.body.provideremail,
          price:req.body.price,
          date:req.body.date,
          address:req.body.address,

        }
      }
      const result=await serviceCollection.updateOne(quary,data)
      res.send(result)
    })
    // post puchase 
    app.post('/purchase',async(req,res)=>{
      const quary=req.body;
      const result=await purchaseCollection.insertOne(quary);
      res.send(result)
    })

    app.post('/services',async(req,res)=>{
        const data=req.body;
        const result=await serviceCollection.insertOne(data)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('beauty and groomig server is runing')
})
app.listen(port,()=>{
    console.log(`beauty and groomig server is runing:${port}`)
})