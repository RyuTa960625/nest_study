import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class MovieTitleValidationPipe implements PipeTransform<string, string>{
  transform(value: string, metadata: ArgumentMetadata): string {
    //입력이 안된 경우 넘어가기
    if (!value) {
      return value;
    }
    
    //만약 글자가 2글자 이하라면 에러 던지기
    if (value.length <= 2) {
      throw new BadRequestException('영화의 제목은 3자 이상 작성해주세요.')
    }

    return value;
  }
}