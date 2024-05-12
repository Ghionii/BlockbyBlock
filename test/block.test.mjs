import { describe, it, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';

// Vet att det är ett litet test men det blev lite stressigt här mot slutet.

describe('Block', () => {
  const timestamp = Date.now();
  const nonce = 0;
  const difficulty = 0;

  const block = new Block();

  describe('Properties', () => {
    it('Should have a timestamp property', () => {
      expect(block).toHaveProperty('timestamp');
    });
  });

  describe('Properties', () => {
    it('Should have a nonce property', () => {
      expect(block).toHaveProperty('nonce');
    });
  });

  describe('Properties', () => {
    it('Should have a difficulty property', () => {
      expect(block).toHaveProperty('difficulty');
    });
  });
});
