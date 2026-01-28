
let users = [
    { id: '1', username: 'ahana', email: 'ahana@example.com' },
    { id: '2', username: 'atul', email: 'atul@example.com' },
];

let projects = [
    { id: '1', name: 'GraphQL', description: 'practice project', ownerId: '1' },
];

let tasks = [
    { id: '1', title: 'Setup Server', description: 'Apollo server initialization', status: 'DONE', priority: 'HIGH', projectId: '1', assigneeId: '1' },
    { id: '2', title: 'Define Schema', description: 'Nested types and enums', status: 'IN_PROGRESS', priority: 'MEDIUM', projectId: '1', assigneeId: '2' },
];

export const resolvers = {
    Query: {
        users: () => users,
        user: (_: any, { id }: { id: string }) => users.find(u => u.id === id),
        projects: () => projects,
        project: (_: any, { id }: { id: string }) => projects.find(p => p.id === id),
        tasks: (_: any, { status, priority }: { status?: string; priority?: string }) => {
            let filteredTasks = tasks;
            if (status) filteredTasks = filteredTasks.filter(t => t.status === status);
            if (priority) filteredTasks = filteredTasks.filter(t => t.priority === priority);
            return filteredTasks;
        },
        task: (_: any, { id }: { id: string }) => tasks.find(t => t.id === id),
        searchProjects: (_: any, { term }: { term: string }) =>
            projects.filter(p => p.name.toLowerCase().includes(term.toLowerCase()) ||
                p.description?.toLowerCase().includes(term.toLowerCase())),
    },
    Mutation: {
        createUser: (_: any, { username, email }: { username: string; email: string }) => {
            const newUser = { id: String(users.length + 1), username, email };
            users.push(newUser);
            return newUser;
        },
        createProject: (_: any, { input }: { input: any }) => {
            const newProject = { id: String(projects.length + 1), ...input };
            projects.push(newProject);
            return newProject;
        },
        createTask: (_: any, { input }: { input: any }) => {
            const newTask = {
                id: String(tasks.length + 1),
                status: 'TODO',
                priority: 'MEDIUM',
                ...input
            };
            tasks.push(newTask);
            return newTask;
        },
        updateTaskStatus: (_: any, { id, status }: { id: string; status: string }) => {
            const task = tasks.find(t => t.id === id);
            if (!task) throw new Error('Task not found');
            task.status = status;
            return task;
        },
        assignTask: (_: any, { taskId, userId }: { taskId: string; userId: string }) => {
            const task = tasks.find(t => t.id === taskId);
            if (!task) throw new Error('Task not found');
            task.assigneeId = userId;
            return task;
        },
        deleteProject: (_: any, { id }: { id: string }) => {
            projects = projects.filter(p => p.id !== id);
            tasks = tasks.filter(t => t.projectId !== id);
            return true;
        },
    },
    // Field-level resolvers for nested relationships
    User: {
        projects: (user: any) => projects.filter(p => p.ownerId === user.id),
        assignedTasks: (user: any) => tasks.filter(t => t.assigneeId === user.id),
    },
    Project: {
        owner: (project: any) => users.find(u => u.id === project.ownerId),
        tasks: (project: any) => tasks.filter(t => t.projectId === project.id),
    },
    Task: {
        project: (task: any) => projects.find(p => p.id === task.projectId),
        assignee: (task: any) => users.find(u => u.id === task.assigneeId),
    },
};
