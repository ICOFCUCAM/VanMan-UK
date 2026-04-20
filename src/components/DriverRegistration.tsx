import React, { useState } from 'react';
import {
  Truck, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft,
  User, Car, Shield, FileText, Loader2, Clock, Headphones, Star, Zap, Check,
} from 'lucide-react';
import { registerDriver } from '@/services/drivers';
import { uploadDriverDocument } from '@/services/storage';
import { useAppContext } from '@/contexts/AppContext';
import type { InsuranceType } from '@/types';
import { DRIVER_IMAGES } from '@/lib/constants';

interface DriverRegistrationProps {
  onNavigate: (page: string) => void;
}

const STEP_LABELS  = ['Personal Details', 'Vehicle & Licence', 'Document Upload', 'Driver Agreement'];
const STEP_DESCS   = ['Identity verification', 'Vehicle credentials', 'Compliance documents', 'Platform agreement'];
const STEP_ICONS   = [User, Car, Upload, FileText] as const;

const REQUIREMENTS = [
  'Valid UK driving licence (full)',
  'Vehicle insurance certificate',
  'Right to work in the UK',
  'Smartphone with GPS enabled',
  'Vehicle under 10 years old',
  'Clean driving record',
];

const DriverRegistration: React.FC<DriverRegistrationProps> = ({ onNavigate }) => {
  const { user } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postcode: '',
    licenseNumber: '', licenseExpiry: '', vehicleType: '', vehicleMake: '', vehicleModel: '', vehicleYear: '', vehicleReg: '',
    insuranceType: 'third-party' as InsuranceType, insuranceExpiry: '',
    driverLicense: null as File | null,
    vehicleRegistration: null as File | null,
    vehiclePhotos: null as File | null,
    insuranceDoc: null as File | null,
    agreeTerms: false, agreeContractor: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [docsSkipped, setDocsSkipped] = useState(false);

  const updateField = (field: string, value: any) => setFormData({ ...formData, [field]: value });

  const handleSubmit = async () => {
    if (!formData.agreeTerms || !formData.agreeContractor) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setDocsSkipped(false);

    // Soft-fail upload: storage RLS requires authentication. If upload fails,
    // we proceed without the URL — admin can request documents manually.
    const uploadDoc = async (file: File | null, docType: Parameters<typeof uploadDriverDocument>[1]) => {
      if (!file) return null;
      const { url, error } = await uploadDriverDocument(formData.email, docType, file, user?.id);
      if (error) {
        console.warn(`Document upload skipped (${docType}):`, error.message);
        return null;
      }
      return url;
    };

    const [licenseUrl, insuranceUrl, registrationUrl, photoUrl] = await Promise.all([
      uploadDoc(formData.driverLicense, 'license'),
      uploadDoc(formData.insuranceDoc, 'insurance'),
      uploadDoc(formData.vehicleRegistration, 'registration'),
      uploadDoc(formData.vehiclePhotos, 'vehicle_photos'),
    ]);

    // Flag if any uploaded file couldn't be stored (so we can inform the user)
    const hadFiles = formData.driverLicense || formData.insuranceDoc || formData.vehicleRegistration || formData.vehiclePhotos;
    const anyStored = licenseUrl || insuranceUrl || registrationUrl || photoUrl;
    if (hadFiles && !anyStored) setDocsSkipped(true);

    const { data, error } = await registerDriver({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      vehicle_type: formData.vehicleType || 'Medium Van',
      vehicle_make: formData.vehicleMake,
      vehicle_model: formData.vehicleModel,
      vehicle_year: formData.vehicleYear,
      vehicle_reg: formData.vehicleReg,
      insurance_type: formData.insuranceType,
      user_id: user?.id ?? null,
      license_document_url: licenseUrl,
      insurance_document_url: insuranceUrl,
      vehicle_registration_url: registrationUrl,
      vehicle_photo_url: photoUrl,
    });

    setIsSubmitting(false);
    if (error) {
      // RLS on the drivers table requires authentication
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        setSubmitError('Please sign in or create an account before submitting your driver application. Your progress will be saved.');
      } else {
        setSubmitError(error.message || 'Failed to submit application. Please try again.');
      }
      return;
    }
    setDriverId(data!.id);
    setSubmitted(true);
  };

  /* ─────── Success screen ─────── */
  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: '#F7FAFC' }}>
        <div className="pt-[88px] pb-20">
          <div className="max-w-xl mx-auto px-4 pt-16 text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.22em] uppercase mb-3 block">Application Received</span>
              <h2 className="text-2xl font-black text-[#0B2239] mb-2">You're in the pipeline</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Our compliance team will review your details and activate your account within 24–48 hours.
              </p>
              {docsSkipped && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-left">
                  <p className="text-amber-800 text-xs font-semibold mb-0.5">Documents needed</p>
                  <p className="text-amber-700 text-xs">We couldn't store your documents automatically. Please email them to <a href="mailto:info@fastmanandvan.org" className="underline font-semibold">info@fastmanandvan.org</a> with your reference below.</p>
                </div>
              )}
              {driverId && (
                <div className="inline-block bg-[#F7FAFC] border border-gray-200 rounded-xl px-6 py-3 mb-5">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Application Reference</p>
                  <p className="text-[#0B2239] font-black font-mono tracking-widest">{driverId.slice(0, 8).toUpperCase()}</p>
                </div>
              )}
              <p className="text-gray-400 text-xs mb-8">Confirmation sent to <strong className="text-gray-600">{formData.email}</strong></p>
              <button onClick={() => onNavigate('home')} className="bg-[#0E2A47] hover:bg-[#0F3558] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#0E2A47] focus:ring-2 focus:ring-[#0E2A47]/8 outline-none transition-all text-gray-800 text-sm bg-gray-50/50 focus:bg-white";
  const labelCls = "block text-[10px] font-bold text-gray-500 tracking-[0.14em] uppercase mb-1.5";
  const StepIcon = STEP_ICONS[step - 1];

  return (
    <div className="min-h-screen">

      {/* ── HERO BANNER ── */}
      <section className="relative pt-[88px] overflow-hidden" style={{ background: '#071A2F' }}>
        <img
          src={DRIVER_IMAGES[0]}
          alt="Driver"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F]/95 via-[#071A2F]/70 to-[#071A2F]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#071A2F]/60" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#F5B400] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Driver Application</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            Drive with Fast Man &amp; Van
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-lg">
            Earn on your schedule with access to nationwide delivery jobs in minutes. Join 10,000+ active drivers on our platform.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Weekly payouts', 'Flexible hours', 'Priority job access', 'Commercial delivery'].map(badge => (
              <span key={badge} className="inline-flex items-center gap-1.5 bg-white/[0.07] border border-white/[0.12] text-white/75 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                <Check className="w-3 h-3 text-[#F5B400]" /> {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY PROGRESS TRACKER ── */}
      <div className="sticky top-[88px] z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 py-3">
            <div className="shrink-0 hidden xs:block">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Step {step} of 4</p>
              <p className="text-sm font-black text-[#0B2239] leading-none">{STEP_DESCS[step - 1]}</p>
            </div>
            <div className="flex items-center gap-0 flex-1">
              {STEP_LABELS.map((label, i) => {
                const Icon = STEP_ICONS[i];
                const complete = i + 1 < step;
                const current = i + 1 === step;
                return (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${current ? 'bg-[#0E2A47] text-white' : complete ? 'text-green-600' : 'text-gray-300'}`}>
                      {complete
                        ? <Check className="w-3 h-3 shrink-0" />
                        : <Icon className="w-3 h-3 shrink-0" />}
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{i + 1}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`flex-1 h-px mx-1 min-w-[8px] ${complete ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <div className="py-10" style={{ background: '#F7FAFC' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

            {/* LEFT — Motivation panel (sticky) */}
            <div className="lg:sticky lg:top-[160px] space-y-4">

              {/* Earnings card */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}>
                <div className="p-5">
                  <p className="text-[#F5B400] text-[9px] font-bold tracking-[0.22em] uppercase mb-2">Typical weekly earnings</p>
                  <p className="text-3xl font-black text-white leading-none">£800–£1,200</p>
                  <p className="text-white/40 text-xs mt-1.5">Based on 40+ hours / week</p>
                </div>
                <div className="border-t border-white/[0.07] px-5 py-3 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-[#F5B400] shrink-0" />
                  <span className="text-white/45 text-xs">Gold tier pays 5% less commission</span>
                </div>
              </div>

              {/* Requirements checklist */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-[#0B2239] text-[9px] font-black tracking-[0.22em] uppercase mb-3">What you need</p>
                <div className="space-y-2.5">
                  {REQUIREMENTS.map(r => (
                    <div key={r} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 bg-green-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-green-500" />
                      </div>
                      <span className="text-gray-600 text-xs leading-snug">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval & support stats */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                {[
                  { icon: Clock,      title: '24–48 hour approval',  sub: 'Typical document review time' },
                  { icon: Headphones, title: '24/7 driver support',   sub: 'Via in-app chat & phone' },
                  { icon: Zap,        title: 'Instant job dispatch',  sub: 'Jobs matched within 60 seconds' },
                ].map(({ icon: Icon, title, sub }, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="border-t border-gray-50" />}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0E2A47]/[0.07] rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#0E2A47]" />
                      </div>
                      <div>
                        <p className="text-[#0B2239] text-xs font-bold">{title}</p>
                        <p className="text-gray-400 text-xs">{sub}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* RIGHT — Form panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Form header */}
              <div className="bg-gradient-to-r from-[#071A2F] via-[#0E2A47] to-[#0F3558] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#F5B400]/12 border border-[#F5B400]/20 rounded-xl flex items-center justify-center shrink-0">
                    <StepIcon className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs">Step {step} of 4</p>
                    <h2 className="text-white font-black text-base leading-tight">{STEP_LABELS[step - 1]}</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">

                {/* ─ Step 1: Personal Details ─ */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>First Name</label>
                        <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={inputCls} placeholder="John" />
                      </div>
                      <div>
                        <label className={labelCls}>Last Name</label>
                        <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={inputCls} placeholder="Smith" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={inputCls} placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputCls} placeholder="+44 7xxx xxx xxx" />
                    </div>
                    <div>
                      <label className={labelCls}>Street Address</label>
                      <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className={inputCls} placeholder="Street address" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>City</label>
                        <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className={inputCls} placeholder="London" />
                      </div>
                      <div>
                        <label className={labelCls}>Postcode</label>
                        <input type="text" value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} className={inputCls} placeholder="SW1A 1AA" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─ Step 2: Vehicle & Licence ─ */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Driving Licence Number</label>
                        <input type="text" value={formData.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} className={inputCls} placeholder="SMITH901234AB5CD" />
                      </div>
                      <div>
                        <label className={labelCls}>Licence Expiry Date</label>
                        <input type="date" value={formData.licenseExpiry} onChange={(e) => updateField('licenseExpiry', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Vehicle Type</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {['Small Van', 'Medium Van', 'Large Van', 'Luton Van'].map((type) => (
                          <button key={type} onClick={() => updateField('vehicleType', type)} className={`p-3 rounded-xl border-2 text-sm font-bold text-left transition-all ${formData.vehicleType === type ? 'border-[#0E2A47] bg-[#0E2A47]/5 text-[#0E2A47]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <Truck className={`w-4 h-4 mb-1 ${formData.vehicleType === type ? 'text-[#0E2A47]' : 'text-gray-400'}`} />
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Make</label>
                        <input type="text" value={formData.vehicleMake} onChange={(e) => updateField('vehicleMake', e.target.value)} className={inputCls} placeholder="Ford" />
                      </div>
                      <div>
                        <label className={labelCls}>Model</label>
                        <input type="text" value={formData.vehicleModel} onChange={(e) => updateField('vehicleModel', e.target.value)} className={inputCls} placeholder="Transit" />
                      </div>
                      <div>
                        <label className={labelCls}>Year</label>
                        <input type="text" value={formData.vehicleYear} onChange={(e) => updateField('vehicleYear', e.target.value)} className={inputCls} placeholder="2023" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Registration Plate</label>
                      <input type="text" value={formData.vehicleReg} onChange={(e) => updateField('vehicleReg', e.target.value)} className={inputCls} placeholder="AB12 CDE" />
                    </div>
                  </div>
                )}

                {/* ─ Step 3: Documents ─ */}
                {step === 3 && (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-xs">All documents are securely encrypted and verified by our compliance team.</p>
                    {[
                      { key: 'driverLicense',      label: 'Driver Licence',             desc: 'Front and back of your driving licence' },
                      { key: 'vehicleRegistration', label: 'Vehicle Registration (V5C)', desc: 'Vehicle logbook document' },
                      { key: 'vehiclePhotos',        label: 'Vehicle Photos',             desc: 'Clear photos of vehicle (front, back, sides)' },
                      { key: 'insuranceDoc',         label: 'Insurance Certificate',      desc: 'Valid vehicle insurance certificate' },
                    ].map((doc) => {
                      const uploaded = !!(formData as any)[doc.key];
                      return (
                        <div key={doc.key} className={`rounded-xl border-2 border-dashed p-4 transition-colors ${uploaded ? 'border-green-200 bg-green-50/40' : 'border-gray-200 hover:border-[#0E2A47]/25'}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-bold text-[#0B2239] text-sm">{doc.label}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{doc.desc}</p>
                            </div>
                            <label className={`cursor-pointer shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${uploaded ? 'bg-green-100 text-green-700' : 'bg-[#0E2A47]/[0.07] hover:bg-[#0E2A47]/12 text-[#0E2A47]'}`}>
                              {uploaded ? <CheckCircle className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                              {uploaded ? 'Uploaded' : 'Upload'}
                              <input type="file" className="hidden" onChange={(e) => updateField(doc.key, e.target.files?.[0] || null)} />
                            </label>
                          </div>
                          {uploaded && (
                            <p className="text-green-600 text-xs mt-2 font-medium">✓ {((formData as any)[doc.key] as File).name}</p>
                          )}
                        </div>
                      );
                    })}
                    <div>
                      <label className={labelCls}>Insurance Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => updateField('insuranceType', 'third-party')} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.insuranceType === 'third-party' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <Shield className="w-5 h-5 text-gray-400 mb-2" />
                          <p className="font-bold text-gray-900 text-sm">Third-Party</p>
                          <p className="text-gray-400 text-xs">Silver tier access</p>
                        </button>
                        <button onClick={() => updateField('insuranceType', 'comprehensive')} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.insuranceType === 'comprehensive' ? 'border-[#F5B400] bg-[#F5B400]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                          <Shield className="w-5 h-5 text-[#F5B400] mb-2" />
                          <p className="font-bold text-gray-900 text-sm">Comprehensive</p>
                          <p className="text-[#F5B400] text-xs font-bold">Gold tier access</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─ Step 4: Agreement ─ */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 max-h-52 overflow-y-auto text-sm text-gray-600 leading-relaxed border border-gray-100">
                      <p className="font-bold text-[#0B2239] mb-2">Independent Contractor Agreement</p>
                      <p className="mb-2">By registering as a driver on the Fast Man &amp; Van platform, you acknowledge and agree that:</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs">
                        <li>You are an independent contractor, not an employee of Fast Man &amp; Van.</li>
                        <li>Fast Man &amp; Van operates as a digital marketplace connecting drivers and customers.</li>
                        <li>You are responsible for your own taxes, insurance, and vehicle maintenance.</li>
                        <li>You must maintain valid insurance and driving licence at all times.</li>
                        <li>You must not transport prohibited items including weapons, illegal drugs, explosives, or hazardous chemicals.</li>
                        <li>You agree to enable GPS tracking while on active jobs.</li>
                        <li>Platform commission will be deducted from card payments automatically.</li>
                        <li>Your data will be processed in accordance with our Privacy Policy and GDPR regulations.</li>
                      </ul>
                    </div>

                    {[
                      { field: 'agreeTerms',      text: 'I agree to the Terms and Conditions, Privacy Policy, and Driver Agreement.' },
                      { field: 'agreeContractor', text: 'I confirm I am registering as an independent contractor and am not an employee of Fast Man & Van.' },
                    ].map(({ field, text }) => (
                      <label key={field} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${(formData as any)[field] ? 'bg-[#0E2A47] border-[#0E2A47]' : 'border-gray-300'}`}>
                          {(formData as any)[field] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" checked={(formData as any)[field]} onChange={(e) => updateField(field, e.target.checked)} className="sr-only" />
                        <span className="text-sm text-gray-700 leading-snug">{text}</span>
                      </label>
                    ))}

                    {(!formData.agreeTerms || !formData.agreeContractor) && (
                      <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Both agreements must be accepted to submit your application.
                      </div>
                    )}
                    {submitError && (
                      <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 p-3.5 rounded-xl">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {submitError}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-500 hover:text-[#0B2239] font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                  ) : (
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-500 hover:text-[#0B2239] font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                      <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                  )}
                  {step < 4 ? (
                    <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 bg-[#0E2A47] hover:bg-[#0F3558] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5">
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!formData.agreeTerms || !formData.agreeContractor || isSubmitting}
                      className="flex items-center gap-2 bg-[#F5B400] hover:bg-[#E5A000] disabled:bg-gray-200 disabled:cursor-not-allowed text-[#0E2A47] disabled:text-gray-400 px-8 py-2.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? 'Submitting…' : 'Submit Application'}
                      {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default DriverRegistration;
