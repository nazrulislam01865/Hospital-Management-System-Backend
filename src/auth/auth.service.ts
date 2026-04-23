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