import React, { useState, useEffect, useCallback } from 'react'; // <-- ✅ FIXED
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import CertificateItem from '../components/CertificateItem';

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // ✅ Define fetchCertificates using useCallback
  const fetchCertificates = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .storage
      .from('certificates')
      .list(`${user.id}/`, { limit: 100 });

    if (error) console.error(error);
    else setCertificates(data);
    console.log("Fetched certs:", data);
  }, [navigate]); // <-- ✅ DON'T FORGET THIS PART

  // ✅ Call fetchCertificates on mount
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // ✅ Upload handler
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const { data: { user } } = await supabase.auth.getUser();
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage.from('certificates').upload(filePath, file);

    if (error) alert(error.message);
    else {
      alert("Upload successful!");
      fetchCertificates(); // Refresh after upload
    }
  };

  // ✅ Delete handler
  const handleDelete = async (certName) => {
    const { data: { user } } = await supabase.auth.getUser();
    const filePath = `${user.id}/${certName}`;

    const { error } = await supabase
      .storage
      .from('certificates')
      .remove([filePath]);

    if (error) {
      console.error("Delete failed:", error.message);
      alert("Failed to delete certificate.");
    } else {
      alert("Certificate deleted!");
      fetchCertificates(); // Refresh list
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Welcome to CredHex</h2>
      <button onClick={handleLogout}>Logout</button>

      <div>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <button onClick={handleUpload}>Upload Certificate</button>
      </div>

      <div>
        <h3>Your Certificates:</h3>
        <ul>
          {certificates.map((cert) => {
  console.log("Rendering:", cert);
  return (
    <CertificateItem
      key={cert.name}
      name={cert.name}
      url={`https://kyldpqktdyeenixuovce.supabase.co/storage/v1/object/public/certificates/${userId}/${cert.name}`}
      onDelete={handleDelete}
    />
  );
})}

        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
