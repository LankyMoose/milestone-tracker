import { Transition, useRef, useSignal, useWatch } from "kaioken"
import {
  currentMilestoneIndex,
  handleMilestoneCompleted,
  isInactive,
  Milestone,
  milestoneData,
  selectedMilestoneSetId,
} from "../state"
import { TimeDisplaySpan } from "./TimeDisplaySpan"
import { Button } from "./Button"
import { Modal } from "./dialog/Modal"
import { Stopwatch } from "./Stopwatch"
import { Col, Row } from "./Containers"

export function ActiveMilestoneSetView() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
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
    <Transition
      in={!!selectedMilestoneSetId.value}
      onTransitionEnd={(s) => s === "exited" && (tempState.value = null)}
      element={(state) => {
        return (
          <Modal
            state={state}
            close={() => (selectedMilestoneSetId.value = null)}
          >
            <Stopwatch />
            <div className="flex flex-col gap-1 bg-black/50 p-1 rounded text-neutral-300">
              <div className="flex items-center gap-2 bg-white/5 py-1 px-4 rounded">
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
                          time={
                            tempState.value?.personalBest ?? {
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                            }
                          }
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
              <textarea
                ref={textAreaRef}
                value={tempState.value?.note}
                readOnly
                tabIndex={-1}
                disabled
                className="resize-none p-2 bg-black/50 rounded font-mono"
              />
            </div>
          </Modal>
        )
      }}
    />
  )
}
