'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../utils/supabase/client';
import styles from './EditBlog.module.css';

export default function EditBlog({ blogId }) {
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) {
        console.error('Error fetching blog:', error.message);
        return;
      }

      setBlog(data);
      setTitle(data.title);
      setDesc(data.desc);
      setThumbnail(data.thumbnail);
      setTag(data.tag.join(', '));
    };

    fetchBlog();
  }, [blogId, supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      let thumbnailUrl = thumbnail;

      // If a new image file is selected, upload it
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('thumbnail')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicURLData, error: urlError } = supabase
          .storage
          .from('thumbnail')
          .getPublicUrl(fileName);

        if (urlError) throw urlError;

        thumbnailUrl = publicURLData.publicUrl;
      }

      const { error } = await supabase
        .from('blogs')
        .update({
          title,
          desc,
          thumbnail: thumbnailUrl,
          tag: tag.split(',').map((t) => t.trim()),
        })
        .eq('id', blogId);

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      console.error('Error updating blog:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className={styles.editFormContainer}>
        <div className={styles.container}>
            <h1>Edit Blog</h1>
        </div>
      {success && <p className={styles.editSuccessMessage}>Blog updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className={styles.editFormLabel}>Title:</label>
          <input
            id="title"
            className={styles.editFormInput}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="desc" className={styles.editFormLabel}>Description:</label>
          <input
            id="desc"
            className={styles.editFormTextarea}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.editFormLabel}>Thumbnail:</label>
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Current thumbnail"
              className={styles.thumbnailPreview}
            />
          )}
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className={styles.editFormInput}
          />
        </div>
        <div>
          <label htmlFor="tag" className={styles.editFormLabel}>Tags (comma-separated):</label>
          <input
            id="tag"
            className={styles.editFormInput}
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className={styles.editFormButton}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
