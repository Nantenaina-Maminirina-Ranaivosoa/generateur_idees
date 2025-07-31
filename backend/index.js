import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Le serveur est en marche !");
});

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});