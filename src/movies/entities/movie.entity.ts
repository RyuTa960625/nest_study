import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseTable } from "../../common/entities/base-table.entity"
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "src/director/entities/director.entity";
import { Genre } from "src/genre/entities/genre.entity";

// ManyToOne Director -> 감독은 여러개의 영화를 가질 수 있음
// ManyToMany Genre -> 영화는 여러개의 장르를 가잘 수 있고 장르는 여러개의 영화를 가질 수 있음
// OneToOne MovieDetail-> 영화는 하나의 상세 내용을 가질 수 있음

@Entity()
export class Movie extends BaseTable{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  title: string;

  @Column('text', { array: true})
  character: string[];

  @ManyToMany(
    () => Genre,
    genre => genre.movies,
    {
      nullable: false,
    }
  )
  @JoinTable()
  genres: Genre[];

  @OneToOne(
    () => MovieDetail,
    movieDetail => movieDetail.id,
    {
      cascade: true,
      nullable: false,
    }
  )
  @JoinColumn()
  detail: MovieDetail;

  @ManyToOne(
    () => Director,
    director => director.id,
    {
      cascade: true,
      nullable: false,
    }
  )
  director: Director;
}
