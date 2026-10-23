export async function saveProfile({
  username,
  email,
  setProfileSaving,
  setProfileError,
  setProfileSuccess,
  updateSession,
}) {
  if (!username.trim() || !email.trim()) {
    setProfileError("Username and email are required fields.");
    return;
  }

  setProfileSaving(true);
  setProfileError("");
  setProfileSuccess("");

  try {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile.");

    setProfileSuccess("Personal details updated successfully!");

    // Dynamic session update for next-auth client side
    if (updateSession) {
      await updateSession({ username: username.trim() });
    }
  } catch (err) {
    setProfileError(err.message);
  } finally {
    setProfileSaving(false);
  }
}

export async function savePassword({
  currentPassword,
  newPassword,
  confirmPassword,
  setPasswordSaving,
  setPasswordError,
  setPasswordSuccess,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}) {
  if (!currentPassword) {
    setPasswordError("Current password is required to make updates.");
    return;
  }
  if (newPassword.length < 6) {
    setPasswordError("New password must be at least 6 characters.");
    return;
  }
  if (newPassword !== confirmPassword) {
    setPasswordError("Confirm password does not match the new password.");
    return;
  }

  setPasswordSaving(true);
  setPasswordError("");
  setPasswordSuccess("");

  try {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update password.");

    setPasswordSuccess("Security password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    setPasswordError(err.message);
  } finally {
    setPasswordSaving(false);
  }
}

export const toggleNotificationSetting = (key, currentValue, setValue) => {
  const next = !currentValue;
  setValue(next);
  if (typeof window !== "undefined") {
    localStorage.setItem(key, String(next));
  }
};
