import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

function StartPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Welcome to HelloStay</h1>

          <p className="page-description">
            HelloStay is an offline hotel management system for managing small
            and medium hotels, guest houses, lodges, and resorts.
          </p>

          <div style={{ marginTop: "24px" }}>
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default StartPage;