import { Controller, Delete, Get, Patch, Post, Param, Body, Query, UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';


@Controller('movies')
@UseInterceptors(ClassSerializerInterceptor)
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  
  @Get()
  getMovies(@Query('title') title?: string){
    return this.movieService.findAll(title)
  }

  @Get(':id')
  getMovie(@Param('id') id: string){
    return this.movieService.findOne(+id)
  }

  @Post() 
  postMovie(
    @Body() body: CreateMovieDto,
  ){
    return this.movieService.create(body)
  }

  @Patch(':id')
  patchMovie(
    @Param('id') id: string, 
    @Body() body: UpdateMovieDto
  ){
    return this.movieService.update(+id, body)
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string){
    return this.movieService.remove(+id)
  }
}
