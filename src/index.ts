
import {readConfig} from "./config.ts"
import {CommandsRegistry, registerCommand, runCommand, handlerLogin} from "./commands.ts"
import { stringify } from "node:querystring";
import { exit } from "node:process";


function main() {
  const commandsRegistry : CommandsRegistry  = {};
  const args = process.argv.slice(2);
  if(args.length == 0){
    console.log("no command provided!");
    process.exit(1);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  registerCommand(commandsRegistry, "login", handlerLogin);

  try {
    runCommand(commandsRegistry, command, ...commandArgs);
  } catch(error) {
    if (error instanceof Error) {
      console.log(`Error running command ${error.message}`);
    } else {
      console.error(`Error running command ${command}: ${error}`);
    }
    process.exit(1);
  }

  let config = readConfig();
  console.log(config);
}

main();
