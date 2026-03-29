import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { ThinkingIndicator } from "@/components/common/ThinkingIndicator";
import {
  singleCaptureNavigationItems,
  spectrumAnalyzerNavigationItems,
  type OperationNavigationItem,
} from "@/pw/features/operations/operationsNavigation";

interface CaptureOperationShellProps {
  isSingleCaptureRoute: boolean;
  isSpectrumAnalyzerRoute: boolean;
  selectedOperation: OperationNavigationItem;
  captureInputsTitle: ReactNode;
  requestForm: ReactNode;
  isPending: boolean;
  resultsView: ReactNode;
}

export function CaptureOperationShell({
  isSingleCaptureRoute,
  isSpectrumAnalyzerRoute,
  selectedOperation,
  captureInputsTitle,
  requestForm,
  isPending,
  resultsView,
}: CaptureOperationShellProps) {
  return (
    <>
      {isSingleCaptureRoute ? (
        <nav className="advanced-subnav">
          {singleCaptureNavigationItems.map((item) => (
            <NavLink key={item.id} to={item.routePath} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : isSpectrumAnalyzerRoute ? (
        <nav className="advanced-subnav">
          {spectrumAnalyzerNavigationItems.map((item) => (
            <NavLink key={item.id} to={item.routePath} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
      <PageHeader title={selectedOperation.label} subtitle="" />
      <Panel title={captureInputsTitle}>{requestForm}</Panel>

      {isPending ? (
        <Panel>
          <ThinkingIndicator label={`Collecting ${selectedOperation.label} data...`} />
        </Panel>
      ) : null}

      <Panel title="Results">{resultsView}</Panel>
    </>
  );
}
