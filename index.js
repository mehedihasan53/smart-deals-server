const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// middleware

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://smart_db:FdNY0yl4SpXudui7@cluster0.ktf2bwl.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// routes
app.get('/', (req, res) => {
    res.send('Smart deals server is running ....');
})


async function run() {
    try {
        await client.connect();

        const db = client.db('smart_db');
        const productsCollection = db.collection('products');



        //    get method
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        //    get single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })



        //    post method
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);

            // Deleted method
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        // update/patch

        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    name: updateProduct.name,
                    price: updateProduct.price
                }
            }
            const result = await productsCollection.updateOne(query, update);
            res.send(result);

        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }

}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Smart deals server is running on port ${port}`);
})