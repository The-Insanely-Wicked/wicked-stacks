import { useParams } from "react-router-dom";
import { PRODUCTS, CATEGORY_LABELS, type Category } from "../products";
import ProductCard from "../components/ProductCard";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { category } = useParams();
  if (!category || !(category in CATEGORY_LABELS)) return <NotFound />;
  const cat = category as Category;
  const items = PRODUCTS.filter((p) => p.category === cat);

  return (
    <section className="section">
      <div className="wrap">
        <h1>{CATEGORY_LABELS[cat]}</h1>
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
