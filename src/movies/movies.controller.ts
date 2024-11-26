import { Controller, Delete, Get, Patch, Post, Param, Body, Query, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, UseGuards, Request, UploadedFile, UploadedFiles  } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Public } from 'src/auth/decorator/public.decorator';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/users/entities/user.entity';
import GetMoviesDto from './dto/get-movies.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@Controller('movies')
@UseInterceptors(ClassSerializerInterceptor)
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  
  @Get()
  @Public()
  getMovies(@Query() dto?: GetMoviesDto){
    return this.movieService.findAll(dto)
  }

  @Get(':id')
  @Public()
  getMovie(@Param('id', ParseIntPipe) id: number){
    return this.movieService.findOne(id)
  }

  @Post()
  @RBAC(Role.admin)
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FilesInterceptor('movies'))
  postMovie(
    @Body() body: CreateMovieDto,
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[]
  ){
    console.log('-------------')
    console.log(files)
    return this.movieService.create(body, req.queryRunner)
  }

  @Patch(':id')
  @RBAC(Role.admin)
  patchMovie(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateMovieDto
  ){
    return this.movieService.update(id, body)
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: number){
    return this.movieService.remove(id)
  }
}
