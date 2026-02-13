import {fetchFeed} from "../rss"
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";

export async function handlerAggregate(cmdName: string, ...args: string[]){
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time between requests>`);
    }
    const durationStr = args[0];
    console.log(`Collecting feeds every ${durationStr}`)

    const timeBetweenRequests = parseDuration(durationStr);
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
        });
    });
}

function parseDuration(durationStr: string){
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if(!match){
        throw new Error(`Invalid duration`);
    }

    let duration : number = parseInt(match[1]);
    if(match[2] === "s"){
        duration *= 1000;
    }
    if(match[2] === "m"){
        duration *= 60000;
    }
    if(match[2] === "h"){
        duration *= 3600000
    }
    return duration;
}

export async function handleError(reason: any){
    if(reason instanceof Error){
        throw new Error(`Aggregate failed with error: ${reason.message}`);
    }
    throw new Error("Aggregate failed with unhandled error");
}

export async function scrapeFeeds(){
    const feed = await getNextFeedToFetch();
    if(!feed){
        throw Error("No feed to fetch")
    }
    const result = await markFeedFetched(feed.id);
    if(!result){
        throw Error("Failed to mark feed as fetched")
    }
    const fetchedFeed = await fetchFeed(feed.url);

    for(const item of fetchedFeed.channel.item){
        console.log(item);
    }
}