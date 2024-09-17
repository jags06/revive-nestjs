import * as Joi from '@hapi/joi';
import { dbConfigSchema } from '../src/config.schema';

describe('dbConfigSchema', () => {
  it('should validate a correct configuration', () => {
    const validConfig = {
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USERNAME: 'user',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'database',
      JWT_SECRET: 'secret',
    };

    const { error } = dbConfigSchema.validate(validConfig);
    expect(error).toBeUndefined();
  });

  it('should fail validation if a required field is missing', () => {
    const invalidConfig = {
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USERNAME: 'user',
      DB_PASSWORD: 'password',
      // DB_DATABASE is missing
      JWT_SECRET: 'secret',
    };

    const { error } = dbConfigSchema.validate(invalidConfig);
    expect(error).toBeDefined();
  });

  it('should use default value for DB_PORT if not provided', () => {
    const configWithoutPort = {
      DB_HOST: 'localhost',
      DB_USERNAME: 'user',
      DB_PORT: 5432,
      DB_PASSWORD: 'password',
      DB_DATABASE: 'database',
      JWT_SECRET: 'secret',
    };

    const { value, error } = dbConfigSchema.validate(configWithoutPort);
    expect(error).toBeUndefined();
    expect(value.DB_PORT).toBe(5432);
  });

  it('should fail validation if DB_PORT is not a number', () => {
    const invalidConfig = {
      DB_HOST: 'localhost',
      DB_PORT: 'not-a-number',
      DB_USERNAME: 'user',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'database',
      JWT_SECRET: 'secret',
    };

    const { error } = dbConfigSchema.validate(invalidConfig);
    expect(error).toBeDefined();
  });
});
