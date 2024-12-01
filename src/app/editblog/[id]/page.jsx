'use client';

import { useParams, useRouter } from 'next/navigation';
import EditBlog from '../../ui/Editblog';

export default function EditBlogPage({ params }) {
  const { id } = useParams();

  if (!id) {
    return <p>Invalid Blog ID</p>;
  }

  return <EditBlog blogId={id} />;
}
