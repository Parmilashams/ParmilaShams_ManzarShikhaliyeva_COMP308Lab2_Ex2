import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      role
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;