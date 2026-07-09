import { useState, useMemo, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  User, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  Trash2,
  Lock,
  X,
  Bell,
  Check,
  Building,
  ChevronDown,
  ChevronUp,
  Download,
  CalendarDays,
  Ticket,
  Clock,
  Users
} from 'lucide-react';

// Interfaces
interface Department {
  id: string;
  name: string;
  description: string;
  services: string[];
  iconName: string;
  color: string;
  imageUrl: string;
  queueCount: number;
}

interface Token {
  id: string;
  token_number: number;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  patient_gender: string;
  patient_age: number;
  department: string;
  status: string;
  created_at: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const IconComponent = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case 'Tooth':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3C7 3 5.5 4.5 5.5 7.5C5.5 10.5 7 13.5 7 13.5C7.5 15.5 7.5 18.5 8.5 19.5C9.5 20.5 11 20.5 12 20.5C13 20.5 14.5 20.5 15.5 19.5C16.5 18.5 16.5 15.5 17 13.5C17 13.5 18.5 10.5 18.5 7.5C18.5 4.5 17 3 17 3H7Z" />
          <path d="M12 3v17.5" />
          <path d="M10 8.5c0 0 1 .5 2 .5s2-.5 2-.5" />
        </svg>
      );
    case 'Aesthetic':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C12 2 19 9.5 19 14C19 17.866 15.866 21 12 21C8.13401 21 5 17.866 5 14C5 9.5 12 2 12 2Z" />
          <path d="M12 11v5" />
          <path d="M10 13.5h4" />
        </svg>
      );
    case 'Ortho':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <path d="M9 13h3v8" />
          <path d="M12 9h3.5L18 13" />
          <path d="M7 10l3-1 2 4" />
        </svg>
      );
    case 'General':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 3v5c0 3.87 3.13 7 7 7s7-3.13 7-7V3" />
          <path d="M8 3h8" />
          <path d="M11.5 15v4.5a2.5 2.5 0 0 0 5 0v-1.5" />
          <circle cx="16.5" cy="18" r="1.5" />
        </svg>
      );
    case 'Gynac':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="9" r="5" />
          <path d="M12 14v8" />
          <path d="M9 18h6" />
        </svg>
      );
    case 'Psych':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-5.88 2.5 2.5 0 0 1 2.46-3.06zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-5.88 2.5 2.5 0 0 0-2.46-3.06z" />
        </svg>
      );
    default:
      return <Sparkles className={className} />;
  }
};

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'tokens' | 'departments'>('tokens');
  
  // Custom Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // State Lists
  const [departments, setDepartments] = useState<Department[]>([
    { id: 'dental', name: 'Dental Care', description: 'Immediate walk-in dental pain diagnostics & extraction reviews.', services: ['Toothache', 'Swelling', 'Cleaning'], iconName: 'Tooth', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=compress&cs=tinysrgb&w=150&q=80', queueCount: 3 },
    { id: 'skin', name: 'Skin & Aesthetic Care', description: 'Consultation for acute rashes, burns, or aesthetic routine evaluations.', services: ['Rashes', 'Allergy', 'Routine Review'], iconName: 'Aesthetic', color: 'text-pink-600 bg-pink-50 border-pink-100', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=compress&cs=tinysrgb&w=150&q=80', queueCount: 2 },
    { id: 'orthopedics', name: 'Orthopedics & Physiotherapy', description: 'OPD consults for sprains, muscle tears, and bone joint pain.', services: ['Sprain', 'Joint Pain', 'Backache'], iconName: 'Ortho', color: 'text-blue-600 bg-blue-50 border-blue-100', imageUrl: 'https://images.unsplash.com/photo-1597764690523-15bea4c581c9?auto=compress&cs=tinysrgb&w=150&q=80', queueCount: 5 },
    { id: 'general-healthcare', name: 'General Healthcare', description: 'OPD checks for high fever, flu symptoms, BP checks, & health registry.', services: ['Fever', 'Cough', 'Blood Pressure'], iconName: 'General', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=compress&cs=tinysrgb&w=150&q=80', queueCount: 12 },
    { id: 'gynecology', name: 'Gynecology & Women\'s Health', description: 'Women health OPD, consultations, prenatal health checks.', services: ['Pregnancy', 'Abdominal pain', 'PCOS check'], iconName: 'Gynac', color: 'text-rose-600 bg-rose-50 border-rose-100', imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=compress&cs=tinysrgb&w=150&q=80', queueCount: 4 },
    { id: 'psychology', name: 'Psychology Counselling', description: 'Mind wellness check-in, panic attack control, stress relief.', services: ['Anxiety', 'Depression', 'Stress counselling'], iconName: 'Psych', color: 'text-purple-600 bg-purple-50 border-purple-100', imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=compress&cs=tinysrgb&w=150&q=80', queueCount: 1 },
  ]);

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Fetch initial token queues from database on mount
  useEffect(() => {
    let active = true;
    setLoadingDb(true);
    supabase.from('tokens').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          setTokens(data as Token[]);
        }
        setLoadingDb(false);
      });

    return () => { active = false; };
  }, []);

  // Wizard Stepper States
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('dental');
  
  // Patient details split
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientGender, setPatientGender] = useState('Female');
  const [patientAge, setPatientAge] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [insuranceOptional, setInsuranceOptional] = useState('');

  // Mobile Summary
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Success States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Add Department Form
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptIcon, setNewDeptIcon] = useState('Sparkles');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  // Computed state
  const selectedDepartmentInfo = useMemo(() => departments.find(d => d.id === selectedDept), [departments, selectedDept]);
  const isStep2Valid = firstName.trim() !== '' && lastName.trim() !== '' && patientPhone.replace(/\D/g, '').length >= 10 && patientAge !== '' && patientGender !== '';

  const handleNext = () => step < 3 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  // Call express RPC / endpoint to register the live token
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const cleanedPhone = patientPhone.replace(/\D/g, '');
    const patientName = `${firstName.trim()} ${lastName.trim()}`;

    // Call supabase create_token RPC
    supabase.rpc('create_token', {
      p_name: patientName,
      p_phone: cleanedPhone,
      p_age: Number(patientAge),
      p_gender: patientGender
    }).then(({ data, error }) => {
      setIsSubmitting(false);
      
      const nextTokenNum = tokens.length > 0 ? Math.max(...tokens.map(t => t.token_number)) + 1 : 1;
      const mockToken: Token = {
        id: (data && data[0]?.id) || Math.random().toString(36).substring(2, 9),
        token_number: (data && data[0]?.token_number) || nextTokenNum,
        patient_name: patientName,
        patient_phone: cleanedPhone,
        patient_email: patientEmail,
        patient_gender: patientGender,
        patient_age: Number(patientAge),
        department: selectedDept,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      if (error) {
        showToast('Database offline, generated fallback token.', 'error');
      }

      setTokens(prev => [mockToken, ...prev]);
      setGeneratedToken(mockToken);
      setStep(4);
      showToast('OPD Queue Token successfully generated!');

      setTimeout(() => setWhatsappSent(true), 1200);
      setTimeout(() => setEmailSent(true), 2400);
    });
  };

  // Add Department Action
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      showToast('Please enter department name', 'error');
      return;
    }
    const id = newDeptName.trim().toLowerCase().replace(/\s+/g, '-');
    const colors = [
      'text-blue-600 bg-blue-50 border-blue-100',
      'text-emerald-600 bg-emerald-50 border-emerald-100',
      'text-pink-600 bg-pink-50 border-pink-100',
      'text-rose-600 bg-rose-50 border-rose-100',
      'text-indigo-600 bg-indigo-50 border-indigo-100'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newDept: Department = {
      id,
      name: newDeptName.trim(),
      description: newDeptDesc || 'OPD clinical healthcare triage and priority queue booking.',
      services: ['Triage', 'Live Queue', 'General consult'],
      iconName: newDeptIcon,
      color,
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=compress&cs=tinysrgb&w=150&q=80',
      queueCount: 0
    };

    setDepartments(prev => [...prev, newDept]);
    showToast(`Department "${newDept.name}" created!`);
    setNewDeptName('');
    setNewDeptDesc('');
  };

  // Delete Department Action
  const handleDeleteDept = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    showToast('Department removed successfully', 'info');
  };

  // Update live token status
  const handleUpdateTokenStatus = (id: string, newStatus: string) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showToast(`Token status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased relative overflow-hidden">
      
      {/* Background Graphic Watermark */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1584515901107-d1776c42578d?auto=compress&cs=tinysrgb&w=1920')`,
          opacity: 0.10
        }} 
      />

      {/* Toasts */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 bg-white pointer-events-auto transform translate-y-0 transition-all duration-300 ${
              toast.type === 'error' ? 'border-red-100 text-red-800' : 'border-emerald-100 text-emerald-800'
            }`}
          >
            <Bell className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold flex-grow">{toast.message}</p>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xs leading-none">
              +
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Drona Healthcare</h1>
              <span className="text-xs text-slate-500 font-semibold">Live OPD Token Generation Portal</span>
            </div>
          </div>

          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
              isAdminMode 
                ? 'bg-slate-950 text-white border-slate-950 hover:bg-slate-900' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isAdminMode ? <ArrowLeft className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isAdminMode ? 'Back to Portal' : 'Clinic Staff Panel'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* VIEW 1: CLINIC STAFF PORTAL */}
        {isAdminMode ? (
          <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-red-600" />
                  OPD Live Queue Manager
                </h2>
                <p className="text-slate-500 text-xs mt-1">Monitor generated patient walk-in tokens, call patient numbers, and manage triage status.</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
                <button
                  onClick={() => setActiveAdminTab('tokens')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeAdminTab === 'tokens' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Tokens ({tokens.length})
                </button>
                <button
                  onClick={() => setActiveAdminTab('departments')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeAdminTab === 'departments' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Departments
                </button>
              </div>
            </div>

            {/* TAB 1: ACTIVE TOKENS LIST */}
            {activeAdminTab === 'tokens' && (
              <div className="space-y-6">
                <h3 className="font-bold text-slate-950 text-base">Active Walk-in Token Registrations</h3>
                {loadingDb ? (
                  <div className="p-8 text-center text-slate-400">Loading live token queues...</div>
                ) : tokens.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 border border-slate-200 border-dashed rounded-xl">No active tokens in OPD queue.</div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="p-4 text-center">Token Number</th>
                            <th className="p-4">Patient Details</th>
                            <th className="p-4">Department ID</th>
                            <th className="p-4">Status Action</th>
                            <th className="p-4 text-center">Registration Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tokens.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-center">
                                <span className="inline-block px-3 py-1 bg-red-50 text-red-700 font-black text-sm rounded-lg border border-red-100">
                                  #{t.token_number}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-900 block">{t.patient_name}</span>
                                <span className="text-xxs text-slate-400 block mt-0.5">{t.patient_phone} | Age: {t.patient_age} | {t.patient_gender}</span>
                              </td>
                              <td className="p-4 font-bold text-slate-800 uppercase">{t.department}</td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdateTokenStatus(t.id, 'calling')}
                                    className={`px-2.5 py-1 rounded text-xxs font-black border transition-colors ${
                                      t.status === 'calling' 
                                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                    }`}
                                  >
                                    Call Out
                                  </button>
                                  <button
                                    onClick={() => handleUpdateTokenStatus(t.id, 'completed')}
                                    className={`px-2.5 py-1 rounded text-xxs font-black border transition-colors ${
                                      t.status === 'completed' 
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                    }`}
                                  >
                                    Complete
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 text-center text-xxs text-slate-400 font-semibold">
                                {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DEPARTMENTS */}
            {activeAdminTab === 'departments' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form to Add Dept */}
                <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-slate-950 text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-red-600" />
                    Create Department
                  </h4>
                  
                  <form onSubmit={handleAddDept} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Department Name</label>
                      <input
                        type="text"
                        required
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        placeholder="e.g. Cardiology"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Description</label>
                      <textarea
                        required
                        value={newDeptDesc}
                        onChange={(e) => setNewDeptDesc(e.target.value)}
                        placeholder="Short description of department services..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Icon Style</label>
                      <select
                        value={newDeptIcon}
                        onChange={(e) => setNewDeptIcon(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      >
                        <option value="Tooth">Tooth (Dental)</option>
                        <option value="Aesthetic">Droplet Spark (Skin / Cosmetology)</option>
                        <option value="Ortho">Motion Joint (Orthopedics)</option>
                        <option value="General">Stethoscope (Healthcare)</option>
                        <option value="Gynac">Female Symbol (Gynecology)</option>
                        <option value="Psych">Brain Profile (Psychology)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg text-xs"
                    >
                      Create Department
                    </button>
                  </form>
                </div>

                {/* List Departments */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-slate-950 text-sm">Active Departments ({departments.length})</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between gap-3 bg-white">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${dept.color}`}>
                            <IconComponent name={dept.iconName} className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-900 text-xs md:text-sm">{dept.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteDept(dept.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          
          // VIEW 2: LIVE TOKEN WIZARD (STEPS 1-2) OR SUCCESS (STEP 4)
          <>
            <div className="flex-grow lg:w-2/3 flex flex-col space-y-6">
              
              {/* Trust-Building Hero Header */}
              {step <= 3 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 max-w-lg space-y-2">
                    <span className="text-xxs font-black tracking-widest text-red-600 uppercase bg-red-50 border border-red-100 px-3 py-1 rounded-full">OPD Live Entry</span>
                    <h2 className="text-2xl font-black text-slate-950 leading-tight">Get Your Live OPD Token</h2>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Enter your details to generate your digital walk-in queue token instantly to secure your consultation priority.
                    </p>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2.5 sm:gap-2 flex-wrap items-center sm:items-start text-xxs font-bold text-slate-600 mt-2 sm:mt-0 flex-shrink-0">
                    <span className="flex items-center bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full">✔ Instant Queue Spot</span>
                    <span className="flex items-center bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full">✔ Live Counter Sync</span>
                    <span className="flex items-center bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full">✔ Certified Specialists</span>
                  </div>
                </div>
              )}

              {/* Wizard Wrapper */}
              {step <= 3 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex-grow">
                  
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 overflow-x-auto gap-4">
                    {[
                      { num: 1, label: 'Department' },
                      { num: 2, label: 'Patient Info' },
                      { num: 3, label: 'Review' }
                    ].map((s) => (
                      <div key={s.num} className="flex items-center space-x-2 flex-shrink-0">
                        <span className={`text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                          step > s.num 
                            ? 'text-emerald-600 font-extrabold' 
                            : step === s.num 
                              ? 'text-red-600 font-black' 
                              : 'text-slate-400 font-semibold'
                        }`}>
                          {step > s.num ? '✔' : step === s.num ? '●' : '○'}
                          {s.label}
                        </span>
                        {s.num < 3 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Department Selection */}
                  {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Choose clinical department</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {departments.map((dept) => {
                          const isSelected = selectedDept === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onClick={() => setSelectedDept(dept.id)}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center h-28 transition-all hover:scale-101 hover:shadow-xs ${
                                isSelected 
                                  ? 'border-red-600 ring-2 ring-red-600/10 bg-red-50/10' 
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="flex flex-col justify-between h-full pr-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${dept.color}`}>
                                  <IconComponent name={dept.iconName} className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-xs md:text-sm text-slate-950 leading-tight mt-2">{dept.name}</span>
                              </div>
                              <img 
                                src={dept.imageUrl} 
                                alt={dept.name} 
                                className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0 shadow-xxs" 
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Patient Info */}
                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Patient Triage Form</h2>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            placeholder="10-digit number"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address (Optional)</label>
                          <input
                            type="email"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                          <select
                            value={patientGender}
                            onChange={(e) => setPatientGender(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Age</label>
                          <input
                            type="number"
                            required
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            placeholder="Years"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason for Visit / Symptoms</label>
                        <textarea
                          rows={3}
                          value={visitReason}
                          onChange={(e) => setVisitReason(e.target.value)}
                          placeholder="Describe symptoms briefly (fever, tooth pain, sprain, etc.)..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 resize-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Insurance Details (Optional)</label>
                        <input
                          type="text"
                          value={insuranceOptional}
                          onChange={(e) => setInsuranceOptional(e.target.value)}
                          placeholder="Provider Name & Policy ID"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review */}
                  {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Review OPD Queue Registry</h2>
                      
                      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">OPD Department</span>
                          <span className="text-sm text-slate-900 font-bold">{selectedDepartmentInfo ? selectedDepartmentInfo.name : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Patient Details</span>
                          <span className="text-sm text-slate-900 font-bold">{firstName} {lastName}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Age & Gender</span>
                          <span className="text-sm text-slate-900 font-bold">{patientAge} Years Old | {patientGender}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Visit Symptoms</span>
                          <span className="text-sm text-slate-900 font-bold">{visitReason || 'Not stated'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 font-medium">OPD Registration Fee</span>
                          <span className="text-base text-red-600 font-extrabold">₹200</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center text-sm font-bold text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={step === 1 ? !selectedDept : step === 2 ? !isStep2Valid : false}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all ${
                          (step === 1 && !selectedDept) || (step === 2 && !isStep2Valid)
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 shadow-xs'
                        }`}
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                      >
                        {isSubmitting ? 'Generating...' : 'Get Queue Token'}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-xxs font-bold text-slate-500">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>🔒 SSL Secured</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xxs font-bold text-slate-500">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>👨‍⚕️ Live Triage Sync</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xxs font-bold text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      <span>⭐ 10,000+ Happy Patients</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xxs font-bold text-slate-500">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>🏥 NABH Standards</span>
                    </div>
                  </div>

                </div>
              )}

              {/* Step 4: Success Ticket Pass Screen */}
              {step === 4 && generatedToken && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-scale-up">
                  <div className="text-center py-6">
                    <span className="text-4xl block mb-3">🎉</span>
                    <h2 className="text-2xl font-black text-slate-950">OPD Triage Token Generated!</h2>
                    <p className="text-slate-500 text-xs mt-1">Your walk-in priority status is successfully secured.</p>
                  </div>

                  {/* High Fidelity Ticket Card */}
                  <div className="border-2 border-red-100 border-dashed rounded-3xl overflow-hidden shadow-sm bg-white relative">
                    {/* Top Stripe */}
                    <div className="bg-red-600 p-4 text-white flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-100">Live OPD Queue Pass</span>
                        <h3 className="text-base font-extrabold uppercase">{selectedDepartmentInfo ? selectedDepartmentInfo.name : 'OPD'}</h3>
                      </div>
                      <Ticket className="w-8 h-8 text-red-200" />
                    </div>

                    {/* Main Token Info */}
                    <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest block">Your Queue Position</span>
                      <h1 className="text-5xl font-black text-slate-950 mt-2 mb-2">#{generatedToken.token_number}</h1>
                      <div className="inline-flex gap-4 items-center justify-center text-xs font-bold text-slate-600 mt-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-red-500" /> Wait: ~15 mins</span>
                        <span className="text-slate-300">|</span>
                        <span>Triage: Priority</span>
                      </div>
                    </div>

                    {/* Sub Details */}
                    <div className="p-6 space-y-3.5 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Patient Name</span>
                        <span className="text-slate-900 font-bold">{generatedToken.patient_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Age & Gender</span>
                        <span className="text-slate-900 font-bold">{generatedToken.patient_age} Years | {generatedToken.patient_gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Registered Phone</span>
                        <span className="text-slate-900 font-bold">{generatedToken.patient_phone}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-slate-200">
                        <span className="text-slate-500 font-semibold">OPD Registration Fee</span>
                        <span className="text-slate-950 font-black">₹200 (Paid at Counter)</span>
                      </div>
                    </div>
                  </div>

                  {/* Dispatch Status */}
                  <div className="space-y-3">
                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      whatsappSent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          whatsappSent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">WhatsApp Triage Dispatch</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {whatsappSent ? 'Queue status sent successfully to ' + patientPhone : 'Processing SMS triggers...'}
                          </p>
                        </div>
                      </div>
                      {whatsappSent && (
                        <span className="text-xxs font-black uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">Sent</span>
                      )}
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      emailSent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          emailSent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Email Triage Dispatch</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {emailSent ? 'Queue token pass emailed to ' + patientEmail : 'Processing email triggers...'}
                          </p>
                        </div>
                      </div>
                      {emailSent && (
                        <span className="text-xxs font-black uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">Sent</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => showToast('Receipt download started (mock)')}
                      className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-xxs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Pass
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => showToast('Event added to Google Calendar (mock)')}
                      className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-xxs transition-colors"
                    >
                      <CalendarDays className="w-4 h-4" />
                      Add to Calendar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setFirstName('');
                        setLastName('');
                        setPatientPhone('');
                        setPatientEmail('');
                        setPatientAge('');
                        setVisitReason('');
                        setInsuranceOptional('');
                        setWhatsappSent(false);
                        setEmailSent(false);
                      }}
                      className="flex items-center justify-center py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-xxs transition-colors"
                    >
                      Generate New Token
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Sidebar Live Queue Summary */}
            <div className="lg:w-1/3 space-y-6">
              
              {/* Collapsible Mobile Queue Drawer */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                  className="w-full p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 lg:pointer-events-none lg:hover:bg-transparent"
                >
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-slate-400" />
                    OPD Queue Status
                  </h3>
                  <div className="lg:hidden">
                    {isSummaryExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                <div className={`p-5 divide-y divide-slate-100 space-y-4 text-xs md:text-sm lg:block ${isSummaryExpanded ? 'block' : 'hidden'}`}>
                  
                  {/* Department */}
                  <div className="flex items-start gap-3 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">🏥 OPD Department</span>
                      <span className="font-bold text-slate-800">{selectedDepartmentInfo ? selectedDepartmentInfo.name : 'Not selected'}</span>
                    </div>
                  </div>

                  {/* Active Queue Count */}
                  <div className="flex items-start gap-3 pt-3 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">👥 Current Queue Size</span>
                      <span className="font-bold text-slate-800">{selectedDepartmentInfo ? selectedDepartmentInfo.queueCount + ' patients waiting' : '0 waiting'}</span>
                    </div>
                  </div>

                  {/* Avg Wait time */}
                  <div className="flex items-start gap-3 pt-3 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">⏱ Avg Wait Time</span>
                      <span className="font-bold text-slate-800">12 - 15 minutes</span>
                    </div>
                  </div>

                  {/* Registration Fee */}
                  <div className="flex items-start gap-3 pt-3 justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">💰 Registration Fee</span>
                        <span className="font-extrabold text-red-600">₹200 (OPD Checkup)</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* WHY CHOOSE US */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h4 className="font-bold text-slate-950 text-sm">Why Choose Us</h4>
                <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2 text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✔</span>
                    Live Triage Management
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✔</span>
                    No Long Queue Wait Times
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✔</span>
                    Instant Confirmation SMS
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✔</span>
                    Secure OPD Registry
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✔</span>
                    24x7 Emergency Care
                  </li>
                </ul>
              </div>

              {/* NEED HELP */}
              <div className="bg-slate-950 rounded-2xl text-white p-6 space-y-4">
                <h4 className="font-bold text-sm">Need Help?</h4>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Clinic Triage Helpline</span>
                    <a href="tel:09986492170" className="font-bold hover:underline">099864 92170</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">WhatsApp Desk</span>
                    <button onClick={() => showToast('Directing to WhatsApp support... (mock)')} className="font-bold hover:underline">Chat with reception</button>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-red-400 font-bold uppercase tracking-wider">Emergency Contact</span>
                    <a href="tel:09986492170" className="font-bold hover:underline text-red-400">099864 92170</a>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => showToast('Privacy Policy (mock)')} className="hover:text-slate-600">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => showToast('Terms & Conditions (mock)')} className="hover:text-slate-600">Terms</button>
            <span>·</span>
            <button onClick={() => showToast('Cancellation Policy (mock)')} className="hover:text-slate-600">Cancellation Policy</button>
            <span>·</span>
            <a href="tel:09986492170" className="hover:text-slate-600">Emergency helpline</a>
          </div>
          <div>
            © 2026 Drona Healthcare Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
