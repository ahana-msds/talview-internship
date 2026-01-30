// 1. node.js core modules: 'fs' for file system operations, 'path' for handling file paths
const fs = require('fs').promises; // using the promises version for async/await
const path = require('path');

// define the path to our data file using 'path.join' for cross-platform compatibility
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

/**
 * service for handling user-related business logic and data access.
 * demonstration of asynchronous programming and node.js core modules.
 */
class UserService {

    // 3. asynchronous programming: using async/await to handle file i/o
    async getAllUsers() {
        try {
            // read file using 'fs.readFile'
            const data = await fs.readFile(usersFilePath, 'utf8');
            // parse json string into javascript object
            return JSON.parse(data);
        } catch (error) {
            console.error('error reading users file:', error);
            throw new Error('could not fetch users');
        }
    }

    async getUserById(id) {
        const users = await this.getAllUsers();
        // find user by id
        return users.find(u => u.id === parseInt(id));
    }

    async createUser(userData) {
        const users = await this.getAllUsers();

        // create a new user object with a unique id
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData
        };

        users.push(newUser);

        try {
            // write updated users list back to file
            // null, 2 provides pretty-printing for the json
            await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
            return newUser;
        } catch (error) {
            console.error('error writing users file:', error);
            throw new Error('could not save user');
        }
    }
}

module.exports = new UserService();
