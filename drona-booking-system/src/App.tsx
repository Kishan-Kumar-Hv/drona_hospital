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
  MessageSquare
} from 'lucide-react';

// Structured Mock Data
const DEPARTMENTS = [
  { id: 'dental', name: 'Dental Care', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50' },
  { id: 'skin', name: 'Skin & Aesthetic Care', icon: Sparkles, color: 'text-pink-500 bg-pink-50' },
  { id: 'orthopedics', name: 'Orthopedics & Physiotherapy', icon: Activity, color: 'text-blue-500 bg-blue-50' },
  { id: 'general-healthcare', name: 'General Healthcare', icon: Stethoscope, color: 'text-indigo-500 bg-indigo-50' },
  { id: 'gynecology', name: 'Gynecology & Women\'s Health', icon: Heart, color: 'text-rose-500 bg-rose-50' },
  { id: 'psychology', name: 'Psychology Counselling', icon: Users, color: 'text-purple-500 bg-purple-50' },
];

const DOCTORS = [
  { id: 'dr-aditi', name: 'Dr. Aditi', specialty: 'MDS - Senior Consultant Dentist', department: 'dental', image: 'https://images.pexels.com/photos/3845814/pexels-photo-3845814.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 500 },
  { id: 'dr-rajesh', name: 'Dr. Rajesh Kulkarni', specialty: 'MD - Consultant General Physician', department: 'general-healthcare', image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 400 },
  { id: 'dr-srinivas', name: 'Dr. K. Srinivas', specialty: 'DNB Ortho - Orthopedics Specialist', department: 'orthopedics', image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 600 },
  { id: 'dr-neha', name: 'Dr. Neha Sharma', specialty: 'MD Cosmetology - Aesthetic Expert', department: 'skin', image: 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 700 },
  { id: 'dr-shalini', name: 'Dr. Shalini Hegde', specialty: 'DGO - Obstetrics & Gynecology', department: 'gynecology', image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 500 },
  { id: 'dr-anand', name: 'Dr. Anand Rao', specialty: 'PhD - Consultant Psychologist', department: 'psychology', image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150', fee: 800 },
];

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', 
  '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
];

export default function App() {
  const [step, setStep] = useState(1);
  
  // Selection States
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].id);
  const [selectedDocId, setSelectedDocId] = useState(DOCTORS[0].id);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  
  // Form States
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [patientStatus, setPatientStatus] = useState('new'); // new or existing
  
  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Derived Info
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(d => d.department === selectedDept);
  }, [selectedDept]);

  const selectedDoctor = useMemo(() => {
    return DOCTORS.find(d => d.id === selectedDocId) || DOCTORS[0];
  }, [selectedDocId]);

  const selectedDepartmentInfo = useMemo(() => {
    return DEPARTMENTS.find(d => d.id === selectedDept) || DEPARTMENTS[0];
  }, [selectedDept]);

  // Adjust Doctor selection automatically if the filtered list changes
  const handleDeptSelect = (deptId: string) => {
    setSelectedDept(deptId);
    const docs = DOCTORS.filter(d => d.department === deptId);
    if (docs.length > 0) {
      setSelectedDocId(docs[0].id);
    }
  };

  // Helper validation
  const isStep2Valid = bookingDate !== '' && bookingTime !== '';
  const isStep3Valid = patientName.trim() !== '' && patientPhone.replace(/\D/g, '').length >= 10 && patientEmail.trim().includes('@');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    // Simulate API connection & Seeder delay
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingRef('DRN-' + Math.floor(100000 + Math.random() * 900000));
      setStep(5); // Success step
      
      // Simulate asynchronous SMS/WhatsApp notification trigger
      setTimeout(() => setWhatsappSent(true), 1200);
      setTimeout(() => setEmailSent(true), 2400);
    }, 1500);
  };

  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-sm leading-none">
              +
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Drona Healthcare</h1>
              <span className="text-xs text-slate-500 font-medium">Online Appointment Booking Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SSL Secured Form</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Booking Wizard (Steps 1-4) or Success Screen (Step 5) */}
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
                      step >= s.num ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 border border-slate-200'
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

              {/* Step 1: Specialty & Doctor */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950 mb-4">1. Choose clinical department</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {DEPARTMENTS.map((dept) => {
                        const DeptIcon = dept.icon;
                        const isSelected = selectedDept === dept.id;
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => handleDeptSelect(dept.id)}
                            className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all hover:scale-101 hover:shadow-sm ${
                              isSelected 
                                ? 'border-red-600 ring-2 ring-red-600/10 bg-red-50/10' 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dept.color}`}>
                              <DeptIcon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs md:text-sm text-slate-900 leading-tight">{dept.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-950 mb-4">2. Select consulting specialist</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {filteredDoctors.map((doc) => {
                        const isSelected = selectedDocId === doc.id;
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setSelectedDocId(doc.id)}
                            className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all hover:shadow-sm ${
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
                  </div>
                </div>
              )}

              {/* Step 2: Date & Available Time Slot */}
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
                                ? 'bg-red-600 border-red-600 text-white shadow-sm' 
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
                        patientStatus === 'new' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      New Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatientStatus('existing')}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors ${
                        patientStatus === 'existing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
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
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600"
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
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600"
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
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600"
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
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Confirm */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-slate-950 mb-2">Review booking request</h2>
                  
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex justify-between pb-3 border-b border-slate-200/60">
                      <span className="text-sm text-slate-500 font-medium">Department</span>
                      <span className="text-sm text-slate-900 font-bold">{selectedDepartmentInfo.name}</span>
                    </div>
                    <div className="flex justify-between pb-3 border-b border-slate-200/60">
                      <span className="text-sm text-slate-500 font-medium">Consultant Doctor</span>
                      <span className="text-sm text-slate-900 font-bold">{selectedDoctor.name}</span>
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
                      <span className="text-base text-red-600 font-extrabold">₹{selectedDoctor.fee}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-emerald-800 font-bold text-xs uppercase tracking-wider">Secure Booking Guarantee</h4>
                      <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                        Your clinical data is protected by industry-standard SSL encryption. You will pay the consultation fee directly at the clinic reception desk upon arrival.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
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
                    disabled={step === 2 ? !isStep2Valid : step === 3 ? !isStep3Valid : false}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all ${
                      (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 shadow-sm'
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
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
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

              {/* Status Notifications Alerts */}
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  whatsappSent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      whatsappSent ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <MessageSquare className="w-4 h-4" />
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
                      <Mail className="w-4 h-4" />
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

              {/* Receipt Details */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
                  <div>
                    <span className="text-xxs font-black uppercase tracking-widest text-slate-400">Appointment Token</span>
                    <h3 className="text-lg font-black">{bookingRef}</h3>
                  </div>
                  <span className="text-xxs font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Confirmed</span>
                </div>
                <div className="p-5 bg-slate-50 space-y-3.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Specialist</span>
                    <span className="text-slate-900 font-bold">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Department</span>
                    <span className="text-slate-900 font-bold">{selectedDepartmentInfo.name}</span>
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
                    <span className="text-slate-950 font-black text-base">₹{selectedDoctor.fee}</span>
                  </div>
                </div>
              </div>

              {/* Reset Action */}
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
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-sm transition-colors text-sm text-center"
              >
                Book Another Appointment
              </button>
            </div>
          )}

        </div>

        {/* Right Side: Sidebar Live Info & Trust */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* Booking Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="font-bold text-slate-950 border-b border-slate-100 pb-3">Booking Summary</h3>
            
            <div className="space-y-4 text-xs md:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Department</span>
                  <span className="font-bold text-slate-800">{selectedDepartmentInfo.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Specialist</span>
                  <span className="font-bold text-slate-800">{selectedDoctor.name}</span>
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

          {/* Secure SSL Info */}
          <div className="bg-slate-900 rounded-2xl text-white p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">256-bit SSL Security</h4>
                <p className="text-white/60 text-xs">Secure Data Encryption</p>
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              Your connection to Drona Healthcare booking server is encrypted. We do not store financial information. All medical inputs are strictly handled for registration purposes.
            </p>
          </div>

        </div>

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
