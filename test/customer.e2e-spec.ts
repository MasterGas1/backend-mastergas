import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../src/app.module";
import { CustomerModule } from "../src/customer/customer.module";
import { SeedModule } from "../src/seed/seed.module";

describe('CustomerController (e2e)', () => {
    let app: INestApplication;
    let token = '';
    const PATH = '/api/v1/customer'; // Include global prefix here
    const PATH_SEED = '/api/v1/seed';

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                SeedModule,
                CustomerModule,
                AppModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("/api/v1");

        await app.init();
    })

    afterAll(async () => {
        await app.close();
    })

    describe('/customer (POST)', () => {

        it('should return 201 if the user sends correct data', async () => {
            const newUser = {
                name: 'John',
                lastName: 'Doe',
                email: 'jdoe@me.com',
                password: 'password',
                rfc: '123456789012',
                taxResidence: 'Mexico',
            }

            await request(app.getHttpServer()).get(PATH_SEED)
                .expect(200)    

            await request(app.getHttpServer()).post(PATH).send(newUser)
            .expect(201)
            .expect(({body}) => {
                token = body.token;
            })
        });

        it('should return 400 if the user sends the same email', async () => {
            const newUser = {
                name: 'John',
                lastName: 'Doe',
                email: 'jdoe@me.com',
                password: 'password',
                rfc: '123456789012',
                taxResidence: 'Mexico',
                role: '12345'
            }

            await request(app.getHttpServer()).post(PATH).send(newUser)
            .expect(400)
        })
        
        it('should return 400 if the user sends the same rfc', async () => {
            const newUser = {
                name: 'John',
                lastName: 'Doe',
                email: 'jdoe1@me.com',
                password: 'password',
                rfc: '123456789012',
                taxResidence: 'Mexico',
                role: '12345'
            }

            await request(app.getHttpServer()).post(PATH).send(newUser)
            .expect(400)
        })
    })

    describe('/customer (GET)', () => {
        it('should return 200 if the user does not send anything, valid token and exists', async () => {
            await request(app.getHttpServer()).get(`${PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        });

        it('should return 400 if the user dont send a valid token', async () => {
            await request(app.getHttpServer()).get(`${PATH}`)
            .set('Authorization', `Bearer 12345`)
            .expect(400)
        })

        it('should return 400 if the user dont send a token', async () => {
            await request(app.getHttpServer()).get(`${PATH}`)
            .expect(400)
        })
    })

    describe('/customer (PUT)', () => {
        it('should return 200 if the user does not send anything, valid token and exists', async () => {
            await request(app.getHttpServer()).put(`${PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        });

        it('should return 200 if the user sends any data', async () => {
            await request(app.getHttpServer()).put(`${PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'John1',
                lastName: 'Doe2'
            })
            .expect(200)
            .expect(({body}) => {
                expect(body.name).toBe('John1');
                expect(body.lastName).toBe('Doe2');
            })
        })

        it('should return 400 if the user sends the same email', async () => {
            await request(app.getHttpServer()).put(`${PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'John1',
                lastName: 'Doe2',
                email: 'jdoe@me.com'
            })
            .expect(400)
        })

        it('should return 400 if the user sends the same rfc', async () => {
            await request(app.getHttpServer()).put(`${PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'John1',
                lastName: 'Doe2',
                rfc: '123456789012'
            })
            .expect(400)
        })

        it('should return 400 if the user dont send a valid token', async () => {
            await request(app.getHttpServer()).put(`${PATH}`)
            .set('Authorization', `Bearer 12345`)
            .expect(400)
        })

        it('should return 400 if the user dont send a token', async () => {
            await request(app.getHttpServer()).put(`${PATH}`)
            .expect(400)
        })

    })

    describe('/customer (DELETE)', () => {
        it('should return 200 if the user does not send anything, valid token and exists', async () => {
            await request(app.getHttpServer()).delete(`${PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        });

        it('should return 400 if the user dont send a valid token', async () => {
            await request(app.getHttpServer()).delete(`${PATH}`)
            .set('Authorization', `Bearer 12345`)
            .expect(400)
        })

        it('should return 400 if the user dont send a token', async () => {
            await request(app.getHttpServer()).delete(`${PATH}`)
            .expect(400)
        })
    })
})