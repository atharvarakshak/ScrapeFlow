import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";

import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PAGETOHTMLTASK } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PAGETOHTMLTASK>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    console.log("Page Html", html);
      
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
