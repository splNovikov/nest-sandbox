import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'name@domain.com', description: 'Email of the user' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  readonly email: string;

  @ApiProperty({ example: 'PASSWORD', description: 'Password of the user' })
  @IsString({ message: 'Password must be a string' })
  @Length(4, 16, {
    message: 'Password must be between 4 and 16 characters long',
  })
  readonly password: string;
}
