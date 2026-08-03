"use client";

import { useState, useEffect, use } from "react";
import { useDialog } from "@/components/providers/DialogProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import CircularProgress from "@mui/material/CircularProgress";

// Debounce Hook helper
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function ProjectSettingsPage({ params }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const { data: session, status } = useSession();
  const router = useRouter();
  const { showConfirm, showPrompt } = useDialog();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("active");

  // Member States
  const [memberInput, setMemberInput] = useState("");
  const [selectedAddRole, setSelectedAddRole] = useState("member");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);

  const debouncedSearch = useDebounce(memberInput, 300);

  useEffect(() => {
    if (!debouncedSearch.trim() || debouncedSearch.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    async function fetchSuggestions() {
      try {
        const res = await fetch(`/api/users`);
        const allUsers = await res.json();
        if (Array.isArray(allUsers)) {
          const match = allUsers.filter(
            (u) =>
              u.username.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
              !project?.members?.some((m) => m.id === u.id)
          );
          setSuggestions(match);
        }
      } catch (err) {
        console.warn("Failed suggestions fetch:", err);
      }
    }

    fetchSuggestions();
  }, [debouncedSearch, project?.members]);

  // Tabs and Responsive States
  const [activeTab, setActiveTab] = useState("general"); // "general" or "members"
  const [mobileShowActions, setMobileShowActions] = useState(false);

  // Role permissions
  const isCreator = project?.creatorId === session?.user?.id;
  const isAdmin = isCreator || project?.admins?.some((u) => u.id === session?.user?.id);
  const isManager = project?.managers?.some((u) => u.id === session?.user?.id);
  const canManageRoles = isAdmin || isManager;

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch Project details
  useEffect(() => {
    if (status !== "authenticated" || !projectId) return;

    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setProject(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setProjectStatus(data.status || "active");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [status, projectId]);

  // Handle Clipboard Copy
  const handleCopyId = () => {
    if (!project?.id) return;
    navigator.clipboard.writeText(project.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle General Settings Update
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name cannot be empty.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          status: projectStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");

      setProject(data);
      // Brief visual success indicator (alert or simple save state, we can just keep state)
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Add Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    const cleanUsername = memberInput.trim();
    if (!cleanUsername) return;

    setMemberLoading(true);
    setMemberError("");

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addMemberUsername: cleanUsername, addMemberRole: selectedAddRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add member.");

      setProject(data);
      setMemberInput("");
      setSelectedAddRole("member");
      setSuggestions([]);
    } catch (err) {
      setMemberError(err.message);
    } finally {
      setMemberLoading(false);
    }
  };

  // Handle Remove Member
  const handleRemoveMember = async (userIdToRemove) => {
    const confirmed = await showConfirm(
      "Are you sure you want to remove this member from the project?",
      "Remove Member",
      "danger",
      "Remove"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeMemberUserId: userIdToRemove }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove member.");

      setProject(data);
      showToast("Member removed successfully", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Handle Change Member Role
  const handleChangeRole = async (memberId, newRole) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changeMemberRoleUserId: memberId, newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update member role.");

      setProject(data);
      showToast("Role updated successfully", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async () => {
    const confirmation = await showPrompt(
      `WARNING: This will permanently delete the project and all associated channels, updates, and objectives.`,
      project?.name,
      "Delete Project Permanently?"
    );

    if (!confirmation) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete project.");

      showToast("Project deleted successfully", "success");
      router.push("/projects");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  useEffect(() => {
    if (project?.name) {
      document.title = `${project.name} - Settings | Helix`;
    } else {
      document.title = "Project Settings | Helix";
    }
  }, [project?.name]);

  if (loading || status === "loading") {
    return <LoadingScreen fullScreen={true} />;
  }

  // Sidebar link items
  const sidebarItems = [
    { id: "general", label: "General Settings", icon: SettingsRoundedIcon },
    { id: "members", label: "Members", icon: PersonRoundedIcon },
  ];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-(--bg-main) p-4">
      {/* Top Header Row */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/projects")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition cursor-pointer"
            title="Back to Projects"
          >
            <ArrowBackRoundedIcon />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {project?.name}
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">Project settings and configuration</p>
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
        {/* Desktop Sidebar & Mobile tab select (Page 1) */}
        <div
          className={`h-full w-full flex-col border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] md:flex md:w-[30%] shrink-0 ${
            mobileShowActions ? "hidden" : "flex"
          }`}
        >
          <div className="p-4 border-b border-[var(--border-color)]">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Settings Category
            </h2>
          </div>
          <div className="flex-1 space-y-1 p-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileShowActions(true);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition text-sm font-medium cursor-pointer ${
                    isSelected
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <Icon fontSize="small" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Content Panel (Page 2 on Mobile) */}
        <div
          className={`h-full flex-1 flex-col overflow-y-auto p-6 md:flex ${
            mobileShowActions ? "flex" : "hidden"
          }`}
        >
          {/* Mobile Back-to-Categories Navigation */}
          <div className="mb-4 flex items-center md:hidden">
            <button
              onClick={() => setMobileShowActions(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] cursor-pointer"
            >
              <ArrowBackRoundedIcon fontSize="small" />
              Back to categories
            </button>
          </div>

          {/* TAB 1: General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">General Settings</h3>
                <p className="text-xs text-[var(--text-secondary)]">Update project basic info, status and metadata</p>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  {error}
                </p>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] resize-none"
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                    Project Status
                  </label>
                  <div className="flex gap-2">
                    {["active", "paused", "completed"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setProjectStatus(st)}
                        className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition text-center capitalize cursor-pointer active:scale-95 ${
                          projectStatus === st
                            ? st === "active"
                              ? "border-green-500 bg-green-500/10 text-green-500 font-bold"
                              : st === "paused"
                                ? "border-yellow-500 bg-yellow-500/10 text-yellow-500 font-bold"
                                : "border-blue-500 bg-blue-500/10 text-blue-500 font-bold"
                            : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Copy Project ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                    Project ID
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-2">
                    <span className="flex-1 px-2 font-mono text-xs text-[var(--text-secondary)] select-all truncate">
                      {project?.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)]/10 px-4 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/20 transition cursor-pointer active:scale-95 shrink-0"
                    >
                      {copied ? (
                        <>
                          <CheckRoundedIcon sx={{ fontSize: 14 }} />
                          Copied
                        </>
                      ) : (
                        <>
                          <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <CircularProgress size={18} color="inherit" />
                        Saving...
                      </>
                    ) : (
                      "Save General Settings"
                    )}
                  </button>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-[var(--border-color)]">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                  <h4 className="text-sm font-bold text-red-500 uppercase tracking-wide">Danger Zone</h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Once you delete a project, there is no going back. All related messages, updates, and metrics will be purged.
                  </p>
                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-600 transition active:scale-95 cursor-pointer"
                  >
                    <DeleteForeverRoundedIcon fontSize="small" />
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Members Settings */}
          {activeTab === "members" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Project Members</h3>
                <p className="text-xs text-[var(--text-secondary)]">Manage collaborators and add people to this project workspace</p>
              </div>

              {/* Member Add Form */}
              {canManageRoles && (
                <form onSubmit={handleAddMember} className="space-y-3">
                  <label className="block text-sm font-semibold text-[var(--text-primary)]">
                    Add Member
                  </label>
                  {memberError && (
                    <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      {memberError}
                    </p>
                  )}
                  <div className="flex flex-col gap-2 sm:flex-row relative">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={memberInput}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onChange={(e) => setMemberInput(e.target.value)}
                        placeholder="Enter user's username"
                        className="w-full rounded-2xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 shadow-lg helix-scroll">
                          {suggestions.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onMouseDown={() => {
                                setMemberInput(u.username);
                                setSuggestions([]);
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
                            >
                              <span>{u.username}</span>
                              <span className="text-[10px] text-[var(--text-secondary)]">{u.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <select
                      value={selectedAddRole}
                      onChange={(e) => setSelectedAddRole(e.target.value)}
                      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] cursor-pointer"
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      {isAdmin && <option value="admin">Admin</option>}
                    </select>
                    <button
                      type="submit"
                      disabled={memberLoading}
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-3 hover:opacity-90 text-white font-semibold transition active:scale-95 text-sm cursor-pointer disabled:opacity-50"
                    >
                      {memberLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <>
                          <PersonAddRoundedIcon fontSize="small" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Current Members List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Current Collaborators ({project?.members?.length || 0})
                </h4>
                <div className="divide-y divide-[var(--border-color)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-2">
                  {project?.members?.map((m) => {
                    const isSelf = m.id === session?.user?.id;
                    const isCreatorMember = m.id === project?.creatorId;
                    const isTargetAdmin = project?.admins?.some((u) => u.id === m.id);
                    const isTargetManager = project?.managers?.some((u) => u.id === m.id);
                    const currentRole = isCreatorMember ? "creator" : isTargetAdmin ? "admin" : isTargetManager ? "manager" : "member";
                    
                    const canEditThisTargetRole = 
                      !isCreatorMember && 
                      (isAdmin ? true : (isManager && currentRole === "member"));

                    return (
                      <div key={m.id} className="flex items-center justify-between p-3 first:pt-2 last:pb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${m.username}`}
                            alt={m.username}
                            className="h-8 w-8 rounded-full bg-[var(--bg-hover)]"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                              {m.username}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] text-[var(--accent)] font-medium">You</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Role Indicator / Dropdown */}
                          {canManageRoles ? (
                            <select
                              value={currentRole}
                              disabled={!canEditThisTargetRole}
                              onChange={(e) => handleChangeRole(m.id, e.target.value)}
                              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <option value="creator" disabled>Creator / Admin</option>
                              <option value="admin" disabled={isManager}>Admin</option>
                              <option value="manager">Manager</option>
                              <option value="member">Member</option>
                            </select>
                          ) : (
                            <span className="text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-color)] px-2 py-0.5 rounded-lg bg-[var(--bg-card)] capitalize">
                              {currentRole === "creator" ? "Creator / Admin" : currentRole}
                            </span>
                          )}

                          {/* Disconnect/Remove Action */}
                          {!isSelf && !isCreatorMember && (isAdmin || (isManager && currentRole === "member")) && (
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                              title={`Remove ${m.username}`}
                            >
                              <PersonRemoveRoundedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
