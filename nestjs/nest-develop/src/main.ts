// 1、导入 NestFactory 工厂
import { NestFactory } from "../@nestjs/core";
// 2、导入 AppModule 根模块
import { AppModule } from "./app.module";

// 3、创建 Nest 应用程序
async function bootstrap() {
    // 通过 NestFactory 工厂创建 Nest 应用程序
    const app = await NestFactory.create(AppModule);
    // 启动并监听端口
    await app.listen(3000);
}
// 4、启动
bootstrap();