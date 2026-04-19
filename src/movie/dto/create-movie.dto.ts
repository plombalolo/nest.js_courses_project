import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieRequest {
  @ApiProperty({
    description: 'Name Film',
    example: 'Fight Club',
    type: String,
  })
  title!: string;
  @ApiProperty({
    description: 'Year of release Film',
    example: 1999,
    type: Number,
  })
  releaseYear!: number;
  @ApiPropertyOptional({
    description: 'Poster Url',
    example: 'https://poster/poster',
    type: String,
  })
  poster?: string;
  @ApiProperty({
    description: 'Actor ID',
    example: '123456',
    type: [String],
  })
  actorIds!: string[];
}
