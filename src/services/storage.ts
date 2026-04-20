import { supabase } from '@/lib/supabase';

const BUCKET = 'driver-documents';

export async function uploadDriverDocument(
  driverEmail: string,
  docType: 'license' | 'registration' | 'vehicle_photos' | 'insurance',
  file: File,
  userId?: string | null,
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const ext = file.name.split('.').pop() ?? 'bin';
    // Use userId as folder when available — matches the common RLS pattern
    // (storage.foldername())[1] = auth.uid()
    const folder = userId ?? driverEmail;
    const path = `${folder}/${docType}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err as Error };
  }
}
