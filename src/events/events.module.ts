import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './controller/events.controller';
import { Event } from './entity/event.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event])
    ],
    controllers: [EventsController],
})
export class EventsModule {

}
