import React, { useState } from 'react';
import { ArrowLeft, FileText, Shield, Cookie, Truck, XCircle, Phone, Info } from 'lucide-react';
import { BRAND } from '@/lib/constants';

type LegalPage = 'terms' | 'privacy' | 'cookies' | 'driver-agreement' | 'cancellation' | 'contact' | 'about';

interface LegalPagesProps {
  page: LegalPage;
  onNavigate: (page: string) => void;
}

const sections: Record<LegalPage, { title: string; icon: React.ReactNode }> = {
  terms: { title: 'Terms & Conditions', icon: <FileText className="w-6 h-6" /> },
  privacy: { title: 'Privacy Policy', icon: <Shield className="w-6 h-6" /> },
  cookies: { title: 'Cookie Policy', icon: <Cookie className="w-6 h-6" /> },
  'driver-agreement': { title: 'Driver Agreement', icon: <Truck className="w-6 h-6" /> },
  cancellation: { title: 'Cancellation Policy', icon: <XCircle className="w-6 h-6" /> },
  contact: { title: 'Contact Us', icon: <Phone className="w-6 h-6" /> },
  about: { title: 'About Us', icon: <Info className="w-6 h-6" /> },
};

const LegalPages: React.FC<LegalPagesProps> = ({ page, onNavigate }) => {
  const section = sections[page] || sections.terms;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#0E2A47] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-4">
            <div className="text-[#F5B400]">{section.icon}</div>
            <h1 className="text-3xl sm:text-4xl font-bold">{section.title}</h1>
          </div>
          <p className="mt-4 text-white/70 text-sm">
            {BRAND.name} · Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {page === 'terms' && <TermsContent />}
        {page === 'privacy' && <PrivacyContent />}
        {page === 'cookies' && <CookiesContent />}
        {page === 'driver-agreement' && <DriverAgreementContent />}
        {page === 'cancellation' && <CancellationContent />}
        {page === 'contact' && <ContactContent />}
        {page === 'about' && <AboutContent />}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border/40">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsContent = () => (
  <div>
    <Section title="1. Acceptance of Terms">
      <p>By accessing or using {BRAND.name} services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.</p>
    </Section>
    <Section title="2. Service Description">
      <p>{BRAND.name} is a logistics technology platform that connects customers with independent professional drivers for the transport of goods across the United Kingdom.</p>
      <p>We act as an intermediary between customers and drivers. We do not employ drivers directly — they operate as independent contractors.</p>
    </Section>
    <Section title="3. Booking and Payment">
      <p>All bookings must be made through our platform. Payment is processed securely at the time of booking. Prices are calculated based on distance, vehicle type, time of day, and other factors.</p>
      <p>A minimum booking fee of £{50} applies to all jobs. The platform commission is {20}% of the total job value.</p>
    </Section>
    <Section title="4. Prohibited Items">
      <p>The following items may not be transported: weapons and firearms, illegal drugs, explosives, hazardous chemicals, radioactive materials, and flammable liquids in bulk quantities.</p>
    </Section>
    <Section title="5. Liability">
      <p>{BRAND.name} provides a platform service only. Liability for goods in transit rests with the driver's insurance policy. We recommend customers declare the value of items and request additional cover where appropriate.</p>
    </Section>
    <Section title="6. Governing Law">
      <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
    </Section>
  </div>
);

const PrivacyContent = () => (
  <div>
    <Section title="1. Data We Collect">
      <p>We collect information you provide when registering, booking, or contacting us. This includes your name, email address, phone number, delivery addresses, and payment information.</p>
    </Section>
    <Section title="2. How We Use Your Data">
      <p>Your data is used to provide and improve our services, process payments, communicate with you about bookings, and comply with legal obligations. We do not sell your personal data to third parties.</p>
    </Section>
    <Section title="3. Data Retention">
      <p>We retain your personal data for as long as your account is active or as required by law. You may request deletion of your account and associated data at any time by contacting us at {BRAND.email}.</p>
    </Section>
    <Section title="4. Your Rights (UK GDPR)">
      <p>Under UK GDPR you have the right to access, rectify, erase, restrict processing of, and port your personal data. You also have the right to object to processing and to lodge a complaint with the ICO.</p>
    </Section>
    <Section title="5. Cookies">
      <p>We use cookies to improve your experience. See our Cookie Policy for full details.</p>
    </Section>
    <Section title="6. Contact">
      <p>For privacy enquiries contact our Data Protection Officer at {BRAND.email}.</p>
    </Section>
  </div>
);

const CookiesContent = () => (
  <div>
    <Section title="What Are Cookies">
      <p>Cookies are small text files placed on your device when you visit our website. They help us remember your preferences and understand how you use our platform.</p>
    </Section>
    <Section title="Types of Cookies We Use">
      <p><strong>Essential cookies</strong> — Required for the website to function correctly. These cannot be disabled.</p>
      <p><strong>Analytics cookies</strong> — Help us understand visitor behaviour so we can improve the platform (e.g. Google Analytics).</p>
      <p><strong>Marketing cookies</strong> — Used to show relevant advertisements and measure campaign effectiveness.</p>
    </Section>
    <Section title="Managing Cookies">
      <p>You can manage your cookie preferences at any time via the cookie consent banner at the bottom of our website, or through your browser settings. Disabling certain cookies may affect site functionality.</p>
    </Section>
  </div>
);

const DriverAgreementContent = () => (
  <div>
    <Section title="1. Independent Contractor Status">
      <p>Drivers using the {BRAND.name} platform operate as independent contractors, not employees. You are responsible for your own taxes, National Insurance contributions, and compliance with HMRC requirements.</p>
    </Section>
    <Section title="2. Vehicle and Insurance Requirements">
      <p>All drivers must hold a valid UK driving licence, maintain a roadworthy vehicle, and hold valid goods-in-transit insurance. Gold tier drivers must hold comprehensive insurance covering goods up to £50,000.</p>
    </Section>
    <Section title="3. Platform Commission">
      <p>The platform retains a 20% commission on all completed jobs. The remaining 80% is paid to the driver weekly via bank transfer.</p>
    </Section>
    <Section title="4. Driver Tiers">
      <p><strong>Golden Star</strong> — Comprehensive insurance, priority job access, higher earning potential.</p>
      <p><strong>Silver Star</strong> — Standard insurance, access to standard job listings.</p>
    </Section>
    <Section title="5. Code of Conduct">
      <p>Drivers must maintain professional conduct at all times, arrive punctually, handle goods with care, and keep customers informed of any delays. Repeated violations may result in account suspension.</p>
    </Section>
    <Section title="6. Prohibited Conduct">
      <p>Accepting payment outside the platform, transporting prohibited items, or misrepresenting your identity or vehicle details will result in immediate account termination.</p>
    </Section>
  </div>
);

const CancellationContent = () => (
  <div>
    <Section title="Customer Cancellations">
      <p><strong>More than 24 hours before pickup</strong> — Full refund, no charge.</p>
      <p><strong>12–24 hours before pickup</strong> — 50% refund of the booking fee.</p>
      <p><strong>Less than 12 hours before pickup</strong> — No refund. The booking fee is retained to compensate the assigned driver.</p>
      <p><strong>No-show</strong> — No refund. The driver will wait up to 15 minutes before marking the job as a no-show.</p>
    </Section>
    <Section title="Driver Cancellations">
      <p>If a driver cancels a confirmed booking, the customer will receive a full refund and we will attempt to assign a replacement driver. Drivers with excessive cancellation rates may have their accounts suspended.</p>
    </Section>
    <Section title="Platform Cancellations">
      <p>In exceptional circumstances (severe weather, force majeure) we may cancel bookings. Full refunds will be issued in all such cases.</p>
    </Section>
    <Section title="How to Cancel">
      <p>To cancel a booking, log in to your account and navigate to your active bookings, or contact us at {BRAND.email} or via WhatsApp on {BRAND.whatsappDisplay}.</p>
    </Section>
  </div>
);

const ContactContent = () => (
  <div>
    <Section title="Get in Touch">
      <p>We're here to help. You can reach us through any of the following channels:</p>
    </Section>
    <div className="grid sm:grid-cols-2 gap-6 mb-10">
      {[
        { label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
        { label: 'Phone', value: BRAND.phone, href: `tel:${BRAND.phone}` },
        { label: 'WhatsApp', value: BRAND.whatsappDisplay, href: `https://wa.me/${BRAND.whatsapp}` },
        { label: 'Support Hours', value: 'Monday – Sunday, 6am – 11pm GMT', href: null },
      ].map((item) => (
        <div key={item.label} className="p-5 rounded-lg border border-border/40 bg-card">
          <div className="text-sm font-medium text-muted-foreground mb-1">{item.label}</div>
          {item.href ? (
            <a href={item.href} className="text-primary font-medium hover:underline">{item.value}</a>
          ) : (
            <div className="font-medium">{item.value}</div>
          )}
        </div>
      ))}
    </div>
    <Section title="Complaints">
      <p>If you have a complaint about our service, please email {BRAND.email} with the subject line "Complaint — [your booking reference]". We aim to respond within 2 business days.</p>
    </Section>
  </div>
);

const AboutContent = () => (
  <div>
    <Section title="Who We Are">
      <p>{BRAND.name} is a UK-based logistics technology platform founded to make man-and-van services faster, safer, and more transparent. We connect customers with vetted independent drivers across the United Kingdom.</p>
    </Section>
    <Section title="Our Mission">
      <p>To deliver the most reliable, tech-driven logistics platform in the UK — giving customers real-time visibility and giving drivers fair, flexible work opportunities.</p>
    </Section>
    <Section title="Our Values">
      <p><strong>Transparency</strong> — Clear pricing, no hidden fees, live tracking.</p>
      <p><strong>Safety</strong> — All drivers are vetted, insured, and rated by customers.</p>
      <p><strong>Fairness</strong> — Drivers keep 80% of every job. Customers get competitive rates.</p>
      <p><strong>Innovation</strong> — AI-powered dispatch, real-time tracking, and smart load matching.</p>
    </Section>
    <Section title="Coverage">
      <p>We operate across the United Kingdom including London, Manchester, Birmingham, Edinburgh, Cardiff, Leeds, Bristol, and all major cities. Rural and remote areas may have limited availability.</p>
    </Section>
    <Section title="Contact">
      <p>For business enquiries: {BRAND.email}</p>
      <p>Phone: {BRAND.phone}</p>
    </Section>
  </div>
);

export default LegalPages;
