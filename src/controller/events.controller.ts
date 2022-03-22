import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDto } from "../dto/create-event.dto";
import { Event } from "../entity/event.entity";
import { UpdateEventDto } from "../dto/update-event.dto";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller("/events")
export class EventsController {
    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>
    ) { }

    @Get()
    async findAll(): Promise<Event[]> {
        return await this.repository.find();
    }

    /**
     * Select * from event where (id = ...id... and date >= ...date...) OR description LIKE "%....%" ORDER BY id DESC LIMIT 2 OFFSET 1
     * @returns 
     */
    @Get("/practice")
    async practice() {
        return await this.repository.find({
            select: ["id", "when"],
            where: [{
                id: 2,
                when: MoreThan(new Date("2021-02-12"))
            }, { //OR
                description: Like("%meet%")
            }],
            take: 2, //limit
            skip: 1, //offset
            order: { //order by
                id: "DESC"
            }
        });
    }

    @Get("/:id(\\d+)")
    async findOne(@Param("id") id: string): Promise<Event> {
        return await this.repository.findOne(id);
    }

    @Post()
    async create(@Body() input: CreateEventDto): Promise<Event> {
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }

    @Patch("/:id(\\d+)")
    async update(@Param("id") id: string, @Body() input: UpdateEventDto): Promise<Event> {
        const event = await this.findOne(id);

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(":id")
    @HttpCode(204)
    async remove(@Param("id") id: string): Promise<void> {
        await this.repository.remove(await this.findOne(id));
    }
}