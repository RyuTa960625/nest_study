import { Exclude, Expose } from "class-transformer";

export class Movie {
  
  id: number;

  title: string;

  character: string[];

  // @Expose()
  @Exclude()
  genre: string;
}