import { Portal, Transition, useSignal, useWatch } from "kaioken"
import {
  currentMilestoneIndex,
  finishRun,
  handleMilestoneCompleted,
  isActive,
  isInactive,
  Milestone,
  milestoneData,
  selectedMilestoneSetId,
} from "../state"
import { TimeDisplaySpan } from "./TimeDisplaySpan"
import { Button } from "./atoms/Button"
import { Modal } from "./dialog/Modal"
import { Stopwatch } from "./Stopwatch"
import { Col, Row } from "./Containers"

export function ActiveMilestoneSetView() {
  const tempState = useSignal<Milestone | null>(null)
  useWatch(() => {
    const setId = selectedMilestoneSetId.value,
      milestoneSets = milestoneData.value,
      milestoneIdx = currentMilestoneIndex.value
    if (setId === null) return
    tempState.value = structuredClone(
      milestoneSets[setId].milestones[milestoneIdx]
    )
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
              close={() => {
                if (
                  isActive.value &&
                  !confirm("Area you sure you want to cancel the run?")
                ) {
                  return
                }
                finishRun()
                selectedMilestoneSetId.value = null
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
                        <Button
                          disabled={isInactive}
                          onclick={() =>
                            tempState.value &&
                            handleMilestoneCompleted(tempState.value)
                          }
                        >
                          Complete
                        </Button>
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
              </Col>
            </Modal>
          )
        }}
      />
    </Portal>
  )
}
