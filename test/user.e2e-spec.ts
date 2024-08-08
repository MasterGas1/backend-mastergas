import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";

import { AppModule } from "../src/app.module";

import { CustomerModule } from "../src/customer/customer.module";

import { SeedModule } from "../src/seed/seed.module";

import { InstallerModule } from '../src/installer/installer.module';

import { CreateInstallerDto } from "../src/installer/dto/create-installer.dto";

describe('User (e2e)', () => {
    let app: INestApplication;
    let token = '';
    let id = '';
    const PATH = '/api/v1/customer'; // Include global prefix here
    const PATH_INSTALLER = '/api/v1/installer';
    const PATH_SEED = '/api/v1/seed';


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CustomerModule,
                InstallerModule,
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
    })

    describe('customerController', () => {
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

    describe('installerController', () => {
        describe('/installer (POST)', () => {
            it('should create a new installer', async () => {
                const createDtoInstaller: CreateInstallerDto = {
                    name: 'Test',
                    lastName: 'Test',
                    email: 'test@me.com',
                    rfc: '123456789013',
                    installer: {
                        companyName: 'Test',
                        phoneNumber: '1234567890',
                        IMSSNumber: '123456789012',
                        employeesNumber: 1,
                        website: 'test.com',
                        ownOffice: true,
                        ownVehicle: true,
                        state: 'test',
                        city: 'test',
                        address: 'test',
                        specializedTools: 'test',
                        yearsExperience: 1,
                        certifications: 'test',
                        securityCourses: 'test'
                    }
                }
    
                const response = await request(app.getHttpServer()).post(PATH_INSTALLER)
                    .send(createDtoInstaller)
                    .expect(201)
            })

            it('should return 400 if the user sends the same email', async () => {
                const createDtoInstaller: CreateInstallerDto = {
                    name: 'Test',
                    lastName: 'Test',
                    email: 'test@me.com',
                    rfc: '123456789013',
                    installer: {
                        companyName: 'Test',
                        phoneNumber: '1234567890',
                        IMSSNumber: '123456789012',
                        employeesNumber: 1,
                        website: 'test.com',
                        ownOffice: true,
                        ownVehicle: true,
                        state: 'test',
                        city: 'test',
                        address: 'test',
                        specializedTools: 'test',
                        yearsExperience: 1,
                        certifications: 'test',
                        securityCourses: 'test'
                    }
                }

                await request(app.getHttpServer()).post(PATH_INSTALLER)
                    .send(createDtoInstaller)
                    .expect(400)
            })

            it('should return 400 if the user sends the same rfc', async () => {
                const createDtoInstaller: CreateInstallerDto = {
                    name: 'Test',
                    lastName: 'Test',
                    email: 'test1@me.com',
                    rfc: '123456789013',
                    installer: {
                        companyName: 'Test',
                        phoneNumber: '1234567890',
                        IMSSNumber: '123456789012',
                        employeesNumber: 1,
                        website: 'test.com',
                        ownOffice: true,
                        ownVehicle: true,
                        state: 'test',
                        city: 'test',
                        address: 'test',
                        specializedTools: 'test',
                        yearsExperience: 1,
                        certifications: 'test',
                        securityCourses: 'test'
                    }
                }

                await request(app.getHttpServer()).post(PATH_INSTALLER)
                    .send(createDtoInstaller)
                    .expect(400)
            })
        })
    
        describe('/installer (GET)', () => {
            it('should get all installers', async () => {
                await request(app.getHttpServer()).get(`${PATH_INSTALLER}`)
                    .expect(200)
                    .expect(({body}) => {
                        expect(body).toHaveLength(1)
                        id = body[0]._id
                    })
            })
        })

        describe('/installer/status/:id (PUT)', () => { 
            it('should update a installer status', async () => {
                await request(app.getHttpServer()).put(`${PATH_INSTALLER}/status/${id}`)
                    .send({status: 'approved'})
                    .expect(200)
            })

            it('should return 400 if the user sends an invalid id', async () => {
                await request(app.getHttpServer()).put(`${PATH_INSTALLER}/status/12345`) 
                    .send({status: 'approved'})
                    .expect(400)
            })

            it('should return 404 if the user does not send anything, valid id and not exists', async () => {
                await request(app.getHttpServer()).put(`${PATH_INSTALLER}/status/${new mongoose.Types.ObjectId()}`) 
                    .send({status: 'approved'})
                    .expect(404)
            })
        })
    
        describe('/installer/:id (GET)', () => {
            it('should get a installer by id', async () => {
                await request(app.getHttpServer()).get(`${PATH_INSTALLER}/${id}`)
                    .expect(200)
                    .expect(({body}) => {
                        expect(body.name).toBe('Test')
                    })
            })

            it('should return 404 if the user does not send anything, valid id and not exists', async () => {
                await request(app.getHttpServer()).get(`${PATH_INSTALLER}/${new mongoose.Types.ObjectId()}`) 
                    .expect(404)
            })

            it('should return 400 if the user sends an invalid id', async () => {
                await request(app.getHttpServer()).get(`${PATH_INSTALLER}/12345`) 
                    .expect(400)
            })
        })
    
        describe('/installer/:id (DELETE)', () => {
            it('should delete a installer by id', async () => {
                await request(app.getHttpServer()).delete(`${PATH_INSTALLER}/${id}`)
                    .expect(200)
            })

            it('should return 404 if the user does not send anything, valid id and not exists', async () => {
                await request(app.getHttpServer()).delete(`${PATH_INSTALLER}/${id}`) 
                    .expect(404)
            })

            it('should return 400 if the user sends an invalid id', async () => {
                await request(app.getHttpServer()).delete(`${PATH_INSTALLER}/12345`) 
                    .expect(400)
            })
        })
    })

})