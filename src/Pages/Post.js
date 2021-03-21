import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  Button,
  Card,
  Dimmer,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Loader,
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

  const getPost = data?.getPost;

  const deleteButtonCallback = () => {
    history.replace("/");
  };
  let postMarkup;
  if (!getPost) {
    postMarkup = (
      <Dimmer>
        <Loader>Loading</Loader>
      </Dimmer>
    );
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
                    post={{ id }}
                    callback={deleteButtonCallback}
                    user={user}
                  />
                )}
              </Card.Content>
            </Card>
            <Header as="h3" dividing>
              Comments
            </Header>
            {comments &&
              comments.map((comment) => (
                <Comments
                  key={comment.id}
                  postId={{ id }}
                  user={user}
                  comment={comment}
                  open={open}
                  setOpen={setOpen}
                />
              ))}
          </Grid.Column>
        </Grid.Row>
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
export default Post;
