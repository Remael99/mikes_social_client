import { gql } from "@apollo/client";

export const FETCH_ALL_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likes {
        username
      }
      likeCount
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;
