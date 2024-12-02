'use client';
import styles from './Footer.module.css'; // Optional for styling
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} Blogify. All rights reserved.
        </p>
        {/* <div className={styles.links}>
          <Link href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className={styles.link}>
            Terms of Service
          </Link>
          <Link href="/contact" className={styles.link}>
            Contact Us
          </Link>
        </div> */}
      </div>
    </footer>
  );
}
