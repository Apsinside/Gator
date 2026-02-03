import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";
import { UUID } from "node:crypto";

export async function createFeed(name: string, url: string, userId: string){
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning();
    return result;
}

export async function getFeeds(){
    return db.select().from(feeds);
}

