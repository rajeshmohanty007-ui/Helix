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
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

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
            <span className="text-violet-400 font-medium">Privacy Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-4">
            <PolicyRoundedIcon sx={{ fontSize: 16 }} /> Official Legal Document &amp; Compliance Statement
          </div>

          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Privacy Policy &amp; Google API Services Disclosure
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            <strong>Helix</strong> — A Product of <strong>Seraphim Studio</strong> • Last Updated: <time dateTime="2026-10-24">October 24, 2026</time> • Effective Date: October 21, 2026
          </p>
        </div>
      </header>

      {/* Main Semantic Article Content */}
      <article className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-12 leading-relaxed text-gray-300">

          {/* Quick Notice Card */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 flex items-start gap-3.5">
            <VerifiedUserRoundedIcon className="text-violet-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-gray-300">
              <strong className="text-white block mb-1">Our Core Commitment to Your Privacy</strong>
              Helix is an official product of <strong>Seraphim Studio</strong> (hosted at <a href="https://helix.seraphimstudio.in" className="text-violet-300 underline font-semibold">https://helix.seraphimstudio.in</a>), engineered to empower developers and modern teams to collaborate effortlessly. We do not sell your personal data, monetize your projects, or utilize your confidential workspace or calendar data to train generalized AI algorithms or serve advertisements.
            </div>
          </div>

          {/* Table of Contents */}
          <section aria-labelledby="toc-heading" className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h2 id="toc-heading" className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Table of Contents
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
              <li><a href="#section-1" className="hover:text-violet-400 transition">1. Who We Are &amp; Scope Overview</a></li>
              <li><a href="#section-2" className="hover:text-violet-400 transition">2. Information We Collect</a></li>
              <li><a href="#section-3" className="hover:text-violet-400 transition font-semibold text-violet-300">3. Google API Services &amp; Limited Use Policy</a></li>
              <li><a href="#section-4" className="hover:text-violet-400 transition">4. How We Use Collected Data</a></li>
              <li><a href="#section-5" className="hover:text-violet-400 transition">5. Data Storage, Security &amp; Retention</a></li>
              <li><a href="#section-6" className="hover:text-violet-400 transition">6. Data Sharing &amp; Third-Party Services</a></li>
              <li><a href="#section-7" className="hover:text-violet-400 transition">7. Your Rights, Access Revocation &amp; Deletion</a></li>
              <li><a href="#section-8" className="hover:text-violet-400 transition">8. Cookies &amp; Local Storage</a></li>
              <li><a href="#section-9" className="hover:text-violet-400 transition">9. Contact &amp; Legal Desk</a></li>
            </ol>
          </section>

          {/* Section 1 */}
          <section id="section-1" aria-labelledby="heading-1" className="space-y-3">
            <h2 id="heading-1" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              1. Who We Are &amp; Scope Overview
            </h2>
            <p className="text-sm">
              This Privacy Policy applies to the <strong>Helix</strong> collaborative productivity web platform (accessible at <a href="https://helix.seraphimstudio.in" className="text-violet-400 font-semibold underline">https://helix.seraphimstudio.in</a>), designed, owned, and operated by <strong>Seraphim Studio</strong> (&quot;Seraphim Studio&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). Helix is a product of Seraphim Studio. This policy governs how Helix collects, uses, maintains, protects, and discloses information gathered from users (&quot;User&quot;, &quot;you&quot;) of the website and associated services.
            </p>
            <p className="text-sm">
              By accessing or using Helix, you acknowledge that you have read, understood, and agreed to the practices outlined in this Privacy Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" aria-labelledby="heading-2" className="space-y-3">
            <h2 id="heading-2" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              2. Information We Collect
            </h2>
            <div className="space-y-3 text-sm">
              <p>We collect information in the following structured categories:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Account Information:</strong> When you register directly or authenticate via Google OAuth, we collect your email address, chosen username, password hash (for credential accounts only), and profile avatar picture.
                </li>
                <li>
                  <strong className="text-white">Workspace &amp; Collaboration Data:</strong> Projects, tasks, subtask checklists, milestones, kanban cards, and team chat messages that you explicitly create and share inside Helix.
                </li>
                <li>
                  <strong className="text-white">Technical &amp; Usage Logs:</strong> IP address, browser type, device information, operating system, and session timestamps used solely for security auditing, fraud prevention, and diagnostic error reporting.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 - Google API Services & Limited Use Policy (Crucial for OAuth Verification) */}
          <section id="section-3" aria-labelledby="heading-3" className="space-y-6 rounded-2xl border border-violet-500/30 bg-violet-600/5 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-2.5 border border-white/10 shrink-0">
                <GoogleIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Mandatory Verification Disclosure</span>
                <h2 id="heading-3" className="text-xl font-bold text-white">
                  3. Google API Services &amp; Google Calendar Data (Limited Use Policy)
                </h2>
              </div>
            </div>

            <p className="text-sm text-gray-300">
              Helix provides optional integration with Google OAuth sign-in and the <strong>Google Calendar API</strong> to facilitate seamless workflow synchronization. Our use of Google user data is strictly limited to authorized in-app productivity functionality.
            </p>

            {/* Verbatim Limited Use Statement */}
            <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-sm text-emerald-100 shadow-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm sm:text-base">
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20 }} />
                Google API Services User Data Policy Compliance Statement
              </div>
              <p className="font-medium leading-relaxed">
                Helix&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-white hover:text-emerald-200"
                >
                  Google API Services User Data Policy
                </a>, including the Limited Use requirements.
              </p>
            </div>

            {/* Scope-by-Scope Breakdown Table */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} className="text-cyan-400" />
                Google OAuth Scopes Requested &amp; Purpose of Processing
              </h3>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-white/10 bg-white/5 text-gray-300 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Scope</th>
                      <th className="py-3 px-4">Data Accessed</th>
                      <th className="py-3 px-4">User-Facing Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-3 px-4 font-mono text-violet-300 text-xs">
                        openid<br />
                        email<br />
                        profile
                      </td>
                      <td className="py-3 px-4">
                        Google User ID, primary email address, display name, and avatar picture.
                      </td>
                      <td className="py-3 px-4">
                        Used solely for identity authentication, creating and managing your Helix account, and displaying your profile inside team workspaces.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-violet-300 text-xs">
                        https://www.googleapis.com/auth/calendar.events
                      </td>
                      <td className="py-3 px-4">
                        Calendar event titles, descriptions, start/end dates and times, and event IDs.
                      </td>
                      <td className="py-3 px-4">
                        Enables bidirectional schedule synchronization: displaying your scheduled Google Calendar events within the Helix Calendar view, and exporting/updating Helix tasks on your Google Calendar upon your action.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* The 4 Limited Use Pillars */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Our Specific Adherence to Google Limited Use Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18 }} className="text-violet-400" />
                    1. Prominent User-Facing Features
                  </div>
                  <p className="text-gray-400">
                    We access and use Google user data exclusively to provide or improve prominent, user-facing features visible directly within the Helix application interface (such as rendering your calendar schedule).
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <BlockRoundedIcon sx={{ fontSize: 18 }} className="text-rose-400" />
                    2. Absolute Prohibition on Advertising
                  </div>
                  <p className="text-gray-400">
                    We do <strong>NOT</strong> use or transfer Google user data for serving advertisements, including personalized, re-targeted, or interest-based advertising. We never sell or monetize Google user data under any circumstances.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <SmartToyOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-400" />
                    3. No Generalized AI/ML Model Training
                  </div>
                  <p className="text-gray-400">
                    Helix does <strong>NOT</strong> use Google user data (including calendar event titles or descriptions) to train, fine-tune, or develop generalized artificial intelligence (AI) or machine learning (ML) models.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} className="text-cyan-400" />
                    4. Strict Prohibition on Human Reading
                  </div>
                  <p className="text-gray-400">
                    Helix does <strong>NOT</strong> allow humans to read user data obtained from Google APIs unless:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400 text-xs">
                    <li>We have obtained your explicit affirmative consent for specific items (e.g., during a customer support request);</li>
                    <li>It is necessary for security purposes (such as investigating abuse or bugs);</li>
                    <li>It is necessary to comply with applicable laws; or</li>
                    <li>The data has been aggregated and de-identified for necessary internal operations.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Storage, Encryption & Security */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-2.5 text-xs sm:text-sm">
              <h3 className="font-bold text-white flex items-center gap-2">
                <LockOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-400" />
                Google Data Storage, Encryption &amp; Security
              </h3>
              <p className="text-gray-300">
                Google OAuth tokens (access tokens and refresh tokens) are encrypted at rest using AES-256 encryption in our secure PostgreSQL database and transmitted exclusively over HTTPS with TLS 1.3 encryption. We never access, handle, or store your Google account passwords. Synced Google Calendar events are temporarily cached in memory/database solely to render your calendar schedule and are updated upon synchronization.
              </p>
            </div>

            {/* Retention & Step-by-Step Deletion / Revocation */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-3 text-xs sm:text-sm">
              <h3 className="font-bold text-white flex items-center gap-2">
                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} className="text-cyan-400" />
                Data Retention, Access Revocation &amp; Deletion Procedures
              </h3>
              <p className="text-gray-300">
                We retain your Google data (OAuth tokens and event caches) only for as long as your Helix account remains active and connected to Google Calendar. You have complete control to revoke access or purge your data at any time through the following mechanisms:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                <li>
                  <strong className="text-white">Direct Google Revocation:</strong> You can revoke Helix&apos;s access immediately at any time by visiting your{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-cyan-300 font-semibold hover:text-white"
                  >
                    Google Account Security Permissions
                  </a>. Revoking access instantly invalidates all OAuth tokens and stops all synchronization.
                </li>
                <li>
                  <strong className="text-white">In-App Disconnect:</strong> In Helix, navigate to <em>Settings &gt; Integrations</em> and click <em>Disconnect Google Calendar</em>. This immediately deletes stored Google tokens and cached calendar entries from our active database.
                </li>
                <li>
                  <strong className="text-white">Complete Data Deletion:</strong> If you delete your Helix account or submit a data deletion request to{" "}
                  <a href="mailto:seraphimcreationverse@gmail.com" className="underline text-violet-300 font-semibold">
                    seraphimcreationverse@gmail.com
                  </a>, all associated Google data, tokens, and records are permanently erased from our systems within 30 days.
                </li>
              </ol>
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
                <li>Facilitating real-time project synchronization, kanban updates, and team chat communication.</li>
                <li>Authenticating user sessions and safeguarding accounts against unauthorized intrusions.</li>
                <li>Providing customer support and responding to system diagnostic logs.</li>
                <li>Delivering user-configured browser and system activity notifications.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" aria-labelledby="heading-5" className="space-y-3">
            <h2 id="heading-5" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              5. Data Storage, Security &amp; Retention
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
              6. Data Sharing &amp; Third-Party Services
            </h2>
            <p className="text-sm">
              We do not sell, trade, or rent personal identification information to others. We share data only with trusted service providers necessary to operate the application infrastructure:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-white">Neon PostgreSQL:</strong> Managed cloud database storage provider with encrypted data at rest.</li>
              <li><strong className="text-white">Upstash Redis:</strong> High-performance caching and real-time WebSocket messaging adapter.</li>
              <li><strong className="text-white">Google Cloud:</strong> OAuth identity verification and calendar sync (when initiated by the user).</li>
            </ul>
            <p className="text-sm text-gray-400 mt-2">
              We never transfer Google user data to data brokers, analytics trackers, or third-party advertising networks.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" aria-labelledby="heading-7" className="space-y-3">
            <h2 id="heading-7" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              7. Your Rights, Access Revocation &amp; Data Deletion
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
              8. Cookies &amp; Local Storage
            </h2>
            <p className="text-sm">
              Helix utilizes essential HTTP cookies strictly to maintain user authentication sessions (NextAuth session tokens). We also utilize browser LocalStorage solely to preserve client-side UI configurations, such as your dark/light theme, font sizes, sidebar collapse status, and dismissed notification alerts.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" aria-labelledby="heading-9" className="space-y-4">
            <h2 id="heading-9" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              9. Contact &amp; Legal Desk
            </h2>
            <p className="text-sm">
              If you have any questions, concerns, or requests regarding this Privacy Policy or Helix&apos;s data practices, please reach out to our team:
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 shrink-0">
                <MailOutlineRoundedIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Seraphim Studio / Helix Legal &amp; Compliance</p>
                <p className="text-xs text-gray-400">Attn: Privacy &amp; Data Protection Officer</p>
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
