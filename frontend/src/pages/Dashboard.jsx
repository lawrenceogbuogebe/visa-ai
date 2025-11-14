import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Users, BookTemplate, GraduationCap, LogOut, Plus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ setToken }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    visa_type: 'EB1A'
  });

  const token = localStorage.getItem('visar_token');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/clients`, newClient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Client created successfully');
      setShowNewClient(false);
      setNewClient({ name: '', email: '', visa_type: 'EB1A' });
      fetchClients();
    } catch (error) {
      toast.error('Failed to create client');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('visar_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #1a0f0a 100%)' }}>
      <Toaster position="top-center" />

      {/* Navigation Bar */}
      <nav className="glass-strong border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold brand-accent" style={{ fontFamily: 'Space Grotesk' }}>VisaroAI</h1>
              <div className="hidden md:flex gap-4">
                <button
                  data-testid="nav-dashboard-button"
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-white px-3 py-2 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  data-testid="nav-templates-button"
                  onClick={() => navigate('/templates')}
                  className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Templates
                </button>
                <button
                  data-testid="nav-training-button"
                  onClick={() => navigate('/training')}
                  className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Training
                </button>
              </div>
            </div>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk' }}>Welcome to VisaroAI</h2>
          <p className="text-base lg:text-lg text-gray-400">Manage your immigration petition clients and cases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass p-6 fade-in">
            <div className="flex items-center justify-between mb-3">
              <Users className="brand-accent" size={24} />
              <span className="text-2xl font-bold">{clients.length}</span>
            </div>
            <p className="text-sm text-gray-400">Total Clients</p>
          </div>
          <div className="glass p-6 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <FileText className="brand-accent" size={24} />
              <span className="text-2xl font-bold">{clients.filter(c => c.visa_type === 'EB1A').length}</span>
            </div>
            <p className="text-sm text-gray-400">EB-1A Cases</p>
          </div>
          <div className="glass p-6 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3">
              <GraduationCap className="brand-accent" size={24} />
              <span className="text-2xl font-bold">{clients.filter(c => c.visa_type === 'EB2NIW').length}</span>
            </div>
            <p className="text-sm text-gray-400">EB-2 NIW Cases</p>
          </div>
          <div className="glass p-6 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <BookTemplate className="brand-accent" size={24} />
              <span className="text-2xl font-bold">{clients.filter(c => c.visa_type === 'O-1A').length}</span>
            </div>
            <p className="text-sm text-gray-400">O-1A Cases</p>
          </div>
        </div>

        {/* Clients Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Clients</h3>
          <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
            <DialogTrigger asChild>
              <button data-testid="create-client-button" className="btn-primary flex items-center gap-2">
                <Plus size={18} />
                New Client
              </button>
            </DialogTrigger>
            <DialogContent className="glass-strong text-white border-white/20">
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ fontFamily: 'Space Grotesk' }}>Create New Client</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateClient} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name</label>
                  <input
                    data-testid="client-name-input"
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    data-testid="client-email-input"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="input-field"
                    placeholder="client@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Visa Type</label>
                  <select
                    data-testid="client-visa-type-select"
                    value={newClient.visa_type}
                    onChange={(e) => setNewClient({ ...newClient, visa_type: e.target.value })}
                    className="input-field"
                  >
                    <option value="EB1A">EB-1A (Extraordinary Ability)</option>
                    <option value="EB2NIW">EB-2 NIW (National Interest Waiver)</option>
                    <option value="O-1A">O-1A (Extraordinary Achievement)</option>
                  </select>
                </div>
                <button data-testid="submit-client-button" type="submit" className="btn-primary w-full">
                  Create Client
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner" />
          </div>
        ) : clients.length === 0 ? (
          <div className="glass p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">No clients yet</h3>
            <p className="text-gray-400 mb-4">Create your first client to start managing petitions</p>
            <button
              data-testid="create-first-client-button"
              onClick={() => setShowNewClient(true)}
              className="btn-primary"
            >
              Create Client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client, index) => (
              <div
                key={client.id}
                data-testid={`client-card-${client.id}`}
                onClick={() => navigate(`/client/${client.id}`)}
                className="glass card-hover p-6 cursor-pointer fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{client.name}</h4>
                    <p className="text-sm text-gray-400">{client.email}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full brand-bg text-white">
                    {client.visa_type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Created {new Date(client.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
