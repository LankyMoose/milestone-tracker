import { Portal } from "kaioken"
import { MilestoneSets } from "./components/MilestoneSets"
import { MilestoneSetEditor } from "./components/MilestoneSetEditor"
import { ActiveMilestoneSetView } from "./components/ActiveMilestoneView"

export function App() {
  return (
    <>
      <MilestoneSets />
      <Portal container={document.getElementById("portal-root")!}>
        <ActiveMilestoneSetView />
        <MilestoneSetEditor />
      </Portal>
    </>
  )
}
