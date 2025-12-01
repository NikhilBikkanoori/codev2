import React from "react";

export default function StudentProfile() {
  return (
    <div style={{ background: "#192047", minHeight: "100vh", margin: 0 }}>
      <style>{`
        :root {
          --bg: #192047;
          --card: #262C53;
          --soft: #1a2349;
          --highlight: #A2F4F9;
          --text: #F7FAFC;
          --radius: 14px;
        }

        body {
          margin: 0;
          font-family: Inter, Segoe UI, Arial;
        }

        .topbar {
          background: var(--card);
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .brand {
          font-size: 20px;
          font-weight: 600;
          color: var(--highlight);
        }

        .container {
          max-width: 900px;
          margin: 40px auto;
          background: var(--card);
          padding: 30px;
          border-radius: var(--radius);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .profile-photo {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: var(--highlight);
          margin: 0 auto 18px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: var(--card);
          font-weight: 700;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        table td {
          padding: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          font-size: 16px;
        }

        table td:first-child {
          color: var(--highlight);
          width: 30%;
          font-weight: 600;
        }

        .back-btn {
          margin-top: 25px;
          padding: 10px 18px;
          background: var(--highlight);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: var(--card);
        }

        .back-btn:hover {
          opacity: 0.85;
        }
      `}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">DropShield — Profile</div>
        <button 
          className="back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* PROFILE CONTAINER */}
      <div className="container">
        <div className="profile-header">
          <div className="profile-photo">A</div>
          <h2 style={{ margin: 0 }}>Alice Kumar</h2>
          <p style={{ marginTop: 4, opacity: 0.8 }}>CSE — 2nd Year</p>
        </div>

        <table>
          <tbody>
            <tr>
              <td>Student ID</td>
              <td>22CSE1025</td>
            </tr>
            <tr>
              <td>Mobile Number</td>
              <td>9876543210</td>
            </tr>
            <tr>
              <td>Email ID</td>
              <td>alice.kumar@example.com</td>
            </tr>
            <tr>
              <td>Year</td>
              <td>2nd Year</td>
            </tr>
            <tr>
              <td>Branch</td>
              <td>Computer Science Engineering</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
