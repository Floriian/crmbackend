import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  credential: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
