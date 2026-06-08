import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // States for storing data
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', rollNo: '', branch: '' });
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/students';

  // 1. GET ALL STUDENTS FROM DATABASE
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Data fetch karne mein error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. HANDLE FORM INPUT CHANGES
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SUBMIT DATA (POST API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData);
      setMessage(response.data.message);
      setFormData({ name: '', rollNo: '', branch: '' }); // Form khali karna
      fetchStudents(); // Table refresh karna naye data ke sath
      setTimeout(() => setMessage(''), 3000); // 3 sec baad message gayab
    } catch (error) {
      setMessage(error.response?.data?.message || "Kuch galti hui!");
    }
  };

  // 4. DELETE STUDENT FROM DATABASE
  const handleDelete = async (rollNo) => {
    try {
      const response = await axios.delete(`${API_URL}/${rollNo}`);
      alert(response.data.message);
      fetchStudents(); // Table refresh karna
    } catch (error) {
      console.error("Delete karne mein error:", error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🎓 Student Management System</h1>
      
      {/* Success/Error Message */}
      {message && <div style={{ padding: '10px', margin: '10px 0', backgroundColor: '#e1f5fe', color: '#0288d1', borderRadius: '5px', textAlign: 'center' }}>{message}</div>}

      {/* === ADD STUDENT FORM === */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Naya Student Add Karo</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} required />
          <input type="text" name="rollNo" placeholder="Roll Number" value={formData.rollNo} onChange={handleChange} style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} required />
          <input type="text" name="branch" placeholder="Branch (e.g. CS, IT)" value={formData.branch} onChange={handleChange} style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} required />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add Student</button>
        </form>
      </div>

      {/* === STUDENTS LIST TABLE === */}
      <h3>Registered Students List</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Roll No</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Branch</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Database mein koi student nahi mila. Form se add kijiye!</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{student.name}</td>
                <td style={{ padding: '12px' }}>{student.rollNo}</td>
                <td style={{ padding: '12px' }}>{student.branch}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => handleDelete(student.rollNo)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;