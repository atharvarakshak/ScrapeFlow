import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { NavigateUrlTask } from "../task/NavigateUrl";

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    
     const url = environment.getInput("URL");
     if(!url){
        environment.log.error("input->URL not defined");
     }
     
     await environment.getPage()!.goto(url);
     environment.log.info(`Visited to ${url}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
