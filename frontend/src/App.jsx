import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Trash2, CheckCircle, Circle, Plus, Cloud, Activity, Globe, ShieldCheck } from 'lucide-react';

function App() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Work");
  const [tasks, setTasks] = useState([]);
  const [cloudStatus, setCloudStatus] = useState("Connecting...");

  // 1. Fetch Backend Info (Docker/Render Service)
  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        // When you deploy to Render, replace 'localhost:3000' with your Render URL
        const response = await fetch('http://localhost:3000/api/info');
        const data = await response.json();
        setCloudStatus(data.status);
      } catch (error) {
        setCloudStatus("Standalone Mode");
      }
    };
    fetchBackendStatus();
  }, []);

  // 2. Real-time Firebase Sync
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 3. Add Task to Cloud
  const addTask = async (e) => {
    e.preventDefault();
    if (!input) return;
    await addDoc(collection(db, "tasks"), {
      text: input,
      category: category,
      completed: false,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  // 4. Toggle Completion
  const toggleComplete = async (id, currentStatus) => {
    await updateDoc(doc(db, "tasks", id), { completed: !currentStatus });
  };

  // 5. Delete from Cloud
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoGroup}>
            <Cloud size={35} color="#60a5fa" />
            <div>
              <h1 style={styles.title}>CloudNexus <span style={{fontWeight: '300'}}>TaskPro</span></h1>
              <div style={styles.badgeRow}>
                <span style={styles.statusBadge}>
                  <Activity size={10} /> {tasks.length} Tasks
                </span>
                <span style={{...styles.statusBadge, color: '#4ade80'}}>
                  <Globe size={10} /> {cloudStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={addTask} style={styles.form}>
          <div style={styles.inputWrapper}>
            <input 
              style={styles.input} 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Deploy a new task..." 
            />
            <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
              <option>Work</option>
              <option>Urgent</option>
              <option>Private</option>
            </select>
          </div>
          <button type="submit" style={styles.addButton}>
            <Plus size={24} />
          </button>
        </form>

        {/* Task List */}
        <div style={styles.list}>
          {tasks.length === 0 && <p style={styles.emptyText}>No tasks found in cloud storage.</p>}
          {tasks.map(task => (
            <div key={task.id} style={{
              ...styles.taskItem, 
              borderLeft: `4px solid ${task.category === 'Urgent' ? '#ef4444' : '#3b82f6'}`
            }}>
              <div style={styles.taskLeft}>
                <div onClick={() => toggleComplete(task.id, task.completed)} style={styles.checkIcon}>
                  {task.completed ? <CheckCircle size={22} color="#4ade80" /> : <Circle size={22} color="#94a3b8" />}
                </div>
                <div>
                  <div style={{ 
                    ...styles.taskText, 
                    textDecoration: task.completed ? 'line-through' : 'none', 
                    opacity: task.completed ? 0.4 : 1 
                  }}>
                    {task.text}
                  </div>
                  <span style={styles.categoryTag}>{task.category}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div style={styles.footer}>
          <ShieldCheck size={14} /> Encrypted Real-time Cloud Connection
        </div>
      </div>
    </div>
  );
}

// Professional CSS-in-JS Styles
const styles = {
  container: { 
    minHeight: '100vh', 
    background: 'radial-gradient(circle at top right, #1e293b, #0f172a)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px' 
  },
  glassCard: { 
    background: 'rgba(30, 41, 59, 0.7)', 
    backdropFilter: 'blur(12px)', 
    borderRadius: '28px', 
    padding: '40px', 
    width: '100%', 
    maxWidth: '550px', 
    border: '1px solid rgba(255,255,255,0.1)', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
  },
  header: { marginBottom: '30px' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '18px' },
  title: { fontSize: '28px', color: 'white', margin: 0, letterSpacing: '-0.5px' },
  badgeRow: { display: 'flex', gap: '10px', marginTop: '8px' },
  statusBadge: { 
    background: 'rgba(255,255,255,0.05)', 
    padding: '4px 10px', 
    borderRadius: '8px', 
    fontSize: '11px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '5px', 
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  form: { display: 'flex', gap: '12px', marginBottom: '35px' },
  inputWrapper: { flex: 1, display: 'flex', background: '#0f172a', borderRadius: '15px', border: '1px solid #334155', overflow: 'hidden' },
  input: { flex: 1, background: 'transparent', border: 'none', padding: '15px', color: 'white', outline: 'none', fontSize: '15px' },
  select: { background: '#1e293b', color: '#94a3b8', border: 'none', padding: '0 15px', outline: 'none', cursor: 'pointer', fontSize: '13px' },
  addButton: { 
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '15px', 
    width: '55px', 
    cursor: 'pointer', 
    transition: '0.3s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '400px', overflowY: 'auto' },
  taskItem: { 
    background: 'rgba(255,255,255,0.02)', 
    padding: '18px', 
    borderRadius: '18px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    transition: '0.2s',
    border: '1px solid rgba(255,255,255,0.03)'
  },
  taskLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  checkIcon: { cursor: 'pointer', display: 'flex', alignItems: 'center' },
  taskText: { color: 'white', fontSize: '16px', fontWeight: '500' },
  categoryTag: { fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '4px', display: 'block' },
  deleteBtn: { background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px', opacity: 0.7 },
  emptyText: { textAlign: 'center', color: '#475569', fontSize: '14px', marginTop: '20px' },
  footer: { textAlign: 'center', color: '#475569', fontSize: '11px', marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }
};

export default App;