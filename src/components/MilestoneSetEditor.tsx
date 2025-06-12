import { ElementProps, Transition, useRef, useSignal, useWatch } from "kaioken"
import {
  Milestone,
  milestoneData,
  MilestoneSet,
  milestoneSetEditing,
} from "../state"
import { DialogHeader } from "./dialog/DialogHeader"
import { DialogBody } from "./dialog/DialogBody"
import { DialogFooter } from "./dialog/DialogFooter"
import { Drawer } from "./dialog/Drawer"
import { useTextareaAutoSize } from "@kaioken-core/hooks"
import { Button } from "./Button"
import { TimeDisplaySpan } from "./TimeDisplaySpan"

export function MilestoneSetEditor() {
  const setId = milestoneSetEditing.value
  const tempState = useSignal<MilestoneSet>({
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
      in={setId !== null}
      onTransitionEnd={(s) =>
        s === "exited" &&
        (tempState.value = {
          name: "",
          milestones: [],
        })
      }
      element={(state) => {
        return (
          <Drawer
            close={() => {
              milestoneSetEditing.value = null
              if (!setId) return

              milestoneData.value = {
                ...milestoneData.value,
                [setId]: tempState.value,
              }
            }}
            state={state}
          >
            <DialogHeader>
              <input
                placeholder="Set Name"
                className="bg-black/40 px-2 w-full"
                type="text"
                value={tempState.value.name}
                oninput={(e) => (tempState.value.name = e.target.value)}
              />
              <Button
                onclick={() => {
                  if (!setId) return
                  delete milestoneData.value[setId]
                  milestoneSetEditing.value = null
                  milestoneData.notify()
                }}
                className="text-base font-normal"
              >
                Delete
              </Button>
            </DialogHeader>
            <DialogBody>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                }}
                className="gap-1 p-1 bg-black/50 rounded text-neutral-300"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Hours</th>
                    <th>Minutes</th>
                    <th>Seconds</th>
                    <th>PB</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tempState.value.milestones.map((milestone) => (
                    <tr key={milestone.id} className="even:bg-white/5">
                      <MilestoneEditor
                        milestone={milestone}
                        resetPB={() => resetMilestonePersonalBest(milestone.id)}
                        delete={() => deleteMilestone(milestone.id)}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </DialogBody>
            <DialogFooter>
              <div className="flex gap-2 justify-between w-full">
                <div>
                  <Button onclick={cancel}>Cancel</Button>
                </div>
                <div className={"flex gap-2"}>
                  <Button onclick={resetPBs}>Reset All PBs</Button>
                  <Button onclick={addMilestone}>New Milestone</Button>
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
    <>
      <td>
        <input
          type="text"
          value={milestone.name}
          oninput={(e) => (milestone.name = e.target.value)}
          className={"bg-black/30 px-2 grow"}
        />
      </td>
      <td>
        <NumberInput
          value={milestone.time.hours}
          oninput={(e) => (milestone.time.hours = Number(e.target.value))}
          min={0}
          max={23}
        />
      </td>
      <td>
        <NumberInput
          id={`${milestone.id}_minutes`}
          value={milestone.time.minutes}
          oninput={(e) => (milestone.time.minutes = Number(e.target.value))}
          min={0}
          max={59}
        />
      </td>
      <td>
        <NumberInput
          id={`${milestone.id}_seconds`}
          value={milestone.time.seconds}
          oninput={(e) => (milestone.time.seconds = Number(e.target.value))}
          min={0}
          max={59}
        />
      </td>
      <td>
        <TimeDisplaySpan time={milestone.personalBest} />
      </td>
      <td>
        <div className="p-2">
          <textarea
            ref={noteTextAreaRef}
            className="px-2 py-1 bg-black/40 text-xs"
            value={milestone.note}
            oninput={(e) => (milestone.note = e.target.value)}
          />
        </div>
      </td>
      <td>
        <Button onclick={_delete}>Delete</Button>
        <Button onclick={resetPB} disabled={milestone.personalBest === null}>
          Reset PB
        </Button>
      </td>
    </>
  )
}

const NumberInput = (props: ElementProps<"input">) => {
  return (
    <input type="number" className={"w-auto bg-black/30 pl-2"} {...props} />
  )
}
