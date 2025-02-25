import "reflect-metadata";

interface ControllerOptions {
    prefix: string;
}

/*
    Controller Decorator 是一个类装饰器，用于定义控制器。
    @Controller()
    @Controller("/api")
    @Controller({ prefix: "/api",...})
    Controller Decorator
*/
export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(opt: ControllerOptions): ClassDecorator
export function Controller(opt?: string | ControllerOptions) {
    let options: ControllerOptions = { prefix: '' };

    if (typeof opt === "string") options.prefix = opt;
    if (opt && typeof opt === "object") options = opt;
    return function (target: Function) {
        // 给控制器装饰的类添加 "prefix" 元数据,值为 opt.prefix
        Reflect.defineMetadata("prefix", options.prefix, target);
    };
}