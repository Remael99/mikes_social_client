import React, { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { FETCH_ALL_POSTS } from "../utils/graphql";

const DeleteButton = ({ post: { id }, commentId, callback }) => {
  const [open, setOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_ALL_POSTS,
        });

        proxy.writeQuery({
          query: FETCH_ALL_POSTS,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== id),
          },
        });
      }

      if (callback) callback();
    },
    variables: {
      postId: id,
      commentId,
    },
  });
  return (
    <>
      <Popup
        content={commentId ? "delete comment" : "delete post"}
        trigger={
          <Button
            floated="right"
            as="div"
            color="red"
            onClick={() => setOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
        inverted
      />

      <Confirm
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={deletePostOrComment}
      ></Confirm>
    </>
  );
};

const DELETE_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
