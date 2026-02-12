import {CommandsRegistry, registerCommand, runCommand} from "./commands/commands"
import {handlerRegister, handlerLogin, handlerUsers} from "./commands/users";
import {handlerReset} from "./commands/reset";
import {handlerAggregate} from "./commands/aggregator"
import { middlewareLoggedIn } from "./middleware";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerFollow, handlerListFeedFollows } from "./commands/feed-follows";

async function main() {
  const commandsRegistry : CommandsRegistry  = {};
  const args = process.argv.slice(2);
  if(args.length == 0){
    console.log("no command provided!");
    process.exit(1);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAggregate);
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, "feeds", middlewareLoggedIn(handlerListFeeds));
  registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerListFeedFollows));


  try {
    await runCommand(commandsRegistry, command, ...commandArgs);
  } catch(error) {
    if (error instanceof Error) {
      console.log(`Error running command ${command}: ${error.message}`);
    } else {
      console.error(`Error running command ${command}: ${error}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
