'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import styles from './Blog.module.css';
import Image from 'next/image';
import Link from 'next/link';
import landingImage from '../../../public/Images/landingpgimg.png';
import Navbar from './Navbar';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, desc, thumbnail, tag, created_at');

        if (error) throw error;

        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
    <Navbar />
    <div className={styles.blogContainer}>
      {/* Landing Page */}
      <div className={styles.landingPage}>
        <h2>Simplify, Explore, and Connect with Blogify</h2>
        <Image src={landingImage} alt="Landing Page" className={styles.landingImg} />
        <i className="fa-solid fa-angles-down"></i>
      </div>

      {/* Recent Blogs */}
      <h1 className={styles.sectionHeading}>RECENT BLOGS</h1>
      <div className={styles.blogList}>
        {blogs.map((blog) => (
          <div key={blog.id} className={styles.blogCard}>
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className={styles.thumbnail}
              onError={(e) => (e.target.style.display = 'none')}
            />
            <h2 className={styles.title}>{blog.title}</h2>
            <p className={styles.desc}>{blog.desc.slice(0, 100)}...</p>
            <div className={styles.blogFooter}>
              <p className={styles.createdAt}>{new Date(blog.created_at).toLocaleDateString()}</p>
              <Link href={`/viewblog/${blog.id}`} className={styles.readMoreLink}>
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
