import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

/* =========================
   ADMIN
========================= */

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageEvents from "./pages/admin/ManageEvents";
import AddEvent from "./pages/admin/AddEvent";
import EditEvent from "./pages/admin/EditEvent";

import AddGroup from "./pages/admin/AddGroup";
import EditGroup from "./pages/admin/EditGroup";
import ManageGroups from "./pages/admin/ManageGroups";

/* =========================
   PUBLIC
========================= */

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

/* =========================
   STUDENT
========================= */

import Connections from "./pages/Connections";
import Events from "./pages/Events";
import Feed from "./pages/Feed";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import Students from "./pages/Students";


/* =========================
   STUDENT ROUTE PROTECTION
========================= */

function StudentRoute({ children }) {
  const {
    currentUser,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <p>Loading Campus Connect...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


/* =========================
   APP
========================= */

function App() {
  return (
    <MainLayout>
      <Routes>

        {/* =====================
            PUBLIC
        ====================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =====================
            STUDENT
        ====================== */}

        <Route
          path="/students"
          element={
            <StudentRoute>
              <Students />
            </StudentRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <StudentRoute>
              <Feed />
            </StudentRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <StudentRoute>
              <Groups />
            </StudentRoute>
          }
        />

        <Route
          path="/events"
          element={
            <StudentRoute>
              <Events />
            </StudentRoute>
          }
        />

        <Route
          path="/connections"
          element={
            <StudentRoute>
              <Connections />
            </StudentRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <StudentRoute>
              <Notifications />
            </StudentRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <StudentRoute>
              <Profile />
            </StudentRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <StudentRoute>
              <Profile />
            </StudentRoute>
          }
        />

        <Route
          path="/search"
          element={
            <StudentRoute>
              <SearchPage />
            </StudentRoute>
          }
        />


        {/* =====================
            ADMIN
        ====================== */}

        <Route element={<AdminRoute />}>

          {/* Dashboard */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* Students */}
          <Route
            path="/admin/students"
            element={<ManageStudents />}
          />

          {/* Events */}
          <Route
            path="/admin/events"
            element={<ManageEvents />}
          />

          <Route
            path="/admin/events/add"
            element={<AddEvent />}
          />

          <Route
            path="/admin/events/edit/:id"
            element={<EditEvent />}
          />

          {/* Groups */}
          <Route
            path="/admin/groups"
            element={<ManageGroups />}
          />

          <Route
            path="/admin/groups/add"
            element={<AddGroup />}
          />

          <Route
            path="/admin/groups/edit/:id"
            element={<EditGroup />}
          />

        </Route>


        {/* =====================
            FALLBACK
        ====================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </MainLayout>
  );
}

export default App;