import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { Button, Card, Form, Grid, Image, Modal } from "semantic-ui-react";
import { AuthContext } from "../Context/Auth";
import { FETCH_USER_PROFILE } from "../utils/graphql";
import { useForm } from "../utils/hooks";
import FileBase from "react-file-base64";
import FollowButton from "../components/followButton";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const { handleSubmit, handleChange, value } = useForm(createNewProfile, {
    description: "",
    userImage: "",
  });

  const { data } = useQuery(FETCH_USER_PROFILE, {
    variables: {
      username,
    },
    onError({ graphQLErrors }) {
      if (graphQLErrors) {
        console.log(graphQLErrors);
      }
    },
  });
  const [addProfile, { loading }] = useMutation(CREATE_USER_PROFILE, {
    variables: value,
    update(proxy, result) {
      const newProfile = result.data.createUserProfile;
      const data = proxy.readQuery({
        query: FETCH_USER_PROFILE,
        variables: {
          username: newProfile.username,
        },
      });
      console.log(data?.getUser);
      proxy.writeQuery({
        query: FETCH_USER_PROFILE,
        variables: {
          username: newProfile.username,
        },
        data: {
          getUser: [{ newProfile, ...data?.getUser }],
        },
      });
      value.description = "";

      if (!loading) {
        setOpen(false);
      }
    },

    onError({ graphQLErrors, networkError }) {
      if (graphQLErrors || networkError) {
        console.log(graphQLErrors);
        console.log(networkError);
      }
    },
  });

  function createNewProfile() {
    addProfile();
  }
  const getUser = data?.getUser;

  let profileMarkup;
  if (!getUser) {
    profileMarkup = <h1>loading...</h1>;
  } else {
    const { username: userName, description, userImage, createdAt } = getUser;
    profileMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src={
                userImage
                  ? userImage
                  : "https://react.semantic-ui.com/images/avatar/large/matthew.png"
              }
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              <Grid.Column></Grid.Column>
              <Grid.Column></Grid.Column>
            </Grid.Row>
            <Card fluid>
              <Card.Content>
                <Card.Header>{userName}</Card.Header>
                <Card.Meta> {moment(createdAt).fromNow()} </Card.Meta>
                <Card.Description> {description} </Card.Description>
              </Card.Content>

              <hr />

              <Card.Content extra>
                {user && user.username === userName ? (
                  <Button color="twitter" onClick={() => setOpen(true)}>
                    {description ? "update profile" : "setup profile"}
                  </Button>
                ) : (
                  user && <FollowButton user={user} followedUser={getUser} />
                )}
              </Card.Content>
            </Card>
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
            <Form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
              <h2>Setup profile</h2>
              <Form.Field>
                <Form.Input
                  placeholder="hello im new here"
                  name="description"
                  onChange={handleChange}
                  value={value.description}
                />
              </Form.Field>
              <Form.Field>
                <div className="fileInput">
                  <FileBase
                    type="file"
                    multiple={false}
                    name="postImage"
                    onDone={({ base64 }) =>
                      (value.userImage = base64.toString())
                    }
                    value={value.userImage}
                  />
                </div>
              </Form.Field>
              <Button
                disabled={description?.trim() === ""}
                type="submit"
                color="green"
                onClick={addProfile}
              >
                setup{" "}
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

  return profileMarkup;
};

const CREATE_USER_PROFILE = gql`
  mutation createProfile($description: String!, $userImage: String!) {
    createUserProfile(description: $description, userImage: $userImage) {
      id
      username
      description
      userImage
    }
  }
`;

export default Profile;
