import { Injectable, NotFoundException } from '@nestjs/common';

export interface Movie {
  id: number;
  title: string;
  character: string[];
}

@Injectable()
export class MoviesService {
  private movies: Movie[] = [
    {
      id: 1,
      title: '해리포터',
      character: ['해리포터', '헤르미온느', '론'],
    },
    {
      id: 2,
      title: '반지의제왕',
      character: ['프로도', '사우론', '간다르프'],
    },
    {
      id: 3,
      title: '스타워즈',
      character: ['루크', '레이아', '한솔로'],
    },
  ];

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

  createMovie(title: string, character: string[]){
    const movie: Movie = {
      id: this.movies.length + 1,
      title: '',
      character,
    }

    this.movies.push(movie)

    return movie
  }

  updateMovie(id: number, title: string, character: string[]) {
    const movie = this.movies.find(movie => movie.id === id)

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID 값의 영화입니다.')
    }

    if (!title) {
      title = movie.title
    }

    if (!character) {
      character = movie.character
    }

    Object.assign(movie, {title, character})

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
