import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import {PAGETOHTMLTASK} from './PageToHtml'
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FillInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebhookTask } from "./DeliverViaWebhook";
import { ExtractDataWithAITask } from "./ExtractDateWithAi";
import { ReadPropertyFromJsonTask } from "./ReadPropertyFromJson";
import { AddPropertyToJsonTask } from "./AddPropertyToJson";
import { NavigateUrlTask } from "./NavigateUrl";
import { ScrollToElememt } from "./ScrollToElememt";
type Registry = {
    [K in TaskType]: WorkflowTask & {type: K};
}
export const TaskRegistry:Registry = {
    LAUNCH_BROWSER:LaunchBrowserTask,
    PAGE_TO_HTML:PAGETOHTMLTASK,
    EXTRACT_TEXT_FROM_ELEMENT:ExtractTextFromElementTask,
    FILL_INPUT:FillInputTask,
    CLICK_ELEMENT:ClickElementTask,
    WAIT_FOR_ELEMENT:WaitForElementTask,
    DELIVER_VIA_WEBHOOK:DeliverViaWebhookTask,
    EXTRACT_DATA_WITH_AI:ExtractDataWithAITask,
    READ_PROPERTY_FROM_JSON:ReadPropertyFromJsonTask,
    ADD_PROPERTY_TO_JSON:AddPropertyToJsonTask,
    NAVIGATE_URL:NavigateUrlTask,
    SCROLL_ELEMENT:ScrollToElememt
 }