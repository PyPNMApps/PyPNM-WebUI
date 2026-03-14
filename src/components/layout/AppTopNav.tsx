import { NavLink } from "react-router-dom";

import { InstanceSelector } from "@/components/layout/InstanceSelector";

const links = [
  ["/", "Overview"],
  ["/health", "Health"],
  ["/endpoints", "Operations"],
  ["/settings", "Settings"],
] as const;

export function AppTopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <h1>PyPNM WebUI</h1>
      </div>
      <nav className="top-nav-links">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="top-nav-instance">
        <InstanceSelector />
      </div>
    </header>
  );
}
