import { Link } from "react-router-dom";
import { useEffect } from "react";
import { sortedPosts } from "../posts";

export default function BlogIndex() {
  useEffect(() => {
    document.title = "The Wicked Blog — Wicked Stacks";
  }, []);

  return (
    <section className="section blog-index">
      <div className="wrap">
        <h1>The Wicked Blog</h1>
        <p className="lead">
          Ideas from the books, argued in public. No fluff, no guru voice —
          just the useful parts, free.
        </p>
        <div className="blog-list">
          {sortedPosts().map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
              <span className="blog-cat">{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="blog-read">Read it →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
