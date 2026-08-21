/*
  Warnings:

  - Changed the type of `type` on the `DeploymentLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DeploymentLog" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "DeploymentLog_deploymentId_createdAt_idx" ON "DeploymentLog"("deploymentId", "createdAt");
