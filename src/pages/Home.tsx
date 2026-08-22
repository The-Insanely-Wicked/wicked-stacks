import { Link } from "react-router-dom";
import { PRODUCTS, SITE, bySlug } from "../products";
import ProductCard from "../components/ProductCard";
import EmailCapture from "../components/EmailCapture";

const flagship = bySlug("complete-business-mastery")!;

export default function Home() {
  const stacks = PRODUCTS.filter((p) => p.category === "stack");
  const books = PRODUCTS.filter((p) => p.category !== "stack");

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">{SITE.parentBrand} presents</p>
          <h1>
            Wicked <span className="wicked">Stacks</span>
          </h1>
          <p className="lead">{SITE.tagline}</p>
          <p className="hero-sub">
            Real books written by a real person — business, life, and stories
            for the kids — with the workbooks, audio, and wickedly good bundle
            deals to match.
          </p>
          <div className="hero-ctas">
            <Link className="buy-btn" to={`/p/${flagship.slug}`}>
              See the flagship — {flagship.title}
            </Link>
            <Link className="ghost-btn" to="/c/stack">
              Browse the Stacks
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-head">The Flagship</h2>
          <div className="flagship-card">
            <div>
              <span className="badge">Flagship</span>
              <h3>{flagship.title}</h3>
              <p className="card-sub">{flagship.subtitle}</p>
              <p>{flagship.blurb}</p>
              <Link className="buy-btn" to={`/p/${flagship.slug}`}>
                Get the book + toolkit — ${flagship.price}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-head">The Books</h2>
          <div className="grid">
            {books.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="section-head">The Stacks — bundle & save</h2>
          <div className="grid">
            {stacks.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section doodle-promo">
        <div className="wrap">
          <h2>We make our videos with DoodleAI</h2>
          <p>
            Every explainer video on this site was made with{" "}
            <strong>DoodleAI</strong> — our AI-powered doodle video studio.
            Turn any script into a whiteboard video in minutes, in 60+
            languages.
          </p>
          <a className="ghost-btn" href={SITE.doodleUrl}>
            Check out DoodleAI →
          </a>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
