import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { envVariableKeys } from './common/const/env.const';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { RBACGuard } from './auth/guard/rbac.guard';
import { ResponseTimeInterceptor } from './common/interceptor/response-time.interceptor';
import { ForbiddenExceptionFilter } from './common/filter/forbidden.filter';
import { QueryFailedExceptionFilter } from './common/filter/query-failed.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MovieUserLike } from './movies/entities/movie-user-like.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { Throttle } from './common/decorator/throttle.decorator';
import { ThrottleInterceptor } from './common/interceptor/throttle.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

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
        type: configService.get<string>(envVariableKeys.dbType) as 'postgres',
        host: configService.get<string>(envVariableKeys.dbHost),
        port: configService.get<number>(envVariableKeys.dbPort),
        username: configService.get<string>(envVariableKeys.dbUsername),
        password: configService.get<string>(envVariableKeys.dbPassword),
        database: configService.get<string>(envVariableKeys.dbDatabase),
        entities: [
          Movie,
          MovieDetail,
          Director,
          Genre,
          User,
          MovieUserLike,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DirectorModule,
    GenreModule,
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public/'
    }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({
              all: true,
            }),
            winston.format.timestamp(),
            winston.format.printf(info => `${info.timestamp} [${info.context}] ${info.level} ${info.message}`),
          )
        }),
        new winston.transports.File({
          dirname: join(process.cwd(), 'logs'),
          filename: 'logs.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => `${info.timestamp} [${info.context}] ${info.level} ${info.message}`),
          )
        })
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }, 
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    }, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor,
    }, 
    // {
    //   provide: APP_FILTER,
    //   useClass: ForbiddenExceptionFilter,
    // }, 
    {
      provide: APP_FILTER,
      useClass: QueryFailedExceptionFilter,
    }, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ThrottleInterceptor,
    }

  ]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      BearerTokenMiddleware,
    )
    .exclude({
      path: 'auth/login',
      method: RequestMethod.POST,
    }, {
      path: 'auth/register',
      method: RequestMethod.POST,
    })
    .forRoutes('*')
  }

}
