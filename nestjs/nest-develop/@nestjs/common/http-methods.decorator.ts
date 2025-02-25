import "reflect-metadata";

// 方法装饰器工厂
const methodDecoratorFactory = (method: string) => {
    return (path?: string) => {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            Reflect.defineMetadata(method, path, target, propertyKey);
        };
    };
};

export const Get = methodDecoratorFactory("get");