import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Upload, MessageSquare, FileText, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ClientView = ({ setToken }) => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('evidence');
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorData, setGeneratorData] = useState({
    visa_type: '',
    criterion: '',
    prompt: ''
  });
  const [expandedPetitions, setExpandedPetitions] = useState({});

  const token = localStorage.getItem('visar_token');

  useEffect(() => {
    fetchClient();
    fetchDocuments();
    fetchPetitions();
    fetchChatHistory();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`${API}/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(response.data);
      setGeneratorData({ ...generatorData, visa_type: response.data.visa_type });
    } catch (error) {
      toast.error('Failed to fetch client');
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/documents/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents');
    }
  };

  const fetchPetitions = async () => {
    try {
      const response = await axios.get(`${API}/petitions/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPetitions(response.data);
    } catch (error) {
      console.error('Failed to fetch petitions');
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${API}/chat/history/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch chat history');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setGenerating(true);
    const userMessage = message;
    setMessage('');

    try {
      const response = await axios.post(`${API}/chat/message`, {
        client_id: clientId,
        message: userMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchChatHistory();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setGenerating(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('client_id', clientId);
    formData.append('file_type', fileType);

    try {
      await axios.post(`${API}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Document uploaded successfully');
      setShowUpload(false);
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleGeneratePetition = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await axios.post(`${API}/petitions/generate`, {
        client_id: clientId,
        visa_type: generatorData.visa_type,
        criterion: generatorData.criterion || null,
        prompt: generatorData.prompt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Petition generated successfully');
      setShowGenerator(false);
      setGeneratorData({ visa_type: client.visa_type, criterion: '', prompt: '' });
      fetchPetitions();
    } catch (error) {
      toast.error('Failed to generate petition');
    } finally {
      setGenerating(false);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #1a0f0a 100%)' }}>
        <div className="spinner" />
      </div>
    );
  }

  const criteria = client.visa_type === 'EB1A' ? [
    'Awards', 'Media', 'Judging', 'Original Contributions', 'Scholarly Articles',
    'Critical Role', 'High Remuneration', 'Artistic Exhibitions', 'Leading Role', 'Commercial Success'
  ] : client.visa_type === 'EB2NIW' ? [
    'Advanced Degree', 'Exceptional Ability', 'National Importance', 'Well Positioned', 'Balance of Interests'
  ] : [
    'Extraordinary Achievement', 'Recognition', 'Critical Role'
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #1a0f0a 100%)' }}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            data-testid="back-button"
            onClick={() => navigate('/dashboard')}
            className="btn-ghost flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{client.name}</h1>
              <p className="text-base text-gray-400">{client.email}</p>
            </div>
            <div className="flex items-center gap-3">
              {client.visa_type === 'EB2NIW' && (
                <button
                  onClick={() => navigate(`/petition-builder/${clientId}`)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Build Complete Petition
                </button>
              )}
              <span className="px-4 py-2 text-sm font-medium rounded-full badge-gradient">
                {client.visa_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="glass-strong border border-white/10 mb-6">
            <TabsTrigger data-testid="chat-tab" value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger data-testid="documents-tab" value="documents">Documents</TabsTrigger>
            <TabsTrigger data-testid="petitions-tab" value="petitions">Petitions</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="glass-strong p-6 rounded-2xl">
              {/* Clear Chat Button */}
              {chatHistory.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={async () => {
                      if (window.confirm('Clear all chat history?')) {
                        try {
                          await axios.delete(`${API}/chat/history/${clientId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          toast.success('Chat history cleared');
                          fetchChatHistory();
                        } catch (error) {
                          toast.error('Failed to clear chat');
                        }
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Clear Chat
                  </button>
                </div>
              )}
              
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-6 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="text-gray-500 mb-4" size={48} />
                    <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                    <p className="text-gray-400">Ask the AI assistant to help draft petition content</p>
                  </div>
                ) : (
                  chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      data-testid={`chat-message-${msg.role}`}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-2xl p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'brand-bg text-white'
                          : 'glass border border-white/10'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {generating && (
                  <div className="flex justify-start">
                    <div className="glass border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                      <div className="spinner" />
                      <span className="text-sm text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  data-testid="chat-input"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Ask the AI assistant to help with petition drafting..."
                  disabled={generating}
                />
                <button
                  data-testid="send-message-button"
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={generating || !message.trim()}
                >
                  <Send size={18} />
                  Send
                </button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="glass-strong p-4 mb-4 border-l-4 border-brand-accent">
                <p className="text-sm text-gray-300">
                  <strong>How it works:</strong> Upload the client's CV and evidence documents here. 
                  When you generate a petition, the AI will automatically extract information from these files 
                  and use specific details (names, dates, achievements) in the generated content.
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Uploaded Documents</h3>
                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <button data-testid="upload-document-button" className="btn-primary flex items-center gap-2">
                      <Upload size={18} />
                      Upload Document
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-strong text-white border-white/20">
                    <DialogHeader>
                      <DialogTitle style={{ fontFamily: 'Space Grotesk' }}>Upload Document</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFileUpload} className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">File Type</label>
                        <select
                          data-testid="file-type-select"
                          value={fileType}
                          onChange={(e) => setFileType(e.target.value)}
                          className="input-field"
                        >
                          <option value="evidence">Evidence Document</option>
                          <option value="cv">CV/Resume</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Choose File</label>
                        <input
                          data-testid="file-input"
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="input-field"
                          accept=".pdf,.docx,.doc,.txt"
                          required
                        />
                      </div>
                      <button
                        data-testid="submit-upload-button"
                        type="submit"
                        className="btn-primary w-full"
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {documents.length === 0 ? (
                <div className="glass p-12 text-center">
                  <Upload className="mx-auto mb-4 text-gray-500" size={48} />
                  <h3 className="text-xl font-semibold mb-2">No documents uploaded</h3>
                  <p className="text-gray-400">Upload evidence documents and CVs to get started</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} data-testid={`document-${doc.id}`} className="glass p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="brand-accent" size={24} />
                        <div>
                          <p className="font-medium">{doc.filename}</p>
                          <p className="text-sm text-gray-400">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-xs rounded-full glass">{doc.file_type}</span>
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this document?')) {
                              try {
                                await axios.delete(`${API}/documents/${doc.id}`, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                toast.success('Document deleted');
                                fetchDocuments();
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
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="petitions">
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="glass-strong p-4 mb-4 border-l-4 border-brand-accent">
                <p className="text-sm text-gray-300">
                  <strong>How it works:</strong> The AI will generate petition content using:
                  (1) Client documents you uploaded in the Documents tab,
                  (2) Templates matching the selected criterion,
                  (3) Training documents you uploaded in the Training page.
                  Be specific in your prompt for best results!
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Generated Petitions</h3>
                <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
                  <DialogTrigger asChild>
                    <button data-testid="generate-petition-button" className="btn-primary">Generate Petition</button>
                  </DialogTrigger>
                  <DialogContent className="glass-strong text-white border-white/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle style={{ fontFamily: 'Space Grotesk' }}>Generate Petition Section</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGeneratePetition} className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Criterion (Optional)</label>
                        <select
                          data-testid="criterion-select"
                          value={generatorData.criterion}
                          onChange={(e) => setGeneratorData({ ...generatorData, criterion: e.target.value })}
                          className="input-field"
                        >
                          <option value="">Select criterion...</option>
                          {criteria.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prompt</label>
                        <textarea
                          data-testid="petition-prompt-textarea"
                          value={generatorData.prompt}
                          onChange={(e) => setGeneratorData({ ...generatorData, prompt: e.target.value })}
                          className="input-field"
                          placeholder="Describe what you need in this petition section..."
                          rows={6}
                          required
                        />
                      </div>
                      <button
                        data-testid="submit-generate-button"
                        type="submit"
                        className="btn-primary w-full"
                        disabled={generating}
                      >
                        {generating ? 'Generating...' : 'Generate'}
                      </button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {petitions.length === 0 ? (
                <div className="glass p-12 text-center">
                  <FileText className="mx-auto mb-4 text-gray-500" size={48} />
                  <h3 className="text-xl font-semibold mb-2">No petitions generated</h3>
                  <p className="text-gray-400">Generate your first petition section</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {petitions.map((petition) => {
                    const isExpanded = expandedPetitions[petition.id] || false;
                    const snippet = petition.content.substring(0, 150) + '...';
                    
                    return (
                      <div 
                        key={petition.id} 
                        data-testid={`petition-${petition.id}`} 
                        className={`glass p-6 petition-card ${isExpanded ? 'expanded' : ''}`}
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => setExpandedPetitions({...expandedPetitions, [petition.id]: !isExpanded})}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg brand-accent">{petition.criterion || 'General Petition'}</h4>
                              <p className="text-sm text-gray-400">Generated {new Date(petition.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(petition.content);
                                  toast.success('Copied to clipboard!');
                                }}
                                className="btn-secondary text-xs px-3 py-1"
                                data-testid={`copy-petition-${petition.id}`}
                              >
                                Copy
                              </button>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Delete this petition?')) {
                                    try {
                                      await axios.delete(`${API}/petitions/${petition.id}`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                      });
                                      toast.success('Petition deleted');
                                      fetchPetitions();
                                    } catch (error) {
                                      toast.error('Failed to delete petition');
                                    }
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 text-xs px-3 py-1"
                                data-testid={`delete-petition-${petition.id}`}
                              >
                                Delete
                              </button>
                              <span className="px-3 py-1 text-xs rounded-full badge-gradient">{petition.visa_type}</span>
                              <button className="text-gray-400 hover:text-white transition-colors text-xl">
                                {isExpanded ? '▲' : '▼'}
                              </button>
                            </div>
                          </div>
                          
                          {!isExpanded && (
                            <p className="text-sm text-gray-400 italic">{snippet}</p>
                          )}
                        </div>
                        
                        <div className={`petition-content ${isExpanded ? 'expanded' : ''}`}>
                          <hr className="border-white/10 my-4" />
                          <div className="prose prose-invert max-w-none">
                            {petition.content.split('\n').map((line, i) => {
                              let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                              if (line.trim().startsWith('- ')) {
                                return <li key={i} className="ml-4 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^- /, '') }} />;
                              }
                              if (/^\d+\.\s/.test(line.trim())) {
                                return <li key={i} className="ml-4 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\.\s/, '') }} />;
                              }
                              if (line.trim().startsWith('###')) {
                                return <h4 key={i} className="text-lg font-semibold mt-4 mb-2 brand-accent">{line.replace(/###\s?/, '')}</h4>;
                              }
                              if (line.trim().startsWith('##')) {
                                return <h3 key={i} className="text-xl font-semibold mt-4 mb-2 brand-accent">{line.replace(/##\s?/, '')}</h3>;
                              }
                              if (line.trim().startsWith('#')) {
                                return <h2 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace(/#\s?/, '')}</h2>;
                              }
                              if (line.trim()) {
                                return <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                              }
                              return <br key={i} />;
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientView;
