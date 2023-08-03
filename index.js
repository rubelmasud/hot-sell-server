const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const dotenv = require('dotenv')


const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

console.log(process.env.DB_USER, process.env.DB_PASS);
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oikc1wt.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db("hot-sell-sopping").collection('users')
        const featuredProductsCollection = client.db("hot-sell-sopping").collection('featuredProducts')
        const myCartCollection = client.db("hot-sell-sopping").collection('myCart')
        const productsCollection = client.db("hot-sell-sopping").collection('products')

        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: "Is User Already Exist" })
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.post('/cartProduct', async (req, res) => {
            const product = req.body
            const result = await myCartCollection.insertOne(product)
            res.send(result)
        })

        app.get('/myCartProducts', async (req, res) => {
            const email = req.query.email
            if (!email) {
                res.send([])
            }
            const query = { email: email }
            const result = await myCartCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/featuredProducts', async (req, res) => {
            const result = await featuredProductsCollection.find().toArray()
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray()
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


app.get('/', (req, res) => {
    res.send('shopping mall in open !!')
})

app.listen(port, () => {
    console.log(`shopping mall in open port: ${port} `);
})