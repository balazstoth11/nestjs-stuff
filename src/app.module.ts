import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rootCertificates } from 'tls';
import { AppService } from './app.service';
import { EventsController } from './controller/events.controller';
import { Event } from './entity/event.entity';

@Module({
  //Find a way to read this from a prop file or something
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    entities: [Event],
    synchronize: true, //DO NOT USE IN PROD
  }),
  TypeOrmModule.forFeature([Event]) //init the repositories
  ],
  controllers: [EventsController],
  providers: [AppService],
})
export class AppModule { }
