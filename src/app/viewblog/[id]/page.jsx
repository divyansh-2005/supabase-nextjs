'use client';

import { useParams } from 'next/navigation';
import ViewBlog from '../../ui/ViewBlog';

export default function ViewBlogPage() {
  const { id } = useParams();

  return (
    <div>
      <ViewBlog id={id} />
    </div>
    
  );
}
