-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_matchId_fkey";

-- CreateTable
CREATE TABLE "teams_in_groups" (
    "id" UUID NOT NULL,
    "matchId" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "result" "team_results_enum",
    "score" INTEGER,

    CONSTRAINT "teams_in_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_in_groups_matchId_teamId_key" ON "teams_in_groups"("matchId", "teamId");

-- AddForeignKey
ALTER TABLE "teams_in_groups" ADD CONSTRAINT "teams_in_groups_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_in_groups" ADD CONSTRAINT "teams_in_groups_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
