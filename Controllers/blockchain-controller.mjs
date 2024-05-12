import { blockchain } from '../init-app.mjs';
import ErrorResponse from '../utilities/errorResponse.mjs';
import ResponseModel from '../utilities/responseModel.mjs';
import { readFileAsync, writeFileAsync } from '../utilities/filehandler.mjs';

export const getBlockchain = async (req, res, next) => {
  try {
    const response = new ResponseModel({ statusCode: 200, data: blockchain });
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

export const createBlock = async (req, res, next) => {
  await updateBlockchain();
  const previousBlock = blockchain.getLastBlock();
  const data = req.body;
  const timestamp = Date.now();
  const nonce = blockchain.pow(timestamp, previousBlock.currentBlockHash, data);

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    previousBlock.currentBlockHash,
    data,
    nonce
  );

  const block = blockchain.createBlock(
    timestamp,
    previousBlock.currentBlockHash,
    currentBlockHash,
    data,
    nonce
  );

  writeFileAsync(
    'logs',
    'blockchain.json',
    JSON.stringify(blockchain.chain, null, 2)
  );
  res.status(200).json({ success: true, data: block });
};

const updateBlockchain = async () => {
  try {
    const blockchainData = await readFileAsync('logs', 'blockchain.json');
    const newBlockchainData = JSON.parse(blockchainData);
    blockchain.chain = newBlockchainData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('JSON FILE NOT FOUND');
      return;
    }
  }
};

export const synchronizeChain = (req, res, next) => {
  const currentLength = blockchain.chain.length;
  let maxLength = currentLength;
  let longestChain = null;

  blockchain.networkNodes.forEach(async (node) => {
    const response = await fetch(`${node}/api/v1/blockchain`);
    if (response.ok) {
      const result = await response.json();

      if (result.data.chain.length > maxLength) {
        maxLength = result.data.chain.length;
        longestChain = result.data.chain;
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log('är synkade');
      } else {
        blockchain.chain = longestChain;
        console.log(blockchain);
      }
    }
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'synkronisering är klar' },
  });
};
