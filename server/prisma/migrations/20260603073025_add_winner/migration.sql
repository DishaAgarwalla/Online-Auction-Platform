-- AlterTable
ALTER TABLE `auction` ADD COLUMN `winnerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_winnerId_fkey` FOREIGN KEY (`winnerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
