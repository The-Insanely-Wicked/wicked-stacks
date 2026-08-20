import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <h1>That page wandered off</h1>
        <p>
          Whatever was here got un-stacked. <Link to="/">Back to the shop →</Link>
        </p>
      </div>
    </section>
  );
}
