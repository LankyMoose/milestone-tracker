import { Portal } from "kaioken"
import { MilestoneSets } from "./components/MilestoneSets"
import { MilestoneSetEditor } from "./components/MilestoneSetEditor"
import { ActiveMilestoneSetView } from "./components/ActiveMilestoneView"

export function App() {
  return (
    <div className="p-4">
      <MilestoneSets />
      <Portal container={document.getElementById("portal-root")!}>
        <ActiveMilestoneSetView />
        <MilestoneSetEditor />
      </Portal>
    </div>
  )
}
