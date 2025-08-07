import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 5000;

const MICROSERVICE_URL = 'http://localhost:5001/generate';

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Le serveur est en marche !");
});

app.post('/api/generate', async (req, res) => {
    try {
        const {theme} = req.body;
        if (!theme) {
            return res.status(400).json({error: 'Le thème est requis.'});
        }
        console.log(`Theme reçu : ${theme}. Appel au microservice...`);
        const microserviceResponse = await axios.post(MICROSERVICE_URL, {theme : theme});

        console.log('Idee recue du microserrvice. Envoi au client.');
        res.status(200).json(microserviceResponse.data);
        
    } catch (error){
        console.error("Erreur lors de l'appel au microservice :", error.message);
        res.status(500).json({error: "Une erreur est survenue lors de la communication avec le service d'IA. "});
    }


});
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)});