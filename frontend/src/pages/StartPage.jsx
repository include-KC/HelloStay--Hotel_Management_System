import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();

  function handleContinue() {
    navigate("/login");
  }

  return (
    <main className="page-center">
      <section className="welcome-card">
        <p className="eyebrow">HelloStay Desktop</p>

        <h1>Welcome to HelloStay</h1>

        <p className="page-description">
          A simple offline hotel management system for small and medium hotels,
          guest houses, lodges, and resorts.
        </p>

        <button className="primary-button" type="button" onClick={handleContinue}>
          Continue to Login
        </button>
      </section>
    </main>
  );
}

export default StartPage;