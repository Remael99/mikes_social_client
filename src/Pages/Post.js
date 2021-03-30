import { gql, useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  Button,
  Card,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Modal,
  Popup,
} from "semantic-ui-react";
import Comments from "../components/Comments";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../Context/Auth";

const Post = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [disable, setDisabled] = useState(false);
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const { data } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId,
    },
  });

  const [comment, setComment] = useState("");

  const [addComment] = useMutation(CREATE_COMMENT, {
    variables: {
      postId,
      body: comment,
    },
    update(proxy, result) {
      setComment("");
      const newComment = result.data.createComment;

      console.log(newComment);
      const data = proxy.readQuery({
        query: FETCH_SINGLE_POST,
        variables: {
          postId: newComment.id,
          body: comment,
        },
      });
      proxy.writeQuery({
        query: FETCH_SINGLE_POST,
        variables: {
          postId: newComment.id,
          body: comment,
        },
        data: {
          getUser: [{ newComment, ...data?.getPost }],
        },
      });
      setOpen(false);
    },
    onError: ({ networkError, graphQLErrors }) => {
      console.log("graphQLErrors", graphQLErrors);
      console.log("networkError", networkError);
    },
  });

  const getPost = data?.getPost;

  const deleteButtonCallback = () => {
    history.replace("/");
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <h1>loading...</h1>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      commentCount,
      likes,
      likeCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header> {username} </Card.Header>
                <Card.Meta> {moment(createdAt).fromNow(true)} </Card.Meta>
                <Card.Description> {body} </Card.Description>
              </Card.Content>

              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup
                  content="click to  add comment!"
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => {
                        user ? setOpen(true) : setDisabled(true);
                      }}
                      disabled={disable}
                    >
                      <Button color="olive" basic>
                        <Icon name="comments" />
                      </Button>
                      <Label as="a" basic color="olive" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                  inverted
                />

                {user && user?.username === username && (
                  <DeleteButton
                    post={getPost}
                    callback={deleteButtonCallback}
                    user={user}
                  />
                )}
              </Card.Content>
            </Card>
            <Header as="h3" dividing>
              Comments
            </Header>
            {comments.length !== 0 ? (
              comments.map((comment) => (
                <Comments
                  key={comment.id}
                  postId={id}
                  user={user}
                  comment={comment}
                  open={open}
                  setOpen={setOpen}
                />
              ))
            ) : (
              <h3> no comments at the moment! click comment button to add</h3>
            )}
          </Grid.Column>
        </Grid.Row>
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
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_SINGLE_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      likeCount
      likes {
        username
      }
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

const CREATE_COMMENT = gql`
  mutation addcomment($postId: ID!, $body: String!) {
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
export default Post;
