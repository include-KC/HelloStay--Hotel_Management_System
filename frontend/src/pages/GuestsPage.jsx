function GuestsPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Guests</p>
          <h2 className="dashboard-page-title">Guests</h2>
        </div>

        <p className="dashboard-page-description">
          Guest profiles, guest creation, guest editing, and guest history will
          be built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>Guests module placeholder</h3>
        <p>No guest API calls, forms, search, filters, or CRUD logic are added yet.</p>
      </article>
    </section>
  );
}

export default GuestsPage;