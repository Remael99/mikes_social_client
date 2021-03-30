import moment from "moment";
import React from "react";
import { Card, Comment } from "semantic-ui-react";

import DeleteButton from "./DeleteButton";

const Comments = ({
  comment: { id, body, createdAt, username },
  user,
  postId,
}) => {
  return (
    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
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
    </div>
  );
};

// className={loading ? "loading" : ""}
// error={error ? true : false}

export default Comments;
