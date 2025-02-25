import { Controller, Get, Req } from "../@nestjs/common";


@Controller("/user")
export class AppController {
    @Get("/hello")
    getHello(@Req() req: Request): string {
        console.log(req);

        return "Hello World!";
    }
}