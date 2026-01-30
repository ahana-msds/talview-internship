const userService = require('./services/userService');
const prisma = require('./db');

async function main() {
    console.log('--- prisma demo start ---');

    try {
        // 1. clean up previous runs
        console.log('cleaning up...');
        await prisma.post.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.user.deleteMany();

        // 2. create user
        console.log('creating user...');
        const user = await userService.createUser({
            email: 'ahana@prisma.io',
            name: 'Ahana',
        });
        console.log('created user:', user);

        // 3. create transaction (user + profile)
        console.log('creating user with profile (transaction)...');
        const anika = await userService.createUserWithProfile(
            { email: 'anika@prisma.io', name: 'Anika' },
            { bio: 'i love orms' }
        );
        console.log('created anika:', anika);

        // 4. add posts
        console.log('adding posts...');
        await prisma.post.createMany({
            data: [
                { title: 'hello prisma', content: 'types are cool', authorId: user.id },
                { title: 'why orm?', content: 'because speed', authorId: user.id },
                { title: 'nested writes', content: 'so simple', authorId: anika.id }
            ]
        });

        // 5. get users with posts (relation)
        console.log('fetching users with posts...');
        // formatted for readability
        const usersWithPosts = await userService.getUsersWithPosts();
        console.log(JSON.stringify(usersWithPosts, null, 2));

    } catch (err) {
        console.error('error:', err);
    } finally {
        await prisma.$disconnect();
        console.log('--- prisma demo end ---');
    }
}

main();
