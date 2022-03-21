import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsController } from './controller/events.controller';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [AppService],
})
export class AppModule {}
