import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const LikeButton = ({ post: { id, likes, likeCount }, user }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [addlikePost] = useMutation(LIKE_POST, {
    variables: { postId: id },
    onError({ graphQLErrors }) {
      if (graphQLErrors) {
        console.log(graphQLErrors[0].extensions.exception.errors);
      }

      // err && setErrors(err?.graphQLErrors[0]?.extensions.exception.errors);
    },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="green" filled>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" as={Link} to="/Login">
      <Icon name="heart" />
    </Button>
  );
  return (
    <Button as="div" labelPosition="right" onClick={addlikePost}>
      {likeButton}
      <Label as="a" basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      username
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
