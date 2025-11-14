import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Training = ({ setToken }) => {
  const navigate = useNavigate();
  const [trainingDocs, setTrainingDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    doc_type: 'successful',
    doc_category: 'petition',
    visa_type: 'EB2NIW'
  });
  const [pasteData, setPasteData] = useState({
    title: '',
    doc_type: 'successful',
    doc_category: 'precedent_decision',
    visa_type: 'EB2NIW',
    content: ''
  });

  const token = localStorage.getItem('visar_token');

  useEffect(() => {
    fetchTrainingDocs();
  }, []);

  const fetchTrainingDocs = async () => {
    try {
      const response = await axios.get(`${API}/training/docs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainingDocs(response.data);
    } catch (error) {
      toast.error('Failed to fetch training documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', uploadData.doc_type);
    formData.append('doc_category', uploadData.doc_category);
    formData.append('visa_type', uploadData.visa_type);

    try {
      await axios.post(`${API}/training/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Training document uploaded and indexed successfully');
      setShowUpload(false);
      setSelectedFile(null);
      setUploadData({ doc_type: 'successful', doc_category: 'petition', visa_type: 'EB2NIW' });
      fetchTrainingDocs();
    } catch (error) {
      toast.error('Failed to upload training document');
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    if (!pasteData.content.trim() || !pasteData.title.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setUploading(true);

    try {
      await axios.post(`${API}/training/paste`, pasteData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Training text added and indexed successfully');
      setShowUpload(false);
      setPasteData({
        title: '',
        doc_type: 'successful',
        doc_category: 'precedent_decision',
        visa_type: 'EB2NIW',
        content: ''
      });
      fetchTrainingDocs();
    } catch (error) {
      toast.error('Failed to add training text');
    } finally {
      setUploading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'petition': { label: 'Petition', color: 'bg-blue-500' },
      'non_precedent_decision': { label: 'Non-Precedent', color: 'bg-purple-500' },
      'precedent_decision': { label: 'Precedent', color: 'bg-yellow-500' },
      'aao_decision': { label: 'AAO Decision', color: 'bg-pink-500' }
    };
    return badges[category] || badges['petition'];
  };

  const successfulDocs = trainingDocs.filter(d => d.doc_type === 'successful');
  const unsuccessfulDocs = trainingDocs.filter(d => d.doc_type === 'unsuccessful');

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
                  className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
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
                  className="text-sm font-medium text-white px-3 py-2 rounded-lg"
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk' }}>Training Database</h2>
          <p className="text-base lg:text-lg text-gray-400">Upload petitions and USCIS decisions to improve AI generation quality</p>
        </div>

        {/* Info Banner */}
        <div className="glass-strong p-6 mb-8 border-l-4 border-brand-accent">
          <h3 className="font-semibold mb-2 brand-accent">How Training Works</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• <strong>Petitions:</strong> Your past successful/unsuccessful petition documents</li>
            <li>• <strong>Precedent Decisions:</strong> AAO and USCIS precedent-setting decisions (e.g., Matter of Dhanasar)</li>
            <li>• <strong>Non-Precedent Decisions:</strong> Other USCIS administrative decisions</li>
            <li>• <strong>AAO Decisions:</strong> Administrative Appeals Office rulings</li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">The AI learns writing style, structure, and successful arguments from these documents.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="text-green-500" size={24} />
              <span className="text-2xl font-bold">{successfulDocs.length}</span>
            </div>
            <p className="text-sm text-gray-400">Successful</p>
          </div>
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-3">
              <XCircle className="text-red-500" size={24} />
              <span className="text-2xl font-bold">{unsuccessfulDocs.length}</span>
            </div>
            <p className="text-sm text-gray-400">Unsuccessful</p>
          </div>
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-3">
              <FileText className="text-yellow-500" size={24} />
              <span className="text-2xl font-bold">{trainingDocs.filter(d => d.doc_category === 'precedent_decision').length}</span>
            </div>
            <p className="text-sm text-gray-400">Precedent Decisions</p>
          </div>
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-3">
              <FileText className="brand-accent" size={24} />
              <span className="text-2xl font-bold">{trainingDocs.length}</span>
            </div>
            <p className="text-sm text-gray-400">Total Documents</p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <button data-testid="upload-training-button" className="btn-primary flex items-center gap-2">
                <Upload size={18} />
                Add Training Data
              </button>
            </DialogTrigger>
            <DialogContent className="glass-strong text-white border-white/20 max-w-3xl">
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Space Grotesk' }}>Add Training Data</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="upload" className="mt-4">
                <TabsList className="glass-strong border border-white/10 mb-4">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Document Type</label>
                      <select
                        data-testid="doc-type-select"
                        value={uploadData.doc_type}
                        onChange={(e) => setUploadData({ ...uploadData, doc_type: e.target.value })}
                        className="input-field"
                      >
                        <option value="successful">Successful</option>
                        <option value="unsuccessful">Unsuccessful</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        data-testid="category-select"
                        value={uploadData.doc_category}
                        onChange={(e) => setUploadData({ ...uploadData, doc_category: e.target.value })}
                        className="input-field"
                      >
                        <option value="petition">Petition Document</option>
                        <option value="precedent_decision">Precedent Decision</option>
                        <option value="non_precedent_decision">Non-Precedent Decision</option>
                        <option value="aao_decision">AAO Decision</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Visa Type</label>
                      <select
                        data-testid="training-visa-type-select"
                        value={uploadData.visa_type}
                        onChange={(e) => setUploadData({ ...uploadData, visa_type: e.target.value })}
                        className="input-field"
                      >
                        <option value="EB2NIW">EB-2 NIW</option>
                        <option value="EB1A">EB-1A</option>
                        <option value="O-1A">O-1A</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Choose File</label>
                      <input
                        data-testid="training-file-input"
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="input-field"
                        accept=".pdf,.docx,.doc,.txt"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">Supported: PDF, DOCX, DOC, TXT</p>
                    </div>
                    <button
                      data-testid="submit-training-button"
                      type="submit"
                      className="btn-primary w-full"
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading & Indexing...' : 'Upload'}
                    </button>
                  </form>
                </TabsContent>

                <TabsContent value="paste">
                  <form onSubmit={handlePaste} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title/Name</label>
                      <input
                        data-testid="paste-title-input"
                        type="text"
                        value={pasteData.title}
                        onChange={(e) => setPasteData({ ...pasteData, title: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Matter of Dhanasar"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Document Type</label>
                      <select
                        data-testid="paste-doc-type-select"
                        value={pasteData.doc_type}
                        onChange={(e) => setPasteData({ ...pasteData, doc_type: e.target.value })}
                        className="input-field"
                      >
                        <option value="successful">Successful</option>
                        <option value="unsuccessful">Unsuccessful</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        data-testid="paste-category-select"
                        value={pasteData.doc_category}
                        onChange={(e) => setPasteData({ ...pasteData, doc_category: e.target.value })}
                        className="input-field"
                      >
                        <option value="petition">Petition Document</option>
                        <option value="precedent_decision">Precedent Decision</option>
                        <option value="non_precedent_decision">Non-Precedent Decision</option>
                        <option value="aao_decision">AAO Decision</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Visa Type</label>
                      <select
                        data-testid="paste-visa-type-select"
                        value={pasteData.visa_type}
                        onChange={(e) => setPasteData({ ...pasteData, visa_type: e.target.value })}
                        className="input-field"
                      >
                        <option value="EB2NIW">EB-2 NIW</option>
                        <option value="EB1A">EB-1A</option>
                        <option value="O-1A">O-1A</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <textarea
                        data-testid="paste-content-textarea"
                        value={pasteData.content}
                        onChange={(e) => setPasteData({ ...pasteData, content: e.target.value })}
                        className="input-field"
                        placeholder="Paste the full text of the decision or petition here..."
                        rows={10}
                        required
                      />
                    </div>
                    <button
                      data-testid="submit-paste-button"
                      type="submit"
                      className="btn-primary w-full"
                      disabled={uploading}
                    >
                      {uploading ? 'Adding & Indexing...' : 'Add Text'}
                    </button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner" />
          </div>
        ) : trainingDocs.length === 0 ? (
          <div className="glass p-12 text-center">
            <Upload className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">No training documents</h3>
            <p className="text-gray-400 mb-4">Upload successful and unsuccessful petitions to train the AI</p>
            <button
              data-testid="upload-first-training-button"
              onClick={() => setShowUpload(true)}
              className="btn-primary"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Successful Petitions */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                <CheckCircle className="text-green-500" size={24} />
                Successful Petitions
              </h3>
              <div className="space-y-3">
                {successfulDocs.length === 0 ? (
                  <p className="text-gray-400 text-sm">No successful petitions uploaded yet</p>
                ) : (
                  successfulDocs.map((doc, index) => {
                    const categoryBadge = getCategoryBadge(doc.doc_category || 'petition');
                    return (
                    <div
                      key={doc.id}
                      data-testid={`training-doc-${doc.id}`}
                      className="glass p-4 flex items-center justify-between fade-in card-hover"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="text-green-500" size={24} />
                        <div className="flex-1">
                          <p className="font-medium">{doc.filename || 'Pasted Text'}</p>
                          <p className="text-sm text-gray-400">Added {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${categoryBadge.color} text-white`}>
                          {categoryBadge.label}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full badge-gradient">{doc.visa_type}</span>
                        <button
                          data-testid={`delete-training-${doc.id}`}
                          onClick={async () => {
                            if (window.confirm('Delete this training document? It will be removed from the AI training data.')) {
                              try {
                                await axios.delete(`${API}/training/docs/${doc.id}`, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                toast.success('Training document deleted');
                                fetchTrainingDocs();
                              } catch (error) {
                                toast.error('Failed to delete document');
                              }
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Unsuccessful Petitions */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                <XCircle className="text-red-500" size={24} />
                Unsuccessful Petitions
              </h3>
              <div className="space-y-3">
                {unsuccessfulDocs.length === 0 ? (
                  <p className="text-gray-400 text-sm">No unsuccessful petitions uploaded yet</p>
                ) : (
                  unsuccessfulDocs.map((doc, index) => {
                    const categoryBadge = getCategoryBadge(doc.doc_category || 'petition');
                    return (
                    <div
                      key={doc.id}
                      data-testid={`training-doc-${doc.id}`}
                      className="glass p-4 flex items-center justify-between fade-in card-hover"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="text-red-500" size={24} />
                        <div className="flex-1">
                          <p className="font-medium">{doc.filename || 'Pasted Text'}</p>
                          <p className="text-sm text-gray-400">Added {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${categoryBadge.color} text-white`}>
                          {categoryBadge.label}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full badge-gradient">{doc.visa_type}</span>
                        <button
                          data-testid={`delete-training-${doc.id}`}
                          onClick={async () => {
                            if (window.confirm('Delete this training document? It will be removed from the AI training data.')) {
                              try {
                                await axios.delete(`${API}/training/docs/${doc.id}`, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                toast.success('Training document deleted');
                                fetchTrainingDocs();
                              } catch (error) {
                                toast.error('Failed to delete document');
                              }
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
