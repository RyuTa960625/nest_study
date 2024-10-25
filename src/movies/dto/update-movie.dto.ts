import { IsNotEmpty, isNotEmpty, IsOptional, registerDecorator, Validate, validate, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export class UpdateMovieDto {
    @IsNotEmpty()
    @IsOptional()
    title?: string;
  
    @IsNotEmpty()
    @IsOptional()
    character?: string[];
  
    @IsNotEmpty()
    @IsOptional()
    genre?: string;
}