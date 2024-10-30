import { BaseTable } from "src/common/entities/base-table.entity";
import { Movie } from "src/movies/entities/movie.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genre extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToMany(
    () => Movie,
    movie => movie.id
  )
  movies: Movie[];
}
