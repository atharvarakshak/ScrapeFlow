import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import {PAGETOHTMLTASK} from './PageToHtml'
import { WorkflowTask } from "@/types/workflow";
type Registry = {
    [K in TaskType]: WorkflowTask & {type: K};
}
export const TaskRegistry:Registry = {
    LAUNCH_BROWSER:LaunchBrowserTask,
    PAGE_TO_HTML:PAGETOHTMLTASK,
    EXTRACT_TEXT_FROM_ELEMENT:ExtractTextFromElementTask
 }