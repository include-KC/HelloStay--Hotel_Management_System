function DashboardHome() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Overview</p>
          <h2 className="dashboard-page-title">Dashboard Home</h2>
        </div>

        <p className="dashboard-page-description">
          This is the future overview screen for hotel activity, occupancy,
          income, and daily operations.
        </p>
      </div>

      <div className="dashboard-placeholder-grid">
        <article className="dashboard-placeholder-card">
          <h3>Rooms Summary</h3>
          <p>Room metrics will be added in a future milestone.</p>
        </article>

        <article className="dashboard-placeholder-card">
          <h3>Guest Activity</h3>
          <p>Guest check-in and stay activity will appear here later.</p>
        </article>

        <article className="dashboard-placeholder-card">
          <h3>Finance Snapshot</h3>
          <p>Income and payment summaries will be added later.</p>
        </article>
      </div>
    </section>
  );
}

export default DashboardHome;