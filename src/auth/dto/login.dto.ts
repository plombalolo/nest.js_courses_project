import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: ' Mail',
    example: '123dabma@gmail.com',
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @ApiProperty({
    description: ' Password',
    example: '123321',
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password!: string;
}
