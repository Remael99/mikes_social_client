import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../Context/Auth";

const Register = () => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const history = useHistory();

  const { handleChange, handleSubmit, value } = useForm(
    registerUser,
    initialState
  );

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      console.log(userData);
      context.login(userData);
      history.push("/");
    },
    onError({ graphQLErrors }) {
      if (graphQLErrors) {
        setErrors(graphQLErrors[0].extensions.exception.errors);
      }

      // err && setErrors(err?.graphQLErrors[0]?.extensions.exception.errors);
    },
    variables: value,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form__container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Register user</h1>
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
          label="email"
          name="email"
          type="email"
          error={errors?.email ? true : false}
          placeholder="email"
          value={value.email}
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
        <Form.Input
          label="confirmpassword"
          name="confirmPassword"
          type="password"
          placeholder="confirmpassword"
          error={errors?.password ? true : false}
          value={value.confirmPassword}
          onChange={handleChange}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Register;
