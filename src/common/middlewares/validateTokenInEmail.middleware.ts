import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

@Injectable()
export class validateTokenInEmailMiddleware implements NestMiddleware{

    constructor(

        private readonly jwtTokenService: JwtService
    ){}
    use(req: Request, res: Response, next: NextFunction) {
        const {authorization} = req.headers

        if(!authorization){
            throw new BadRequestException('Authorization header not found')
        }

        const token = authorization.replace('Bearer ', '')

        const secretKey =  process.env.SECRET_KEY_CHANGE_PASSWORD || "S3CR3TK3Y$_P455W0RD"

        try {
            const encryption = this.jwtTokenService.verify(token, {secret: secretKey}) as {id: string};

            req.body.userId = encryption.id;
    
            next()
        } catch (error) {
            throw new BadRequestException('Invalid token')
        }
    }
    
}