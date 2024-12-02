'use client';

import { useState, useEffect } from 'react';
import { useSession } from '../context/SessionProvider';
import { createClient } from '../../../utils/supabase/client';
import styles from './MyBlogs.module.css'; // Add appropriate CSS for styling
import Navbar from '../ui/Navbar';

export default function MyBlogs() {
  const user = useSession(); // Get the current user from context
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Supabase client instance
  const supabase = createClient();

  // Fetch the blogs created by the user
  useEffect(() => {
    if (!user) {
      // Redirect or show message if user is not logged in
      return;
    }

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('user_id', user.id) // Filter blogs by the logged-in user
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user, supabase]);

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      <h1 className={styles.heading}>My Blogs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>You haven't created any blogs yet.</p>
      ) : (
        <div className={styles.blogList}>
          {blogs.map((blog) => (
            <div key={blog.id} className={styles.blogItem}>
              <h2 className={styles.blogTitle}>{blog.title}</h2>
              {/* {blog.thumbnail && (
                <img src={blog.thumbnail} alt={blog.title} className={styles.thumbnail} />
              )} */}
              <p className={styles.blogDescription}>{blog.desc}</p>
              <div className={styles.blogActions}>
                <a href={`/edit-blog/${blog.id}`} className={styles.editButton}>
                  Edit
                </a>
                <button className={styles.deleteButton} onClick={() => deleteBlog(blog.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

// Function to delete a blog post
const deleteBlog = async (blogId) => {
  const supabase = createClient();
  const { error } = await supabase.from('blogs').delete().eq('id', blogId);
  if (error) {
    alert('Error deleting blog: ' + error.message);
  } else {
    alert('Blog deleted successfully!');
    window.location.reload(); // Reload to reflect changes
  }
};
