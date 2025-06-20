"use client";

import { useState } from 'react';
import StudentRegistrationForm from "@/components/StudentsRegistrationForm";
import StudentListPage from "@/components/StudentsList";

export default function Home() {
  const [activeTab, setActiveTab] = useState('register'); // Track which tab is active

  return (
    <div className="container-fluid min-vh-100">
      {/* Header with custom styles */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#0a2d3d' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#" style={{ color: 'white' }}>Student Portal</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      <div className="row flex-grow-1">
        {/* Sidebar */}
        <div className="col-md-3 bg-light p-4" style={{ borderRight: '2px solid #ddd' }}>
          <h4 className="mb-4" style={{ color: '#0a2d3d' }}>Navigation</h4>
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
              style={{
                cursor: 'pointer',
                backgroundColor: activeTab === 'register' ? '#0a2d3d' : '',
                color: activeTab === 'register' ? 'white' : '',
                border: 'none',
              }}
            >
              Register Student
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
              style={{
                cursor: 'pointer',
                backgroundColor: activeTab === 'view' ? '#0a2d3d' : '',
                color: activeTab === 'view' ? 'white' : '',
                border: 'none',
              }}
            >
              View Students
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-4">
          {activeTab === 'register' && (
            <StudentRegistrationForm onSubmitSuccess={() => setActiveTab('view')} />
          )}
          {activeTab === 'view' && (
            <StudentListPage />
          )}
        </div>
      </div>
    </div>
  );
}
