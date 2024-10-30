import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateMovieDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    title?: string;

    @ArrayNotEmpty()
    @IsArray()
    @IsString({
        each: true,
    })
    @IsOptional()
    character?: string[];

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    detail?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    directorId?: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({},{
        each: true,
    })
    @IsOptional()
    genreIds?: number[];
}