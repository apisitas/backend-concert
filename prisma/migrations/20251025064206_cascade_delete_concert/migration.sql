-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_concertId_fkey`;

-- DropIndex
DROP INDEX `Reservation_concertId_fkey` ON `reservation`;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_concertId_fkey` FOREIGN KEY (`concertId`) REFERENCES `Concert`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
