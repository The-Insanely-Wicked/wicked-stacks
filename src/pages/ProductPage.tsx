import { useParams, Link } from "react-router-dom";
import { bySlug, CATEGORY_LABELS } from "../products";
import BuyButton from "../components/BuyButton";
import ProductCard from "../components/ProductCard";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { slug } = useParams();
  const product = slug ? bySlug(slug) : undefined;
  if (!product) return <NotFound />;

  const included = (product.includes ?? [])
    .map((s) => bySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article className="section product-page">
      <div className="wrap">
        <p className="crumbs">
          <Link to="/">Home</Link> ·{" "}
          <Link to={`/c/${product.category}`}>
            {CATEGORY_LABELS[product.category]}
          </Link>
        </p>
        {product.badge && <span className="badge">{product.badge}</span>}
        <h1>{product.title}</h1>
        <p className="lead">{product.subtitle}</p>
        <p className="formats">{product.formats.join(" · ")}</p>

        <div className="price-row">
          <span className="price big">
            {product.compareAt && (
              <s className="compare">${product.compareAt}</s>
            )}{" "}
            ${product.price}
          </span>
          <BuyButton product={product} />
        </div>

        {product.description.map((para) => (
          <p key={para.slice(0, 32)} className="body-para">
            {para}
          </p>
        ))}

        <h2>What's inside</h2>
        <ul className="checklist">
          {product.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        {included.length > 0 && (
          <>
            <h2>Included in this stack</h2>
            <div className="grid">
              {included.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </>
        )}

        <p className="guarantee">
          🛡️ 30-day money-back guarantee. Instant download after checkout.
        </p>
      </div>
    </article>
  );
}
