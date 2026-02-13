import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";
import { firstOrUndefined } from "./utils";
import { UUID } from "node:crypto";

export async function createFeed(name: string, url: string, userId: string){
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning();
    return result;
}

export async function getFeeds(){
    return db.select().from(feeds);
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string){
    const result = await db.update(feeds).set({updatedAt: new Date(), lastFetchedAt: new Date() }).where(eq(feeds.id, feedId)).returning();
    return result 
}

export async function getNextFeedToFetch(){
    const result = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`).limit(1);
    return firstOrUndefined(result);
}