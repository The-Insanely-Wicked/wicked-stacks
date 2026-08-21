import { Link } from "react-router-dom";
import type { Product } from "../products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/p/${product.slug}`} className="card">
      {product.image && (
        <img className="card-img" src={product.image} alt="" loading="lazy" />
      )}
      {product.badge && <span className="badge">{product.badge}</span>}
      <h3 className="card-title">{product.title}</h3>
      <p className="card-sub">{product.subtitle}</p>
      <p className="card-blurb">{product.blurb}</p>
      <div className="card-foot">
        <span className="price">
          {product.compareAt && (
            <s className="compare">${product.compareAt}</s>
          )}{" "}
          ${product.price}
        </span>
        <span className="card-cta">View →</span>
      </div>
    </Link>
  );
}
