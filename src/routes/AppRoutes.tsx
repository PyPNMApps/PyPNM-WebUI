import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { AnalysisViewerPage } from "@/pages/AnalysisViewerPage";
import { EndpointExplorerPage } from "@/pages/EndpointExplorerPage";
import { FileListPage } from "@/pages/FileListPage";
import { HealthPage } from "@/pages/HealthPage";
import { HomePage } from "@/pages/HomePage";
import { MeasurementRequestPage } from "@/pages/MeasurementRequestPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { SettingsPage } from "@/pages/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/endpoints" element={<Navigate to="/operations" replace />} />
        <Route path="/operations" element={<EndpointExplorerPage />} />
        <Route path="/operations/:operationId" element={<EndpointExplorerPage />} />
        <Route path="/measurements" element={<MeasurementRequestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/files" element={<FileListPage />} />
        <Route path="/analysis" element={<AnalysisViewerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
