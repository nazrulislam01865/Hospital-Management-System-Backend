// import { Module } from "@nestjs/common";
// import { JwtModule } from "@nestjs/jwt";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { AdminEntity } from "src/admin/entities/admin.entity";
// import { AuthController } from "./auth.controller";
// import { AuthService } from "./auth.service";
// import { JwtAuthGuard } from "./guards/jwtAuth.guard";


// @Module({
//     imports: [TypeOrmModule.forFeature([AdminEntity]),JwtModule.register({
//         secret: process.env.JWT_SECRET || 'a7f3b9c2e8d4f1a6b5c7e9d2f4a8b6c1e3d5f7a9b2c4d6e8f0a1b3c5d7e9f3',
//         signOptions: { expiresIn: '1d' },
//     })],
//     controllers: [AuthController],
//     providers: [AuthService,JwtAuthGuard],
//     exports: [JwtAuthGuard, JwtModule],

// })
// export class AuthModule{}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../admin/entities/admin.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { JWT_EXPIRES_IN, JWT_SECRET } from './auth.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule,AuthService],
})
export class AuthModule {}