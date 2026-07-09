import { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  Stethoscope,
  Activity,
  Heart,
  Users,
  Brain,
  Trash2,
  Lock,
  X,
  Bell,
  Check,
  Building,
  UserPlus
} from 'lucide-react';

// Interfaces
interface Department {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  image: string;
  fee: number;
}

interface Appointment {
  id: string;
  ref: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  departmentName: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

// Icon mapper for dynamic department rendering
const IconComponent = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'Users': return <Users className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'bookings' | 'doctors' | 'departments'>('bookings');
  
  // Custom Toast Notifications State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Dynamic Lists with Initial Seed Data
  const [departments, setDepartments] = useState<Department[]>([
    { id: 'dental', name: 'Dental Care', iconName: 'Sparkles', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { id: 'skin', name: 'Skin & Aesthetic Care', iconName: 'Sparkles', color: 'text-pink-600 bg-pink-50 border-pink-100' },
    { id: 'orthopedics', name: 'Orthopedics & Physiotherapy', iconName: 'Activity', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { id: 'general-healthcare', name: 'General Healthcare', iconName: 'Stethoscope', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { id: 'gynecology', name: 'Gynecology & Women\'s Health', iconName: 'Heart', color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { id: 'psychology', name: 'Psychology Counselling', iconName: 'Brain', color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 'dr-aditi', name: 'Dr. Aditi', specialty: 'MDS - Senior Consultant Dentist', department: 'dental', image: 'https://images.pexels.com/photos/3845814/pexels-photo-3845814.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 500 },
    { id: 'dr-rajesh', name: 'Dr. Rajesh Kulkarni', specialty: 'MD - Consultant General Physician', department: 'general-healthcare', image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 400 },
    { id: 'dr-srinivas', name: 'Dr. K. Srinivas', specialty: 'DNB Ortho - Orthopedics Specialist', department: 'orthopedics', image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 600 },
    { id: 'dr-neha', name: 'Dr. Neha Sharma', specialty: 'MD Cosmetology - Aesthetic Expert', department: 'skin', image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 700 },
    { id: 'dr-shalini', name: 'Dr. Shalini Hegde', specialty: 'DGO - Obstetrics & Gynecology', department: 'gynecology', image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 500 },
    { id: 'dr-anand', name: 'Dr. Anand Rao', specialty: 'PhD - Consultant Psychologist', department: 'psychology', image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 800 },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'appt-1',
      ref: 'DRN-391850',
      patientName: 'Sunita Sharma',
      patientPhone: '9845021893',
      patientEmail: 'sunita@gmail.com',
      doctorName: 'Dr. Aditi',
      departmentName: 'Dental Care',
      date: '2026-07-12',
      time: '11:00 AM',
      reason: 'Regular scaling and tooth checkup',
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString()
    }
  ]);

  // Booking Flow Stepper Wizard States
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('dental');
  const [selectedDocId, setSelectedDocId] = useState('dr-aditi');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [patientStatus, setPatientStatus] = useState('new');
  
  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBookingRef, setActiveBookingRef] = useState('');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocDept, setNewDocDept] = useState('dental');
  const [newDocFee, setNewDocFee] = useState(500);
  const [newDocImage, setNewDocImage] = useState('');

  // New Department Form State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptIcon, setNewDeptIcon] = useState('Sparkles');

  // Time Slots
  const TIME_SLOTS = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', 
    '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
  ];

  // Auto-adjust Doctor selection on department switch
  const handleDeptSelect = (deptId: string) => {
    setSelectedDept(deptId);
    const availableDocs = doctors.filter(d => d.department === deptId);
    if (availableDocs.length > 0) {
      setSelectedDocId(availableDocs[0].id);
    } else {
      setSelectedDocId('');
    }
  };

  // Helper validation
  const filteredDoctors = useMemo(() => doctors.filter(d => d.department === selectedDept), [doctors, selectedDept]);
  const selectedDoctor = useMemo(() => doctors.find(d => d.id === selectedDocId), [doctors, selectedDocId]);
  const selectedDepartmentInfo = useMemo(() => departments.find(d => d.id === selectedDept), [departments, selectedDept]);
  
  const isStep2Valid = bookingDate !== '' && bookingTime !== '';
  const isStep3Valid = patientName.trim() !== '' && patientPhone.replace(/\D/g, '').length >= 10 && patientEmail.trim().includes('@');

  const handleNext = () => step < 4 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const refNum = 'DRN-' + Math.floor(100000 + Math.random() * 900000);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveBookingRef(refNum);
      
      const newAppt: Appointment = {
        id: Math.random().toString(36).substring(2, 9),
        ref: refNum,
        patientName,
        patientPhone,
        patientEmail,
        doctorName: selectedDoctor ? selectedDoctor.name : 'Unknown Doctor',
        departmentName: selectedDepartmentInfo ? selectedDepartmentInfo.name : 'General Care',
        date: bookingDate,
        time: bookingTime,
        reason: visitReason,
        status: 'confirmed',
        createdAt: new Date().toLocaleDateString()
      };

      setAppointments(prev => [newAppt, ...prev]);
      setStep(5);
      showToast('Appointment successfully confirmed!');

      setTimeout(() => setWhatsappSent(true), 1200);
      setTimeout(() => setEmailSent(true), 2400);
    }, 1500);
  };

  // Add Doctor Action
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocSpecialty.trim()) {
      showToast('Please fill in all doctor details', 'error');
      return;
    }
    const id = 'doc-' + Math.random().toString(36).substring(2, 9);
    const newDoc: Doctor = {
      id,
      name: newDocName.trim(),
      specialty: newDocSpecialty.trim(),
      department: newDocDept,
      image: newDocImage.trim() || 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=150',
      fee: Number(newDocFee)
    };

    setDoctors(prev => [...prev, newDoc]);
    showToast(`${newDoc.name} has been added successfully!`);
    
    // Reset Form
    setNewDocName('');
    setNewDocSpecialty('');
    setNewDocImage('');
    setNewDocFee(500);
  };

  // Delete Doctor Action
  const handleDeleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    showToast('Doctor deleted successfully', 'info');
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
      iconName: newDeptIcon,
      color
    };

    setDepartments(prev => [...prev, newDept]);
    showToast(`Department "${newDept.name}" created!`);
    setNewDeptName('');
  };

  // Delete Department Action
  const handleDeleteDept = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    showToast('Department removed successfully', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased relative overflow-hidden">
      
      {/* Background Graphic Watermark */}
      <div 
        className="absolute inset-0 z-0 opacity-4 pointer-events-none bg-cover bg-center" 
        style={{ backgroundImage: `url('https://plain-apac-prod-public.komododecks.com/202607/09/b8Wnz2wQ1ckCLbKMW9r9/image.png')` }} 
      />

      {/* Floating Toasts */}
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xs leading-none">
              +
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Drona Healthcare</h1>
              <span className="text-xs text-slate-500 font-semibold">Online Appointment Booking Portal</span>
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
            {isAdminMode ? 'Back to Booking' : 'Staff Admin Panel'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* VIEW 1: STAFF ADMIN PORTAL */}
        {isAdminMode ? (
          <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-8">
            
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-red-600" />
                  Staff Administrator Portal
                </h2>
                <p className="text-slate-500 text-xs mt-1">Configure clinic departments, active consulting doctors, and view incoming patient logs.</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
                <button
                  onClick={() => setActiveAdminTab('bookings')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeAdminTab === 'bookings' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Bookings ({appointments.length})
                </button>
                <button
                  onClick={() => setActiveAdminTab('doctors')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeAdminTab === 'doctors' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Manage Doctors
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

            {/* TAB 1: BOOKINGS LIST */}
            {activeAdminTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="font-bold text-slate-950 text-base">Patient Booking Registry</h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="p-4">Reference ID</th>
                          <th className="p-4">Patient Details</th>
                          <th className="p-4">Doctor & Dept</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-bold text-slate-900">{appt.ref}</td>
                            <td className="p-4">
                              <span className="font-bold text-slate-900 block">{appt.patientName}</span>
                              <span className="text-xxs text-slate-400 block mt-0.5">{appt.patientPhone} | {appt.patientEmail}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-slate-800 block">{appt.doctorName}</span>
                              <span className="text-xxs text-slate-400 block mt-0.5">{appt.departmentName}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-slate-800 block">{appt.date}</span>
                              <span className="text-xxs text-slate-400 block mt-0.5">{appt.time}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xxs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MANAGE DOCTORS */}
            {activeAdminTab === 'doctors' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form to Add Doctor */}
                <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-slate-950 text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-red-600" />
                    Register New Consultant
                  </h4>
                  
                  <form onSubmit={handleAddDoctor} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Doctor Name</label>
                      <input
                        type="text"
                        required
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="Dr. Full Name"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Qualifications & Specialty</label>
                      <input
                        type="text"
                        required
                        value={newDocSpecialty}
                        onChange={(e) => setNewDocSpecialty(e.target.value)}
                        placeholder="e.g. MDS - Orthodontist"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Clinical Department</label>
                      <select
                        value={newDocDept}
                        onChange={(e) => setNewDocDept(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={newDocFee}
                        onChange={(e) => setNewDocFee(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Profile Image URL</label>
                      <input
                        type="text"
                        value={newDocImage}
                        onChange={(e) => setNewDocImage(e.target.value)}
                        placeholder="Optional image link"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg text-xs"
                    >
                      Add Doctor
                    </button>
                  </form>
                </div>

                {/* List Doctors */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-slate-950 text-sm">Active Doctors ({doctors.length})</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {doctors.map((doc) => {
                      const deptInfo = departments.find(d => d.id === doc.department);
                      return (
                        <div key={doc.id} className="p-4 border border-slate-200 rounded-xl flex items-start justify-between gap-3 hover:shadow-xs transition-shadow bg-white">
                          <div className="flex items-center gap-3">
                            <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 flex-shrink-0" />
                            <div>
                              <h5 className="font-bold text-slate-900 text-xs md:text-sm leading-snug">{doc.name}</h5>
                              <p className="text-xxs text-slate-400 leading-snug">{doc.specialty}</p>
                              <span className="inline-block mt-2 text-xxs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                                {deptInfo ? deptInfo.name : doc.department} | Fee: ₹{doc.fee}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DEPARTMENTS */}
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
                        placeholder="e.g. Neurology"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase">Clinical Icon Style</label>
                      <select
                        value={newDeptIcon}
                        onChange={(e) => setNewDeptIcon(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      >
                        <option value="Sparkles">Sparkles (Aesthetics)</option>
                        <option value="Activity">Pulse Activity (General Care)</option>
                        <option value="Stethoscope">Stethoscope (Medicine)</option>
                        <option value="Heart">Heart (Women's / Cardiology)</option>
                        <option value="Brain">Brain (Psychology / Mind)</option>
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
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${dept.color}`}>
                            <IconComponent name={dept.iconName} className="w-4 h-4" />
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
          
          // VIEW 2: PATIENT BOOKING FLOW (STEPS 1-4) OR SUCCESS (STEP 5)
          <>
            <div className="flex-grow lg:w-2/3 flex flex-col">
              {step <= 4 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex-grow">
                  
                  {/* Stepper Indicators */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 overflow-x-auto">
                    {[
                      { num: 1, label: 'Department & Doctor' },
                      { num: 2, label: 'Date & Time' },
                      { num: 3, label: 'Patient Info' },
                      { num: 4, label: 'Confirm' }
                    ].map((s) => (
                      <div key={s.num} className="flex items-center space-x-2 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          step >= s.num ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {s.num}
                        </div>
                        <span className={`text-xs md:text-sm font-semibold transition-colors ${
                          step >= s.num ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {s.label}
                        </span>
                        {s.num < 4 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Department & Doctor */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-slate-950 mb-4">1. Choose clinical department</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {departments.map((dept) => {
                            const isSelected = selectedDept === dept.id;
                            return (
                              <button
                                key={dept.id}
                                type="button"
                                onClick={() => handleDeptSelect(dept.id)}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all hover:scale-101 hover:shadow-xs ${
                                  isSelected 
                                    ? 'border-red-600 ring-2 ring-red-600/10 bg-red-50/10' 
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${dept.color}`}>
                                  <IconComponent name={dept.iconName} className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-xs md:text-sm text-slate-900 leading-tight">{dept.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-950 mb-4">2. Select consulting specialist</h2>
                        {filteredDoctors.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            {filteredDoctors.map((doc) => {
                              const isSelected = selectedDocId === doc.id;
                              return (
                                <button
                                  key={doc.id}
                                  type="button"
                                  onClick={() => setSelectedDocId(doc.id)}
                                  className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all hover:shadow-xs ${
                                    isSelected 
                                      ? 'border-red-600 ring-2 ring-red-600/10 bg-red-50/10' 
                                      : 'border-slate-200 hover:border-slate-300 bg-white'
                                  }`}
                                >
                                  <img
                                    src={doc.image}
                                    alt={doc.name}
                                    className="w-16 h-16 rounded-full object-cover border border-slate-100 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 leading-tight">{doc.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-snug">{doc.specialty}</p>
                                    <span className="inline-block mt-3 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                                      Consult fee: ₹{doc.fee}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-xl border-dashed">
                            No doctors registered in this department yet. Staff can add them in the Admin Panel.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date & Slots */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-slate-950 mb-3">Choose date of visit</h2>
                        <div className="relative max-w-sm">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="date"
                            min={todayStr}
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-950 mb-3">Select preferred session slot</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const isSelected = bookingTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setBookingTime(slot)}
                                className={`py-3 px-2 rounded-xl text-center font-bold text-xs md:text-sm transition-all border ${
                                  isSelected 
                                    ? 'bg-red-600 border-red-600 text-white shadow-xs' 
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Patient Information */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-slate-950 mb-2">Patient Details</h2>
                      
                      {/* Status Selection */}
                      <div className="flex gap-4 p-1.5 bg-slate-100 rounded-xl max-w-xs border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setPatientStatus('new')}
                          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors ${
                            patientStatus === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          New Patient
                        </button>
                        <button
                          type="button"
                          onClick={() => setPatientStatus('existing')}
                          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors ${
                            patientStatus === 'existing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Existing Patient
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="tel"
                              required
                              value={patientPhone}
                              onChange={(e) => setPatientPhone(e.target.value)}
                              placeholder="10-digit number"
                              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason for Visit / Symptoms</label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                          <textarea
                            rows={3}
                            value={visitReason}
                            onChange={(e) => setVisitReason(e.target.value)}
                            placeholder="Describe your health concern briefly..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-slate-950 mb-2">Review booking request</h2>
                      
                      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Department</span>
                          <span className="text-sm text-slate-900 font-bold">{selectedDepartmentInfo ? selectedDepartmentInfo.name : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Consultant Doctor</span>
                          <span className="text-sm text-slate-900 font-bold">{selectedDoctor ? selectedDoctor.name : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Date & Time</span>
                          <span className="text-sm text-slate-900 font-bold">{bookingDate} at {bookingTime}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-slate-200/60">
                          <span className="text-sm text-slate-500 font-medium">Patient Details</span>
                          <span className="text-sm text-slate-900 font-bold">{patientName} ({patientStatus})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 font-medium">Consultation Fee</span>
                          <span className="text-base text-red-600 font-extrabold">₹{selectedDoctor ? selectedDoctor.fee : 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stepper Navigation */}
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

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={step === 1 ? !selectedDocId : step === 2 ? !isStep2Valid : step === 3 ? !isStep3Valid : false}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all ${
                          (step === 1 && !selectedDocId) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
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
                        {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              )}

              {/* Step 5: Success & Receipt */}
              {step === 5 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-950">Appointment Booking Confirmed!</h2>
                    <p className="text-slate-500 text-sm mt-1">Thank you, {patientName}. Your clinical slot is successfully reserved.</p>
                  </div>

                  {/* Status Alerts */}
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
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">WhatsApp Confirmation</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {whatsappSent ? 'Receipt sent successfully to ' + patientPhone : 'Sending confirmation status...'}
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
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Email Confirmation</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {emailSent ? 'Secure receipt dispatched to ' + patientEmail : 'Processing email trigger...'}
                          </p>
                        </div>
                      </div>
                      {emailSent && (
                        <span className="text-xxs font-black uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">Sent</span>
                      )}
                    </div>
                  </div>

                  {/* Receipt */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
                      <div>
                        <span className="text-xxs font-black uppercase tracking-widest text-slate-400">Appointment Token</span>
                        <h3 className="text-lg font-black">{activeBookingRef}</h3>
                      </div>
                      <span className="text-xxs font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Confirmed</span>
                    </div>
                    <div className="p-5 bg-slate-50 space-y-3.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Specialist</span>
                        <span className="text-slate-900 font-bold">{selectedDoctor ? selectedDoctor.name : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Department</span>
                        <span className="text-slate-900 font-bold">{selectedDepartmentInfo ? selectedDepartmentInfo.name : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Scheduled Date</span>
                        <span className="text-slate-900 font-bold">{bookingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Time Slot</span>
                        <span className="text-slate-900 font-bold">{bookingTime}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-slate-200">
                        <span className="text-slate-500 font-semibold">Patient Name</span>
                        <span className="text-slate-900 font-bold">{patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Consultation Fee</span>
                        <span className="text-slate-950 font-black text-base">₹{selectedDoctor ? selectedDoctor.fee : 0}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setBookingDate('');
                      setBookingTime('');
                      setPatientName('');
                      setPatientPhone('');
                      setPatientEmail('');
                      setVisitReason('');
                      setWhatsappSent(false);
                      setEmailSent(false);
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-sm text-center"
                  >
                    Book Another Appointment
                  </button>
                </div>
              )}
            </div>

            {/* Right Side: Sidebar Info */}
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <h3 className="font-bold text-slate-950 border-b border-slate-100 pb-3">Booking Summary</h3>
                
                <div className="space-y-4 text-xs md:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Department</span>
                      <span className="font-bold text-slate-800">{selectedDepartmentInfo ? selectedDepartmentInfo.name : 'Not selected'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Specialist</span>
                      <span className="font-bold text-slate-800">{selectedDoctor ? selectedDoctor.name : 'Not selected'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Date of Visit</span>
                      <span className="font-bold text-slate-800">{bookingDate || 'Not selected'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Session Slot</span>
                      <span className="font-bold text-slate-800">{bookingTime || 'Not selected'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Info Subtle Text */}
              <div className="flex items-center gap-2 text-slate-400 text-xs px-3">
                <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Encrypted secure form transmission</span>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-xs font-semibold">
          © {new Date().getFullYear()} Drona Healthcare Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
