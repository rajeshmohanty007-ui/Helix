"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RegisterForm from "@/components/landing/RegisterForm";
import LoginForm from "@/components/landing/LoginForm";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import RuleFolderRoundedIcon from "@mui/icons-material/RuleFolderRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";

export default function TermsContent() {
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
            <span className="text-violet-400">Terms of Service</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-4">
            <GavelRoundedIcon sx={{ fontSize: 16 }} /> User Agreement & Terms
          </div>

          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Terms of Service
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
            <RuleFolderRoundedIcon className="text-violet-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-gray-300">
              <strong className="text-white block mb-1">Please Read Carefully</strong>
              Helix is a product of <strong>Seraphim Studio</strong>. These Terms of Service constitute a legally binding agreement between you and <strong>Seraphim Studio</strong> regarding your use of the Helix platform, tools, APIs, and integrations.
            </div>
          </div>

          {/* Table of Contents */}
          <section aria-labelledby="toc-heading" className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h2 id="toc-heading" className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Table of Contents
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
              <li><a href="#section-1" className="hover:text-violet-400 transition">1. Acceptance of Terms</a></li>
              <li><a href="#section-2" className="hover:text-violet-400 transition">2. Account Registration & Security</a></li>
              <li><a href="#section-3" className="hover:text-violet-400 transition">3. Description of Platform Services</a></li>
              <li><a href="#section-4" className="hover:text-violet-400 transition">4. User Content & Intellectual Property</a></li>
              <li><a href="#section-5" className="hover:text-violet-400 transition">5. Acceptable Use Policy</a></li>
              <li><a href="#section-6" className="hover:text-violet-400 transition">6. Third-Party Integrations & APIs</a></li>
              <li><a href="#section-7" className="hover:text-violet-400 transition">7. Disclaimers & Limitation of Liability</a></li>
              <li><a href="#section-8" className="hover:text-violet-400 transition">8. Termination & Account Deletion</a></li>
              <li><a href="#section-9" className="hover:text-violet-400 transition">9. Governing Law & Dispute Resolution</a></li>
              <li><a href="#section-10" className="hover:text-violet-400 transition">10. Contact Information</a></li>
            </ol>
          </section>

          {/* Section 1 */}
          <section id="section-1" aria-labelledby="heading-1" className="space-y-3">
            <h2 id="heading-1" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm">
              By accessing, browsing, registering for, or using the <strong>Helix</strong> collaborative productivity platform (hosted at <a href="https://helix.seraphimstudio.in" className="text-violet-400 underline">https://helix.seraphimstudio.in</a>), a product of and operated by <strong>Seraphim Studio</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (&quot;Terms&quot;).
            </p>
            <p className="text-sm">
              If you do not agree to all of the terms and conditions outlined herein, you must refrain from accessing or utilizing Helix immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" aria-labelledby="heading-2" className="space-y-3">
            <h2 id="heading-2" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              2. Account Registration & Security
            </h2>
            <div className="space-y-2 text-sm">
              <p>When creating an account on Helix:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You must provide accurate, current, and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials, passwords, and active authentication sessions.</li>
                <li>You agree to notify us immediately at <a href="mailto:seraphimcreationverse@gmail.com" className="text-violet-400 underline">seraphimcreationverse@gmail.com</a> upon detecting any unauthorized use of your account.</li>
                <li>Helix is not liable for any loss or damages arising from your failure to safeguard your account.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" aria-labelledby="heading-3" className="space-y-3">
            <h2 id="heading-3" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              3. Description of Platform Services
            </h2>
            <p className="text-sm">
              Helix provides productivity and collaboration software including, but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong className="text-white">Workspace & Project Management:</strong> Creating isolated workspaces, assigning project roles, and tracking milestones.</li>
              <li><strong className="text-white">Smart Task Tracking:</strong> Visual Kanban task boards, priorities, subtask checklists, and progress metrics.</li>
              <li><strong className="text-white">Real-Time Team Discussions:</strong> Topic-oriented channel chats and project update feeds.</li>
              <li><strong className="text-white">Unified Calendars:</strong> Agenda management, event scheduling, and Google Calendar synchronization.</li>
              <li><strong className="text-white">AI-Powered Schedule Assistance:</strong> Automated task scheduling heuristics powered by Gemini AI.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="section-4" aria-labelledby="heading-4" className="space-y-3">
            <h2 id="heading-4" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              4. User Content & Intellectual Property
            </h2>
            <p className="text-sm">
              <strong>Your Content:</strong> You retain full ownership and intellectual property rights in all data, files, code, messages, task checklists, and information you submit, upload, or create within Helix (&quot;User Content&quot;).
            </p>
            <p className="text-sm">
              <strong>License to Operate:</strong> By uploading User Content, you grant Helix a worldwide, non-exclusive, royalty-free license solely to host, store, display, and process your content as strictly necessary to provide the Service to you and your authorized team collaborators.
            </p>
            <p className="text-sm">
              <strong>Helix IP:</strong> The Helix interface, logos, branding, trademarks, software code, and styling remain the exclusive property of Seraphim Studio. You may not copy, reverse engineer, or decompile any portion of Helix without prior written permission.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" aria-labelledby="heading-5" className="space-y-3">
            <h2 id="heading-5" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              5. Acceptable Use Policy
            </h2>
            <div className="space-y-2 text-sm">
              <p>You agree not to engage in any prohibited activities, including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Deploying viruses, trojans, worms, or other malicious computer code through the platform.</li>
                <li>Attempting to probe, scan, or breach any security vulnerability or firewall of our infrastructure.</li>
                <li>Transmitting harassing, threatening, defamatory, or unlawful communications in team chats.</li>
                <li>Conducting automated scraping or extraction of platform data without express authorization.</li>
                <li>Interfering with or overburdening Helix servers, databases, or WebSocket gateways.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" aria-labelledby="heading-6" className="space-y-3">
            <h2 id="heading-6" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              6. Third-Party Integrations & APIs
            </h2>
            <p className="text-sm">
              Helix offers integrations with third-party service providers, notably <strong>Google OAuth</strong> and the <strong>Google Calendar API</strong>.
            </p>
            <p className="text-sm">
              When utilizing Google Calendar synchronization, you acknowledge that your interaction with Google services is governed by Google&apos;s own Terms of Service and Privacy Policy. Helix does not warrant or assume liability for third-party service outages or API modifications by external providers.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" aria-labelledby="heading-7" className="space-y-3">
            <h2 id="heading-7" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              7. Disclaimers & Limitation of Liability
            </h2>
            <p className="text-sm uppercase tracking-wide text-gray-400 text-xs">
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-sm">
              To the fullest extent permitted by applicable law, Seraphim Studio and Helix disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p className="text-sm">
              In no event shall Seraphim Studio, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruption, resulting from your use of or inability to access the Platform.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" aria-labelledby="heading-8" className="space-y-3">
            <h2 id="heading-8" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              8. Termination & Account Deletion
            </h2>
            <p className="text-sm">
              You may terminate your account at any time through the Helix Settings panel or by submitting a written request to <a href="mailto:seraphimcreationverse@gmail.com" className="text-violet-400 underline">seraphimcreationverse@gmail.com</a>.
            </p>
            <p className="text-sm">
              Helix reserves the right to suspend or terminate access to the Service for any user who violates these Terms, poses a security threat, or engages in fraudulent activity, without prior notice or liability.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" aria-labelledby="heading-9" className="space-y-3">
            <h2 id="heading-9" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              9. Governing Law & Dispute Resolution
            </h2>
            <p className="text-sm">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in competent courts of jurisdiction.
            </p>
          </section>

          {/* Section 10 */}
          <section id="section-10" aria-labelledby="heading-10" className="space-y-4">
            <h2 id="heading-10" className="text-xl font-bold text-white border-b border-white/10 pb-2">
              10. Contact Information
            </h2>
            <p className="text-sm">
              For any questions, legal notices, or clarifications concerning these Terms of Service, please contact:
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 shrink-0">
                <MailOutlineRoundedIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Seraphim Studio / Helix Legal Department</p>
                <p className="text-xs text-gray-400">Attn: Legal Affairs & Compliance</p>
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
