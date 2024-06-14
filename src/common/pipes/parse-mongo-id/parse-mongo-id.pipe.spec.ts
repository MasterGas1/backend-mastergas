import { BadRequestException } from '@nestjs/common';

import { ParseMongoIdPipe } from './parse-mongo-id.pipe';
import mongoose from 'mongoose';

describe('ParseMongoIdPipe', () => {
  it('should be defined', () => {
    expect(new ParseMongoIdPipe()).toBeDefined();
  });

  it('should throw BadRequestException when given an invalid ID', () => {
    const pipe = new ParseMongoIdPipe();
    expect(() => pipe.transform('invalidId', { type: 'param' })).toThrow(BadRequestException);
  });

  it('should return the ID when given a valid ID', () => {
    const pipe = new ParseMongoIdPipe();
    const id = new mongoose.mongo.ObjectId();
    expect(pipe.transform(id, { type: 'param' })).toBe(id);
  });
});
