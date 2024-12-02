'use client';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import profile icon
import { createClient } from '../../../utils/supabase/client';

export default function Navbar() {
  const supabase = createClient();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Track session loading state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      } else {
        setSession(data.session); // Set session if available
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          {/* Logo */}
          <Link href="/" className={styles.brand}>
            Blogify
          </Link>

          {/* Navbar Links */}
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>

            {session ? (
              <>
                <Link href="/AddBlog" className={styles.navLink}>Add Blog</Link>

                {/* Profile Dropdown */}
                <div className={styles.profileDropdown}>
                  <FaUserCircle
                    className={styles.profileIcon}
                    onClick={toggleDropdown}
                  />
                  {dropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link href="/account" className={styles.dropdownItem}>
                        Update Profile
                      </Link>
                      <Link href="/myblogs" className={styles.dropdownItem}>
                        My Blogs
                      </Link>
                      <form action="/auth/signout" method="post" className={styles.dropdownItem}>
                        <button type="submit" className={styles.signOutButton}>
                          Sign Out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/signup" className={styles.navLink}>Create Account</Link>
                <Link href="/login" className={styles.navLink}>Log In</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
