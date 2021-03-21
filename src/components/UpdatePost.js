import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form, Icon, Modal } from "semantic-ui-react";
import { useForm } from "../utils/hooks";

const UpdatePost = ({ post: { id, username }, user }) => {
  const [open, setOpen] = useState();
  const { handleSubmit, handleChange, value } = useForm(updatenewPost, {
    body: "",
  });

  const [updatePost, { loading, error }] = useMutation(UPDATE_POST, {
    variables: {
      postId: id,
    },
    update() {},
  });

  function updatenewPost() {
    updatePost();
  }

  return (
    <>
      {user && user.username === username && (
        <Button size="mini" onClick={() => setOpen(true)}>
          {" "}
          <Icon name="edit" style={{ margin: 0 }} />{" "}
        </Button>
      )}
      <Modal
        closeIcon
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ width: "500px", height: "250px" }}
      >
        <Modal.Content>
          <Form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
            <h2>edit post</h2>
            <Form.Field>
              <Form.Input
                placeholder="sssup dear people"
                name="body"
                onChange={handleChange}
                value={value.body}
                error={error ? true : false}
              />
            </Form.Field>
            <Button type="submit" color="green">
              edit
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

const UPDATE_POST = gql`
  mutation updatePost($postId: ID!, $body: String!) {
    updatePost(postId: $postId, body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
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

export default UpdatePost;

// {error && (
//     <div className="ui error message">
//       <ul className="list">
//         <li>{error.graphQLErrors[0].message}</li>
//       </ul>
//     </div>
//   )}
