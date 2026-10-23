"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RegisterForm from "@/components/landing/RegisterForm";
import LoginForm from "@/components/landing/LoginForm";
import GoogleIcon from "@/components/ui/GoogleIcon";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";

export default function PrivacyContent() {
  const [regVisible, setRegVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#151b3b] to-[#1c2942] text-white">
      <Navbar onReg={() => setRegVisible(true)} onLog={() => setLogVisible(true)} />

      {/* Header Banner */}
      <header className="relative mx-auto max-w-5xl px-6 pt-36 pb-12">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-32 h-64 w-64 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-violet-400">Privacy Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-4">
            <PolicyRoundedIcon sx={{ fontSize: 16 }} /> Official Legal Document
          </div>

          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Last Updated: <time dateTime="2026-10-21">October 21, 2026</time> • Effective Date: October 21, 2026
          </p>
        </div>
      </header>

      {/* Main Semantic Article Content */}
      <article className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-10 leading-relaxed text-gray-300">

          {/* Quick Notice Card */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 flex items-start gap-3.5">
            <VerifiedUserRoundedIcon className="text-violet-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-gray-300">
              <strong className="text-white block mb-1">Our Core Commitment to Your Privacy</strong>
              Helix is engineered to empower developers and creators to collaborate effortlessly. We do not sell your personal data, monetize your projects, or utilize your confidential workspace details to train advertising algorithms.
            </div>
          </div>

          {/* Table of Contents */}
          <section aria-labelledby="toc-heading" className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h2 id="toc-heading" className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Table of Contents
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
              <li><a href="#section-1" className="hover:text-violet-400 transition">1. Who We Are & Overview</a></li>
              <li><a href="#section-2" className="hover:text-violet-400 transition">2. Information We Collect</a></li>
              <li><a href="#section-3" className="hover:text-violet-400 transition font-semibold text-violet-300">3. Google API & Calendar Limited Use Policy</a></li>
              <li><a href="#section-4" className="hover:text-violet-400 transition">4. How We Use Collected Data</a></li>
              <li><a href="#section-5" className="hover:text-violet-400 transition">5. Data Storage & Security</a></li>
              <li><a href="#section-6" className="hover:text-violet-400 transition">6. Data Sharing & Third Parties</a></li>
              <li><a href="#section-7" className="hover:text-violet-400 transition">7. Your Rights & Data Deletion</a></li>
              <li><a href="#section-8" className="hover:text-violet-400 transition">8. Cookies & Local Storage</a></li>
              <li><a href="#section-9" className="hover:text-violet-400 transition">9. Contact Information</a></li>
            </ol>
          </section>

          {/* Section 1 */}
          <section id="section-1" aria-labelledby="heading-1" className="space-y-3">
            <h2 id="heading-1" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              1. Who We Are & Overview
            </h2>
            <p className="text-sm">
              This Privacy Policy applies to the <strong>Helix</strong> collaborative productivity web platform (&quot;Helix&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated by <strong>Seraphim Creationverse</strong>. It governs the manner in which Helix collects, uses, maintains, and discloses information gathered from users (&quot;User&quot;, &quot;you&quot;) of the website and associated services.
            </p>
            <p className="text-sm">
              By accessing or using Helix, you acknowledge that you have read and understood the practices described in this Privacy Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" aria-labelledby="heading-2" className="space-y-3">
            <h2 id="heading-2" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              2. Information We Collect
            </h2>
            <div className="space-y-3 text-sm">
              <p>We collect information in the following categories:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Account Information:</strong> When you register directly or authenticate via Google OAuth, we collect your email address, chosen username, hashed passwords (for credential accounts), and profile avatar picture.
                </li>
                <li>
                  <strong className="text-white">Workspace & Collaboration Data:</strong> Projects, tasks, subtask checklists, calendar appointments, kanban cards, and chat channel messages that you explicitly create and share inside Helix.
                </li>
                <li>
                  <strong className="text-white">Technical & Usage Logs:</strong> IP address, browser type, device information, operating system, and session timestamps used solely for security auditing and diagnostic error reporting.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 - Google API Disclosure (Crucial for OAuth Verification) */}
          <section id="section-3" aria-labelledby="heading-3" className="space-y-4 rounded-2xl border border-violet-500/30 bg-violet-600/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-2 border border-white/10 shrink-0">
                <GoogleIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Compliance Disclosure</span>
                <h2 id="heading-3" className="text-lg font-bold text-white">
                  3. Google API Services & Google Calendar Data (Limited Use Policy)
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <p>
                Helix offers optional integrations with Google OAuth authentication and the <strong>Google Calendar API</strong> (requesting scopes <code>openid</code>, <code>email</code>, <code>profile</code>, and <code>https://www.googleapis.com/auth/calendar.events</code>).
              </p>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2.5 text-xs sm:text-sm">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} className="text-cyan-400" />
                  How We Access, Use, and Store Google User Data:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                  <li>
                    <strong className="text-white">Access:</strong> We access your basic Google profile details (name, email, and avatar) for identity verification, and your Google Calendar events (titles, descriptions, and start/end timestamps).
                  </li>
                  <li>
                    <strong className="text-white">Use:</strong> Google Calendar data is accessed solely to enable bidirectional schedule synchronization—displaying your Google events inside Helix Calendar and optionally exporting your Helix tasks and schedule events to your Google Calendar.
                  </li>
                  <li>
                    <strong className="text-white">Storage:</strong> Google OAuth tokens (access tokens and refresh tokens) are encrypted and stored in our PostgreSQL database to maintain your scheduled synchronization. We do not store sensitive Google account credentials or passwords.
                  </li>
                  <li>
                    <strong className="text-white">No Sale or Advertising:</strong> Helix does <strong>NOT</strong> sell, rent, monetize, transfer, or disclose Google user data to third-party data brokers, advertisers, or data marketplaces under any circumstances.
                  </li>
                  <li>
                    <strong className="text-white">No AI Model Training:</strong> Your Google Calendar event data is strictly used for in-app schedule rendering. We do <strong>NOT</strong> use Google user data to train, tune, or improve generalized artificial intelligence or machine learning models.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs sm:text-sm text-emerald-200">
                <strong>Google API Services User Data Policy Compliance Statement:</strong><br />
                Helix&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:text-white"
                >
                  Google API Services User Data Policy
                </a>, including the Limited Use requirements.
              </div>

              <p className="text-xs text-gray-400">
                You can revoke Helix&apos;s access to your Google account at any moment through your Helix Settings panel or directly in your{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-violet-400 hover:text-violet-300"
                >
                  Google Security Permissions
                </a>. Revoking access immediately halts synchronization and permanently deletes stored access tokens.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" aria-labelledby="heading-4" className="space-y-3">
            <h2 id="heading-4" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              4. How We Use Collected Data
            </h2>
            <div className="space-y-2 text-sm">
              <p>Helix utilizes collected information strictly for legitimate operational purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Providing, maintaining, and updating the Helix collaboration and task tracking platform.</li>
                <li>Facilitating real-time project synchronization and team chat communication.</li>
                <li>Authenticating user sessions and safeguarding accounts against unauthorized intrusions.</li>
                <li>Providing customer support and responding to system error logs.</li>
                <li>Delivering user-configured browser and system activity notifications.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" aria-labelledby="heading-5" className="space-y-3">
            <h2 id="heading-5" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              5. Data Storage, Security & Retention
            </h2>
            <p className="text-sm">
              We employ industry-standard technical safeguards to protect your personal and workspace information. All communications between your browser and our servers are encrypted using Transport Layer Security (TLS/SSL). Passwords are cryptographically hashed using salted bcrypt prior to database storage.
            </p>
            <p className="text-sm">
              User data is persisted securely in cloud databases managed by Neon (AWS ap-southeast-1 region) with strict network isolation. We retain your data as long as your account remains active or until you request account deletion.
            </p>
          </section>

          {/* Section 6 */}
          <section id="section-6" aria-labelledby="heading-6" className="space-y-3">
            <h2 id="heading-6" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              6. Data Sharing & Third Parties
            </h2>
            <p className="text-sm">
              We do not sell, trade, or rent personal identification information to others. We share data only with trusted service providers necessary to operate the application infrastructure:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-white">Neon PostgreSQL:</strong> Cloud database storage provider.</li>
              <li><strong className="text-white">Upstash Redis:</strong> High-performance caching and WebSocket adapter.</li>
              <li><strong className="text-white">Google Cloud:</strong> OAuth identity verification and calendar sync (when initiated by the user).</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="section-7" aria-labelledby="heading-7" className="space-y-3">
            <h2 id="heading-7" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              7. Your Rights & Data Deletion
            </h2>
            <p className="text-sm">
              Depending on your location (including rights under GDPR and CCPA), you possess the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Access, export, or receive a copy of your personal data stored on Helix.</li>
              <li>Rectify inaccurate personal details or update your username and email address via Settings.</li>
              <li>Request the complete deletion of your account and all associated workspace records.</li>
              <li>Disconnect third-party integrations (such as Google Calendar) at any time.</li>
            </ul>
            <p className="text-sm">
              To exercise any of these rights, please contact our privacy representative directly at{" "}
              <a href="mailto:seraphimcreationverse@gmail.com" className="text-violet-400 font-semibold underline">
                seraphimcreationverse@gmail.com
              </a>.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" aria-labelledby="heading-8" className="space-y-3">
            <h2 id="heading-8" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              8. Cookies & Local Storage
            </h2>
            <p className="text-sm">
              Helix utilizes essential HTTP cookies strictly to maintain user authentication sessions (NextAuth session tokens). We also utilize browser LocalStorage solely to preserve client-side UI configurations, such as your dark/light theme, font sizes, sidebar collapse status, and dismissed notification alerts.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" aria-labelledby="heading-9" className="space-y-4">
            <h2 id="heading-9" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              9. Contact Information
            </h2>
            <p className="text-sm">
              If you have any questions, concerns, or requests regarding this Privacy Policy or Helix&apos;s data practices, please reach out to:
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 shrink-0">
                <MailOutlineRoundedIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Seraphim Creationverse / Helix Legal Desk</p>
                <p className="text-xs text-gray-400">Attn: Privacy & Data Protection Officer</p>
                <a
                  href="mailto:seraphimcreationverse@gmail.com"
                  className="mt-1 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300 transition"
                >
                  seraphimcreationverse@gmail.com
                </a>
              </div>
            </div>
          </section>

        </div>
      </article>

      <Footer />

      {/* Auth Modals */}
      {regVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <RegisterForm
            onClose={() => setRegVisible(false)}
            onSwitchToLogin={() => {
              setRegVisible(false);
              setLogVisible(true);
            }}
          />
        </div>
      )}
      {logVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <LoginForm
            onClose={() => setLogVisible(false)}
            onSwitchToRegister={() => {
              setLogVisible(false);
              setRegVisible(true);
            }}
          />
        </div>
      )}
    </main>
  );
}
