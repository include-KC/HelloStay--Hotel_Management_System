import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

function LoginPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Login</h1>

          <p className="page-description">
            This is a placeholder login screen. Real authentication will be
            added in a later milestone.
          </p>

          <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
            <Input
              id="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              helperText="Placeholder only. No backend connection yet."
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              helperText="Authentication will be implemented later."
            />

            <Button disabled>Login later</Button>

            <Link to="/">
              <Button variant="ghost">Back to Start</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;