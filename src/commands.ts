import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;


export function handlerLogin(cmdName: string, ...args: string[]){
    if(args.length == 0){
        throw Error("login command requires a username");
    }
    setUser(args[0]);
    console.log(`username set to ${args[0]} in config`);
}


export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    const handler = registry[cmdName];
    if(handler){
        handler(cmdName, ...args);
    }
}