import { gql } from '@apollo/client';
import { TASK_FIELDS } from './fragments';

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFields
      project {
        id
      }
    }
  }
  ${TASK_FIELDS}
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: Status!) {
    updateTaskStatus(id: $id, status: $status) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $userId: ID!) {
    assignTask(taskId: $taskId, userId: $userId) {
      ...TaskFields
      assignee {
        id
        username
      }
    }
  }
  ${TASK_FIELDS}
`;
