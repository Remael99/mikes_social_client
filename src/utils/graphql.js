import { gql } from "@apollo/client";

export const FETCH_ALL_POSTS = gql`
  {
    getPosts {
      id
      body
      postImage
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

export const FETCH_USER_PROFILE = gql`
  query($username: String!) {
    getUser(username: $username) {
      id
      username
      description
      userImage
      createdAt
      followers {
        id
        username
        createdAt
      }
      followCount
    }
  }
`;
