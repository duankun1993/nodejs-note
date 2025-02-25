import "reflect-metadata";

const createParamDeecorator = (key: string) => {
    return (data?: any) => {
        /**
         * 参数装饰器
         * @param target 控制器实例原型
         * @param propertyKey 控制器方法名
         * @param parameterIndex 参数索引
         */
        return (target: any, propertyKey: string, parameterIndex: number) => {
            // 给target的propertyKey方法添加元数据 如："params:requestHandler" 值为 []
            // 数组的的数据表示哪个位置使用什么参数装饰器

            // 获取该方法已经存在的参数装饰器信息
            const existParamsMetadatas = Reflect.getMetadata(`params`, target, propertyKey) || [];
            // 设置当前参数装饰器信息
            existParamsMetadatas[parameterIndex] = key;
            // 将参数装饰器信息更新到方法上
            Reflect.defineMetadata(`params`, existParamsMetadatas, target, propertyKey);

        }
    }
};

export const Request = createParamDeecorator("Request");
export const Req = Request;
