'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');

  // ✅ Load user + profile
  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // ✅ Exit early if no user
      if (userError || !user) {
        router.push('/login');
        return;
      }

      // ✅ TypeScript knows user exists after the return above
      const currentUser: User = user;

      setEmail(currentUser.email ?? null);

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, website')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        alert('Error loading profile: ' + error.message);
      } else if (data) {
        setUsername(data.username ?? '');
        setFullName(data.full_name ?? '');
        setWebsite(data.website ?? '');
      }

      setLoading(false);
    };

    getProfile();
  }, [router]);

  // ✅ Save profile updates
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      id: user.id,
      username,
      full_name: fullName,
      website,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    setLoading(false);

    if (error) alert(error.message);
    else alert('Profile updated!');
  };

  if (loading) return <p className="p-6">Loading profile…</p>;

  return (
    <main className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p className="text-gray-600">
        Signed in as {email ? email : 'Unknown email'}
      </p>

      <form onSubmit={updateProfile} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 rounded bg-black text-white"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        className="w-full p-2 rounded border"
      >
        Sign out
      </button>
    </main>
  );
}
