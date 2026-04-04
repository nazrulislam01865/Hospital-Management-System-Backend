import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDTO {
    @IsString()
    @IsNotEmpty({ message: 'Email field is required' })
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password field is required' })
    password: string;
}