import { IsArray,IsDateString,IsNotEmpty,IsOptional,IsString,IsUrl,Matches,} from 'class-validator';

export class PatientDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!.*\d).+$/, {
    message: 'Name field should not contain any numbers',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Please provide a valid email address',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password field is required' })
  @Matches(/^(?=.*[@#$&]).+$/, {
    message:
      'Password must contain at least one special character (@ or # or $ or &)',
  })
  password: string;

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
