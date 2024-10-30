import { Controller, Delete, Get, Patch, Post, Param, Body, Query, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe  } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';


@Controller('movies')
@UseInterceptors(ClassSerializerInterceptor)
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  
  @Get()
  getMovies(@Query('title', MovieTitleValidationPipe) title?: string){
    return this.movieService.findAll(title)
  }

  @Get(':id')
  getMovie(@Param('id', ParseIntPipe) id: number){
    return this.movieService.findOne(id)
  }j

  @Post() 
  postMovie(
    @Body() body: CreateMovieDto,
  ){
    return this.movieService.create(body)
  }

  @Patch(':id')
  patchMovie(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateMovieDto
  ){
    return this.movieService.update(id, body)
  }

  @Delete(':id')
  deleteMovie(@Param('id', ParseIntPipe) id: number){
    return this.movieService.remove(id)
  }
}
