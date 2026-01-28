import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    username
    email
  }
`;

export const PROJECT_FIELDS = gql`
  fragment ProjectFields on Project {
    id
    name
    description
  }
`;

export const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    title
    description
    status
    priority
  }
`;
