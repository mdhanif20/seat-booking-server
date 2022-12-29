const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qytn8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const dataBase = client.db("SetBookingApi");
        const databaseCollection = dataBase.collection("allSetInfo");


        app.get("/allSeatInfo",async(req,res)=>{
            const allSet = databaseCollection.find({});
            const result = await allSet.toArray();
            res.json(result);
        })

        app.put("/bookingSeat/:id",async(req,res)=>{
            const id = req.params.id;
            const bookInfo = req.body;
            const filter = { _id: ObjectId(id)};
            const option = { upsert:true };
            const updateBooking = {
                $set:{
                    name: bookInfo.name,
                    email: bookInfo.email,
                    phoneNumber: bookInfo.phoneNumber,
                    booked: bookInfo.booked
                }
            };
            const result = await databaseCollection.updateOne(filter,updateBooking,option)
            res.json(result)
        })
    }
    finally{
        // await client.close(); 
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Booking Information.')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})