import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^((\+254|0)?7\d{8}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
    {
      message: 'Username must be a valid Kenyan phone number or email address',
    },
  )
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
