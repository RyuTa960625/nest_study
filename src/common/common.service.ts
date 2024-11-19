import { BadRequestException, Injectable } from "@nestjs/common";
import { SelectQueryBuilder } from "typeorm";
import PagePaginationDto from "./dto/page-pagination.dto";
import { CursorPaginationDto } from "./dto/cursor-pagination.dto";
import { buffer } from "stream/consumers";

@Injectable()
export class CommonService {
  constructor(){}

  applyPagePaginationParamsToQb<T>(qb: SelectQueryBuilder<T>, dto: PagePaginationDto){
    const {page, take} = dto;

    const skip = (page - 1) * take;

    qb.take(take);
    qb.skip(skip);
  }

  async applyCursorPaginationParamsToQb<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto){
    // const {order, take, id} = dto;

    // if (id) {
    //   const direction = order === 'ASC' ? '>' : '<';
    //   qb.where(`${qb.alias}.id ${direction} :id`, {id})
    // }

    // qb.orderBy(`${qb.alias}.id`, order)'

    let {cursor, take, order} = dto;

    if(cursor){
      const decodeCursor = Buffer.from(cursor, 'base64').toString('utf-8');
      const cursorObj = JSON.parse(decodeCursor);

      order = cursorObj.order;

      const {values} = cursorObj;

      const columns = Object.keys(values);
      const comparisonOperator = order.some((o) => o.endsWith('DESC')) ? '<' : '>';

      const whereConditions = columns.map(column => `${qb.alias}.${column}`).join(',');
      const whereParams = columns.map(column => `:${column}`)
      
      qb.where(`(${whereConditions}) ${comparisonOperator} (${whereParams})`, values)
    }

    for(let i = 0; i < order.length; i++){
      const [column, direction] = order[i].split('_')

      if(direction !== 'ASC' && direction !== 'DESC'){
        throw new BadRequestException('Order는 ASC 또는 DESC으로 입력해주세요.')
      }
        
      if(i === 0){
        qb.orderBy(`${qb.alias}.${column}`, direction)
      } else {
        qb.addOrderBy(`${qb.alias}.${column}`, direction)
      }
    }

    qb.take(take)

    const results = await qb.getMany();

    const nextCursor = this.generateNextCursor(results, order)

    return {qb, nextCursor}
  }

  generateNextCursor<T>(results: T[], order: string[]): string | null{
    if(results.length === 0) return null

    const lastItem = results[results.length - 1];

    const values = {};

    order.forEach((columnOrder) => {
      const [column] = columnOrder.split('_')
      values[column] = lastItem[column];
    });

    const cursorObj = {values, order};
    const nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64')

    return nextCursor;
  }
}