import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { readdir, unlink } from "fs/promises";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { join, parse } from "path";
import { Movie } from "src/movies/entities/movie.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService{
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ){}

  logEverySecond(){
    console.log("분마다 실행")
  }

  @Cron('* * 0 * * *')
  async eraseOrphanFiles(){
    const files = await readdir(join(process.cwd(), 'public', 'temp'))

    const deleteFilesTarget =  files.filter((file) => {
      const filename = parse(file).name;

      const split = filename.split('_')

      if(split.length !== 2){
        return true
      }

      try{
        const date = +new Date(parseInt(split[split.length - 1]))
        const aDayInMilSec = (24 * 60 * 60 * 1000)

        const now = +new Date()

        return (now - date) > aDayInMilSec
      }catch(e){
        return true
      }

    })
    
    await Promise.all(
      deleteFilesTarget.map(
        (x) => unlink(join(process.cwd(), 'public', 'temp', x))
      )
    )
  }

  @Cron('0 * * * * *')
  async calculateMovieLikeCounts(){
    await this.movieRepository.query(
      ` 
      UPDATE movie m
      SET "likeCount" = (
        SELECT count(*) FROM movie_user_like mul
        WHERE m.id = mul."movieId" AND mul."isLike" = true
      )
      `
    )

    await this.movieRepository.query(
      ` 
      UPDATE movie m
      SET "dislikeCount" = (
        SELECT count(*) FROM movie_user_like mul
        WHERE m.id = mul."movieId" AND mul."isLike" = false
      )
      `
    )
  }
}