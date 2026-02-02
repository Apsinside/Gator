import fs from "fs";
import os from "os";
import path from "path";
import { config } from "process";
import {getUser} from "./lib/db/queries/users"

type Config = {
    dbUrl: string,
    currentUserName: string
}

function getConfigFilePath() : string{
    return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}

export async function setUser(username: string ){
    const config: Config = readConfig();
    const rawConfig = {
        db_url: config.dbUrl,
        current_user_name: username,
    };

    const rawConfigJson = JSON.stringify(rawConfig);
    console.log
    try{
        fs.writeFileSync(getConfigFilePath(), rawConfigJson);
    }catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while writing the config file: ${error.message}`);
        } else {
            console.log("An unknown error occurred while writing the config file!");
        }
    }
};

export function readConfig(): Config{
    const configJson = fs.readFileSync(getConfigFilePath(), "utf-8");
    const config = JSON.parse(configJson);
    return validateConfig(config);
}
