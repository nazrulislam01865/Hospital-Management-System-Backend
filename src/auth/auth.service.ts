// import { BadRequestException, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { InjectRepository } from "@nestjs/typeorm";
// import { AdminEntity } from "src/admin/entities/admin.entity";
// import { Repository } from "typeorm";
// import { RegisterAdminDto } from "./dto/registerAdmin.dto";
// import bcrypt from "node_modules/bcryptjs";
// import { LoginDTO } from "./dto/login.dto";

// @Injectable()
// export class AuthService{

//     constructor(@InjectRepository(AdminEntity)
//     private readonly adminRepo:Repository<AdminEntity>,
//     private readonly jwtService:JwtService
//     ){}

//     async registerAdmin(dto: RegisterAdminDto){
//         const existingAdmin = await this.adminRepo.findOne(
//             { where: [{ email: dto.email }, {uname :dto.uname} ]}
//         );
//         //check if admin with the same email or username already exists
//         if (existingAdmin) {
//             throw new BadRequestException("Admin with this email or username already exists");
//         }

//         const hashedPassword = await bcrypt.hash(dto.password, 10);

//         const newAdmin = this.adminRepo.create({
//             email: dto.email,
//             uname: dto.uname,
//             name: dto.name,
//             password: hashedPassword
//         });

//         const saveAdmin = await this.adminRepo.save(newAdmin);

//         return{
//             message: "Admin registered successfully",
//             data:{
//                 uname: saveAdmin.uname,
//                 name: saveAdmin.name
//             }
//         };

//     }

//     //login admin
//     async loginAdmin(dto:LoginDTO){
//         const admin = await this.adminRepo.findOne({ where: { email: dto.email } });

//         if (!admin) {
//             throw new BadRequestException("Invalid email or password");
//         }
//         //compare hashed password with the password provided by the user
//         const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
//         //if password is not valid, throw an error
//         if (!isPasswordValid) {
//             throw new BadRequestException("Invalid email or password");
//         }
//         //if password is valid, generate a JWT token and return it to the client
//         const payload = { email: admin.email, sub: admin.id , role: 'admin'};
//         const token = await this.jwtService.signAsync(payload);
//         //return the token and admin name to the client
//         return {
//             message: "Login successful",
//             data: {
//                 token,
//                 name: admin.name
//             },
//         };
//     }
// }


import {BadRequestException,Injectable,UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../admin/entities/admin.entity';
import { Repository } from 'typeorm';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';
import { JWT_EXPIRES_IN, JWT_SECRET } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async registerAdmin(dto: RegisterAdminDto) {
    const existingAdmin = await this.adminRepo.findOne({
      where: [{ email: dto.email }, { uname: dto.uname }],
    });

    if (existingAdmin) {
      throw new BadRequestException(
        'Admin with this email or username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newAdmin = this.adminRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepo.save(newAdmin);

    return {
      message: 'Admin registered successfully',
      data: {
        id: savedAdmin.id,
        uniqueId: savedAdmin.uniqueId,
        uname: savedAdmin.uname,
        name: savedAdmin.name,
        email: savedAdmin.email,
        dateOfBirth: savedAdmin.dateOfBirth,
        socialMediaLinks: savedAdmin.socialMediaLinks,
        createdAt: savedAdmin.createdAt,
      },
    };
  }

  async loginAdmin(dto: LoginDTO) {
    const admin = await this.adminRepo.findOne({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      email: admin.email,
      sub: admin.id,
      role: 'admin',
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      message: 'Login successful',
      data: {
        token,
        name: admin.name,
      },
    };
  }
}