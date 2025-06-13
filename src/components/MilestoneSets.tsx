import { Derive, For, useComputed } from "kaioken"
import {
  jsonUtils,
  milestoneData,
  milestoneSetEditing,
  selectedMilestoneSetId,
} from "../state"
import { EditIcon } from "./icons/EditIcon"
import { ExportIcon } from "./icons/ExportIcon"
import { IconButton } from "./IconButton"
import { TrashIcon } from "./icons/TrashIcon"

export function MilestoneSets() {
  const sets = useComputed(() => Object.entries(milestoneData.value))
  return (
    <div className="flex flex-col p-2 bg-white/5 rounded overflow-y-auto">
      <ul className="flex flex-col gap-1 bg-black/25 p-1 rounded-md">
        <Derive from={sets}>
          {({ length }) =>
            length === 0 && (
              <i className="text-neutral-500 p-2 text-center">No sets exist</i>
            )
          }
        </Derive>
        <For each={sets}>
          {([id, set]) => (
            <li className="w-full text-left rounded p-4 flex items-center gap-2 justify-between bg-white/5">
              <div className="font-bold">
                <a
                  href="javascript:void(0)"
                  className="opacity-75 hover:opacity-100"
                  onclick={() => (selectedMilestoneSetId.value = id)}
                >
                  {set.name || "Unnamed Set"}
                </a>
              </div>
              <div className="flex gap-4">
                <IconButton
                  title={"Edit"}
                  onclick={() => (milestoneSetEditing.value = id)}
                >
                  <EditIcon width="1rem" />
                  <span className="hidden sm:inline">Edit</span>
                </IconButton>
                <IconButton
                  title={"Export"}
                  onclick={() => jsonUtils.exportSet(set)}
                >
                  <ExportIcon width="1rem" />
                  <span className="hidden sm:inline">Export</span>
                </IconButton>
                <IconButton
                  title={"Delete"}
                  onclick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete this milestone set?"
                      )
                    ) {
                      delete milestoneData.value[id]
                      milestoneData.notify()
                    }
                  }}
                >
                  <TrashIcon width="1rem" />
                  <span className="hidden sm:inline">Delete</span>
                </IconButton>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
