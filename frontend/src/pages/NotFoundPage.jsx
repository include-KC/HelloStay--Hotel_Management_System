import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-center">
      <section className="welcome-card">
        <p className="eyebrow">404</p>

        <h1>Page Not Found</h1>

        <p className="page-description">
          The page you are looking for does not exist.
        </p>

        <Link className="text-link" to="/">
          Go back to Start Page
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;