import { Link, NavLink } from "react-router-dom";

const nav = [
  { to: "/c/business", label: "Business" },
  { to: "/c/mindset", label: "Mind & Life" },
  { to: "/c/kids", label: "Kids' Corner" },
  { to: "/c/stack", label: "Stacks" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link to="/" className="logo">
          <img className="logo-mark" src="/brand/mark.png" alt="" />
          <span className="logo-text">
            Wicked<span className="logo-accent">Stacks</span>
            <sup className="logo-tm">™</sup>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Store sections">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="nav-link">
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
