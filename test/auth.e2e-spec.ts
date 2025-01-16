import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { SeedModule } from '../src/seed/seed.module';
import { UserModule } from '../src/user/user.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const PATH_AUTH = '/api/v1/auth';
  const PATH_CUSTOMER = '/api/v1/customer';
  const PATH_SEED = '/api/v1/seed';
  let token: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SeedModule, UserModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api/v1');
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/customer (POST)', () => {
    it('should return 201 if sends correct form', async () => {
      const newUser = {
        name: 'John',
        lastName: 'Doe',
        email: 'jdoe@me.com',
        password: 'Password12345',
        rfc: '123456789012',
        taxResidence: 'Mexico',
      };

      await request(app.getHttpServer()).get(PATH_SEED).expect(200);

      await request(app.getHttpServer())
        .post(PATH_CUSTOMER)
        .send(newUser)
        .expect(201);
    });
  });

  describe('/auth (POST)', () => {
    it('should return 201 if the user sends email and password', async () => {
      await request(app.getHttpServer())
        .post(PATH_AUTH)
        .send({
          email: 'jdoe@me.com',
          password: 'Password12345',
        })
        .expect(201)
        .expect(({ body }) => {
          token = body.token;
        });
    });

    it('should return 400 if the user dont send email or password', async () => {
      await request(app.getHttpServer())
        .post(PATH_AUTH)
        .send({
          email: 'jdoe@me.com',
        })
        .expect(400);
    });
  });

  describe('/customer (DELETE)', () => {
    it('should return 200 if the user does not send anything, valid token and exists', async () => {
      await request(app.getHttpServer())
        .delete(`${PATH_CUSTOMER}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
