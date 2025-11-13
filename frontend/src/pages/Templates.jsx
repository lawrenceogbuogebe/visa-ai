import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, FileText, Search } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Templates = ({ setToken }) => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTemplate, setNewTemplate] = useState({
    visa_type: 'EB1A',
    criterion: '',
    content: ''
  });

  const token = localStorage.getItem('visar_token');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedVisa, searchTerm]);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data);
    } catch (error) {
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;
    
    if (selectedVisa !== 'all') {
      filtered = filtered.filter(t => t.visa_type === selectedVisa);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.criterion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTemplates(filtered);
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/templates`, newTemplate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Template created successfully');
      setShowNew(false);
      setNewTemplate({ visa_type: 'EB1A', criterion: '', content: '' });
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const eb1aCriteria = [
    'Awards', 'Media', 'Judging', 'Original Contributions', 'Scholarly Articles',
    'Critical Role', 'High Remuneration', 'Artistic Exhibitions', 'Leading Role', 'Commercial Success'
  ];

  const eb2niwCriteria = [
    'Advanced Degree', 'Exceptional Ability', 'National Importance', 'Well Positioned', 'Balance of Interests'
  ];

  const o1aCriteria = [
    'Extraordinary Achievement', 'Recognition', 'Critical Role', 'Original Contribution'
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #1a0f0a 100%)' }}>
      <Toaster position="top-center" />

      {/* Navigation Bar */}
      <nav className="glass-strong border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold brand-accent" style={{ fontFamily: 'Space Grotesk' }}>Visar</h1>
              <div className="hidden md:flex gap-4">
                <button
                  data-testid="nav-dashboard-button"
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
                <button
                  data-testid="nav-templates-button"
                  className="text-sm font-medium text-white px-3 py-2 rounded-lg"
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          data-testid="back-button"
          onClick={() => navigate('/dashboard')}
          className="btn-ghost flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk' }}>Template Library</h2>
          <p className="text-base lg:text-lg text-gray-400">Pre-built templates for each visa criterion</p>
        </div>

        {/* Filters and Search */}
        <div className="glass-strong p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Visa Type</label>
              <select
                data-testid="visa-filter-select"
                value={selectedVisa}
                onChange={(e) => setSelectedVisa(e.target.value)}
                className="input-field"
              >
                <option value="all">All Visa Types</option>
                <option value="EB1A">EB-1A</option>
                <option value="EB2NIW">EB-2 NIW</option>
                <option value="O-1A">O-1A</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  data-testid="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Search templates..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Create New Template */}
        <div className="flex justify-end mb-6">
          <Dialog open={showNew} onOpenChange={setShowNew}>
            <DialogTrigger asChild>
              <button data-testid="create-template-button" className="btn-primary flex items-center gap-2">
                <Plus size={18} />
                New Template
              </button>
            </DialogTrigger>
            <DialogContent className="glass-strong text-white border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Space Grotesk' }}>Create New Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Visa Type</label>
                  <select
                    data-testid="template-visa-type-select"
                    value={newTemplate.visa_type}
                    onChange={(e) => setNewTemplate({ ...newTemplate, visa_type: e.target.value, criterion: '' })}
                    className="input-field"
                  >
                    <option value="EB1A">EB-1A</option>
                    <option value="EB2NIW">EB-2 NIW</option>
                    <option value="O-1A">O-1A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Criterion</label>
                  <select
                    data-testid="template-criterion-select"
                    value={newTemplate.criterion}
                    onChange={(e) => setNewTemplate({ ...newTemplate, criterion: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select criterion...</option>
                    {(newTemplate.visa_type === 'EB1A' ? eb1aCriteria :
                      newTemplate.visa_type === 'EB2NIW' ? eb2niwCriteria : o1aCriteria
                    ).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Template Content</label>
                  <textarea
                    data-testid="template-content-textarea"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    className="input-field"
                    placeholder="Enter the template content..."
                    rows={10}
                    required
                  />
                </div>
                <button data-testid="submit-template-button" type="submit" className="btn-primary w-full">
                  Create Template
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="glass p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-gray-400 mb-4">Create your first template to get started</p>
            <button
              data-testid="create-first-template-button"
              onClick={() => setShowNew(true)}
              className="btn-primary"
            >
              Create Template
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template, index) => (
              <div
                key={template.id}
                data-testid={`template-${template.id}`}
                className="glass p-6 fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{template.criterion}</h4>
                    <p className="text-sm text-gray-400">Created {new Date(template.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full brand-bg text-white">
                      {template.visa_type}
                    </span>
                    <button
                      data-testid={`delete-template-${template.id}`}
                      onClick={async () => {
                        if (window.confirm('Delete this template?')) {
                          try {
                            await axios.delete(`${API}/templates/${template.id}`, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            toast.success('Template deleted');
                            fetchTemplates();
                          } catch (error) {
                            toast.error('Failed to delete template');
                          }
                        }
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{template.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
