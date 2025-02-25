import "reflect-metadata"
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import { Logger } from './logger';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';
export class NestApplication {
    private readonly app: Express = express();

    constructor(protected readonly module: Express) { }

    // 核心逻辑处理
    async init() {
        // 1.处理路由映射
        // 去除模块mudule里所有的controller
        const controllers = Reflect.getMetadata("controllers", this.module) ?? [];
        Logger.log("AppModule dependencies initialized.", "NestApplication")
        // console.log('controllers', controllers);
        this.routerParser(controllers)
    }

    private routerParser(controllers: any[]) {
        for (const Controller of controllers) {
            // 获取控制器装饰器上的prefix
            const prefix = Reflect.getMetadata("prefix", Controller) ?? '/';
            // console.log('prefix', prefix);
            Logger.log(`Registering ${Controller.name} {${prefix}}`, "NestApplication")
            const controllerPrototype = Controller.prototype;
            const controller = new Controller();
            // 获取实例上的所有方法名
            const methodNames = Object.getOwnPropertyNames(controllerPrototype);
            // 遍历方法名
            for (const name of methodNames) {
                if (name !== 'constructor') {
                    // 获取该方法实体
                    const methodHandler = controllerPrototype[name];
                    // 获取该方法装饰器上的path和method元数据
                    const methodType = Reflect.getMetadata("method", methodHandler) as string;
                    if (!methodType) continue;

                    const pathMetadata = Reflect.getMetadata("path", methodHandler) ?? '/';
                    const method = methodType.toLowerCase() as HttpMethod;
                    const routerPath = path.posix.join(prefix, pathMetadata);

                    // express 注册路由
                    this.app[method](routerPath, async (req: Request, res: Response, next: NextFunction) => {
                        const result = await methodHandler.call(controller);
                        // methodHandler.call(this.module,...args);
                        res.send(result);
                    });

                    Logger.log(`Mapped {${routerPath},${methodType}}`, "RoutesResolver")
                }
            }

        }
    }

    public async listen(port: number, callback?: () => void) {
        await this.init();
        this.app.listen(port, () => {
            Logger.log(`Application is running on port http://localhost:${port}`, 'NestApplication')
            callback?.();
        });
    }
}