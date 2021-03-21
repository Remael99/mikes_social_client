import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../Context/Auth";
import AddPost from "../components/AddPost";
import { FETCH_ALL_POSTS } from "../utils/graphql";

const Home = () => {
  const { loading, data } = useQuery(FETCH_ALL_POSTS);
  const { user } = useContext(AuthContext);

  const posts = data?.getPosts;
  return (
    <Grid columns="three">
      <Grid.Row>
        {user && (
          <Grid.Column
            style={{
              position: "absolute",
              zIndex: "99",
              top: "50%",
              right: 0,
              left: 0,
            }}
          >
            <AddPost />
          </Grid.Column>
        )}{" "}
      </Grid.Row>
      <Grid.Row className="page__title">
        <h1>Recent posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>loading...</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Transition.Group duration={1000}>
              <Grid.Column key={post.id} style={{ marginBottom: "25px" }}>
                <PostCard post={post} />
              </Grid.Column>
            </Transition.Group>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
