import express from 'express';
import blockchainRouter from './routes/blockchain-routes.mjs';
import nodeRouter from './routes/node-routes.mjs';
import errorHandler from './middleware/errorHandler.mjs';
import logger from './middleware/logger.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import ErrorResponse from './utilities/errorResponse.mjs';
const PORT = process.argv[2];

const app = express();

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);

global.__appdir = dirname;
app.use(logger);
app.use(express.json());
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/nodes', nodeRouter);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
