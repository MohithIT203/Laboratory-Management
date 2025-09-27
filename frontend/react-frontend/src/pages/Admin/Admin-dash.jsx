import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  MapPin,
  Clock,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin-dash.css";
import AdminAppBar from "../../components/Admin_navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalLocations: 0,
    totalSlots: 0,
  });

  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
   fetchData();
  }, []);

  const fetchData = async()=>{
     setAnimateCards(true);
    try{
      const res = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/stats`);     
      setDashboardData(res.data);
    }
    catch(err){
      console.log(err);
    }
  }
  const handleNavigation = (page) => {
    navigate(page);
  };

  // Stats Card Component
  const StatCard = ({ icon: Icon, count, label, delay }) => (
    <div
      className={`stat-card ${animateCards ? "animate" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="stat-card-content">
        <div className="stat-icon">
          <Icon size={28} strokeWidth={2} />
        </div>
        <div className="stat-count">{count}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );

  // Nav Card Component
  const NavCard = ({ icon: Icon, title, description, page }) => (
    <div className="nav-card" onClick={() => handleNavigation(page)}>
      <div className="nav-card-content">
        <div className="nav-card-header">
          <div className="nav-icon">
            <Icon size={24} strokeWidth={2} />
          </div>
          <div className="nav-arrow">→</div>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <>
    <AdminAppBar/>
    <div className="dashboard-container-1">
      <div className="dashboard-inner">
        {/* Header */}
        <header className="dashboard-headers">
          <div className="dashboard-title">Hello , Welcome Back!</div>
          <div className="dashboard-subtitle">Admin</div>
        </header>

        {/* Stats */}
        <section className="stats-section">
          <h2>System Overview</h2>
          <div className="stats-grid">
            <StatCard
              icon={GraduationCap}
              count={dashboardData.totalStudents}
              label="Active Students"
              delay={0.1}
            />
            <StatCard
              icon={Users}
              count={dashboardData.totalTeachers}
              label="Faculty Members"
              delay={0.2}
            />
            <StatCard
              icon={BookOpen}
              count={dashboardData.totalCourses}
              label="Course Modules"
              delay={0.3}
            />
            <StatCard
              icon={MapPin}
              count={dashboardData.totalLocations}
              label="Lab Locations"
              delay={0.4}
            />
            <StatCard
              icon={Clock}
              count={dashboardData.totalSlots}
              label="Time Slots"
              delay={0.5}
            />
          </div>
        </section>

        {/* Management Modules */}
        <section className="modules-section">
          <h2>Management Modules</h2>
          <div className="modules-grid">
            <NavCard
              icon={Users}
              title="Faculty Management"
              description="Manage teachers - add, edit, and remove faculty"
              page="/Admin/Users"
            />
            <NavCard
              icon={GraduationCap}
              title="Student Portal"
              description="Manage students with enrollment and updates"
              page="/Admin/Users"
            />
            <NavCard
              icon={Clock}
              title="Schedule Manager"
              description="View and update slot allocations & attendance"
              page="/Admin/all-slots"
            />
            <NavCard
              icon={BookOpen}
              title="Course & Lab Hub"
              description="Manage courses and lab locations"
              page="/Admin/courses"
            />
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
