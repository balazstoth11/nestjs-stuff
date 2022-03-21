import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDto } from "../dto/create-event.dto";
import { Event } from "../entity/event.entity";
import { UpdateEventDto } from "../dto/update-event.dto";

@Controller("/events")
export class EventsController {
    private events: Event[] = [];

    @Get()
    findAll(): Event[] {
        return this.events;
    }

    private filter(e: Event, id: number): boolean {
        console.log(typeof id, typeof e.id, e.id === id, e.id == id);
        return e.id === id;
        
    }

    @Get("/:id(\\d+)")
    findOne(@Param("id") id: string): any {
        return this.events.find(e => this.filter(e, parseInt(id))) ?? 'asd';
    }

    @Get("/:id(\\w+)")
    findOneW(@Param("id") id: string): any {
        return "w";
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