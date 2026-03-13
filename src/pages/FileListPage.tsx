import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";

export function FileListPage() {
  return (
    <>
      <PageHeader title="File List" subtitle="List backend file artifacts and provide download actions." />
      <Panel title="File Inventory Placeholder">
        <p>Add API integration for file metadata and download links.</p>
      </Panel>
    </>
  );
}
