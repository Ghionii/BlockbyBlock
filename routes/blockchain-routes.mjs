import express from 'express';
import {
  getBlockchain,
  createBlock,
  synchronizeChain,
} from '../Controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/mine').post(createBlock);
router.route('/concensus').get(synchronizeChain);

export default router;
