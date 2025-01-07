import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log(websiteUrl);

    const browser = await puppeteer.launch({
      headless: true,
      channel:"chrome"
    });
    environment.log.info("Browser started successfully.")

    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({ width: 2560, height: 1440 });
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page : ${websiteUrl}`)
    await waitFor(3000)
    return true;
  }
  catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
