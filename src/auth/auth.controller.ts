// import { Body, Controller, Post } from "@nestjs/common";
// import { AuthService } from "./auth.service";
// import { RegisterAdminDto } from "./dto/registerAdmin.dto";
// import { LoginDTO } from "./dto/login.dto";

// @Controller("auth")
// export class AuthController {

//     constructor(private readonly authService: AuthService){}

//     @Post('/register')
//     async registerAdmin(@Body() dto: RegisterAdminDto){
//         return await this.authService.registerAdmin(dto);
//     }

//     @Post('/login')
//     async loginAdmin(@Body() dto: LoginDTO){
//         return await this.authService.loginAdmin(dto);
//     }
// }





import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-admin')
  registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.loginAdmin(dto);
  }
}