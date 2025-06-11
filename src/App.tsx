import { Milestones } from "./components/Milestones"
import { Stopwatch } from "./components/Stopwatch"

export function App() {
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-center p-4">
      <Stopwatch />
      <Milestones />
    </div>
  )
}
