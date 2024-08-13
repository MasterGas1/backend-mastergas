import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import mongoose from "mongoose";

import { ServiceModule } from "../src/service/service.module";
import { AppModule } from "../src/app.module";

describe('Service (e2e)', () => {

    let app: INestApplication;
    let rootServiceId = '';
    let subserviceId = '';
    let rootServicePriceId = '';
    const PATH = '/api/v1/service';

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ServiceModule,
                AppModule 
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("/api/v1");

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    })

    describe('/service (POST)', () => {

        it('should return 400 if the user dont send nothing', async () => {
           await request(app.getHttpServer()).post(PATH)
           .expect(400)
        })

        it('should return 400 if the user sends one field left', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 400 if a root service receive serviceId', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
                type: 'root service',
                fatherServiceId: new mongoose.Types.ObjectId()
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 400 if a root service price receive serviceId', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
                type: 'root service price',
                fatherServiceId: new mongoose.Types.ObjectId()
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 400 if a root service receive price', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
                type: 'root service',
                price: 100
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 400 if a subservice receive price', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
                type: 'subservice',
                price: 100
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 400 if the root service price dont have price', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
                type: 'root service price',
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 400  if the price dont have price', async () => {

            const newService = {
                name: 'Name',
                description: 'Description',
                type: 'subservice',
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })

        it('should return 201 if the user sends everything root service', async () => {

            const newService = {
                name: 'NameRoot',
                description: 'Description',
                type: 'root service'
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(201)
            .expect(res => {
                rootServiceId = res.body._id;
            })
        })

        it('should return 201 if the user sends everything subservice', async () => {

            const newService = {
                name: 'NameSub',
                description: 'Description',
                type: 'subservice',
                fatherServiceId: rootServiceId
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(201)
            .expect(res => {
                subserviceId = res.body._id;
            })
        })

        it('should return 201 if the user sends everything root service price', async () => {

            const newService = {
                name: 'NameRootPrice',
                description: 'Description',
                type: 'root service price',
                price: 100
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(201)
            .expect(res => {
                rootServicePriceId = res.body._id;
            })
        })

        it('should return 201 if the user sends everything price', async () => {

            const newService = {
                name: 'NamePrice',
                description: 'Description',
                type: 'price',
                price: 100,
                fatherServiceId: subserviceId
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(201)
        })

        it('should return 400 if the name is repeated and same type', async () => {

            const newService = {
                name: 'NameRoot',
                description: 'Description',
                type: 'root service'
            }

            await request(app.getHttpServer()).post(PATH)
            .send(newService)
            .expect(400)
        })
    })

    describe('/service/rootServices (GET)', () => {
        it('should return 200 and all root services', async () => {

            await request(app.getHttpServer()).get(`${PATH}/rootServices`)
            .expect(200)
            .expect(res => {
                expect(res.body.length).toBeGreaterThan(0)
            })
        })
    })

    describe('/service/:id (GET)', () => {
        it('should return 400 if the id is invalid', async () => {
            await request(app.getHttpServer()).get(`${PATH}/invalidId`)
            .expect(400)
        })

        it('should return 404 if the id is not found', async () => {
            await request(app.getHttpServer()).get(`${PATH}/${new mongoose.Types.ObjectId()}`)
            .expect(404)
        })

        it('should return 200 if the id is valid', async () => {
            await request(app.getHttpServer()).get(`${PATH}/${rootServiceId}`)
            .expect(200)
        })
    })

    describe('/service/:id (PUT)', () => {
        it('should return 400 if the id is invalid', async () => {
            await request(app.getHttpServer()).put(`${PATH}/invalidId`)
            .expect(400)
        })
        
        it('should return 404 if the id is not found', async () => {
            await request(app.getHttpServer()).put(`${PATH}/${new mongoose.Types.ObjectId()}`)
            .expect(404)
        })

        it('should return 400 if the service type is not price or root service price and has price field', async () => {

            const newService = {
                price: 100
            }

            await request(app.getHttpServer()).put(`${PATH}/${rootServiceId}`)
            .send(newService)
            .expect(400)


        })

        it('should return 400 if the service name is repeated', async () => {

            const newService = {
                name: 'NameRoot'
            }

            await request(app.getHttpServer()).put(`${PATH}/${rootServiceId}`)
            .send(newService)
            .expect(400)
        })

        it('should return 200 if the id is valid and update', async () => {

            const newService = {
                name: 'NameUpdated',
                description: 'Description Updated',
            }

            await request(app.getHttpServer()).put(`${PATH}/${rootServiceId}`)
            .send(newService)
            .expect(200)
        })
    })

    describe('/service/:id (DELETE)', () => {
        it('should return 400 if the id is invalid', async () => {
            await request(app.getHttpServer()).delete(`${PATH}/invalidId`)
            .expect(400)
        })

        it('should return 404 if the id is not found', async () => {
            await request(app.getHttpServer()).delete(`${PATH}/${new mongoose.Types.ObjectId()}`)
            .expect(404)
        })

        it('should return 200 if the id is valid and delete childrens', async () => {
            await request(app.getHttpServer()).delete(`${PATH}/${rootServiceId}`)
            .expect(200)
        })

        it('should return 200 if the id is valid and is root service price', async () => {
            
            await request(app.getHttpServer()).delete(`${PATH}/${rootServicePriceId}`)
            .expect(200)
        })
    })
})