'use client';
import { useRef, useState } from 'react';
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/heic,image/heif';
interface EvidenceUploadFormProps { claimId: string; }
interface UploadResult { avifPath: string; auditLink: string; bytesIn: number; bytesOut: number; }
export function EvidenceUploadForm({ claimId }: EvidenceUploadFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const handleSelect = (selected: File | null) => { setError(null); setResult(null); if (!selected) return; if (selected.size > MAX_BYTES) { setError('Image exceeds 10 MB limit.'); return; } if (!ACCEPTED.includes(selected.type)) { setError('Only JPEG, PNG, HEIC or HEIF images are accepted.'); return; } setFile(selected); };
  const handleUpload = async () => { if (!file) return; setBusy(true); setError(null); setResult(null); const requestId = crypto.randomUUID(); try { const form = new FormData(); form.append('file', file); form.append('auditLink', `evidence:${claimId}:${requestId}`); const res = await fetch('/api/v1/evidence', { method: 'POST', body: form, headers: { 'x-request-id': requestId }, }); if (!res.ok) { setError('Upload failed. Check the image and try again.'); return; } const json = (await res.json()) as UploadResult; setResult(json); setFile(null); if (fileRef.current) fileRef.current.value = ''; } catch { setError('Upload failed. Check the image and try again.'); } finally { setBusy(false); } };
  return (<form onSubmit={e=>{e.preventDefault();handleUpload();}} className="p-4 border rounded-lg bg-card shadow-sm"><label htmlFor={`evidence-file-${claimId}`} className="block text-sm font-medium mb-2">Upload Evidence Image</label><input id={`evidence-file-${claimId}`} ref={fileRef} type="file" accept={ACCEPTED} onChange={e=>handleSelect(e.target.files?.[0]??null)} className="mb-3 text-sm" /><button type="submit" disabled={busy||!file} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{busy ? 'Uploading...' : file ? 'Upload' : 'Select file'}</button>{error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}{result && (<div className="mt-3 text-sm text-muted-foreground"><p>AVIF: <code>{result.avifPath}</code></p><p>Audit: <span>{result.auditLink}</span></p><p>In: {result.bytesIn} bytes → Out: {result.bytesOut} bytes</p></div>)}</form>);
}
