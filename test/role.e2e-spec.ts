import mongoose from 'mongoose';
import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './../src/app.module';
import { RoleModule } from '../src/role/role.module';

describe('RoleController (e2e)', () => {
  let app: INestApplication;
  let id = '';
  const PATH = '/api/v1/role'; // Include global prefix here

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        RoleModule,
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("/api/v1");
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/role (POST)', () => {
    it('should return 201 if the user sends name', async () => {
      await request(app.getHttpServer()).post(PATH).send({
        name: 'HelloWorld'
      }).expect(201)
      .expect(({body}) => {
        id = body._id;
      })
      ;
    });

    it('should return 400 if the role already exists', async () => {
      await request(app.getHttpServer()).post(PATH).send({
        name: 'HelloWorld'
      }).expect(400);
    });

  });

  describe('/role (GET)', () => {
    it('should return 200 if the user does not send anything', async () => {
      await request(app.getHttpServer()).get(PATH)
        .expect(200)
        .expect(({body}) => {
          expect(body.length).toBeGreaterThan(0);
        })
      ;
    });
  });

  describe('/role/:id (GET)', () => {
    it('should return 200 if the user does not send anything, valid id and exists', async () => {
      await request(app.getHttpServer()).get(`${PATH}/${id}`)
        .expect(200)
        .expect(({body}) => {
          expect(body.name).toBe('HelloWorld');
        })
    });

    it('should return 400 if the user does not send anything, invalid id', async () => {
      await request(app.getHttpServer()).get(`${PATH}/invalidId`)
        .expect(400)
    })

    it('should return 404 if the user does not send anything, valid id and not exists', async () => {
      await request(app.getHttpServer()).get(`${PATH}/${new mongoose.Types.ObjectId()}`) 
        .expect(404)
    })
  });

  describe('/role/:id (PUT)', () => {
    it('should return 200 if the user does not send anything, valid id and exists', async () => {
      await request(app.getHttpServer()).put(`${PATH}/${id}`)
        .expect(200)
    });

    it('should return 200 if the user sends name', async () => {
      await request(app.getHttpServer()).put(`${PATH}/${id}`)
        .send({
          name: 'Hello World Updated'
        })
        .expect(200)
        .expect(({body}) => {
          expect(body.name).toBe('Hello World Updated');
        })
    });

    it('should return 400 if the user does not send anything, invalid id', async () => {
      await request(app.getHttpServer()).put(`${PATH}/invalidId`)
        .expect(400)
    });

    it('should return 404 if the user does not send anything, valid id and not exists', async () => {
      await request(app.getHttpServer()).put(`${PATH}/${new mongoose.Types.ObjectId()}`) 
        .expect(404)
    })
  });

  describe('/role/:id (DELETE)', () => {
    it('should return 200 if the user does not send anything, valid id and exists', async () => {
      await request(app.getHttpServer()).delete(`${PATH}/${id}`)
        .expect(200)
    });

    it('should return 400 if the user does not send anything, invalid id', async () => {
      await request(app.getHttpServer()).delete(`${PATH}/invalidId`)
        .expect(400)
    });

    it('should return 404 if the user does not send anything, valid id and not exists', async () => {
      await request(app.getHttpServer()).delete(`${PATH}/${new mongoose.Types.ObjectId()}`) 
        .expect(404)
    })  
  });

});