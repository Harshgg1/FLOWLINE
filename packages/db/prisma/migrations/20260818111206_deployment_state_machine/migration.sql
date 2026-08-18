/*
  Warnings:

  - The values [DEPLOYING] on the enum `DeploymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `commitHash` on the `Deployment` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeploymentStatus_new" AS ENUM ('QUEUED', 'CLONING', 'BUILDING', 'STARTING', 'RUNNING', 'FAILED');
ALTER TABLE "public"."Deployment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Deployment" ALTER COLUMN "status" TYPE "DeploymentStatus_new" USING ("status"::text::"DeploymentStatus_new");
ALTER TYPE "DeploymentStatus" RENAME TO "DeploymentStatus_old";
ALTER TYPE "DeploymentStatus_new" RENAME TO "DeploymentStatus";
DROP TYPE "public"."DeploymentStatus_old";
ALTER TABLE "Deployment" ALTER COLUMN "status" SET DEFAULT 'QUEUED';
COMMIT;

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "commitHash",
ADD COLUMN     "containerId" TEXT,
ADD COLUMN     "port" INTEGER;
