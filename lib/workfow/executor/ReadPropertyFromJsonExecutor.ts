import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";
import { env } from "process";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    
     const jsonData = environment.getInput("JSON");
     if(!jsonData){
        environment.log.error("input->JSON not defined");
     }
     const propertyName = environment.getInput("Property name");
     if(!propertyName){
        environment.log.error("input->property name not defined");
     }

     const json = JSON.parse(jsonData);
     const propertyValue = json[propertyName];

     if(!propertyValue){
        environment.log.error("property not found");
        return false;
     }

     environment.setOutput("Property value",propertyValue);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
