/*
  Warnings:

  - You are about to drop the column `timestamp` on the `DeploymentLog` table. All the data in the column will be lost.
  - Added the required column `type` to the `DeploymentLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('INFO', 'ERROR', 'BUILD');

-- AlterTable
ALTER TABLE "DeploymentLog" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "LogType" NOT NULL;
