'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '../../../utils/supabase/client';
import styles from './accountForm.module.css'; // Assuming you are using a specific CSS file for this component

export default function AccountForm({ user }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div>
      <h1 className={styles.heading}>Update Profile</h1>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input id="email" type="text" value={user?.email} disabled className={styles.formInput} />
        </div>
        <div>
          <label htmlFor="fullName" className={styles.formLabel}>Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div>
          <label htmlFor="username" className={styles.formLabel}>Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div>
          <label htmlFor="website" className={styles.formLabel}>Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
            className={styles.formInput}
          />
        </div>

        <div>
          <button
            className={styles.formButton}
            onClick={() => updateProfile({ fullname, username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button className={styles.formButton} type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
