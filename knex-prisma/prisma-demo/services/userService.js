const prisma = require('../db');

const userService = {
    // CREATE
    async createUser(data) {
        return await prisma.user.create({
            data: data
        });
    },

    // READ
    async getAllUsers() {
        return await prisma.user.findMany();
    },

    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
    },

    // UPDATE
    async updateUser(id, data) {
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: data
        });
    },

    // DELETE
    async deleteUser(id) {
        return await prisma.user.delete({
            where: { id: parseInt(id) }
        });
    },

    // RELATIONS (equivalent to JOINS)
    // Get all users with their posts
    async getUsersWithPosts() {
        return await prisma.user.findMany({
            include: {
                posts: true
            }
        });
    },

    // TRANSACTION example
    // Create user and profile together
    async createUserWithProfile(userData, profileData) {
        // Prisma transactions are often implicit in nested writes, but here is explicit $transaction
        // Method 1: Nested write (Atomic by default in Prisma)
        /*
        return await prisma.user.create({
          data: {
            ...userData,
            profile: {
              create: profileData
            }
          }
        })
        */

        // Method 2: Interactive Transaction (more like Knex)
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: userData
            });

            await tx.profile.create({
                data: {
                    ...profileData,
                    userId: user.id
                }
            });

            return user;
        });
    }
};

module.exports = userService;
