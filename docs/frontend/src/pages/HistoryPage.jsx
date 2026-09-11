function HistoryPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">History</p>
          <h2 className="dashboard-page-title">History</h2>
        </div>

        <p className="dashboard-page-description">
          Past stays, guest activity, room activity, and financial history will
          be built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>History module placeholder</h3>
        <p>No timeline, filters, reports, or historical API logic is added yet.</p>
      </article>
    </section>
  );
}

export default HistoryPage;