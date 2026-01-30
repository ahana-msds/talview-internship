const userService = require('../services/userService');

/**
 * usercontroller handles the request/response logic.
 * it interacts with userservice to perform data operations.
 */
class UserController {

    // handle GET /api/users (including query strings)
    async getUsers(req, res) {
        try {
            // 2. route params and query strings: req.query contains query parameters
            const { role, name } = req.query;
            let users = await userService.getAllUsers();

            // if a role query is provided, filter the results
            if (role) {
                users = users.filter(u => u.role === role);
            }

            // if a name query is provided, filter by name (case-insensitive)
            if (name) {
                users = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
            }

            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // handle GET /api/users/:id (demonstrating route parameters)
    async getUserById(req, res) {
        try {
            // 2. route params: req.params contains parameters from the url path
            const { id } = req.params;
            const user = await userService.getUserById(id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'user not found' });
            }

            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // handle POST /api/users (demonstrating request bodies)
    async createUser(req, res) {
        try {
            // 2. request bodies: req.body contains data sent in the request body
            // express.json() middleware is required to parse this
            const { name, role, email } = req.body;

            if (!name || !email) {
                return res.status(400).json({ success: false, message: 'please provide name and email' });
            }

            const newUser = await userService.createUser({ name, role: role || 'user', email });

            res.status(201).json({ success: true, data: newUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UserController();
