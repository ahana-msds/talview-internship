
export const typeDefs = `#graphql
  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  enum Status {
    TODO
    IN_PROGRESS
    DONE
  }

  type User {
    id: ID!
    username: String!
    email: String!
    projects: [Project!]!
    assignedTasks: [Task!]!
  }

  type Project {
    id: ID!
    name: String!
    description: String
    owner: User!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: Status!
    priority: Priority!
    project: Project!
    assignee: User
  }

  input CreateProjectInput {
    name: String!
    description: String
    ownerId: ID!
  }

  input CreateTaskInput {
    title: String!
    description: String
    projectId: ID!
    status: Status
    priority: Priority
    assigneeId: ID
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    projects: [Project!]!
    project(id: ID!): Project
    tasks(status: Status, priority: Priority): [Task!]!
    task(id: ID!): Task
    searchProjects(term: String!): [Project!]!
  }

  type Mutation {
    createUser(username: String!, email: String!): User!
    createProject(input: CreateProjectInput!): Project!
    createTask(input: CreateTaskInput!): Task!
    updateTaskStatus(id: ID!, status: Status!): Task!
    assignTask(taskId: ID!, userId: ID!): Task!
    deleteProject(id: ID!): Boolean!
  }
`;
