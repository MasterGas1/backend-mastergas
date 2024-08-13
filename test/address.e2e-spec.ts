import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './../src/app.module';
import { AddressModule } from './../src/address/address.module';
import { CustomerModule } from './../src/customer/customer.module';
import { SeedModule } from './../src/seed/seed.module';

describe('AddressController (e2e)', () => {
    let app: INestApplication;
    let addressId = '';
    let token = '';
    const PATH = '/api/v1/address';
    const PATH_USER = '/api/v1/customer';
    const PATH_SEED = '/api/v1/seed';

    beforeEach(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AddressModule,
                CustomerModule,
                SeedModule,
                AppModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("/api/v1");

        await app.init();

    })

    afterAll(async () => {
        await app.close();

    });

    describe('/address (POST)', () => {
        it('should return 201 if the user sends any data to create a new user', async () => {
            const newUser = {
                name: 'John',
                lastName: 'Doe',
                email: 'jdoe1@me.com',
                password: 'password',
                rfc: '123456789013',
                taxResidence: 'Mexico',
            }
    
            await request(app.getHttpServer()).get(PATH_SEED)
    
            await request(app.getHttpServer()).post(PATH_USER).send(newUser)
                .expect(({ body }) => {
                    console.log('body', body)
                    token = body.token
                })
        })
        it('should return 400 if the user does not send anything', async () => {
            await request(app.getHttpServer()).post(`${PATH}`)
                .send({
                    addressName: 'Home',
                    name: 'John',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect('400')
        })
    })

    describe('/address (DELETE', () => {
        it('should return 200 if the user send a valid token to delete the user', async () => {
            await request(app.getHttpServer()).delete(`${PATH}`) 
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
        });
    })
})