// This is a placeholder file - we'll set up Supabase tomorrow
export const supabase = {
  auth: {
    signIn: () => Promise.resolve({ user: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};
