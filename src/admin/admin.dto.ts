import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches} from 'class-validator';
import { IsValidDate } from '../common/validators/is-valid-date.decorator';

export class AdminDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name field is required' })
  @Matches(/^(?!.*\d)[A-Za-z\s]+$/, {message: 'Name field should not contain any numbers'})
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Username field is required' })
  uname: string;

  @IsNotEmpty({ message: 'Email field is required' })
  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password field is required' })
  @Matches(/^(?=.*[@#$&]).+$/, {message:'Password must contain at least one special character (@ or # or $ or &)'})
  password: string;

  @IsOptional()
  @IsString()
  @IsValidDate({ message: 'Please provide a valid date' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @IsUrl(
    { require_protocol: true },
    { message: 'Please provide a valid social media link' },
  )
  socialMediaLinks?: string;
}