import { IsOptional, IsString } from "class-validator";
import PagePaginationDto from "src/common/dto/page-pagination.dto";
import { CursorPaginationDto } from "src/common/dto/cursor-pagination.dto";

// export default class GetMoviesDto extends PagePaginationDto {
//   @IsString()
//   @IsOptional()
//   title?: string;
// }

export default class GetMoviesDto extends CursorPaginationDto {
  @IsString()
  @IsOptional()
  title?: string;
}