
import {readConfig, setUser} from "./config.ts"

function main() {
  setUser("Fabian");
  let config = readConfig();
  console.log(config);
}

main();
