import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rootCertificates } from 'tls';
import { AppController } from './app.controller';
import { AppDummy } from './app.dummy';
import { AppJapanService } from './app.japan.service';
import { AppService } from './app.service';
import { EventsController } from './events/controller/events.controller';
import { Event } from './events/entity/event.entity';
import { EventsModule } from './events/events.module';

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
    EventsModule
  ],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppJapanService
  }, {
    provide: 'APP_NAME',
    useValue: 'Nest events'
  }, {
    provide: 'MESSAGE',
    inject: [AppDummy],
    useFactory: a => `${a.dummy()} factory!`
  }, AppDummy],
})
export class AppModule { }
