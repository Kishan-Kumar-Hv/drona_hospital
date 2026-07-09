import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FALLBACK_DOCTORS, FALLBACK_HOSPITAL_SETTINGS } from '../data/fallbackContent';
import type { Doctor, HospitalSettings } from '../types';

// Generic read hook for content tables (services, facilities, testimonials,
// faqs, doctors). Falls back to static content when Supabase isn't
// configured, or when the table is empty/unreachable.
export function useTable<T>(table: string, fallback: T[]) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase) {
      let localData = localStorage.getItem(`db_${table}`);
      if (localData && (localData.includes('pexels.com') || localData.includes('Aditi') || localData.includes('aditi'))) {
        localStorage.removeItem(`db_${table}`);
        localData = null;
      }
      if (localData) {
        try {
          setData(JSON.parse(localData));
        } catch {
          setData(fallback);
        }
      } else {
        setData(fallback);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: rows, error } = await supabase.from(table).select('*').order('created_at', { ascending: true });

    if (error || !rows || rows.length === 0) {
      setData(fallback);
    } else {
      setData(rows as T[]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, refetch };
}

function mapDoctorRow(row: Record<string, unknown>): Doctor {
  return {
    id: row.id as string,
    name: row.name as string,
    specialty: row.specialty as string,
    qualifications: row.qualifications as string,
    experience: row.experience as string,
    department: row.department as string,
    image: row.image as string,
    workingDays: row.working_days as number[],
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    slotMinutes: row.slot_minutes as number,
    consultationFee: row.consultation_fee as number,
  };
}

export function useDoctors() {
  const [data, setData] = useState<Doctor[]>(FALLBACK_DOCTORS);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase) {
      let localData = localStorage.getItem('db_doctors');
      if (localData && (localData.includes('pexels.com') || localData.includes('Aditi') || localData.includes('aditi'))) {
        localStorage.removeItem('db_doctors');
        localData = null;
      }
      if (localData) {
        try {
          setData(JSON.parse(localData));
        } catch {
          setData(FALLBACK_DOCTORS);
        }
      } else {
        setData(FALLBACK_DOCTORS);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: rows, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: true });

    if (error || !rows || rows.length === 0) {
      setData(FALLBACK_DOCTORS);
    } else {
      setData(rows.map(mapDoctorRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, refetch };
}

export function useHospitalSettings() {
  const [settings, setSettings] = useState<HospitalSettings>(FALLBACK_HOSPITAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase) {
      let localData = localStorage.getItem('db_hospital_settings');
      if (localData && (localData.includes('pexels.com') || localData.includes('Aditi') || localData.includes('aditi'))) {
        localStorage.removeItem('db_hospital_settings');
        localData = null;
      }
      if (localData) {
        try {
          setSettings(JSON.parse(localData));
        } catch {
          setSettings(FALLBACK_HOSPITAL_SETTINGS);
        }
      } else {
        setSettings(FALLBACK_HOSPITAL_SETTINGS);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from('hospital_settings').select('*').eq('id', 1).maybeSingle();

    if (error || !data) {
      setSettings(FALLBACK_HOSPITAL_SETTINGS);
    } else {
      setSettings(data as HospitalSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { settings, loading, refetch };
}
