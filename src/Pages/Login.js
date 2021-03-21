import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../Context/Auth";

const Login = () => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
  };

  const history = useHistory();

  const { handleChange, handleSubmit, value } = useForm(
    loginUser,
    initialState
  );

  const [addUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login } }) {
      context.login(login);
      history.push("/");
    },
    onError({ graphQLErrors, networkError }) {
      if (graphQLErrors) {
        setErrors(graphQLErrors[0].extensions.exception.errors);
      }

      if (networkError) {
        console.log(networkError);
      }
      //setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: value,
  });

  function loginUser() {
    addUser();
  }

  return (
    <div className="form__container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Welcome back</h1>
        <Form.Input
          label="username"
          name="username"
          type="text"
          placeholder="username"
          error={errors?.username ? true : false}
          value={value.username}
          onChange={handleChange}
        />

        <Form.Input
          label="password"
          name="password"
          type="password"
          error={errors?.password ? true : false}
          placeholder="password"
          value={value.password}
          onChange={handleChange}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      token
      createdAt
    }
  }
`;

export default Login;
