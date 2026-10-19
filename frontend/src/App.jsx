import Login from "./Login";
import SignUp from "./SignUp";
import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, CheckSquare, Settings,
  Search, Bell, Plus, MapPin, CalendarDays, Clock3,
  ExternalLink, Pencil, Trash2, X, ChevronDown,
  GraduationCap,TrendingUp, CircleCheck,
  CircleDashed, Menu
} from "lucide-react";
import "./App.css";



const initialTasks = [

];

const statuses = ["Wishlist", "Applied", "Online Assessment", "Interview", "Offer", "Rejected", "Accepted", "Withdrawn"];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(
  Boolean(localStorage.getItem("accessToken"))
);
  const [applications, setApplications] = useState([]);
const [loadingApplications, setLoadingApplications] = useState(true);

const [applicationError, setApplicationError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setApplicationError("Please log in to view your applications.");
        setLoadingApplications(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications.");
        }

        setApplications(
          (data.applications || []).map((app) => ({
            ...app,
            id: app._id,
            date: app.appliedDate
              ? app.appliedDate.slice(0, 10)
              : "",
            color: "#6478e8",
            stipend: app.stipend || app.salary || "",
          }))
        );
      } catch (error) {
        setApplicationError(error.message);
      } finally {
        setLoadingApplications(false);
      }
    }

    fetchApplications();
  }, []);

  
const [tasks, setTasks] = useState([]);
const [loadingTasks, setLoadingTasks] = useState(true);

useEffect(() => {
  async function fetchTasks() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoadingTasks(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks.");
      }

      setTasks(
        (data.tasks || []).map((task) => ({
          ...task,
          id: task._id,
        }))
      );
    } catch (error) {
      console.error("Fetch tasks error:", error.message);
    } finally {
      setLoadingTasks(false);
    }
  }

  fetchTasks();
}, []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({
    type: "Internship", company: "", role: "", location: "",
    mode: "Remote", status: "Wishlist", stipend: "", date: "", jobUrl: "", notes: ""
  });

  const filtered = useMemo(() => applications.filter((a) => {
    const matchesSearch = `${a.company} ${a.role}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || a.type === filter || a.status === filter;
    return matchesSearch && matchesFilter;
  }), [applications, search, filter]);

  const openAdd = () => {
    setEditing(null);
    setForm({ type: "Internship", company: "", role: "", location: "", mode: "Remote", status: "Wishlist", stipend: "", date: "", jobUrl: "", notes: "" });
    setShowForm(true);
  };

  const openEdit = (application) => {
    setEditing(application.id);
    setForm({ ...application, date: application.date || "" });
    setShowForm(true);
  };


const saveApplication = async (e) => {
  e.preventDefault();

  if (!form.company.trim() || !form.role.trim()) return;

  const token = localStorage.getItem("accessToken");

  if (!token) {
    setApplicationError("Please log in before adding an application.");
    return;
  }

  const payload = {
    type: form.type,
    company: form.company.trim(),
    role: form.role.trim(),
    location: form.location,
    mode: form.mode,
    status: form.status,
    stipend: form.stipend || "",
    appliedDate: form.date || null,
    jobUrl: form.jobUrl || "",
    notes: form.notes || "",
  };

  try {
    const response = await fetch("http://localhost:3000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save application.");
    }

    const saved = data.application;

    setApplications((old) => [
      {
        ...saved,
        id: saved._id,
        date: saved.appliedDate ? saved.appliedDate.slice(0, 10) : "",
        color: "#6478e8",
        stipend: saved.stipend || saved.salary || "",
      },
      ...old,
    ]);

    setApplicationError("");
    setShowForm(false);
  } catch (error) {
    setApplicationError(error.message);
  }
  
};


const deleteApplication = async (id) => {
  if (!window.confirm("Delete this application?")) return;

  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:3000/api/applications/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete application.");
    }

    setApplications((old) => old.filter((a) => a.id !== id));
    setApplicationError("");
  } catch (error) {
    setApplicationError(error.message);
  }
};




const toggleTask = async (id) => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${id}/toggle`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task.");
    }

    setTasks((old) =>
      old.map((task) =>
        task.id === id
          ? { ...task, done: data.task.done }
          : task
      )
    );
  } catch (error) {
    console.error("Toggle task error:", error.message);
    window.alert(error.message || "Could not update task.");
  }
};

  
 
const addTask = async () => {
  const title = window.prompt("What do you need to do?");
  if (!title?.trim()) return;

  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title.trim(),
        due: "Upcoming",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save task.");
    }

    setTasks((old) => [
      { ...data.task, id: data.task._id },
      ...old,
    ]);
  } catch (error) {
    console.error("Add task error:", error.message);
    window.alert(error.message || "Could not save task.");
  }
};


  const stats = [
    { label: "Total Applications", value: applications.length, icon: BriefcaseBusiness, color: "#6478e8", bg: "#eef0ff" },
    { label: "Interviews", value: applications.filter(a => a.status === "Interview").length, icon: CalendarDays, color: "#0f9f84", bg: "#e4f8f2" },
    { label: "Offers", value: applications.filter(a => a.status === "Offer" || a.status === "Accepted").length, icon: CircleCheck, color: "#c17c1b", bg: "#fff4df" },
    { label: "Tasks Pending", value: tasks.filter(t => !t.done).length, icon: CheckSquare, color: "#a35cc8", bg: "#f7eafa" },
  ];
  if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

  return (
    
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><BriefcaseBusiness size={21} /></div><div><strong>TrackMyCareer</strong><small>CAREER WORKSPACE</small></div><button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={18}/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {[
            { label: "Dashboard", icon: LayoutDashboard },
            { label: "Applications", icon: BriefcaseBusiness },
            { label: "Tasks", icon: CheckSquare },
          ].map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${page === label ? "active" : ""}`} onClick={() => { setPage(label); setMobileMenu(false); }}>
              <Icon size={19}/><span>{label}</span>{label === "Tasks" && <span className="nav-count">{tasks.filter(t=>!t.done).length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className={`nav-item ${page === "Settings" ? "active" : ""}`} onClick={() => setPage("Settings")}><Settings size={19}/><span>Settings</span></button>
          <div className="profile"><div className="avatar">SP</div><div className="profile-info"><strong>My Workspace</strong><small>Job seeker</small></div><ChevronDown size={16}/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMobileMenu(true)}><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div>
          <div className="topbar-actions"><span className="today-label"><CalendarDays size={15}/> Career journey, one step at a time</span><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i/></button><div className="avatar top-avatar">SP</div></div>
        </header>

        <div className="content">
        {loadingApplications && (
  <p>Loading your applications...</p>
)}

{applicationError && (
  <p className="error-message">{applicationError}</p>
)}
          {page === "Dashboard" && <>
            <section className="welcome-row"><div><div className="eyebrow">YOUR CAREER OVERVIEW</div><h1>Good morning! <span>✦</span></h1><p>Keep your momentum going. Every application is a step forward.</p></div><button className="primary-button" onClick={openAdd}><Plus size={18}/> Add application</button></section>
            <section className="stats-grid">{stats.map(({ label, value, icon: Icon, color, bg }) => <div className="stat-card" key={label}><div className="stat-top"><span>{label}</span><div style={{ color, background: bg }}><Icon size={19}/></div></div><div className="stat-value">{value}</div><div className="stat-foot"><TrendingUp size={14}/> Keep building your future</div></div>)}</section>
            <section className="dashboard-grid">
              <div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent applications</h2><p>Stay on top of your opportunities</p></div><button className="text-button" onClick={() => setPage("Applications")}>View all <ExternalLink size={14}/></button></div>
                <div className="application-list">{applications.slice(0, 4).map(a => <ApplicationRow key={a.id} app={a} onEdit={openEdit} onDelete={deleteApplication}/>)}</div>
              </div>
              <div className="panel tasks-panel"><div className="panel-heading"><div><h2>Today's focus</h2><p>Small steps add up</p></div><button className="small-add" onClick={addTask}><Plus size={17}/></button></div>
                <div className="task-list">{tasks.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask}/>)}</div>
                <button className="outline-button full-button" onClick={() => setPage("Tasks")}>View all tasks</button>
              </div>
            </section>
            <section className="quote-card"><div className="quote-icon">✦</div><div><strong>Your next opportunity could be one application away.</strong><p>Stay consistent, track your progress, and trust the process.</p></div></section>
          </>}

          {page === "Applications" && <section className="panel page-panel"><div className="page-title-row"><div><div className="eyebrow">YOUR OPPORTUNITIES</div><h1>Applications</h1><p>Manage your jobs and internships in one place.</p></div><button className="primary-button" onClick={openAdd}><Plus size={18}/> Add application</button></div>
            <div className="toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company or role..."/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Job</option><option>Internship</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="table-wrap"><table><thead><tr><th>COMPANY & ROLE</th><th>TYPE</th><th>STATUS</th><th>LOCATION</th><th>ADDED</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(a=><tr key={a.id}><td><div className="company-cell"><div className="company-logo" style={{background:a.color}}>{a.company.slice(0,1)}</div><div><strong>{a.company}</strong><small>{a.role}</small></div></div></td><td>{a.type}</td><td><StatusBadge status={a.status}/></td><td>{a.location || "—"}</td><td>{a.date || "—"}</td><td><div className="row-actions"><button onClick={()=>openEdit(a)} aria-label="Edit"><Pencil size={16}/></button><button onClick={()=>deleteApplication(a.id)} aria-label="Delete"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>
            {filtered.length === 0 && <div className="empty-state">No applications found. Try another filter or add an application.</div>}
          </section>}

          {page === "Tasks" && <section className="panel page-panel"><div className="page-title-row"><div><div className="eyebrow">STAY ORGANIZED</div><h1>My tasks</h1><p>Plan the next step in your career journey.</p></div><button className="primary-button" onClick={addTask}><Plus size={18}/> Add task</button></div><div className="task-progress"><div><strong>{tasks.filter(t=>t.done).length} completed</strong><span>{tasks.filter(t=>!t.done).length} remaining</span></div><div className="progress-track"><div style={{width:`${tasks.length ? tasks.filter(t=>t.done).length/tasks.length*100 : 0}%`}}/></div></div><div className="task-list large-task-list">{tasks.map(t=><TaskRow key={t.id} task={t} onToggle={toggleTask}/>)}</div></section>}

          {page === "Settings" && <section className="panel page-panel"><div className="eyebrow">PREFERENCES</div><h1>Settings</h1><p>Your workspace settings will be available here.</p><div className="settings-card"><GraduationCap size={24}/><div><strong>Career workspace</strong><p>Track jobs, internships, tasks and interview progress.</p></div></div></section>}
        </div>
      </main>


      {showForm && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><div className="modal"><div className="modal-heading"><div><div className="eyebrow">{editing ? "UPDATE DETAILS" : "NEW OPPORTUNITY"}</div><h2>{editing ? "Edit application" : "Add application"}</h2><p>Keep your opportunity details organized.</p></div><button className="icon-button" onClick={()=>setShowForm(false)}><X size={19}/></button></div><form onSubmit={saveApplication}><div className="form-grid"><label>Type *<select required value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Internship</option><option>Job</option></select></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Company *<input required value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="e.g. Google"/></label><label>Role *<input required value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="e.g. Software Engineer Intern"/></label><label>Location<input value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Bengaluru / Remote"/></label><label>Work mode<select value={form.mode||"Remote"} onChange={e=>setForm({...form,mode:e.target.value})}><option>Remote</option><option>Hybrid</option><option>Onsite</option></select></label><label>Salary / stipend<input value={form.stipend||form.salary||""} onChange={e=>setForm({...form,stipend:e.target.value})} placeholder="e.g. ₹25,000/month"/></label><label>Application date<input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})}/></label><label className="wide-label">Job URL<input type="url" value={form.jobUrl||""} onChange={e=>setForm({...form,jobUrl:e.target.value})} placeholder="https://..."/></label><label className="wide-label">Notes<textarea rows="3" value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Recruiter, deadline, preparation notes..."/></label></div><div className="modal-footer"><button type="button" className="outline-button" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="primary-button">
  <Plus size={18} /> Add application
</button></div></form></div></div>}
    </div>
  );
}


function ApplicationRow({ app, onEdit, onDelete }) {
  return <div className="application-row"><div className="company-logo" style={{background:app.color}}>{app.company.slice(0,1)}</div><div className="application-info"><strong>{app.company}</strong><span>{app.role}</span><small><MapPin size={12}/>{app.location} <span>·</span> {app.type}</small></div><div className="application-right"><StatusBadge status={app.status}/><div className="row-actions"><button onClick={()=>onEdit(app)} aria-label="Edit"><Pencil size={14}/></button><button onClick={()=>onDelete(app.id)} aria-label="Delete"><Trash2 size={14}/></button></div></div></div>;
}

function TaskRow({ task, onToggle }) {
  return <div className={`task-row ${task.done ? "task-done" : ""}`}><button className="task-check" onClick={()=>onToggle(task.id)} aria-label={task.done ? "Mark incomplete" : "Mark complete"}>{task.done ? <CircleCheck size={21}/> : <CircleDashed size={21}/>}</button><div className="task-content"><strong>{task.title}</strong><small><Clock3 size={13}/>{task.due}</small></div></div>;
}

function StatusBadge({ status }) {
  const style = { Wishlist: "badge-wishlist", Applied: "badge-applied", "Online Assessment": "badge-assessment", Interview: "badge-interview", Offer: "badge-offer", Accepted: "badge-offer", Rejected: "badge-rejected", Withdrawn: "badge-withdrawn" }[status] || "badge-wishlist";
  return <span className={`status-badge ${style}`}>{status}</span>;
}

export default App;
