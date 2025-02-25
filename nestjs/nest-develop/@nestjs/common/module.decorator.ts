import "reflect-metadata";

interface ModuleOptions {
    controllers: Function[];
}

export function Module(options: ModuleOptions): ClassDecorator {
    return (target: any) => {
        // 给模块类Module(target)添加元数据controllers,值为options.controllers
        Reflect.defineMetadata("controllers", options.controllers, target);
    };
}