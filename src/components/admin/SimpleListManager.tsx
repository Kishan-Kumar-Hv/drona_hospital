import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useTable } from '../../hooks/useContent';
import { ICON_OPTIONS } from '../../lib/iconMap';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'url' | 'icon-select';
}

type FormValues = Record<string, string | number>;

interface SimpleListManagerProps<T extends { id: string }> {
  table: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  fallback: T[];
  emptyValues: FormValues;
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string;
}

export function SimpleListManager<T extends { id: string }>({
  table,
  title,
  description,
  fields,
  fallback,
  emptyValues,
  getTitle,
  getSubtitle,
}: SimpleListManagerProps<T>) {
  const { data, loading, refetch } = useTable<T>(table, fallback);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(emptyValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditing(null);
    setFormValues(emptyValues);
    setError('');
    setShowModal(true);
  };

  const openEdit = (item: T) => {
    const values: FormValues = {};
    fields.forEach((f) => {
      values[f.key] = (item as unknown as Record<string, string | number>)[f.key];
    });
    setEditing(item);
    setFormValues(values);
    setError('');
    setShowModal(true);
  };

  const handleChange = (key: string, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    if (!supabase) {
      try {
        const localData = JSON.parse(localStorage.getItem(`db_${table}`) || JSON.stringify(fallback));
        if (editing) {
          const updated = localData.map((item: any) =>
            item.id === editing.id ? { ...item, ...formValues } : item
          );
          localStorage.setItem(`db_${table}`, JSON.stringify(updated));
        } else {
          const newItem = { id: Math.random().toString(36).slice(2, 9), ...formValues };
          localData.push(newItem);
          localStorage.setItem(`db_${table}`, JSON.stringify(localData));
        }
        setSaving(false);
        setShowModal(false);
        refetch();
      } catch (err: any) {
        setError(err.message || 'Error saving locally');
        setSaving(false);
      }
      return;
    }

    const result = editing
      ? await supabase.from(table).update(formValues).eq('id', editing.id)
      : await supabase.from(table).insert([formValues]);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setShowModal(false);
    refetch();
  };

  const handleDelete = async (item: T) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;

    if (!supabase) {
      try {
        const localData = JSON.parse(localStorage.getItem(`db_${table}`) || JSON.stringify(fallback));
        const updated = localData.filter((i: any) => i.id !== item.id);
        localStorage.setItem(`db_${table}`, JSON.stringify(updated));
        refetch();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    await supabase.from(table).delete().eq('id', item.id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-heading">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={openAdd} disabled={!supabase}>
          Add
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
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-heading truncate">{getTitle(item)}</p>
                {getSubtitle && <p className="text-sm text-muted truncate">{getSubtitle(item)}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" icon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(item)} disabled={!supabase}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleDelete(item)}
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
              <h3 className="text-lg font-bold text-heading">{editing ? 'Edit' : 'Add'} {title}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-heading">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-heading mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formValues[field.key] ?? ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ) : field.type === 'icon-select' ? (
                    <select
                      value={formValues[field.key] ?? ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                      value={formValues[field.key] ?? ''}
                      onChange={(e) =>
                        handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  )}
                </div>
              ))}
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
