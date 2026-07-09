import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useDoctors } from '../../hooks/useContent';
import { formatAvailability } from '../../data/bookingData';
import type { Doctor } from '../../types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DoctorFormState {
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  department: string;
  image: string;
  workingDays: number[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
  consultationFee: number;
}

const EMPTY_FORM: DoctorFormState = {
  name: '',
  specialty: '',
  qualifications: '',
  experience: '',
  department: '',
  image: '',
  workingDays: [1, 2, 3, 4, 5, 6],
  startTime: '10:00',
  endTime: '14:00',
  slotMinutes: 20,
  consultationFee: 500,
};

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || 'doctor'}-${suffix}`;
}

export function DoctorsManager() {
  const { data: doctors, loading, refetch } = useDoctors();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditing(doctor);
    setForm({
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications,
      experience: doctor.experience,
      department: doctor.department,
      image: doctor.image,
      workingDays: doctor.workingDays,
      startTime: doctor.startTime,
      endTime: doctor.endTime,
      slotMinutes: doctor.slotMinutes,
      consultationFee: doctor.consultationFee,
    });
    setError('');
    setShowModal(true);
  };

  const toggleDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day].sort((a, b) => a - b),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      specialty: form.specialty,
      qualifications: form.qualifications,
      experience: form.experience,
      department: form.department,
      image: form.image,
      working_days: form.workingDays,
      start_time: form.startTime,
      end_time: form.endTime,
      slot_minutes: form.slotMinutes,
      consultation_fee: form.consultationFee,
    };

    if (!supabase) {
      try {
        const localData = JSON.parse(localStorage.getItem('db_doctors') || JSON.stringify(doctors));
        if (editing) {
          const updated = localData.map((item: any) =>
            item.id === editing.id
              ? {
                  ...item,
                  ...payload,
                  workingDays: form.workingDays,
                  startTime: form.startTime,
                  endTime: form.endTime,
                  slotMinutes: form.slotMinutes,
                  consultationFee: form.consultationFee,
                }
              : item
          );
          localStorage.setItem('db_doctors', JSON.stringify(updated));
        } else {
          const newDoc = {
            id: slugify(form.name),
            ...payload,
            workingDays: form.workingDays,
            startTime: form.startTime,
            endTime: form.endTime,
            slotMinutes: form.slotMinutes,
            consultationFee: form.consultationFee,
          };
          localData.push(newDoc);
          localStorage.setItem('db_doctors', JSON.stringify(localData));
        }
        setSaving(false);
        setShowModal(false);
        refetch();
      } catch (err: any) {
        setError(err.message || 'Error saving doctor locally');
        setSaving(false);
      }
      return;
    }

    const result = editing
      ? await supabase.from('doctors').update(payload).eq('id', editing.id)
      : await supabase.from('doctors').insert([{ id: slugify(form.name), ...payload }]);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setShowModal(false);
    refetch();
  };

  const handleDelete = async (doctor: Doctor) => {
    if (!window.confirm(`Delete ${doctor.name}? This cannot be undone.`)) return;

    if (!supabase) {
      try {
        const localData = JSON.parse(localStorage.getItem('db_doctors') || JSON.stringify(doctors));
        const updated = localData.filter((i: any) => i.id !== doctor.id);
        localStorage.setItem('db_doctors', JSON.stringify(updated));
        refetch();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    await supabase.from('doctors').delete().eq('id', doctor.id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-heading">Doctors</h2>
          <p className="text-sm text-muted">Manage doctor profiles and their booking schedules.</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={openAdd} disabled={!supabase}>
          Add Doctor
        </Button>
      </div>

      {!supabase && (
        <div className="mb-4 p-3 bg-amber-50 rounded-xl flex items-center gap-2 text-sm text-amber-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Backend is not configured — showing demo content. Connect Supabase to enable editing.
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted text-sm py-8 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="space-y-2">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
              <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-heading truncate">{doctor.name}</p>
                <p className="text-sm text-muted truncate">
                  {doctor.specialty} &middot; {doctor.department}
                </p>
                <p className="text-xs text-muted truncate">{formatAvailability(doctor)} &middot; ₹{doctor.consultationFee}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" icon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(doctor)} disabled={!supabase}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleDelete(doctor)}
                  disabled={!supabase}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-heading">{editing ? 'Edit' : 'Add'} Doctor</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-heading">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Specialty</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm((prev) => ({ ...prev, specialty: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={form.qualifications}
                    onChange={(e) => setForm((prev) => ({ ...prev, qualifications: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Experience</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1">Working Days</label>
                <div className="flex gap-2 flex-wrap">
                  {DAY_LABELS.map((label, day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        form.workingDays.includes(day)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-body border-border hover:border-primary/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Slot Length (minutes)</label>
                  <input
                    type="number"
                    min={5}
                    value={form.slotMinutes}
                    onChange={(e) => setForm((prev) => ({ ...prev, slotMinutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.consultationFee}
                    onChange={(e) => setForm((prev) => ({ ...prev, consultationFee: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" loading={saving} onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
