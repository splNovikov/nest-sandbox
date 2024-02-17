import { IsNumber, IsString } from 'class-validator';

export class AddRoleDTO {
  @IsString({ message: 'Value must be a string' })
  readonly value: string;

  @IsNumber({}, { message: 'User Id must be a number' })
  readonly userId: number;
}
