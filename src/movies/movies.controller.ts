import { Controller, Delete, Get, Patch, Post, Param, Body, Query  } from '@nestjs/common';
import { MoviesService } from './movies.service';


@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  @Get()
  getMovies(@Query('title') title?: string){
    return this.movieService.getManyMovies(title)
  }

  @Get(':id')
  getMovie(@Param('id') id: string){
    return this.movieService.getMovieById(+id)
  }

  @Post()
  postMovie(@Body('title') title: string, @Body('character') character: string[]){
    return this.movieService.createMovie(title, character)
  }

  @Patch(':id')
  patchMovie(@Param('id') id: string, @Body('title') title: string, @Body('character') character: string[]){
    return this.movieService.updateMovie(+id, title, character)
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string){
    return this.movieService.deleteMovie(+id)
  }
}
