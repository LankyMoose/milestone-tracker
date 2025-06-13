import { ActiveMilestoneSetView } from "./components/ActiveMilestoneView"
import { Row } from "./components/Containers"
import { IconButton } from "./components/IconButton"
import { CogIcon } from "./components/icons/CogIcon"
import { CreateIcon } from "./components/icons/CreateIcon"
import { ImportIcon } from "./components/icons/ImportIcon"
import { MilestoneSetEditor } from "./components/MilestoneSetEditor"
import { MilestoneSets } from "./components/MilestoneSets"
import { Settings } from "./components/Settings"
import { createMilestoneSet, jsonUtils, settingsOpen } from "./state"

export function App() {
  return (
    <div className="flex flex-col gap-4 p-4 max-h-screen">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Milestone Tracker</h1>
        <Row gap="gap-4">
          <IconButton onclick={() => createMilestoneSet()}>
            <CreateIcon width="1rem" />
            Create New Set
          </IconButton>
          <IconButton onclick={() => jsonUtils.importSet()}>
            <ImportIcon width="1rem" />
            Import Set
          </IconButton>
          <IconButton onclick={() => (settingsOpen.value = true)}>
            <CogIcon width="1rem" />
            Settings
          </IconButton>
        </Row>
      </div>
      <MilestoneSets />
      <ActiveMilestoneSetView />
      <MilestoneSetEditor />
      <Settings />
    </div>
  )
}
