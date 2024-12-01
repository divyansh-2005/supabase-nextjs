import Image from "next/image";
import Link from "next/link";
import Blog from "./ui/Blog";


export default function Home() {
  return (
    <div>
      <h1>Welcome to Blogify</h1>
      <Blog />
    </div>
  );
}
