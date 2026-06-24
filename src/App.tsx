import { useEffect, useMemo, useState } from "react";
import "./App.css";

type ClientStatus = "Prospect" | "Active" | "Follow Up" | "Closed";

type Client = {
  id: number;
  name: string;
  business: string;
  email: string;
  phone: string;
  status: ClientStatus;
  notes: string;
};

const starterClients: Client[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    business: "Johnson Beauty Studio",
    email: "sarah@beautystudio.com",
    phone: "515-555-0142",
    status: "Active",
    notes: "Interested in website redesign and AI appointment automation.",
  },
  {
    id: 2,
    name: "Marcus Lee",
    business: "Lee Home Services",
    email: "marcus@leehomeservices.com",
    phone: "612-555-0198",
    status: "Prospect",
    notes: "Needs CRM setup and follow-up automation for leads.",
  },
  {
    id: 3,
    name: "Amanda Wilson",
    business: "Wilson Co. Designs",
    email: "amanda@wilsondesigns.com",
    phone: "704-555-0173",
    status: "Follow Up",
    notes: "Follow up about branding package and website project.",
  },
  {
    id: 4,
    name: "David Thompson",
    business: "Thompson Real Estate",
    email: "david@thompsonre.com",
    phone: "320-555-0184",
    status: "Active",
    notes: "Monthly retainer for marketing and lead generation.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function App() {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem("clientCrmClients");
    return saved ? JSON.parse(saved) : starterClients;
  });

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    status: "Prospect" as ClientStatus,
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem("clientCrmClients", JSON.stringify(clients));
  }, [clients]);

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.business} ${client.email} ${client.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter((client) => client.status === "Active").length,
      prospects: clients.filter((client) => client.status === "Prospect")
        .length,
      followUps: clients.filter((client) => client.status === "Follow Up")
        .length,
    };
  }, [clients]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.business || !form.email) {
      alert("Please fill out name, business, and email.");
      return;
    }

    const newClient: Client = {
      id: Date.now(),
      ...form,
    };

    setClients([newClient, ...clients]);

    setForm({
      name: "",
      business: "",
      email: "",
      phone: "",
      status: "Prospect",
      notes: "",
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="crown">♛</div>
          <h2>LTM AI STUDIO</h2>
          <p>Solutions That Scale</p>
        </div>

        <nav className="nav">
          <button className="nav-item active">▦ Dashboard</button>
          <button className="nav-item">👤 Clients</button>
          <button className="nav-item">👥 Leads</button>
          <button className="nav-item">📅 Follow Ups</button>
          <button className="nav-item">📝 Notes</button>
          <button className="nav-item">📊 Reports</button>
          <button className="nav-item">⚙ Settings</button>
        </nav>

        <div className="profile-card">
          <div className="monogram">MB</div>
          <strong>Maurica Bellaphant</strong>
          <span>Full-Stack Developer</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn">☰</button>

          <div className="user-menu">
            <div className="user-initials">MB</div>
            <span>Maurica Bellaphant</span>
            <span>⌄</span>
          </div>
        </header>

        <section className="hero">
          <h1>
            <span>Client</span> CRM
          </h1>
          <p>Manage your clients, leads, and business relationships.</p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <span>Total Clients</span>
              <strong>{stats.total}</strong>
              <p>All clients</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div>
              <span>Active Clients</span>
              <strong>{stats.active}</strong>
              <p>Currently active</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gold-icon">★</div>
            <div>
              <span>Prospects</span>
              <strong>{stats.prospects}</strong>
              <p>New opportunities</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gold-icon">📅</div>
            <div>
              <span>Follow Ups</span>
              <strong>{stats.followUps}</strong>
              <p>Require attention</p>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <form className="panel form-panel" onSubmit={handleSubmit}>
            <h2>👤 Add New Client</h2>

            <label>
              Client Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter client name"
              />
            </label>

            <label>
              Business
              <input
                value={form.business}
                onChange={(e) =>
                  setForm({ ...form, business: e.target.value })
                }
                placeholder="Enter business name"
              />
            </label>

            <label>
              Email
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email address"
              />
            </label>

            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ClientStatus })
                }
              >
                <option>Prospect</option>
                <option>Active</option>
                <option>Follow Up</option>
                <option>Closed</option>
              </select>
            </label>

            <label>
              Notes
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Add notes about the client, services needed, timeline, budget..."
              />
            </label>

            <button type="submit" className="primary-btn">
              + Add Client
            </button>
          </form>

          <section className="panel pipeline-panel">
            <div className="panel-title">
              <h2>Client Pipeline</h2>
            </div>

            <input
              className="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search clients by name, business, or email..."
            />

            <div className="client-list">
              {filteredClients.map((client) => (
                <article className="client-card" key={client.id}>
                  <div className="avatar">{getInitials(client.name)}</div>

                  <div className="client-info">
                    <h3>{client.name}</h3>
                    <strong>{client.business}</strong>

                    <div className="client-meta">
                      <span>✉ {client.email}</span>
                      <span>📞 {client.phone || "Not provided"}</span>
                    </div>

                    <p>▣ {client.notes}</p>
                  </div>

                  <span
                    className={`status ${client.status
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >
                    {client.status}
                  </span>

                  <button
                    className="dots"
                    onClick={() =>
                      setClients(
                        clients.filter((saved) => saved.id !== client.id)
                      )
                    }
                  >
                    ⋯
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>

        <footer>© 2026 LTM AI Studio. Built by Maurica Bellaphant.</footer>
      </main>
    </div>
  );
}

export default App;