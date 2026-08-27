import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { postBySlug, sortedPosts } from "../posts";
import { bySlug } from "../products";
import BuyButton from "../components/BuyButton";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? postBySlug(slug) : undefined;

  useEffect(() => {
    if (post) document.title = `${post.title} — Wicked Stacks`;
  }, [post]);

  if (!post) return <NotFound />;
  const product = bySlug(post.productSlug);
  const more = sortedPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="section product-page blog-post">
      <div className="wrap">
        <p className="crumbs">
          <Link to="/">Home</Link> · <Link to="/blog">Blog</Link>
        </p>
        <span className="badge">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>

        {post.body.map((line, i) =>
          line.startsWith("## ") ? (
            <h2 key={i}>{line.slice(3)}</h2>
          ) : (
            <p key={i}>{line}</p>
          )
        )}

        {post.videoUrl && (
          <p>
            <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="blog-video-link">
              ▶ {post.videoLabel ?? "Watch the free episode on YouTube"}
            </a>
          </p>
        )}

        {product && (
          <aside className="blog-cta">
            <span className="blog-cat">From the shelf</span>
            <h3>{product.title}</h3>
            <p>{product.blurb}</p>
            <div className="price-row">
              <span className="price big">${product.price}</span>
              <BuyButton product={product} />
            </div>
          </aside>
        )}

        <h2>Keep reading</h2>
        <div className="blog-list">
          {more.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="blog-card">
              <span className="blog-cat">{p.category}</span>
              <h2>{p.title}</h2>
              <span className="blog-read">Read it →</span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
