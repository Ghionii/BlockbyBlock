import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';
const PORT = process.argv[2];

const app = express();

app.use(express.json());
app.use('/api/v1/blockchain', blockchainRouter);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
