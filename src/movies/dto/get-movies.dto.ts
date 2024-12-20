import { IsOptional, IsString } from "class-validator";
import PagePaginationDto from "src/common/dto/page-pagination.dto";
import { CursorPaginationDto } from "src/common/dto/cursor-pagination.dto";
import { ApiProperty } from "@nestjs/swagger";

// export default class GetMoviesDto extends PagePaginationDto {
//   @IsString()
//   @IsOptional()
//   title?: string;
// }

export default class GetMoviesDto extends CursorPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '영화의 제목',
    example: '더글로리',
  })
  title?: string;
}