import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { operationNavigationItems } from "@/features/operations/operationsNavigation";

function uniqueValues(values: string[]): string[] {
  return [...new Set(values)];
}

export function OperationsMenu() {
  const location = useLocation();
  const isActive = location.pathname.startsWith("/operations");
  const [isOpen, setIsOpen] = useState(false);
  const levelOneItems = uniqueValues(operationNavigationItems.map((item) => item.menuPath[0]));

  return (
    <div className={isOpen ? "operations-menu open" : "operations-menu"}>
      <button
        type="button"
        className={isActive ? "nav-link active operations-menu-trigger" : "nav-link operations-menu-trigger"}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        Operations
      </button>
      <div className="operations-menu-popover">
        <div className="operations-menu-columns">
          {levelOneItems.map((levelOne) => {
            const matchingItems = operationNavigationItems.filter((item) => item.menuPath[0] === levelOne);
            const levelTwoItems = uniqueValues(matchingItems.map((item) => item.menuPath[1]));

            return (
              <section key={levelOne} className="operations-menu-column">
                <div className="operations-menu-heading">{levelOne}</div>
                {levelTwoItems.map((levelTwo) => {
                  const leafItems = matchingItems.filter((item) => item.menuPath[1] === levelTwo);

                  return (
                    <div key={`${levelOne}-${levelTwo}`} className="operations-menu-group">
                      <div className="operations-menu-subheading">{levelTwo}</div>
                      <div className="operations-menu-links">
                        {leafItems.map((item) => (
                          <NavLink
                            key={item.id}
                            to={item.routePath}
                            onClick={() => {
                              setIsOpen(false);
                            }}
                            className={({ isActive: isLeafActive }) =>
                              isLeafActive ? "operations-menu-link active" : "operations-menu-link"
                            }
                          >
                            <span>{item.label}</span>
                            <span className="operations-menu-endpoint">{item.endpointPath}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
