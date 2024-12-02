'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../utils/supabase/client';
import styles from './EditBlog.module.css';
import Navbar from './Navbar';

export default function EditBlog({ blogId }) {
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const predefinedTags = ['Technology', 'Health', 'Finance', 'Education', 'Travel', 'Other'];
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
      setTags(data.tag || []); // Ensure tags are an array
    };

    fetchBlog();
  }, [blogId, supabase]);

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags((prevTags) => [...prevTags, value]);
    } else {
      setTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

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
          tag: tags, // Save selected tags as an array
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
    <>
    <Navbar />
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
          <textarea
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
          <label className={styles.editFormLabel}>Tags:</label>
          <div className={styles.tagContainer}>
            {predefinedTags.map((t) => (
              <div key={t} className={styles.tagItem}>
                <input
                  type="checkbox"
                  id={t}
                  value={t}
                  checked={tags.includes(t)}
                  onChange={handleTagChange}
                />
                <label htmlFor={t}>{t}</label>
              </div>
            ))}
          </div>
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
    </>
  );
}
