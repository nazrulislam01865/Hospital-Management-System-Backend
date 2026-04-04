// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";



// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//     constructor(private readonly jwtService: JwtService) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const req = context.switchToHttp().getRequest();
//         const authHeader = req.headers.authorization as string | undefined;
        
//         if (!authHeader) {
//             throw new UnauthorizedException("Authorization header is missing");
//         }
//         const [type,token] = authHeader.split(' '); // Assuming the format

//         if (type !== 'Bearer' || !token) {
//             throw new UnauthorizedException('Invalid token format');
//         }

//         try {
//             const decoded = await this.jwtService.verifyAsync(token,{
//                 secret: process.env.JWT_SECRET || 'a7f3b9c2e8d4f1a6b5c7e9d2f4a8b6c1e3d5f7a9b2c4d6e8f0a1b3c5d7e9f3',
//             })
//             req.user = decoded; 
//             return true;

//         } catch (error) {
//             throw new UnauthorizedException("Invalid or expired token");
//         }

        
//     }

// }


import {CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../auth.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });

      req.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}