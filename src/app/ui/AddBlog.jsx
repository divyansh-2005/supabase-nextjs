'use client';

import { useState } from 'react';
import { useSession } from '../context/SessionProvider'; 
import { createClient } from '../../../utils/supabase/client';
import styles from './AddBlog.module.css';

export default function AddBlog() {
  const user = useSession(); // Get the current user
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile,setImageFile] = useState(null);

  const predefinedTags = ['Technology', 'Health', 'Finance', 'Education', 'Travel', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
       
    if (file) {
      setImageFile(file);
    }
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags((prevTags) => [...prevTags, value]);
    } else {
      setTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

  const handleSubmit = async (e) => {
    const supabase = createClient();
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

      // Check if there is an image file
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        
        console.log('Uploading image:', fileName); // Debug log

        // Upload the image file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('thumbnail') // 'thumbnail' is the bucket name
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data, error } = supabase
          .storage
          .from('thumbnail')
          .getPublicUrl(fileName);

        if (!data) {
          console.error('Get public URL error:', error);
          throw new Error(`Failed to get public URL: ${error.message}`);
        }

        thumbnailUrl = data.publicUrl;
        console.log('PublicURL:', data.publicUrl);
      }

      // Insert the blog post into the 'blogs' table
      const { data, error } = await supabase.from('blogs').insert([
        {
          user_id: user.id,
          title,
          desc,
          thumbnail:thumbnailUrl,
          tag: tags, // Array of tags
        },
      ]);

      if (error) {
        console.error('Insert blog error:', error);
        throw new Error(`Failed to insert blog: ${error.message}`);
      }

      console.log('Blog added successfully:', data);

      setSuccess(true);
      setTitle('');
      setDesc('');
      setThumbnailUrl('');
      setTags('');
      setImageFile(null);
    } catch (error) {
      console.error('Error adding blog:', error.message);
      alert(`Error adding blog: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add a New Blog</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div>
          <label className={styles.formLabel} htmlFor="title">Title:</label>
          <input
            className={styles.formInput}
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.formLabel} htmlFor="desc">Description:</label>
          <input
            className={styles.formTextarea}
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label className={styles.formLabel} htmlFor="thumbnail">Thumbnail (Image):</label>
          <input
            className={styles.formInput}
            id="thumbnail"
            type="file"
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label className={styles.formLabel} htmlFor="tag">Tags:</label>
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
          <button className={styles.formButton} type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Blog'}
          </button>
        </div>
      </form>
      {success && <p>Blog added successfully!</p>}
    </div>
  );
}
