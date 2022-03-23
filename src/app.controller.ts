import { Controller, Get, Inject } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly service: AppService) { }

    @Get("/hello")
    hello(): string {
        return this.service.getHello();
    }
}