'use client';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import profile icon
import { useSession } from '../context/SessionProvider';

export default function Navbar() {
  const user = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

            {user ? (
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
