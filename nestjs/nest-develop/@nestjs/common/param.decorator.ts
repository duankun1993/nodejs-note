import "reflect-metadata";

const createParamDeecorator = (key: string) => {
    return (data?: string) => {
        /**
         * 参数装饰器
         * @param target 实例原型对象
         * @param propertyKey 方法名
         * @param parameterIndex 参数索引
         */
        return (target: any, propertyKey: string, parameterIndex: number) => {
            // 给target的propertyKey方法添加元数据 如："params:requestHandler" 值为 []
            // 数组的的数据表示哪个位置使用什么参数装饰器
            console.log(target, propertyKey, parameterIndex);

            // 获取该方法已经存在的参数装饰器信息
            const existParamsMetadatas = Reflect.getMetadata("params", target, propertyKey) || [];
            // 设置当前参数装饰器信息
            existParamsMetadatas[parameterIndex] = { key, data };
            // 将参数装饰器信息更新到方法上
            Reflect.defineMetadata(`params`, existParamsMetadatas, target, propertyKey);

        }
    }
};

export const Request = createParamDeecorator("Request");
export const Req = Request;
export const Response = createParamDeecorator("Response");
export const Res = Response;
export const Next = createParamDeecorator("Next");
export const Param = createParamDeecorator("Param");
export const Query = createParamDeecorator("Query");
export const Body = createParamDeecorator("Body");
export const Headers = createParamDeecorator("Headers");
export const Ip = createParamDeecorator("Ip");
