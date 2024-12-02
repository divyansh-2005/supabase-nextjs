'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { useSession } from '../context/SessionProvider'; // Custom hook for session
import { createClient } from '../../../utils/supabase/client';
import styles from './AddBlog.module.css';

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function AddBlog() {
  const user = useSession(); // Get the current user
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const predefinedTags = ['Technology', 'Health', 'Finance', 'Education', 'Travel', 'Other'];

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags((prevTags) => [...prevTags, value]);
    } else {
      setTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleEditorChange = useCallback((newContent) => {
    setDesc(newContent);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    if (!user) {
      alert('You must be logged in to add a blog.');
      setLoading(false);
      return;
    }

    try {
      let thumbnailUrl = '';

      if (thumbnail) {
        const fileExtension = thumbnail.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;

        // Upload the image file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('thumbnail') // Replace 'thumbnail' with your bucket name
          .upload(fileName, thumbnail);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data, error } = supabase.storage
          .from('thumbnail')
          .getPublicUrl(fileName);

        if (error) {
          throw new Error(`Failed to get public URL: ${error.message}`);
        }

        thumbnailUrl = data.publicUrl;
      }

      const { data, error } = await supabase.from('blogs').insert([
        {
          user_id: user.id,
          title,
          desc,
          thumbnail: thumbnailUrl,
          tags, // Array of tags
        },
      ]);

      if (error) {
        throw new Error(`Failed to insert blog: ${error.message}`);
      }

      setSuccess(true);
      setTitle('');
      setDesc('');
      setThumbnail(null);
      setTags([]);
    } catch (error) {
      alert(`Error adding blog: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div>
      <h1>Add a New Blog</h1>
          <label htmlFor="title" className={styles.formLabel}>
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>

        <div>
          <label htmlFor="desc" className={styles.formLabel}>
            Description:
          </label>
          <textarea
            className={styles.formTextarea}
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          ></textarea>
          {/* <JoditEditor
  value={desc}
  config={{
    readonly: false,
    placeholder: 'Write your blog content here...',
    theme: 'dark',
    toolbarSticky: false,
    toolbarButtonSize: 'small',
  }}
  onChange={handleEditorChange}
/> */}

        </div>

        <div>
          <label htmlFor="thumbnail" className={styles.formLabel}>
            Thumbnail (Image):
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.formInput}
          />
        </div>

        <div>
          <label className={styles.formLabel}>Tags:</label>
          <div className={styles.tagContainer}>
            {predefinedTags.map((tag) => (
              <div key={tag} className={styles.tagItem}>
                <input
                  type="checkbox"
                  id={tag}
                  value={tag}
                  checked={tags.includes(tag)}
                  onChange={handleTagChange}
                />
                <label htmlFor={tag}>{tag}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className={styles.formButton}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Blog'}
          </button>
        </div>
      </form>
      {success && <p className={styles.successMessage}>Blog added successfully!</p>}
    </div>
  );
}
