import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";
import { env } from "process";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input->target url not defined");
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("Body not defined");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Status code:  ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody,null,4)); 


    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
