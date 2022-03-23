import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "../dto/create-event.dto";
import { Event } from "../entity/event.entity";
import { UpdateEventDto } from "../dto/update-event.dto";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { response } from "express";

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
     * Select id, when from event where (id = ...id... and date >= ...date...) OR description LIKE "%....%" ORDER BY id DESC LIMIT 2 OFFSET 1
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

    @Get("/:id")
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<Event> {
        const ret = await this.repository.findOne(id);
        if (!ret) {
            throw new NotFoundException();
        }
        return ret;
    }

    @Post()
    async create(@Body() input: CreateEventDto): Promise<Event> {
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }

    @Patch("/:id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() input: UpdateEventDto): Promise<Event> {
        const event = await this.findOne(id);

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(":id")
    @HttpCode(204)
    async remove(@Param("id") id: number): Promise<void> {
        await this.repository.remove(await this.findOne(id));
    }
}