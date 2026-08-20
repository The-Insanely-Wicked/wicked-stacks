import type { Product } from "../products";

// Renders the real checkout link once a Stripe Payment Link is pasted into
// products.ts; until then, an honest "coming soon" state.
export default function BuyButton({ product }: { product: Product }) {
  if (!product.buyUrl) {
    return (
      <button className="buy-btn disabled" disabled>
        Checkout opening soon
      </button>
    );
  }
  return (
    <a className="buy-btn" href={product.buyUrl}>
      Buy now — ${product.price}
    </a>
  );
}
