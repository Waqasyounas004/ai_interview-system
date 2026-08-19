import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  experience_level: string;
  target_technologies: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch the profile of the logged in user from Supabase.
 * If no profile row exists yet, inserts a default profile for the user.
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    // Row not found, create profile record
    const newProfile: UserProfile = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Candidate",
      email: user.email || "",
      role: "Fullstack Developer",
      experience_level: "Mid-Level",
      target_technologies: ["React", "Next.js", "TypeScript", "Node.js", "Supabase"],
    };

    const { data: inserted, error: insertError } = await supabase
      .from("profiles")
      .upsert(newProfile)
      .select()
      .single();

    if (insertError) {
      console.warn("Using fallback profile data:", insertError.message || insertError);
      return newProfile;
    }
    return inserted;
  }

  if (error) {
    console.error("Error fetching profile:", error);
    // Return fallback profile using user metadata
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Candidate",
      email: user.email || "",
      role: "Fullstack Developer",
      experience_level: "Mid-Level",
      target_technologies: ["React", "Next.js", "TypeScript", "Node.js", "Supabase"],
    };
  }

  return data;
}

/**
 * Update the user profile in Supabase `profiles` table.
 */
export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email, ...payload })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
