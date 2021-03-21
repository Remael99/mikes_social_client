import { gql, useMutation } from "@apollo/client";
import moment from "moment";
import React, { useState } from "react";
import { Button, Card, Comment, Form, Modal } from "semantic-ui-react";

import DeleteButton from "./DeleteButton";

const Comments = ({
  comment: { id, body, createdAt, username },
  user,
  postId,
  open,
  setOpen,
}) => {
  const [comment, setComment] = useState("");

  const [addComment] = useMutation(CREATE_COMMENT, {
    variables: {
      postId,
      body: comment,
    },
    update() {
      setComment("");
      setOpen(false);
    },
    onError: ({ networkError, graphQLErrors }) => {
      console.log("graphQLErrors", graphQLErrors);
      console.log("networkError", networkError);
    },
  });

  return (
    <>
      <Card fluid>
        <Card.Content>
          {user && user.username === username && (
            <DeleteButton post={postId} commentId={id} />
          )}
          <Comment.Group>
            <Comment>
              {" "}
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as="a"> {username} </Comment.Author>
                <Comment.Metadata>
                  <div> {moment().calendar({ createdAt })} </div>
                </Comment.Metadata>
                <Comment.Text> {body} </Comment.Text>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Card.Content>
      </Card>
      <Modal
        closeIcon
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ width: "500px", height: "250px" }}
      >
        <Modal.Content>
          <Form>
            <h2>post comment </h2>
            <Form.Field>
              <Form.Input
                placeholder="sssup dear people"
                name="body"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
            </Form.Field>
            <Button
              disabled={comment.trim() === ""}
              type="submit"
              color="green"
              onClick={addComment}
            >
              Comment
            </Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button type="submit" color="red" onClick={() => setOpen(false)}>
            cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      username
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;
// className={loading ? "loading" : ""}
// error={error ? true : false}

export default Comments;
