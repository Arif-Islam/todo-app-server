const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zu1tk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('task-manager').collection('todolist');

        app.post('/todo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            res.send(result);
        })

        app.get('/todo', async (req, res) => {
            const todos = await todoCollection.find().toArray();
            res.send(todos);
        })

        app.delete('/todo/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        })
    } 
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task Manager says hello')
})

app.listen(port, () => {
    console.log(`Task Manager app listening on port ${port}`)
})

