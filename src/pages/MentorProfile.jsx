import React, { useState, useEffect, useRef } from "react";

export default function MentorProfile() {
  const defaultMentor = {
    name: "Prof. Sharma",
    dept: "CSE",
    id: "MTR-001",
    mobile: "",
    email: "",
    photo: ""
  };

  const [mentor, setMentor] = useState(defaultMentor);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  // Load from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem("mentor");
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        setMentor((prev) => ({ ...prev, ...obj }));
        setPreview(obj.photo || "");
      } catch (_) {}
    }
  }, []);

  // Render initials when no photo
  const getInitials = () => {
    return (mentor.name || "M")
      .split(" ")
      .map((x) => x[0] || "")
      .join("")
      .toUpperCase();
  };

  // Handle image upload
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result); // base64
      setMentor({ ...mentor, photo: ev.target.result });
    };
    reader.readAsDataURL(f);
  };

  // Handle URL input
  const handleUrlChange = (v) => {
    setPreview(v);
  };

  // Save button
  const saveDetails = () => {
    const urlInput = document.getElementById("photoUrlInput").value.trim();
    const finalPhoto = urlInput ? urlInput : mentor.photo;

    const updated = {
      ...mentor,
      photo: finalPhoto
    };

    localStorage.setItem("mentor", JSON.stringify(updated));
    window.location.href = "/dashboard"; // adjust route if needed
  };

  return (
    <div className="container" style={{ padding: "40px" }}>
      {/* STYLE */}
      <style>{`
        .profile-page-full{max-width:900px;margin:40px auto;padding:24px;background:#262C53;border-radius:12px;color:white}
        .profile-photo-large{width:180px;height:180px;border-radius:50%;background:#071124;display:flex;align-items:center;justify-content:center;font-weight:700;color:#a0aac0;font-size:40px;overflow:hidden}
        .photo-edit-btn{display:inline-block;margin:10px auto 0 auto;background:rgba(0,0,0,0.5);border-radius:8px;padding:8px 12px;cursor:pointer;border:1px solid rgba(255,255,255,0.06);text-align:center}
        .field-row{display:flex;flex-direction:column;margin-top:12px}
        .field-row label{font-size:13px;color:#9aa3be;margin-bottom:6px}
        .field-row input{padding:10px;border-radius:8px;border:1px solid rgba(162,244,249,0.06);background:#071124;color:white}
        .btn-row{display:flex;gap:10px;margin-top:18px}
        .btn-primary{background:#A2F4F9;border:none;border-radius:8px;padding:10px 14px;cursor:pointer;color:#071124;font-weight:600}
        .btn-secondary{background:#444a68;border:none;border-radius:8px;padding:10px 14px;cursor:pointer;color:white}
        .small-link{color:#A2F4F9;cursor:pointer;text-decoration:none}
        input[type=file]{display:none}
      `}</style>

      <div className="profile-page-full">
        {/* Back Link */}
        <div className="topbar-back">
          <a href="/dashboard" className="small-link">
            ← Back to Dashboard
          </a>
        </div>

        {/* MAIN SECTION */}
        <div style={{ display: "flex", gap: "30px", alignItems: "center", flexWrap: "wrap" }}>

          {/* PHOTO SECTION */}
          <div>
            <div className="profile-photo-large">
              {preview ? (
                <img
                  src={preview}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  alt="Profile"
                />
              ) : (
                getInitials()
              )}
            </div>

            <div className="photo-edit-btn" onClick={() => fileInputRef.current.click()}>
              ✎ Edit
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* FORM SECTION */}
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div className="field-row">
              <label>Name</label>
              <input
                value={mentor.name}
                onChange={(e) => setMentor({ ...mentor, name: e.target.value })}
              />
            </div>

            <div className="field-row">
              <label>Mentor ID</label>
              <input
                value={mentor.id}
                onChange={(e) => setMentor({ ...mentor, id: e.target.value })}
              />
            </div>

            <div className="field-row">
              <label>Department</label>
              <input
                value={mentor.dept}
                onChange={(e) => setMentor({ ...mentor, dept: e.target.value })}
              />
            </div>

            <div className="field-row">
              <label>Mobile</label>
              <input
                value={mentor.mobile}
                onChange={(e) => setMentor({ ...mentor, mobile: e.target.value })}
              />
            </div>

            <div className="field-row">
              <label>Email</label>
              <input
                value={mentor.email}
                onChange={(e) => setMentor({ ...mentor, email: e.target.value })}
              />
            </div>

            <div className="field-row">
              <label>Photo URL (optional)</label>
              <input
                id="photoUrlInput"
                placeholder="https://..."
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </div>

            <div className="btn-row">
              <button className="btn-primary" onClick={saveDetails}>
                Save
              </button>

              <a href="/dashboard">
                <button className="btn-secondary">Cancel</button>
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "10px", color: "#93a3c9", fontSize: "13px" }}>
          You can upload an image or provide an image link. The preview updates instantly.
        </div>
      </div>
    </div>
  );
}
