import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  constructor() {
    const movie1 = new Movie()
    movie1.id = 1
    movie1.title = '해리포터'
    movie1.character = ['해리포터', '헤르미온느', '론']
    movie1.genre = '판타지'

    const movie2 = new Movie()
    movie2.id = 2
    movie2.title = '반지의제왕'
    movie2.character = ['프로도', '사우론', '간다르프']
    movie2.genre = '판타지'

    const movie3 = new Movie()
    movie3.id = 3
    movie3.title = '스타워즈'
    movie3.character = ['루크', '레이아', '한솔로']
    movie3.genre = 'SF'

    this.movies.push(movie1, movie2, movie3)
  }

  getManyMovies(title?: string) {
    if(!title){
      return this.movies
    }

    return this.movies.filter(movie => movie.title.includes(title))
  }

  getMovieById(id: number){
    const movie = this.movies.find(movie => movie.id === id)

    if(!movie){
      throw new NotFoundException('Movie not found')
    }
    
    return movie
  }

  createMovie(createMovieDto: CreateMovieDto) {
    const movie: Movie = {
      id: this.movies.length + 1,
      ...createMovieDto,
    }

    this.movies.push(movie)

    return movie
  }

  updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = this.movies.find(movie => movie.id === id)

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다.')
    }

    Object.assign(movie, updateMovieDto)

    return movie
  }

  deleteMovie(id: number){
    const movie = this.movies.find(movie => movie.id === id)

    if(!movie){
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다.')
    }

    this.movies = this.movies.filter(movie => movie.id !== id)

    return id
  }
}
