import { createPost } from "src/lib/db/queries/posts";
import {fetchFeed} from "../rss"
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { it } from "node:test";
import { Feed, NewPost } from "src/lib/db/schema";

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

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  await scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);
  for (let item of feedData.channel.item) {
    console.log(`Found post: %s`, item.title);

    const now = new Date();

    await createPost({
      url: item.link,
      feedId: feed.id,
      title: item.title,
      createdAt: now,
      updatedAt: now,
      description: item.description,
      publishedAt: new Date(item.pubDate),
    } satisfies NewPost);
  }

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}