import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import {  ScrollToElememt } from "../task/ScrollToElememt";

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElememt>
): Promise<boolean> {
  try {
    
     const selector = environment.getInput("Selector");
     if(!selector){
        environment.log.error("input->Selector not defined");
     }
     
     await environment.getPage()!.evaluate((selector) => {
        const element = document.querySelector(selector);
        if(!element){
          throw new Error("Element not found");
        }
        const top = element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({top})
     }, selector);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
