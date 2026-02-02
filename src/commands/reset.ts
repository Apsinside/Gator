import  {resetUsers} from "../lib/db/queries/users"

export async function handlerReset(cmdName: string, ...args: string[]) {
  await resetUsers();
  console.log("reset successful!");
}