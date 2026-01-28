import { gql } from '@apollo/client';
import { TASK_FIELDS, USER_FIELDS } from './fragments';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      owner {
        username
      }
      tasks {
        ...TaskFields
        assignee {
          username
        }
      }
    }
  }
  ${TASK_FIELDS}
`;

export const SEARCH_PROJECTS = gql`
  query SearchProjects($term: String!) {
    searchProjects(term: $term) {
      id
      name
      description
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;
