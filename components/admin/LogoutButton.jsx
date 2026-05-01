"use client";

export default function LogoutButton() {
  return (
    <button
      type="button"
      className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
      onClick={async () => {
        try {
          const res = await fetch("/api/admin/logout", {
            method: "POST",
            credentials: "include",
            cache: "no-store",
          });
          await res.json()
          if (!res.ok) console.error("Logout failed:", res.status);
        } catch (e) {
          console.error(e);
        }
        // Give the browser time to commit Set-Cookie from the logout response before navigating.
        // Without this, /admin/login mounts while admin_token still exists → session probe sends you back to /admin.
      
      }}
    >
      Log out
    </button>
  );
}
