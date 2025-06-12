import {
  Derive,
  ElementProps,
  Transition,
  useRef,
  useSignal,
  useWatch,
} from "kaioken"
import {
  Milestone,
  milestoneData,
  MilestoneSet,
  milestoneSetEditing,
} from "../state"
import { DialogHeader } from "./dialog/DialogHeader"
import { DialogFooter } from "./dialog/DialogFooter"
import { Drawer } from "./dialog/Drawer"
import { useTextareaAutoSize } from "@kaioken-core/hooks"
import { TimeDisplaySpan } from "./TimeDisplaySpan"
import { Row, Col } from "./Containers"
import { IconButton } from "./IconButton"
import { TrashIcon } from "./icons/TrashIcon"
import { UndoIcon } from "./icons/UndoIcon"
import { CreateIcon } from "./icons/CreateIcon"

export function MilestoneSetEditor() {
  const tempState = useSignal<MilestoneSet>({
    version: 0,
    name: "",
    milestones: [],
  })

  useWatch(() => {
    if (milestoneSetEditing.value === null) {
      return
    }
    tempState.value = structuredClone(
      milestoneData.value[milestoneSetEditing.value]
    )
  })

  const resetMilestonePersonalBest = (id: string) => {
    tempState.value = {
      ...tempState.value,
      milestones: tempState.value.milestones.map((m) => ({
        ...m,
        personalBest: m.id === id ? null : m.personalBest,
      })),
    }
  }

  const deleteMilestone = (id: string) => {
    tempState.value = {
      ...tempState.value,
      milestones: tempState.value.milestones.filter((m) => m.id !== id),
    }
  }

  const resetPBs = () => {
    tempState.value = {
      ...tempState.value,
      milestones: tempState.value.milestones.map((m) => ({
        ...m,
        personalBest: null,
      })),
    }
  }

  const addMilestone = () => {
    tempState.value = {
      ...tempState.value,
      milestones: [
        ...tempState.value.milestones,
        {
          id: crypto.randomUUID(),
          name: "",
          time: { hours: 0, minutes: 0, seconds: 0 },
          personalBest: null,
          note: "",
        },
      ],
    }
    console.log(tempState.value)
  }

  const cancel = () => {
    milestoneSetEditing.value = null
  }

  return (
    <Transition
      in={milestoneSetEditing.value !== null}
      onTransitionEnd={(s) =>
        s === "exited" &&
        (tempState.value = {
          version: 0,
          name: "",
          milestones: [],
        })
      }
      element={(state) => {
        return (
          <Drawer
            close={() => {
              if (milestoneSetEditing.value === null) return
              milestoneData.value = {
                ...milestoneData.value,
                [milestoneSetEditing.value]: tempState.value,
              }
              milestoneSetEditing.value = null
            }}
            state={state}
          >
            <DialogHeader>
              <input
                placeholder="Set Name"
                className="bg-black/40 px-2 py-1 w-full rounded"
                type="text"
                value={tempState.value.name}
                oninput={(e) => (tempState.value.name = e.target.value)}
              />
            </DialogHeader>
            <div className="flex flex-col gap-1 p-1 bg-black/30 rounded-md overflow-y-auto max-h-[60vh]">
              <Derive from={tempState}>
                {(state) => {
                  if (state.milestones.length === 0) {
                    return (
                      <i className="text-sm text-neutral-400 text-center">
                        No milestones
                      </i>
                    )
                  }
                  return state.milestones.map((milestone) => (
                    <MilestoneEditor
                      key={milestone.id}
                      milestone={milestone}
                      resetPB={() => resetMilestonePersonalBest(milestone.id)}
                      delete={() => deleteMilestone(milestone.id)}
                    />
                  ))
                }}
              </Derive>
            </div>
            <DialogFooter>
              <div className="flex px-2 gap-2 justify-between w-full">
                <div>
                  <IconButton onclick={cancel}>
                    <UndoIcon width="1rem" />
                    Undo Changes
                  </IconButton>
                </div>
                <div className={"flex gap-4"}>
                  <IconButton
                    onclick={resetPBs}
                    disabled={
                      tempState.value.milestones.length === 0 ||
                      tempState.value.milestones.some(
                        (m) => m.personalBest !== null
                      )
                    }
                  >
                    <UndoIcon width="1rem" />
                    Reset All PBs
                  </IconButton>
                  <IconButton onclick={addMilestone}>
                    <CreateIcon width="1rem" />
                    New Milestone
                  </IconButton>
                </div>
              </div>
            </DialogFooter>
          </Drawer>
        )
      }}
    />
  )
}

type MilestoneEditorProps = {
  milestone: Milestone
  resetPB: () => void
  delete: () => void
}

function MilestoneEditor({
  milestone,
  delete: _delete,
  resetPB,
}: MilestoneEditorProps) {
  const noteTextAreaRef = useRef<HTMLTextAreaElement>(null)

  useTextareaAutoSize(noteTextAreaRef)

  return (
    <Row className="items-start bg-white/5 rounded p-3">
      <Col grow>
        <input
          type="text"
          placeholder={"Milestone Name"}
          value={milestone.name}
          oninput={(e) => (milestone.name = e.target.value)}
          className={"bg-black/30 px-2 grow rounded"}
        />
        <Row wrap>
          <Row>
            H:
            <NumberInput
              value={milestone.time.hours}
              oninput={(e) => (milestone.time.hours = Number(e.target.value))}
              min={0}
              max={23}
            />
            M:
            <NumberInput
              id={`${milestone.id}_minutes`}
              value={milestone.time.minutes}
              oninput={(e) => (milestone.time.minutes = Number(e.target.value))}
              min={0}
              max={59}
            />
            S:
            <NumberInput
              id={`${milestone.id}_seconds`}
              value={milestone.time.seconds}
              oninput={(e) => (milestone.time.seconds = Number(e.target.value))}
              min={0}
              max={59}
            />
          </Row>
          <Row>
            PB:
            <TimeDisplaySpan time={milestone.personalBest} />
          </Row>
        </Row>
        <Row>
          <textarea
            ref={noteTextAreaRef}
            placeholder={"Notes"}
            className="px-2 py-1 bg-black/30 text-xs w-full rounded resize-none"
            value={milestone.note}
            oninput={(e) => (milestone.note = e.target.value)}
          />
        </Row>
      </Col>

      <Col className="text-xs">
        <IconButton onclick={_delete}>
          <TrashIcon width="1rem" />
          Delete
        </IconButton>
        <IconButton
          onclick={resetPB}
          disabled={milestone.personalBest === null}
        >
          <UndoIcon width="1rem" />
          Reset PB
        </IconButton>
      </Col>
    </Row>
  )
}

const NumberInput = (props: ElementProps<"input">) => {
  return (
    <input
      type="number"
      className={"w-auto bg-black/30 pl-2 rounded"}
      {...props}
    />
  )
}
