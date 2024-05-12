import express from 'express';
import { listNodes, registerNode } from '../Controllers/node-controller.mjs';

const router = express.Router();

router.route('/').get(listNodes);
router.route('/register-node').post(registerNode);
export default router;
