import { NavLink } from "react-router-dom";

import { InstanceSelector } from "@/components/layout/InstanceSelector";
import { OperationsMenu } from "@/features/operations/components/OperationsMenu";

const links = [
  ["/settings", "Settings"],
  ["/files", "Files"],
  ["/health", "Health"],
  ["/about", "About"],
] as const;

function PyPnmWebUiIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="top-nav-brand-icon">
      <defs>
        <linearGradient id="pypnm-webui-icon-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#79a9ff" />
          <stop offset="100%" stopColor="#58d0a7" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
      <path
        d="M18 43V21h8.5c4.4 0 7 2.3 7 6.1 0 3.9-2.6 6.3-7 6.3H23v9.6zm5-13.7h3.2c1.8 0 2.8-.8 2.8-2.3 0-1.4-1-2.1-2.8-2.1H23zm15 13.7V21h4.9l7.1 12.7V21h4.5v22h-4.7l-7.3-13V43z"
        fill="url(#pypnm-webui-icon-fill)"
      />
    </svg>
  );
}

export function AppTopNav() {
  return (
    <header className="top-nav">
      <NavLink to="/" end className="top-nav-brand" aria-label="PyPNM WebUI home">
        <PyPnmWebUiIcon />
        <h1>PyPNM WebUI</h1>
      </NavLink>
      <nav className="top-nav-links">
        <NavLink to={links[0][0]} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          {links[0][1]}
        </NavLink>
        <OperationsMenu />
        {links.slice(1).map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
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
