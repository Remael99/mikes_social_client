import React, { useContext } from "react";
import { Button, Card, Icon, Image, Label, Popup } from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../Context/Auth";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = ({
  post: {
    username,
    body,
    createdAt,
    postImage,
    likeCount,
    commentCount,
    likes,
    id,
  },
}) => {
  const { user } = useContext(AuthContext);

  const commentPost = () => {};
  return (
    <Card fluid>
      <Image
        src={
          postImage
            ? postImage
            : "https://react.semantic-ui.com/images/avatar/large/matthew.png"
        }
        style={{ height: "50%" }}
        wrapped
        ui={false}
      />

      <Card.Content>
        <Card.Header style={{ paddingBottom: "5px" }}>
          <Popup
            content="view profile"
            inverted
            trigger={
              <Image
                as={Link}
                to={user ? `/${username}/profile` : `/login`}
                src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                avatar
              />
            }
          />

          <span style={{ padding: "5px" }}>{username}</span>
        </Card.Header>
        <Card.Meta as={Link} to={`posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description labelPosition="right">{body}</Card.Description>
      </Card.Content>

      <Card.Content extra>
        <LikeButton post={{ id, likes, likeCount }} user={user} />
        <Popup
          content="comments"
          trigger={
            <Button as="div" labelPosition="right" onClick={commentPost}>
              <Button color="olive" basic as={Link} to={`posts/${id}`}>
                <Icon name="comments" />
              </Button>
              <Label as="a" basic color="olive" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
          inverted
        />

        {user && user?.username === username && <DeleteButton post={{ id }} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;

// <UpdatePost user={user} post={{ id, username }} />
