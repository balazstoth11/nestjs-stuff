import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./update-event.dto";

@Controller("/events")
export class EventsController {
    private events: Event[] = [];

    @Get()
    findAll(): Event[] {
        return this.events;
    }

    @Get(":id")
    findOne(@Param("id") id: number): Event {
        return this.events.find(e => e.id === id);
    }

    @Post()
    create(@Body() input: CreateEventDto): Event {
        const event = {
            ...input,
            when: new Date(input.when),
            id: this.events.length + 1
        };
        this.events.push(event);
        return event;
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() input: UpdateEventDto): Event {
        const index = this.events.findIndex(e => e.id === id);

        return this.events[index] = {
            ...this.events[index],
            ...input,
            when: input.when ? new Date(input.when) : this.events[index].when
        };
    }

    @Delete(":id")
    @HttpCode(204)
    remove(@Param("id") id: number): void {
        this.events = this.events.filter(e => e.id !== id);
    }
}