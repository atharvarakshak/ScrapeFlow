/*
  Warnings:

  - You are about to drop the column `creditsConsumed` on the `WorkflowExecution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkflowExecution" DROP COLUMN "creditsConsumed";
