import "reflect-metadata";

// http方法装饰器工厂
const methodDecoratorFactory = (method: string) => {
    return (path?: string, statusCode?: number) => {

        /**
         * 给方法装饰器添加元数据
         * target 类的原型
         * propertyKey 方法名
         * descriptor 方法的描述符(可以控制、调用该方法)
         */
        return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
            // descriptor.value 是方法本身
            // 给方法装饰器添加元数据 "method" 值为 method
            Reflect.defineMetadata('method', method, descriptor.value);
            // 给方法装饰器添加元数据 "path" 值为 path
            Reflect.defineMetadata('path', path, descriptor.value);
            Reflect.defineMetadata('statusCode', statusCode, descriptor.value);
        };
    };
};

export const Get = methodDecoratorFactory("GET");
export const Redirect = methodDecoratorFactory("Redirect");