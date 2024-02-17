import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ example: 'name@domain.com', description: 'Email of the user' })
  readonly email: string;

  @ApiProperty({ example: 'PASSWORD', description: 'Password of the user' })
  readonly password: string;
}
