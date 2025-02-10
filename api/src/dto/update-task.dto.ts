import { IsString, IsOptional, IsBoolean } from 'class-validator';

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
}
