import { Controller, Get } from "../@nestjs/common";


@Controller("/user")
export class AppController {
    @Get("/hello")
    getHello(): string {
        return "Hello World!";
    }
}