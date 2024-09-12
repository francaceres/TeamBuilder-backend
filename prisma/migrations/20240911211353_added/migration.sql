-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_groupId_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_groupId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_matchId_fkey";

-- DropForeignKey
ALTER TABLE "users_in_groups" DROP CONSTRAINT "users_in_groups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "users_in_groups" DROP CONSTRAINT "users_in_groups_userId_fkey";

-- AddForeignKey
ALTER TABLE "users_in_groups" ADD CONSTRAINT "users_in_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_in_groups" ADD CONSTRAINT "users_in_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
