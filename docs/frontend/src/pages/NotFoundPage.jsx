import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

function NotFoundPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Page Not Found</h1>

          <div style={{ marginTop: "16px" }}>
            <ErrorMessage message="The page you are looking for does not exist." />
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link to="/">
              <Button>Go to Start Page</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default NotFoundPage;