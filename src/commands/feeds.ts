import { ConsoleLogWriter } from "drizzle-orm";
import { debug } from "node:console";
import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserById } from "src/lib/db/queries/users";
import {Feed, User} from "src/lib/db/schema" 

export async function handlerAddFeed(cmdName: string, ...args: string[]){
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }
    
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if(!user){
        throw new Error("failed to add feed because user is not database!");
    }

    const feedName = args[0];
    const url = args[1];
    const feed = await createFeed(feedName, url, user.id);
    if(!feed){
        throw new Error("feed already present in database!");
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]){
    const feeds = await getFeeds();
    for (const feed of feeds){
        const user = await getUserById(feed.user_id);
        if(!user){
            continue;
        }
        printFeed(feed, user);
    }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
