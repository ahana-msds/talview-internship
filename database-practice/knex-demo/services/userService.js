const db = require('../db');

const userService = {
    // CREATE
    async createUser(data) {
        // using returning('*') to get the created record back
        const [user] = await db('users').insert(data).returning('*');
        return user;
    },

    // READ
    async getAllUsers() {
        return await db('users').select('*');
    },

    async getUserById(id) {
        return await db('users').where({ id }).first();
    },

    // UPDATE
    async updateUser(id, data) {
        const [updated] = await db('users')
            .where({ id })
            .update(data)
            .returning('*');
        return updated;
    },

    // DELETE
    async deleteUser(id) {
        return await db('users').where({ id }).del();
    },

    // COMPLEX QUERY: JOIN
    // Get all users with their posts
    async getUsersWithPosts() {
        return await db('users')
            .leftJoin('posts', 'users.id', 'posts.author_id')
            .select('users.id', 'users.name', 'posts.title as post_title', 'posts.content');
    },

    // TRANSACTION example
    // Create user and profile together
    async createUserWithProfile(userData, profileData) {
        return await db.transaction(async (trx) => {
            const [user] = await trx('users').insert(userData).returning('*');

            await trx('profiles').insert({
                ...profileData,
                user_id: user.id
            });

            return user;
        });
    }
};

module.exports = userService;
