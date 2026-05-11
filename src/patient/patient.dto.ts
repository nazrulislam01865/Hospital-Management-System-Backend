import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class PatientDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name field is required' })
  @Matches(/^(?!.*\d).+$/, {
    message: 'Name field should not contain any numbers',
  })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email field is required' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Please provide a valid email address',
  })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'Password field is required' })
  @Matches(/^(?=.*[@#$&]).+$/, {
    message:
      'Password must contain at least one special character (@ or # or $ or &)',
  })
  password: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString({}, { message: 'Please provide a valid date' })
  dateOfBirth: string;

  @IsOptional()
  @IsArray({ message: 'Social media links must be an array' })
  @IsUrl(
    { require_protocol: true },
    { each: true, message: 'Each social media link must be a valid URL' },
  )
  socialMediaLinks?: string[];
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name field is required' })
  @Matches(/^(?!.*\d).+$/, {
    message: 'Name field should not contain any numbers',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email field is required' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Please provide a valid email address',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'Password field is required' })
  @Matches(/^(?=.*[@#$&]).+$/, {
    message:
      'Password must contain at least one special character (@ or # or $ or &)',
  })
  password?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date' })
  dateOfBirth?: string;

  @IsOptional()
  @IsArray({ message: 'Social media links must be an array' })
  @IsUrl(
    { require_protocol: true },
    { each: true, message: 'Each social media link must be a valid URL' },
  )
  socialMediaLinks?: string[];
}