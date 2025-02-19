/*
  Warnings:

  - You are about to drop the column `matchId` on the `teams` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teams" DROP COLUMN "matchId",
ADD COLUMN     "groupId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
