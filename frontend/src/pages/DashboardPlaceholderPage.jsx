import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function DashboardPlaceholderPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Private Area</h1>

          <p className="page-description">
            This is a temporary protected page for testing authentication state
            and protected routing. The real dashboard shell will be built in a
            later milestone.
          </p>

          <div style={{ marginTop: "24px" }}>
            <Button type="button" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default DashboardPlaceholderPage;