import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Movie } from './movies/entities/movie.entity';
import { MovieDetail } from './movies/entities/movie-detail.entity';
import { DirectorModule } from './director/director.module';
import { Director } from './director/entities/director.entity';
import { GenreModule } from './genre/genre.module';
import { Genre } from './genre/entities/genre.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    MoviesModule,
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev','prod').required(),
        DB_TYPE:Joi.string().valid('postgres').required(),
        DB_HOST:Joi.string().required(),
        DB_PORT:Joi.number().required(),
        DB_USERNAME:Joi.string().required(),
        DB_PASSWORD:Joi.string().required(),
        DB_DATABASE:Joi.string().required(),
        HASH_ROUNDS:Joi.number().required(),
        ACCESS_TOKEN_SECRET:Joi.string().required(),
        REFRESH_TOKEN_SECRET:Joi.string().required(),
      })
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Movie,
          MovieDetail,
          Director,
          Genre,
          User,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DirectorModule,
    GenreModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
