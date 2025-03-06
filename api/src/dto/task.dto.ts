import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
