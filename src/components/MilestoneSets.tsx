import { For, useComputed } from "kaioken"
import {
  createMilestoneSet,
  jsonUtils,
  milestoneData,
  milestoneSetEditing,
  selectedMilestoneSetId,
} from "../state"
import { Row } from "./Containers"
import { EditIcon } from "./icons/EditIcon"
import { ImportIcon } from "./icons/ImportIcon"
import { CreateIcon } from "./icons/CreateIcon"
import { ExportIcon } from "./icons/ExportIcon"
import { IconButton } from "./IconButton"
import { TrashIcon } from "./icons/TrashIcon"

export function MilestoneSets() {
  const sets = useComputed(() => Object.entries(milestoneData.value))
  return (
    <div className="flex flex-col gap-4 p-4 max-h-screen">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Milestone Sets</h1>
        <Row gap="gap-4">
          <IconButton onclick={() => createMilestoneSet()}>
            <CreateIcon width="1.25rem" />
            Create
          </IconButton>
          <IconButton onclick={() => jsonUtils.importSet()}>
            <ImportIcon width="1.25rem" />
            Import
          </IconButton>
        </Row>
      </div>
      <div className="flex flex-col p-2 bg-white/5 rounded overflow-y-auto">
        <ul className="flex flex-col gap-1 bg-black/25 p-1 text-xs rounded-md">
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
                  <IconButton onclick={() => (milestoneSetEditing.value = id)}>
                    <EditIcon width="1.25rem" />
                  </IconButton>
                  <IconButton onclick={() => jsonUtils.exportSet(set)}>
                    <ExportIcon width="1.25rem" />
                  </IconButton>
                  <IconButton
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
                    <TrashIcon width="1.25rem" />
                  </IconButton>
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  )
}
