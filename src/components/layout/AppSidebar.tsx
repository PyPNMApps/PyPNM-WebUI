import { NavLink } from "react-router-dom";

const links = [
  ["/", "Overview"],
  ["/health", "Health"],
  ["/endpoints", "Endpoint Explorer"],
  ["/measurements", "Measurement Request"],
  ["/results", "Results"],
  ["/files", "File List"],
  ["/analysis", "Analysis Viewer"],
  ["/settings", "Settings"],
] as const;

export function AppSidebar() {
  return (
    <aside className="sidebar">
      <h1>PyPNM WebUI</h1>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
