import React, { useState } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { useForm } from "../utils/hooks";
import { gql, useMutation } from "@apollo/client";
import { FETCH_ALL_POSTS } from "../utils/graphql";
import FileBase from "react-file-base64";

const AddPost = () => {
  const [open, setOpen] = useState(false);

  const { handleSubmit, handleChange, value } = useForm(createNewPost, {
    body: "",
    postImage: "",
  });

  const [addPost, { error, loading }] = useMutation(CREATE_NEW_POST, {
    variables: value,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ALL_POSTS,
      });

      proxy.writeQuery({
        query: FETCH_ALL_POSTS,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      value.body = "";
      if (!loading) {
        setOpen(false);
      }
    },
  });
  function createNewPost() {
    addPost();
  }

  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Button color="teal">New post</Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      style={{ width: "500px", height: "250px" }}
    >
      <Modal.Content>
        <Form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
          <h2>create a post</h2>
          <Form.Field>
            <Form.Input
              placeholder="sssup dear people"
              name="body"
              onChange={handleChange}
              value={value.body}
              error={error ? true : false}
            />
          </Form.Field>
          <div className="fileInput">
            <FileBase
              type="file"
              multiple={false}
              name="postImage"
              onDone={({ base64 }) => (value.postImage = base64.toString())}
              value={value.postImage}
            />
          </div>
          <Button type="submit" color="green">
            Add post
          </Button>
        </Form>
        {error && (
          <div className="ui error message">
            <ul className="list">
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button type="submit" color="red" onClick={() => setOpen(false)}>
          cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const CREATE_NEW_POST = gql`
  mutation createpost($body: String!, $postImage: String!) {
    createPost(body: $body, postImage: $postImage) {
      id
      body
      createdAt
      postImage
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

export default AddPost;
