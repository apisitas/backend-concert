import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ----- USERS -----
  const usersData = [
    { email: 'alice@example.com' },
    { email: 'bob@example.com' },
    { email: 'carol@example.com' },
    { email: 'dave@example.com' },
    { email: 'eve@example.com' },
    { email: 'frank@example.com' },
    { email: 'grace@example.com' },
    { email: 'heidi@example.com' },
    { email: 'ivan@example.com' },
    { email: 'judy@example.com' },
  ];

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true, // ignores users with existing emails
  });

  const users = await prisma.user.findMany(); // get all users for reservations

  // ----- CONCERTS -----
  const concertsData = [
    { name: 'Rock Fest 2025', totalSeats: 50, description: 'Annual rock music festival' },
    { name: 'Jazz Night', totalSeats: 30, description: 'Smooth jazz evening' },
    { name: 'EDM Party', totalSeats: 100, description: 'Electronic dance music party' },
    { name: 'Pop Extravaganza', totalSeats: 40, description: 'Top pop hits live' },
    { name: 'Indie Vibes', totalSeats: 25, description: 'Indie band performances' },
    { name: 'Classical Evenings', totalSeats: 20, description: 'Relaxing classical concert' },
    { name: 'HipHop Live', totalSeats: 60, description: 'HipHop night with DJs' },
    { name: 'Reggae Night', totalSeats: 35, description: 'Feel the reggae rhythm' },
    { name: 'Metal Mayhem', totalSeats: 45, description: 'Heavy metal festival' },
    { name: 'Country Roads', totalSeats: 30, description: 'Country music live' },
  ];

  await prisma.concert.createMany({
    data: concertsData,
    skipDuplicates: true, // ignores concerts with same name if name is unique
  });

  const concerts = await prisma.concert.findMany(); // get all concerts for reservations

  // ----- RESERVATIONS (optional random) -----
  for (let i = 0; i < 15; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomConcert = concerts[Math.floor(Math.random() * concerts.length)];

    // Skip if user already reserved this concert
    const existing = await prisma.reservation.findUnique({
      where: { userId_concertId: { userId: randomUser.id, concertId: randomConcert.id } },
    });
    if (existing) continue;

    // Skip if concert is full
    const count = await prisma.reservation.count({ where: { concertId: randomConcert.id } });
    if (count >= randomConcert.totalSeats) continue;

    await prisma.reservation.create({
      data: {
        userId: randomUser.id,
        concertId: randomConcert.id,
      },
    });
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
