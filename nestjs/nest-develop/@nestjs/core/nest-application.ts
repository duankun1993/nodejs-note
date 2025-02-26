import "reflect-metadata"
import express, { Express, NextFunction, Request as ExpressResquest, Response as ExpressResponse } from 'express';
import path from 'path';
import { Logger } from './logger';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';
export class NestApplication {
    private readonly app: Express = express();
    constructor(protected readonly module: any) {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
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
            for (const methodName of methodNames) {
                if (methodName !== 'constructor') {
                    // 获取该方法实体
                    const methodHandler = controllerPrototype[methodName];
                    // 获取该方法装饰器上的path和method元数据
                    const methodType = Reflect.getMetadata("method", methodHandler) as string;
                    if (!methodType) continue;

                    const pathMetadata = Reflect.getMetadata("path", methodHandler) ?? '/';
                    const method = methodType.toLowerCase() as HttpMethod;
                    const routerPath = path.posix.join(prefix, pathMetadata);

                    // express 注册路由
                    this.app[method](routerPath, async (req: ExpressResquest, res: ExpressResponse, next: NextFunction) => {
                        const args = this.paramsParser(controller, methodName, req, res, next)
                        const result = await methodHandler.call(controller, ...args);

                        res.send(result);
                    });

                    Logger.log(`Mapped {${routerPath},${methodType}}`, "RoutesResolver")
                }
            }

        }
    }

    private paramsParser(controller: Object, methodType: string, req: ExpressResquest, res: ExpressResponse, next: NextFunction) {
        // 获取元数据
        // 从控制器实例（controller）上获取（methodType）方法上的元数据params，值是一个数组
        const paramsMetadata = Reflect.getMetadata("params", controller, methodType) ?? [];
        // 遍历params，返回一个数组，数组的每个元素是一个对象，对象包含key和data
        return paramsMetadata.map(({ key, data }: { key: string; data: string | undefined }) => {
            switch (key) {
                case "Request":
                    return req;
                case "Response":
                    return res;
                case "Next":
                    return next;
                case "Param":
                    return data ? req.params[data] : req.params;
                case "Query":
                    return data ? req.query[data] : req.query;
                case "Body":
                    return data ? req.body[data] : req.body;
                case "Headers":
                    return data ? req.headers[data] : req.headers;
                case "Cookies":
                    return data ? req.cookies[data] : req.cookies;
                case "Ip":
                    return req.ip;
                default:
                    return null;
            }
        })

    }

    public async listen(port: number, callback?: () => void) {
        await this.init();
        this.app.listen(port, () => {
            Logger.log(`Application is running on port http://localhost:${port}`, 'NestApplication')
            callback?.();
        });
    }
}