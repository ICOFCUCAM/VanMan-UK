import React, { useState } from 'react';
import { Truck, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, User, Car, Shield, FileText, Loader2 } from 'lucide-react';
import { registerDriver } from '@/services/drivers';
import { uploadDriverDocument } from '@/services/storage';
import { useAppContext } from '@/contexts/AppContext';
import type { InsuranceType } from '@/types';

interface DriverRegistrationProps {
  onNavigate: (page: string) => void;
}

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

  const updateField = (field: string, value: any) => setFormData({ ...formData, [field]: value });

  const handleSubmit = async () => {
    if (!formData.agreeTerms || !formData.agreeContractor) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const uploadDoc = async (
      file: File | null,
      docType: Parameters<typeof uploadDriverDocument>[1],
    ) => {
      if (!file) return null;
      const { url, error } = await uploadDriverDocument(formData.email, docType, file);
      if (error) throw new Error(`Failed to upload ${docType}: ${error.message}`);
      return url;
    };

    let licenseUrl: string | null = null;
    let insuranceUrl: string | null = null;
    let registrationUrl: string | null = null;
    let photoUrl: string | null = null;

    try {
      [licenseUrl, insuranceUrl, registrationUrl, photoUrl] = await Promise.all([
        uploadDoc(formData.driverLicense, 'license'),
        uploadDoc(formData.insuranceDoc, 'insurance'),
        uploadDoc(formData.vehicleRegistration, 'registration'),
        uploadDoc(formData.vehiclePhotos, 'vehicle_photos'),
      ]);
    } catch (uploadErr) {
      setIsSubmitting(false);
      setSubmitError((uploadErr as Error).message);
      return;
    }

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
      user_id: user?.id,
      license_document_url: licenseUrl,
      insurance_document_url: insuranceUrl,
      vehicle_registration_url: registrationUrl,
      vehicle_photo_url: photoUrl,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message || 'Failed to submit application. Please try again.');
      return;
    }

    setDriverId(data!.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">Thank you for applying to drive with Fast Man & Van. Our team will review your documents and get back to you within 48 hours.</p>
            {driverId && <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-50 inline-block px-4 py-2 rounded-lg">Application Ref: {driverId.slice(0, 8).toUpperCase()}</p>}
            <p className="text-sm text-gray-500 mb-8">You'll receive an email confirmation shortly.</p>
            <button onClick={() => onNavigate('home')} className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Personal Info', icon: User },
    { num: 2, label: 'Vehicle Details', icon: Car },
    { num: 3, label: 'Documents', icon: Upload },
    { num: 4, label: 'Agreement', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Become a Driver</h1>
          <p className="text-gray-600">Join thousands of drivers earning great money on their own schedule.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  step === s.num ? 'bg-[#0A2463] text-white' : step > s.num ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {idx < steps.length - 1 && <div className={`w-8 h-0.5 ${step > s.num ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="+44 7xxx xxx xxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="Street address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="London" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                  <input type="text" value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="SW1A 1AA" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
                <input type="text" value={formData.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="SMITH901234AB5CD" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                <input type="date" value={formData.licenseExpiry} onChange={(e) => updateField('licenseExpiry', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Small Van', 'Medium Van', 'Large Van', 'Luton Van'].map((type) => (
                    <button key={type} onClick={() => updateField('vehicleType', type)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.vehicleType === type ? 'border-[#0A2463] bg-[#0A2463]/5 text-[#0A2463]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input type="text" value={formData.vehicleMake} onChange={(e) => updateField('vehicleMake', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="Ford" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input type="text" value={formData.vehicleModel} onChange={(e) => updateField('vehicleModel', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="Transit" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="text" value={formData.vehicleYear} onChange={(e) => updateField('vehicleYear', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="2023" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration</label>
                <input type="text" value={formData.vehicleReg} onChange={(e) => updateField('vehicleReg', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="AB12 CDE" />
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Documents</h3>
              <p className="text-gray-600 text-sm mb-4">All documents will be securely stored and verified by our team.</p>
              {[
                { key: 'driverLicense', label: 'Driver License', desc: 'Front and back of your driving license' },
                { key: 'vehicleRegistration', label: 'Vehicle Registration (V5C)', desc: 'Vehicle logbook document' },
                { key: 'vehiclePhotos', label: 'Vehicle Photos', desc: 'Clear photos of your vehicle (front, back, sides)' },
                { key: 'insuranceDoc', label: 'Insurance Documentation', desc: 'Valid vehicle insurance certificate' },
              ].map((doc) => (
                <div key={doc.key} className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#0A2463]/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{doc.label}</p>
                      <p className="text-gray-500 text-sm">{doc.desc}</p>
                    </div>
                    <label className="cursor-pointer bg-[#0A2463]/10 hover:bg-[#0A2463]/20 text-[#0A2463] px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {(formData as any)[doc.key] ? 'Uploaded' : 'Upload'}
                      <input type="file" className="hidden" onChange={(e) => updateField(doc.key, e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  {(formData as any)[doc.key] && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {((formData as any)[doc.key] as File).name}
                    </div>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => updateField('insuranceType', 'third-party')} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.insuranceType === 'third-party' ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
                    <Shield className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="font-semibold text-gray-900 text-sm">Third-Party Insurance</p>
                    <p className="text-gray-500 text-xs">Silver Star tier access</p>
                  </button>
                  <button onClick={() => updateField('insuranceType', 'comprehensive')} className={`p-4 rounded-xl border-2 text-left transition-all ${formData.insuranceType === 'comprehensive' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200'}`}>
                    <Shield className="w-6 h-6 text-[#D4AF37] mb-2" />
                    <p className="font-semibold text-gray-900 text-sm">Comprehensive Insurance</p>
                    <p className="text-[#D4AF37] text-xs font-medium">Golden Star tier access</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Agreement */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Driver Agreement</h3>
              <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto text-sm text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900 mb-2">Independent Contractor Agreement</p>
                <p className="mb-2">By registering as a driver on the Fast Man & Van platform, you acknowledge and agree that:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You are an independent contractor, not an employee of Fast Man & Van.</li>
                  <li>Fast Man & Van operates as a digital marketplace connecting drivers and customers.</li>
                  <li>You are responsible for your own taxes, insurance, and vehicle maintenance.</li>
                  <li>You must maintain valid insurance and driving license at all times.</li>
                  <li>You must not transport prohibited items including weapons, illegal drugs, explosives, or hazardous chemicals.</li>
                  <li>You agree to enable GPS tracking while on active jobs.</li>
                  <li>Platform commission will be deducted from card payments automatically.</li>
                  <li>Your data will be processed in accordance with our Privacy Policy and GDPR regulations.</li>
                </ul>
              </div>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => updateField('agreeTerms', e.target.checked)} className="w-5 h-5 rounded mt-0.5 text-[#0A2463]" />
                <span className="text-sm text-gray-700">I agree to the Terms and Conditions, Privacy Policy, and Driver Agreement.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={formData.agreeContractor} onChange={(e) => updateField('agreeContractor', e.target.checked)} className="w-5 h-5 rounded mt-0.5 text-[#0A2463]" />
                <span className="text-sm text-gray-700">I confirm that I am registering as an independent contractor and understand that I am not an employee of Fast Man & Van.</span>
              </label>
              {(!formData.agreeTerms || !formData.agreeContractor) && (
                <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Please accept both agreements to proceed.
                </div>
              )}
              {submitError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms || !formData.agreeContractor || isSubmitting}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A028] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#0A2463] px-8 py-3 rounded-xl font-bold transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? 'Submitting...' : 'Submit Application'} {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;
