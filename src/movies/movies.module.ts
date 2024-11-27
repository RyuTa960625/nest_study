import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MovieDetail } from './entities/movie-detail.entity';
import { Director } from 'src/director/entities/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import {v4} from 'uuid'
import { User } from 'src/users/entities/user.entity';
import { MovieUserLike } from './entities/movie-user-like.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      // Movie Entity를 import
      Movie,
      MovieDetail,
      Director,
      Genre,
      User,
      MovieUserLike,
    ]),
    CommonModule,
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: join(process.cwd(), 'public', 'movie'),
    //     filename: (req, file, cb) => {
    //       const split = file.originalname.split('.')

    //       let extension = 'mp4'

    //       if(split.length > 1){
    //         extension = split[split.length - 1]
    //       }
    //       cb(null, `${v4()}_${Date.now()}.${extension}`)
    //     }
    //   })
    // }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
