import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class RegisterAdminDto {


    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'Email field is required' })
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Please provide a valid email address' })
    email!: string;
    @IsString()
    @IsNotEmpty()
    uname!: string;
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[@#$&]).+$/, {message:'Password must contain at least one special character (@ or # or $ or &)'})
    password!: string;
 
}