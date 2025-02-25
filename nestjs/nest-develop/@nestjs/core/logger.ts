import clc from 'cli-color';

export class Logger {
    private static lastLogTime = Date.now();
    static log(message: string, context: string) {
        const time = new Date();
        const pid = process.pid;
        const diffTime = time.getTime() - Logger.lastLogTime;
        console.log(`[Nest] ${clc.green(pid)} - ${clc.yellow(time)}   ${clc.green('LOG')}    [${clc.green(context)}] ${clc.green(message)} +${clc.green(diffTime)}ms`);
        Logger.lastLogTime = time.getTime();
    }
}