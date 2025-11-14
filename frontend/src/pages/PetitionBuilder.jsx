import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PetitionBuilder = ({ setToken }) => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  
  // Step 1: Professional Background
  const [backgroundData, setBackgroundData] = useState({
    full_name: '',
    field: '',
    degree: '',
    experience_years: '',
    achievements: '',
    publications_count: '',
    awards: '',
    current_position: '',
    research_focus: ''
  });

  // Step 2: Endeavors & Arguments
  const [generatedEndeavorOptions, setGeneratedEndeavorOptions] = useState([]);
  const [generatedArgumentOptions, setGeneratedArgumentOptions] = useState([]);
  const [selectedEndeavors, setSelectedEndeavors] = useState([]);
  const [selectedArguments, setSelectedArguments] = useState([]);

  // Step 3: Cover Letter
  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterId, setCoverLetterId] = useState(null);
  const [revisionRequest, setRevisionRequest] = useState('');

  // Step 4: Reference Letters
  const [referenceLetters, setReferenceLetters] = useState([]);
  const [numReferences, setNumReferences] = useState(3);
  const [referenceInfo, setReferenceInfo] = useState([
    { name: '', position: '', institution: '', relationship: '', focus: '' },
    { name: '', position: '', institution: '', relationship: '', focus: '' },
    { name: '', position: '', institution: '', relationship: '', focus: '' }
  ]);

  const token = localStorage.getItem('visar_token');

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`${API}/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(response.data);
      setBackgroundData({ ...backgroundData, full_name: response.data.name });
    } catch (error) {
      toast.error('Failed to fetch client');
    }
  };

  // CV Upload and Auto-fill
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvFile(file);
    setUploadingCV(true);

    try {
      // Upload CV
      const formData = new FormData();
      formData.append('file', file);
      formData.append('client_id', clientId);
      formData.append('file_type', 'cv');

      await axios.post(`${API}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Parse CV and extract data
      const response = await axios.post(`${API}/cv/parse`, {
        client_id: clientId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Auto-fill form
      setBackgroundData({
        ...backgroundData,
        ...response.data,
        full_name: response.data.full_name || client.name
      });
      
      toast.success('CV data extracted! Review and edit as needed.');
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('No CV found. The file may still be uploading.');
      } else {
        toast.error('Failed to process CV. Please fill manually.');
      }
    } finally {
      setUploadingCV(false);
    }
  };

  // Step 1: Submit Background
  const handleBackgroundSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate endeavors and arguments
      const response = await axios.post(`${API}/endeavor/suggest`, {
        professional_background: `
Name: ${backgroundData.full_name}
Field: ${backgroundData.field}
Degree: ${backgroundData.degree}
Experience: ${backgroundData.experience_years} years
Achievements: ${backgroundData.achievements}
Publications: ${backgroundData.publications_count}
Awards: ${backgroundData.awards}
Position: ${backgroundData.current_position}
Research Focus: ${backgroundData.research_focus}
        `,
        field: backgroundData.field
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGeneratedEndeavorOptions(response.data.endeavors);
      setGeneratedArgumentOptions(response.data.national_interest_angles);
      setStep(2);
      toast.success('Endeavors generated! Select your preferred options.');
    } catch (error) {
      toast.error('Failed to generate endeavors');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    if (selectedEndeavors.length === 0) {
      toast.error('Please select at least one endeavor');
      return;
    }

    setLoading(true);

    try {
      const prompt = `Generate a complete EB-2 NIW I-140 petition cover letter for ${backgroundData.full_name}.

Professional Background:
${Object.entries(backgroundData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Selected Proposed Endeavors:
${selectedEndeavors.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Selected National Interest Arguments:
${selectedArguments.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Generate a COMPLETE, comprehensive EB-2 NIW cover letter following this structure:

1. Introduction (who petitioner is, what they're requesting)
2. Proposed Endeavor (detailed description of the specific endeavor)
3. Prong 1: Substantial Merit and National Importance (minimum 3 paragraphs)
4. Prong 2: Well Positioned to Advance the Endeavor (minimum 3 paragraphs with evidence)
5. Prong 3: Balance of Interests - waiving labor certification (minimum 2 paragraphs)
6. Conclusion (strong closing statement)

IMPORTANT: 
- Generate the ENTIRE letter, do NOT stop mid-sentence
- Use specific details, numbers, and achievements from the professional background
- Each section must be fully developed with evidence
- Write in a professional, persuasive tone suitable for USCIS adjudication
- Minimum 6-8 pages of content
- End with a complete conclusion paragraph

Do NOT use placeholders. Generate the complete, submission-ready letter.`;

      const response = await axios.post(`${API}/petitions/generate`, {
        client_id: clientId,
        visa_type: 'EB2NIW',
        criterion: null,
        prompt: prompt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCoverLetter(response.data.response);
      setCoverLetterId(response.data.message_id);
      setStep(3);
      toast.success('Cover letter generated!');
    } catch (error) {
      toast.error('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Revise Cover Letter
  const handleRevision = async () => {
    if (!revisionRequest.trim()) {
      toast.error('Please describe what you want to change');
      return;
    }

    setLoading(true);

    try {
      const prompt = `Revise the following EB-2 NIW cover letter based on this feedback: "${revisionRequest}"

Current Cover Letter:
${coverLetter}

Generate the revised version maintaining the same structure but incorporating the requested changes.`;

      const response = await axios.post(`${API}/petitions/generate`, {
        client_id: clientId,
        visa_type: 'EB2NIW',
        criterion: null,
        prompt: prompt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCoverLetter(response.data.response);
      setCoverLetterId(response.data.message_id);
      setRevisionRequest('');
      toast.success('Cover letter revised!');
    } catch (error) {
      toast.error('Failed to revise cover letter');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Generate Reference Letters
  const handleGenerateReferences = async () => {
    // Filter out empty references
    const filledReferences = referenceInfo.filter(ref => 
      ref.name.trim() && ref.position.trim() && ref.institution.trim()
    );

    if (filledReferences.length === 0) {
      toast.error('Please fill in at least one reference letter with complete details');
      return;
    }

    setLoading(true);
    const generatedLetters = [];

    try {
      for (let i = 0; i < referenceInfo.length; i++) {
        const ref = referenceInfo[i];
        const prompt = `Generate a professional reference letter for ${backgroundData.full_name}'s EB-2 NIW petition.

Recommender Details:
Name: ${ref.name}
Position: ${ref.position}
Institution: ${ref.institution}
Relationship: ${ref.relationship}
Focus Area: ${ref.focus}

Petitioner Background:
${Object.entries(backgroundData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Generate a compelling, authentic reference letter that:
1. Introduces the recommender and their credentials
2. Explains how they know the petitioner
3. Discusses specific achievements and contributions they've witnessed
4. Emphasizes the petitioner's impact in their field
5. Provides a strong, unequivocal recommendation

The letter should sound personal and authentic to the recommender, not generic. Length: 2-3 pages.`;

        const response = await axios.post(`${API}/petitions/generate`, {
          client_id: clientId,
          visa_type: 'EB2NIW',
          criterion: `Reference Letter ${i + 1}`,
          prompt: prompt
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        generatedLetters.push({
          id: response.data.message_id,
          name: ref.name,
          content: response.data.response
        });
      }

      setReferenceLetters(generatedLetters);
      setStep(5);
      toast.success('Reference letters generated!');
    } catch (error) {
      toast.error('Failed to generate reference letters');
    } finally {
      setLoading(false);
    }
  };

  const addReferenceInfo = () => {
    setReferenceInfo([...referenceInfo, {
      name: '',
      position: '',
      institution: '',
      relationship: '',
      focus: ''
    }]);
  };

  const updateReferenceInfo = (index, field, value) => {
    const updated = [...referenceInfo];
    updated[index][field] = value;
    setReferenceInfo(updated);
  };

  if (!client) {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #1a0f0a 100%)' }}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="glass-strong border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(`/client/${clientId}`)}
            className="btn-ghost flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Client
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <Sparkles className="brand-accent" size={32} />
            EB-2 NIW Petition Builder
          </h1>
          <p className="text-gray-400">Complete guided workflow for {client.name}</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: 'Background' },
            { num: 2, label: 'Endeavors' },
            { num: 3, label: 'Cover Letter' },
            { num: 4, label: 'References' },
            { num: 5, label: 'Complete' }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex flex-col items-center ${i > 0 ? 'ml-4' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step > s.num ? 'bg-green-500 text-white' :
                  step === s.num ? 'badge-gradient text-white' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {step > s.num ? <CheckCircle size={20} /> : s.num}
                </div>
                <span className="text-xs mt-2 text-gray-400">{s.label}</span>
              </div>
              {i < 4 && (
                <div className={`h-1 w-12 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-strong p-8">
          {/* Step 1: Professional Background */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Professional Background</h2>
              
              {/* CV Upload Option */}
              <div className="glass p-6 mb-6 border-2 border-dashed border-brand-accent/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="brand-accent" size={20} />
                  Quick Start: Upload CV/Resume (Optional)
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Upload your CV and we'll automatically extract information to fill the form. You can review and edit all fields after.
                </p>
                <input
                  type="file"
                  onChange={handleCVUpload}
                  className="input-field"
                  accept=".pdf,.docx,.doc"
                  disabled={uploadingCV}
                />
                {uploadingCV && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                    <div className="spinner" />
                    Extracting information from CV...
                  </div>
                )}
              </div>

              <form onSubmit={handleBackgroundSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={backgroundData.full_name}
                      onChange={(e) => setBackgroundData({ ...backgroundData, full_name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Field/Industry</label>
                    <input
                      type="text"
                      value={backgroundData.field}
                      onChange={(e) => setBackgroundData({ ...backgroundData, field: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Artificial Intelligence"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Highest Degree</label>
                    <input
                      type="text"
                      value={backgroundData.degree}
                      onChange={(e) => setBackgroundData({ ...backgroundData, degree: e.target.value })}
                      className="input-field"
                      placeholder="e.g., PhD in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={backgroundData.experience_years}
                      onChange={(e) => setBackgroundData({ ...backgroundData, experience_years: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Publications Count</label>
                    <input
                      type="number"
                      value={backgroundData.publications_count}
                      onChange={(e) => setBackgroundData({ ...backgroundData, publications_count: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Position</label>
                    <input
                      type="text"
                      value={backgroundData.current_position}
                      onChange={(e) => setBackgroundData({ ...backgroundData, current_position: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Senior Research Scientist"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Key Achievements</label>
                  <textarea
                    value={backgroundData.achievements}
                    onChange={(e) => setBackgroundData({ ...backgroundData, achievements: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="List major achievements, breakthroughs, patents, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Awards & Recognition</label>
                  <textarea
                    value={backgroundData.awards}
                    onChange={(e) => setBackgroundData({ ...backgroundData, awards: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="List awards, honors, fellowships"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Research Focus</label>
                  <textarea
                    value={backgroundData.research_focus}
                    onChange={(e) => setBackgroundData({ ...backgroundData, research_focus: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Describe research areas and specializations"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Generating Endeavors...' : 'Continue to Endeavors'}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Select Endeavors & Arguments */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="btn-ghost flex items-center gap-2 mb-6"
              >
                <ArrowLeft size={18} />
                Back to Background Form
              </button>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Select Proposed Endeavors & Arguments</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 brand-accent">Proposed Endeavors (Select 1-3)</h3>
                <div className="space-y-3">
                  {generatedEndeavorOptions.map((endeavor, i) => (
                    <label key={i} className="flex items-start gap-3 p-4 glass cursor-pointer hover:bg-white/5">
                      <input
                        type="checkbox"
                        checked={selectedEndeavors.includes(endeavor)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEndeavors([...selectedEndeavors, endeavor]);
                          } else {
                            setSelectedEndeavors(selectedEndeavors.filter(e => e !== endeavor));
                          }
                        }}
                        className="mt-1"
                      />
                      <span className="text-sm">{endeavor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 brand-accent">National Interest Arguments (Select 3-5)</h3>
                <div className="space-y-3">
                  {generatedArgumentOptions.map((argument, i) => (
                    <label key={i} className="flex items-start gap-3 p-4 glass cursor-pointer hover:bg-white/5">
                      <input
                        type="checkbox"
                        checked={selectedArguments.includes(argument)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedArguments([...selectedArguments, argument]);
                          } else {
                            setSelectedArguments(selectedArguments.filter(a => a !== argument));
                          }
                        }}
                        className="mt-1"
                      />
                      <span className="text-sm">{argument}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-ghost flex-1"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerateCoverLetter}
                  className="btn-primary flex-1"
                  disabled={loading || selectedEndeavors.length === 0}
                >
                  {loading ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Revise Cover Letter */}
          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="btn-ghost flex items-center gap-2 mb-6"
              >
                <ArrowLeft size={18} />
                Back to Endeavor Selection
              </button>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Cover Letter Draft</h2>
              
              <div className="glass p-6 mb-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-sans">{coverLetter}</pre>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Request Revision</label>
                <textarea
                  value={revisionRequest}
                  onChange={(e) => setRevisionRequest(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="What would you like to change? (e.g., 'Make the introduction stronger', 'Add more detail about publications')"
                />
                <button
                  onClick={handleRevision}
                  className="btn-secondary mt-3"
                  disabled={loading}
                >
                  {loading ? 'Revising...' : 'Revise Cover Letter'}
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="btn-ghost flex-1"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="btn-primary flex-1"
                >
                  Approve & Generate Reference Letters
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Reference Letters */}
          {step === 4 && (
            <div>
              <button
                onClick={() => setStep(3)}
                className="btn-ghost flex items-center gap-2 mb-6"
              >
                <ArrowLeft size={18} />
                Back to Cover Letter
              </button>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Reference Letters</h2>
              
              <p className="text-gray-400 mb-6">Add details for each recommender. We'll generate personalized letters for each.</p>

              <div className="space-y-6 mb-6">
                {referenceInfo.map((ref, i) => (
                  <div key={i} className="glass p-6">
                    <h3 className="font-semibold mb-4">Reference Letter {i + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Recommender Name</label>
                        <input
                          type="text"
                          value={ref.name}
                          onChange={(e) => updateReferenceInfo(i, 'name', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Position/Title</label>
                        <input
                          type="text"
                          value={ref.position}
                          onChange={(e) => updateReferenceInfo(i, 'position', e.target.value)}
                          className="input-field"
                          placeholder="e.g., Professor of Computer Science"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Institution</label>
                        <input
                          type="text"
                          value={ref.institution}
                          onChange={(e) => updateReferenceInfo(i, 'institution', e.target.value)}
                          className="input-field"
                          placeholder="e.g., MIT"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Relationship</label>
                        <input
                          type="text"
                          value={ref.relationship}
                          onChange={(e) => updateReferenceInfo(i, 'relationship', e.target.value)}
                          className="input-field"
                          placeholder="e.g., PhD advisor, Collaborator"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Focus Area</label>
                        <input
                          type="text"
                          value={ref.focus}
                          onChange={(e) => updateReferenceInfo(i, 'focus', e.target.value)}
                          className="input-field"
                          placeholder="e.g., Research collaboration, Teaching excellence"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addReferenceInfo}
                className="btn-secondary mb-6"
              >
                + Add Another Reference Letter
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="btn-ghost flex-1"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerateReferences}
                  className="btn-primary flex-1"
                  disabled={loading || referenceInfo.length === 0}
                >
                  {loading ? 'Generating Reference Letters...' : `Generate ${referenceInfo.length} Reference Letters`}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="text-center">
              <CheckCircle className="mx-auto mb-6 text-green-500" size={64} />
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Petition Package Complete!</h2>
              <p className="text-gray-400 mb-8">Your EB-2 NIW petition documents have been generated.</p>

              <div className="space-y-4 mb-8">
                <div className="glass p-4 text-left">
                  <h3 className="font-semibold mb-2">📄 Cover Letter</h3>
                  <p className="text-sm text-gray-400">Full I-140 petition letter</p>
                </div>
                {referenceLetters.map((letter, i) => (
                  <div key={i} className="glass p-4 text-left">
                    <h3 className="font-semibold mb-2">✉️ Reference Letter {i + 1}</h3>
                    <p className="text-sm text-gray-400">From {letter.name}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/client/${clientId}`)}
                  className="btn-primary flex-1"
                >
                  View All Documents
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setBackgroundData({
                      full_name: client.name,
                      field: '',
                      degree: '',
                      experience_years: '',
                      achievements: '',
                      publications_count: '',
                      awards: '',
                      current_position: '',
                      research_focus: ''
                    });
                    setSelectedEndeavors([]);
                    setSelectedArguments([]);
                    setCoverLetter('');
                    setReferenceLetters([]);
                    setReferenceInfo([]);
                  }}
                  className="btn-secondary flex-1"
                >
                  Start New Petition
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetitionBuilder;
