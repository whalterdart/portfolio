import { IsString, IsArray, IsUrl, IsOptional, IsDate } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly imageUrl: string;

  @IsArray()
  readonly technologies: string[];

  @IsOptional()
  @IsString()
  readonly githubUrl?: string;

  @IsOptional()
  @IsString()
  readonly liveUrl?: string;

  @IsOptional()
  readonly createdAt?: Date;

  @IsOptional()
  readonly updatedAt?: Date;
}
