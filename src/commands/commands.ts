import { userInfo } from "node:os";
import { setUser } from "../config";
import {createUser, getUser} from "../lib/db/queries/users"

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;


export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    const handler = registry[cmdName];
    if(handler){
        return handler(cmdName, ...args);
    }
}