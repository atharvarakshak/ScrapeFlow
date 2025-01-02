/*
  Warnings:

  - Added the required column `definition` to the `WorkflowExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkflowExecution" ADD COLUMN     "definition" TEXT NOT NULL;
