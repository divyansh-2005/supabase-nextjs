'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client'; // Adjust path based on your project structure
import styles from './Blog.module.css';

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
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.blogContainer}>
      {blogs.map((blog) => (
        <div key={blog.id} className={styles.blogCard}>
          
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className={styles.thumbnail}
              onError={(e) => {
                e.target.style.display = 'none';
                console.error('Error loading image:', blog.thumbnail);
              }}
            />
          ) : (
            <p>No thumbnail available</p>
          )}
          <h2 className={styles.title}>{blog.title}</h2>
          {/* <p className={styles.desc}>
            {blog.desc.length > 100 ? `${blog.desc.slice(0, 100)}...` : blog.desc}
          </p> */}
          <div className={styles.tags}>
            {blog.tag.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={styles.createdAt}>
            Created at: {new Date(blog.created_at).toLocaleDateString()}
          </p>
          <button
            className={styles.readMoreButton}
            onClick={() => router.push(`/viewblog/${blog.id}`)}
          >
            Read More
          </button>
        </div>
      ))}
    </div>
  );
}
