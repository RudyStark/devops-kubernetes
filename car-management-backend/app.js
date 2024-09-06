const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb-service:27017/cardb';

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const Car = mongoose.model('Car', {
    marque: String,
    modele: String,
    prix: Number
});

app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des voitures" });
    }
});

app.post('/api/cars', async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la voiture" });
    }
});

app.delete('/api/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression de la voiture" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
