import { confirm } from "@tauri-apps/plugin-dialog"
import { Portal, Transition, useComputed, useSignal, useWatch } from "kaioken"
import {
  currentMilestone,
  finishRun,
  handleMilestoneCompleted,
  isActive,
  isInactive,
  Milestone,
  milestoneData,
  selectedMilestoneSetId,
} from "../state"
import { TimeDisplaySpan } from "./TimeDisplaySpan"
import { Modal } from "./dialog/Modal"
import { Stopwatch } from "./Stopwatch"
import { Col, Row } from "./Containers"
import { ShortcutBadge } from "./ShortcutBadge"
import { shortcuts } from "../shortcuts"
import { IconButton } from "./IconButton"
import { LineChart, LineChartData } from "./charts/LineChart"

export function ActiveMilestoneSetView() {
  const tempState = useSignal<Milestone | null>(null)
  const graphData = useComputed<LineChartData>(() => {
    const setId = selectedMilestoneSetId.value
    if (setId === null)
      return {
        labels: [],
        datasets: [],
      }
    const set = milestoneData.value[setId]

    return {
      xLabels: set.milestones.map((m) => m.name),
      datasets: [
        {
          label: "Target",
          data: set.milestones.map((ms) => ms.time.raw / 1000),
          fill: false,
          borderColor: "green",
          tension: 0.1,
        },
        ...(set.runHistory ?? []).map((run) => ({
          label: "Run",
          data: run.times.map((t) => t / 1000),
          fill: false,
          borderColor: "blue",
          tension: 0.1,
        })),
      ],
    }
  })
  useWatch(() => {
    const ms = currentMilestone.value
    if (ms === null) return
    tempState.value = structuredClone(ms)
  })
  return (
    <Portal container={document.getElementById("portal-root")!}>
      <Transition
        in={!!selectedMilestoneSetId.value}
        onTransitionEnd={(s) => s === "exited" && (tempState.value = null)}
        element={(state) => {
          return (
            <Modal
              state={state}
              close={async () => {
                if (!isActive.value) {
                  selectedMilestoneSetId.value = null
                  return
                }

                const confirmed = await confirm(
                  "Are you sure you want to cancel the run?",
                  { title: "Cancel Run", cancelLabel: "No", okLabel: "Yes" }
                )
                if (confirmed) {
                  finishRun()
                  selectedMilestoneSetId.value = null
                }
              }}
            >
              <Col>
                <Stopwatch />
                <Col className="bg-white/5 p-2 rounded">
                  <h2 className="font-mono font-bold">Current Milestone</h2>
                  <div className="flex items-center gap-2 bg-black/25 p-2 rounded">
                    <Col grow>
                      <Row className="justify-between">
                        <div className="font-bold">{tempState.value?.name}</div>
                        <IconButton
                          disabled={isInactive}
                          onclick={() => handleMilestoneCompleted()}
                          className="bg-green-900 rounded px-2 py-1"
                        >
                          Complete{" "}
                          <ShortcutBadge
                            shortcut={shortcuts.completeMilestone}
                            replacer={null}
                          />
                        </IconButton>
                      </Row>
                      <Col>
                        <Row className="justify-between">
                          <Row>
                            <span className="grow">PB: </span>
                            <TimeDisplaySpan
                              time={tempState.value?.personalBest ?? null}
                            />
                          </Row>
                          <Row>
                            <span className="grow">Target: </span>
                            <TimeDisplaySpan
                              time={
                                tempState.value?.time ?? {
                                  hours: 0,
                                  minutes: 0,
                                  seconds: 0,
                                  raw: 0,
                                }
                              }
                            />
                          </Row>
                        </Row>
                      </Col>
                    </Col>
                  </div>
                  <h2 className="font-mono font-bold">Notes</h2>
                  <pre className="p-2 bg-black/25 w-full rounded text-sm text-neutral-300">
                    <code>{tempState.value?.note || <i>No Notes</i>}</code>
                  </pre>
                </Col>
                <Col className="bg-white/5 p-2 rounded">
                  <h2 className="font-mono font-bold">Stats</h2>
                  <div className="p-2 bg-black/25 rounded">
                    <LineChart data={graphData} />
                  </div>
                </Col>
              </Col>
            </Modal>
          )
        }}
      />
    </Portal>
  )
}
