import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./Context/Auth";
import AuthRoute from "./utils/AuthRoute";
import Post from "./Pages/Post";
import Profile from "./Pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Navbar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={Post} />
          <Route exact path="/:username/profile" component={Profile} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
