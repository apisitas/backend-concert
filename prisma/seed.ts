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
        {
            name: 'Rock Fest 2025',
            totalSeats: 50,
            description: 'Experience the adrenaline-pumping excitement of Rock Fest 2025, a full-day festival that brings together legendary rock bands and rising stars. From electrifying guitar solos to drum solos that will make your heart race, every performance is designed to ignite the crowd. Feel the energy of thousands of fans singing along, headbanging, and enjoying epic pyrotechnics, all in one unforgettable night.'
        },
        {
            name: 'Jazz Night',
            totalSeats: 30,
            description: 'Step into a world of elegance and smooth rhythms at Jazz Night. Enjoy an intimate evening with live saxophones, pianos, double bass, and soulful vocals that transport you to smoky jazz clubs of the past. Sip on your favorite drink as the musicians take you on an emotional journey, blending classic standards with improvisational brilliance, creating an ambiance perfect for relaxing and unwinding.'
        },
        {
            name: 'EDM Party',
            totalSeats: 100,
            description: 'Prepare to lose yourself in a high-octane night of electronic dance music at the EDM Party. World-renowned DJs will be spinning the hottest tracks while dazzling light shows and synchronized laser displays make the atmosphere surreal. Feel the bass reverberate through your body as the crowd jumps, dances, and celebrates until dawn. This is not just a party—it’s an experience that will leave you breathless.'
        },
        {
            name: 'Pop Extravaganza',
            totalSeats: 40,
            description: 'Join a star-studded night at Pop Extravaganza, featuring live performances of chart-topping hits from today’s biggest pop artists. Dance, sing along, and witness spectacular stage productions with vibrant costumes, LED screens, and energetic choreography. Every moment is designed to make you feel part of the show, leaving you with memories that last long after the music stops.'
        },
        {
            name: 'Indie Vibes',
            totalSeats: 25,
            description: 'Indie Vibes brings together the most authentic indie bands for an evening of acoustic melodies and heartfelt lyrics. Enjoy a laid-back, intimate atmosphere where every note tells a story and every performance is personal. Connect with the music on a deeper level as the artists pour their hearts out, leaving you inspired and emotionally touched by the unique sound of the indie scene.'
        },
        {
            name: 'Classical Evenings',
            totalSeats: 20,
            description: 'Immerse yourself in a serene night of Classical Evenings, featuring the finest orchestral symphonies and solo performances. From the delicate piano pieces to the grandeur of full string ensembles, every composition is performed with precision and emotion. Let the candlelit hall, the harmonies, and the resonance of live instruments transport you to a world of elegance, reflection, and timeless beauty.'
        },
        {
            name: 'HipHop Live',
            totalSeats: 60,
            description: 'HipHop Live is an electrifying celebration of modern urban music, blending dynamic rap performances, DJ sets, and high-energy dance battles. The event captures the raw energy and creativity of hip-hop culture, giving fans a chance to experience lyrical skill, infectious beats, and interactive crowd participation. This night is about rhythm, attitude, and the unapologetic expression of self.'
        },
        {
            name: 'Reggae Night',
            totalSeats: 35,
            description: 'Feel the relaxing and uplifting vibes of Reggae Night, where soulful rhythms, tropical melodies, and positive messages fill the air. Enjoy live performances that transport you to the Caribbean, with bands blending traditional reggae, ska, and modern influences. Dance barefoot on the grass or simply sway to the beat, embracing a night of music, unity, and chill energy.'
        },
        {
            name: 'Metal Mayhem',
            totalSeats: 45,
            description: 'Metal Mayhem is the ultimate destination for fans of heavy metal and hard rock. Witness brutal riffs, thunderous drum solos, and powerful vocals that shake the very foundations of the venue. Fans gather to headbang, mosh, and celebrate the intense energy of metal music. Each band pushes the limits of performance, creating an unforgettable spectacle of power and sound.'
        },
        {
            name: 'Country Roads',
            totalSeats: 30,
            description: 'Experience the warmth and storytelling of country music at Country Roads. Live bands play heartfelt songs about love, life, and the open road, combining acoustic guitars, fiddles, and smooth vocals. Sing along to familiar tunes or discover new favorites while enjoying a friendly, down-to-earth atmosphere that captures the spirit of the countryside and the heart of its music.'
        },
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
        const count = await prisma.reservation.count({
            where: { concertId: randomConcert.id, action: 'RESERVE' },
        });
        if (count >= randomConcert.totalSeats) continue;

        // Randomly pick action
        const randomAction = Math.random() < 0.8 ? 'RESERVE' : 'CANCEL'; // 80% reserve, 20% cancel

        await prisma.reservation.create({
            data: {
                userId: randomUser.id,
                concertId: randomConcert.id,
                action: randomAction,
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
