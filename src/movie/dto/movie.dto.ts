import { ApiProperty } from '@nestjs/swagger';

export class MoviePresponse {
  @ApiProperty({
    description: 'Name Film',
    example: 'Fight Club',
    type: String,
  })
  title!: string;
  @ApiProperty({
    description: 'Film ID',
    example: '123456',
    type: String,
  })
  id!: string;
}
