import { NavLink } from "react-router-dom";

import { InstanceSelector } from "@/components/layout/InstanceSelector";
import { OperationsMenu } from "@/features/operations/components/OperationsMenu";

const links = [
  ["/settings", "Settings"],
  ["/spectrum-analyzer", "Spectrum Analyzer"],
  ["/single-capture", "Single Capture"],
  ["/advanced", "Advanced"],
  ["/files", "Files"],
  ["/health", "Health"],
  ["/about", "About"],
] as const;

function PyPnmWebUiIcon() {
  return <img src="/images/PyPNM-WebUI-favicon.ico" alt="" aria-hidden="true" className="top-nav-brand-icon" />;
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
        <NavLink to={links[1][0]} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          {links[1][1]}
        </NavLink>
        <NavLink to={links[2][0]} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          {links[2][1]}
        </NavLink>
        {links.slice(3).map(([to, label]) => (
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
