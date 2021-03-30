import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Label } from "semantic-ui-react";

const FollowButton = ({
  user,
  followedUser: { username, followCount, followers },
}) => {
  const [followUser, setFollowUser] = useState(false);

  useEffect(() => {
    if (user && followers?.find((f) => f?.username === user?.username)) {
      setFollowUser(true);
    } else {
      setFollowUser(false);
    }
  }, [user, followers]);

  const [addfollowUser] = useMutation(FOLLOW_USER, {
    variables: { username },
    onError({ graphQLErrors }) {
      if (graphQLErrors) {
        console.log(graphQLErrors);
      }
    },
  });

  const followButton =
    user &&
    (followUser ? (
      <Button color="green">following</Button>
    ) : (
      <Button color="twitter">follow</Button>
    ));
  return (
    <Button as="div" labelPosition="right" onClick={addfollowUser}>
      {followButton}
      <Label as="a" basic color="twitter" pointing="left">
        {followCount}
      </Label>
    </Button>
  );
};

const FOLLOW_USER = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      id
      username
      followers {
        id
        username
        createdAt
      }
      followCount
    }
  }
`;

export default FollowButton;
