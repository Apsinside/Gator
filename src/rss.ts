import { XMLParser } from "fast-xml-parser";
import { timeLog } from "node:console";
import { parse } from "node:path";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};


export async function fetchFeed(feedURL: string){
    const response = await fetch(feedURL,{
		headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
		    },
        }
    );

    if (!response.ok) {
        throw new Error(`failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const result = await response.text();

    const xmlParser : XMLParser = new XMLParser;
    const output = xmlParser.parse(result);

    const channel = output.rss?.channel;
    if (!channel) {
    throw new Error("missing channel");
    }

    const required = ["title", "link", "description"] as const;

    for (const key of required) {
    if (!channel[key]) {
        throw new Error(`missing channel.${key}`);
    }
    }

    const title = channel.title;
    const link = channel.link;
    const description = channel.description;


    let rssItems: RSSItem[] = [];
    let rawItems: RSSItem[];
    if(Array.isArray(channel.item)){
        rawItems = channel.item;
    }else {
        rawItems = [channel.item];
    }

    for(const item of rawItems){
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }   
        rssItems.push({
            title: item.title, 
            link: item.link, 
            description: item.description, 
            pubDate: item.pubDate
        });
    }

    const rss: RSSFeed = {
        channel:{
            title: title, 
            link: link, 
            description: description, 
            item: rssItems}
    };

    return rss;
}