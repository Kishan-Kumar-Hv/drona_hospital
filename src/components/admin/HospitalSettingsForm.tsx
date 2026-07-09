import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useHospitalSettings } from '../../hooks/useContent';
import type { HospitalSettings } from '../../types';

const FIELD_GROUPS: { title: string; fields: { key: keyof HospitalSettings; label: string; type?: 'text' | 'textarea' }[] }[] = [
  {
    title: 'General',
    fields: [
      { key: 'name', label: 'Hospital Name' },
      { key: 'local_name', label: 'Local Name' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'hero_image', label: 'Hero Image URL' },
    ],
  },
  {
    title: 'Address',
    fields: [
      { key: 'address_street', label: 'Street' },
      { key: 'address_city', label: 'City' },
      { key: 'address_state', label: 'State' },
      { key: 'address_pincode', label: 'Pincode' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'phone', label: 'Phone' },
      { key: 'emergency_phone', label: 'Emergency Phone' },
      { key: 'email', label: 'Email' },
      { key: 'working_hours', label: 'Working Hours' },
    ],
  },
  {
    title: 'Map',
    fields: [
      { key: 'map_url', label: 'Map URL' },
      { key: 'map_embed_url', label: 'Map Embed URL', type: 'textarea' },
    ],
  },
  {
    title: 'Social Links',
    fields: [
      { key: 'social_facebook', label: 'Facebook' },
      { key: 'social_instagram', label: 'Instagram' },
      { key: 'social_twitter', label: 'Twitter / X' },
      { key: 'social_linkedin', label: 'LinkedIn' },
    ],
  },
];

export function HospitalSettingsForm() {
  const { settings, loading, refetch } = useHospitalSettings();
  const [form, setForm] = useState<HospitalSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (key: keyof HospitalSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    if (!supabase) {
      try {
        localStorage.setItem('db_hospital_settings', JSON.stringify(form));
        setSaving(false);
        setSuccess(true);
        refetch();
      } catch (err: any) {
        setError(err.message || 'Error saving settings locally');
        setSaving(false);
      }
      return;
    }

    const { id, ...updates } = form;
    const { error: updateError } = await supabase.from('hospital_settings').update(updates).eq('id', id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    refetch();
  };

  if (loading) {
    return <p className="text-sm text-muted py-8 text-center">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-heading">Hospital Information</h2>
        <p className="text-sm text-muted">Edit the contact details, address, and links shown across the website.</p>
      </div>

      {!supabase && (
        <div className="mb-4 p-3 bg-amber-50 rounded-xl flex items-center gap-2 text-sm text-amber-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Backend is not configured — showing demo content. Connect Supabase to enable editing.
        </div>
      )}

      <div className="space-y-8">
        {FIELD_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-heading mb-3">{group.title}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.fields.map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-heading mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={form[field.key] as string}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field.key] as string}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Saved successfully.
        </div>
      )}

      <div className="mt-6">
        <Button variant="primary" loading={saving} onClick={handleSave} disabled={!supabase}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
