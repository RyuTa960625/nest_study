import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "영화 제목",
    example: "더글로리",
  })
  title: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({
    each: true,
  })
  @ApiProperty({
    description: "등장 인물",
    example: "전재준",
  })
  character: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "영화 설명",
    example: "시간 잘감",
  })
  detail: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "감독 객체 ID",
    example: 1,
  })
  directorId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({},{
    each: true,
  })
  @Type(() => Number)
  @ApiProperty({
    description: "장르 IDs",
    example: [1, 2, 3],
  })
  genreIds: number[];

  @IsString()
  @ApiProperty({
    description: "영화 파일 이름",
    example: "aaa-bbb-ccc-ddd.jpg",
  })
  movieFileName: string;
}