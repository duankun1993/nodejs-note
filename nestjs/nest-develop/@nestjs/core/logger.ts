import clc from 'cli-color';

export class Logger {
    static log(message: string, context: string) {
        const time = new Date().toLocaleString();
        const pid = process.pid;
        console.log(`[Nest] ${clc.green(pid)} - ${clc.yellow(time)}   ${clc.green('LOG')}    [${clc.green(context)}] ${clc.green(message)}`);
    }
}