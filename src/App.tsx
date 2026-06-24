import { useEffect, useMemo, useState } from "react";
import "./App.css";

/**
 * Defines the only status values allowed for a client.
 * This helps prevent typos and keeps the CRM data consistent.
 */
type ClientStatus = "Prospect" | "Active" | "Follow Up" | "Closed";

/**
 * Defines the structure of a client record.
 * This should match the data coming from the Express backend.
 */
type Client = {
  id: number;
  name: string;
  business: string;
  email: string;
  phone: string;
  status: ClientStatus;
  notes: string;
};

/**
 * Converts a full name into initials.
 * Example: "Maurica Bellaphant" becomes "MB".
 */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function App() {
  /**
   * Stores the client list returned from the backend API.
   */
  const [clients, setClients] = useState<Client[]>([]);

  /**
   * Stores the search text entered by the user.
   */
  const [search, setSearch] = useState("");

  /**
   * Stores form data for creating a new client.
   */
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    status: "Prospect" as ClientStatus,
    notes: "",
  });

  /**
   * Tracks which client is currently being edited.
   * null means no client is being edited.
   */
  const [editingId, setEditingId] = useState<number | null>(null);

  /**
   * Stores form data while editing an existing client.
   */
  const [editForm, setEditForm] = useState({
    business: "",
    email: "",
    phone: "",
    notes: "",
  });

  /**
   * Loads client data from the Express backend when the app first opens.
   */
  useEffect(() => {
    fetch("http://localhost:5000/api/clients")
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Failed to load clients:", error));
  }, []);

  /**
   * Filters clients based on the search input.
   */
  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.business} ${client.email} ${client.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /**
   * Calculates dashboard statistics.
   * useMemo prevents recalculating unless the clients array changes.
   */
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

  /**
   * Creates a new client by sending form data to the backend API.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.business || !form.email) {
      alert("Please fill out name, business, and email.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const newClient = await response.json();

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

  /**
   * Deletes a client from the backend and removes it from the UI.
   */
  async function deleteClient(id: number) {
    await fetch(`http://localhost:5000/api/clients/${id}`, {
      method: "DELETE",
    });

    setClients(clients.filter((client) => client.id !== id));
  }

  /**
   * Updates only the client's status.
   */
  async function updateClientStatus(id: number, status: ClientStatus) {
    const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const updatedClient = await response.json();

    setClients(
      clients.map((client) => (client.id === id ? updatedClient : client))
    );
  }

  /**
   * Opens edit mode and fills the edit form with the selected client's data.
   */
  function startEditing(client: Client) {
    setEditingId(client.id);

    setEditForm({
      business: client.business,
      email: client.email,
      phone: client.phone,
      notes: client.notes,
    });
  }

  /**
   * Saves edited client details to the backend.
   */
  async function saveClientEdits(id: number) {
    const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    const updatedClient = await response.json();

    setClients(
      clients.map((client) => (client.id === id ? updatedClient : client))
    );

    setEditingId(null);
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

                    {editingId === client.id ? (
                      <div className="edit-fields">
                        <input
                          value={editForm.business}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              business: e.target.value,
                            })
                          }
                          placeholder="Business"
                        />

                        <input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="Email"
                        />

                        <input
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Phone"
                        />

                        <textarea
                          value={editForm.notes}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Notes"
                        />

                        <div className="edit-actions">
                          <button onClick={() => saveClientEdits(client.id)}>
                            Save
                          </button>

                          <button onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong>{client.business}</strong>

                        <div className="client-meta">
                          <span>✉ {client.email}</span>
                          <span>📞 {client.phone || "Not provided"}</span>
                        </div>

                        <p>▣ {client.notes}</p>

                        <button
                          className="edit-btn"
                          onClick={() => startEditing(client)}
                        >
                          Edit Client
                        </button>
                      </>
                    )}
                  </div>

                  <select
                    className={`status ${client.status
                      .replace(" ", "-")
                      .toLowerCase()}`}
                    value={client.status}
                    onChange={(e) =>
                      updateClientStatus(
                        client.id,
                        e.target.value as ClientStatus
                      )
                    }
                  >
                    <option>Prospect</option>
                    <option>Active</option>
                    <option>Follow Up</option>
                    <option>Closed</option>
                  </select>

                  <button
                    className="dots"
                    onClick={() => deleteClient(client.id)}
                  >
                    ×
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