/*
  Warnings:

  - You are about to drop the column `result` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the `_PlayerToTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams_in_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlayerToTeam" DROP CONSTRAINT "_PlayerToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerToTeam" DROP CONSTRAINT "_PlayerToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "teams_in_groups" DROP CONSTRAINT "teams_in_groups_matchId_fkey";

-- DropForeignKey
ALTER TABLE "teams_in_groups" DROP CONSTRAINT "teams_in_groups_teamId_fkey";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "result",
DROP COLUMN "score";

-- DropTable
DROP TABLE "_PlayerToTeam";

-- DropTable
DROP TABLE "teams_in_groups";

-- CreateTable
CREATE TABLE "teams_in_matches" (
    "id" UUID NOT NULL,
    "matchId" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "result" "team_results_enum",
    "score" INTEGER,

    CONSTRAINT "teams_in_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players_in_teams" (
    "id" UUID NOT NULL,
    "teamInMatchId" UUID NOT NULL,
    "playerId" UUID NOT NULL,

    CONSTRAINT "players_in_teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_in_matches_matchId_teamId_key" ON "teams_in_matches"("matchId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "players_in_teams_teamInMatchId_playerId_key" ON "players_in_teams"("teamInMatchId", "playerId");

-- AddForeignKey
ALTER TABLE "teams_in_matches" ADD CONSTRAINT "teams_in_matches_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_in_matches" ADD CONSTRAINT "teams_in_matches_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_in_teams" ADD CONSTRAINT "players_in_teams_teamInMatchId_fkey" FOREIGN KEY ("teamInMatchId") REFERENCES "teams_in_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_in_teams" ADD CONSTRAINT "players_in_teams_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
