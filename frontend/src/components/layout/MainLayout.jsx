import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  const session = localStorage.getItem('helloStay_session');

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Left Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <Topbar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
