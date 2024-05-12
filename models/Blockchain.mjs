import Block from './Block.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
import { DIFFICULTY } from '../utilities/settings.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];

    this.networkNodes = [];

    this.nodeUrl = process.argv[3];

    this.createBlock(Date.now(), '0', 'Genesis', []);
  }

  createBlock(timestamp, previousBlockHash, currentBlockHash, data, nonce) {
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      nonce
    );

    this.chain.push(block);

    return block;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData, nonce) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData) +
      nonce;
    const hash = createHash(stringToHash);

    return hash;
  }

  pow(timestamp, previousBlockHash, data) {
    const DIFFICULTY_LEVEL = DIFFICULTY;
    let nonce = 0;
    let hash = this.hashBlock(timestamp, previousBlockHash, data, nonce);

    while (
      hash.substring(0, DIFFICULTY_LEVEL) !== '0'.repeat(DIFFICULTY_LEVEL)
    ) {
      nonce++;
      hash = this.hashBlock(timestamp, previousBlockHash, data, nonce);
    }

    return nonce;
  }

  validateChain(blockchain) {
    let isValid = true;

    for (let i = 1; i < blockchain.length; i++) {
      const block = blockchain[i];
      const previousBlock = blockchain[i - 1];

      const hash = this.hashBlock(
        block.timestamp,
        previousBlock.currentBlockHash,
        block.data,
        block.nonce
      );
      if (hash !== block.currentBlockHash) {
        isValid = false;
        console.error(
          `Invalid hash for block ${i}: Received Hash - ${hash}, Expected Hash - ${block.currentBlockHash}`
        );
      }

      if (block.previousBlockHash !== previousBlock.currentBlockHash) {
        isValid = false;
        console.error(`Invalid previous block hash for block ${i}`);
      }
    }

    return isValid;
  }
}
