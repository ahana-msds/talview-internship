const userService = require('./services/userService');
const db = require('./db');

async function main() {
    console.log('--- knex demo start ---');

    try {
        // 1. clean up previous runs
        console.log('cleaning up...');
        await db('posts').del();
        await db('profiles').del();
        await db('users').del();

        // 2. create user
        console.log('creating user...');
        const user = await userService.createUser({
            email: 'alice@example.com',
            name: 'Alice Knex',
        });
        console.log('created user:', user);

        // 3. create transaction (user + profile)
        console.log('creating user with profile (transaction)...');
        const bob = await userService.createUserWithProfile(
            { email: 'bob@example.com', name: 'Bob Knex' },
            { bio: 'i love sql query builders' }
        );
        console.log('created bob:', bob);

        // 4. add posts
        console.log('adding posts...');
        await db('posts').insert([
            { title: 'hello knex', content: 'knex is cool', author_id: user.id },
            { title: 'why sql?', content: 'because control', author_id: user.id },
            { title: 'transactions', content: 'acid is important', author_id: bob.id }
        ]);

        // 5. get users with posts (join)
        console.log('fetching users with posts...');
        const usersWithPosts = await userService.getUsersWithPosts();
        console.log('users with posts:', usersWithPosts);

    } catch (err) {
        console.error('error:', err);
    } finally {
        await db.destroy();
        console.log('--- knex demo end ---');
    }
}

main();
