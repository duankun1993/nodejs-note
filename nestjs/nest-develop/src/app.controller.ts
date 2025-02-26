import { Body, Controller, Get, Post, Req, Res } from "../@nestjs/common";


@Controller("/user")
export class AppController {
    @Get("/hello")
    getHello(@Req() req, @Res() res): string {
        console.log("req", req);
        console.log('res', res);
        return "Hello World!";
    }

    @Post("/create")
    createUser(@Body() body) {
        console.log("body", body);

        console.log("createUser");
        return "createUser";
    }
}