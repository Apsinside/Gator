import {fetchFeed} from "../rss"

export async function handlerAggregate(_: string){
    const feedURL = "https://www.wagslane.dev/index.xml";
    const feedData = await fetchFeed(feedURL);
    const feedDataStr = JSON.stringify(feedData, null, 2);
    console.log(feedDataStr);
}