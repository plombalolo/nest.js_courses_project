import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'bi9unb8yUNBYunbynuvbyByu8vy8yubYBbyu8...',
  })
  accesToken!: string;
}
