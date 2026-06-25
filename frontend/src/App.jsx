import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { checkTimeBoundStatuses, migrateLegacyBookings, getMigrationFlag, setMigrationFlag } from './utils/dataStore';

function App() {
  useEffect(() => {
    if (!getMigrationFlag()) {
      migrateLegacyBookings();
      setMigrationFlag();
    }

    const interval = setInterval(() => {
      checkTimeBoundStatuses();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
