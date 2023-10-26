import { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setErrMsg("");
      await props.validateLogin(username, password);
      navigate("/");
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  useEffect(() => {
    if (errMsg) {
      setTimeout(() => {
        setErrMsg("");
      }, 2000);
    }
  }, [errMsg]);

  return (
    <div className="login-form-container">
      <h2 className="welcome-text">Welcome back to the Fiasco</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-mail"
            value={username}
            onChange={(ev) => {
              setUsername(ev.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
        </Form.Group>
        <div className="button-container">
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
          >
            Submit
          </Button>{" "}
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              navigate("/");
            }}
            className="btn-primary"
          >
            Cancel
          </Button>
        </div>
        {errMsg && <Alert variant="danger">{errMsg}</Alert>}
      </Form>
    </div>
  );
}

export { LoginForm };
