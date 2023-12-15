const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');

const app = express();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

const customers = [
    {
        "name": "Caleb",
        "industry": "music"
    },
    {
        "name": "John",
        "industry": "networking"
    },
    {
        "name": "Sal",
        "industry": "sports medicine"
    }
];

const customer = new Customer({
    name: 'John',
    industry: 'marketing'
});


app.get('/', (req, res) => {
    res.send("Welcome!");
});

app.get('/api/customers', async (req, res) => {
    try{
        const result = await Customer.find();
        res.send({"customers": result});
    } catch (e){
        res.status(500).json({error: e.message});
    }
    
});

app.get('/api/customers/:id',async(req, res) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try{
        const customerId = req.params.id;
        console.log(customerId);
        const customer = await Customer.findById(customerId);
        console.log(customer);
        if(!customer){ // if customer == null 
            res.status(404).json({error: 'user not found'});
        }else{
            res.json({customer});
        }
    } catch (e){
        res.status(500).json({error: 'something went wrong'});

    }
    
});

app.post('/api/customers', async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try{
        await customer.save();
        res.status(201).json({customer});
    }catch(e){
        res.status(400).json({error: e.message});
    }
    
});

app.post('/', (req, res) =>{
    res.send('This is a post request!');
});

const start = async() => {
    try{
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT);
        });
    } catch(e) {
        console.log(e.message)
    }
};

start();