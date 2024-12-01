'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { useSession } from '../context/SessionProvider'; // Adjust the path to your SessionContext
import styles from './ViewBlog.module.css';

export default function ViewBlog({ id }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState(null);
  const user = useSession(); // Get logged-in user from the session context
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      const supabase = createClient();

      try {
        const { data: blog, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setBlog(blog);

        // Fetch creator details
        if (blog.user_id) {
          const { data: creator, error: creatorError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', blog.user_id)
            .single();

          if (creatorError) throw creatorError;
          setCreator(creator.full_name || 'Unknown');
        }
      } catch (error) {
        console.log('Error fetching blog:', error instanceof Error ? error.message : error);
      }
       finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleEditClick = () => {
    router.push(`/editblog/${blog.id}`);
  };

  const handleDeleteClick = async () => {
    const supabase = createClient();

    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', id);

        if (error) throw error;

        alert('Blog deleted successfully!');
        router.push('/'); // Navigate back to the main page
      } catch (error) {
        console.error('Error deleting blog:', error.message);
        alert('Failed to delete the blog.');
      }
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found!</p>;

  return (
    <div className={styles.blogDetail}>
      <h1>{blog.title}</h1>
      {creator && <p className={styles.creator}>Author - {creator}</p>} 

      <div className={styles.imageContainer}>
        {blog.thumbnail && (
          <img src={blog.thumbnail} alt={blog.title} className={styles.thumbnail} />
        )}

        <div className={styles.rightSide}>
          <p className={styles.createdAt}>Date: {new Date(blog.created_at).toLocaleDateString()}</p>
          <div className={styles.tags}>
            {blog.tag.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.desc}>{blog.desc}</p>
      
      {/* Show Edit and Delete buttons if the logged-in user matches the blog's user_id */}
      {user && user.id === blog.user_id && (
        <div className={styles.actions}>
          <button onClick={handleEditClick} className={styles.editButton}>
            Edit Blog
          </button>
          <button onClick={handleDeleteClick} className={styles.deleteButton}>
            Delete Blog
          </button>
        </div>
      )}
    </div>
  );
}
