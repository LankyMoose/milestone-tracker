import { ElementProps, For, useComputed } from "kaioken"
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

function IconButton(props: ElementProps<"button">) {
  return (
    <button
      className="flex items-center gap-2 cursor-pointer opacity-75 hover:opacity-100 text-xs"
      {...props}
    />
  )
}

export function MilestoneSets() {
  const sets = useComputed(() => Object.entries(milestoneData.value))
  return (
    <div className="flex flex-col gap-4 p-4 bg-white/5 rounded">
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
      <ul className="flex flex-col gap-1 bg-black/25 p-1 text-xs rounded-md">
        <For each={sets}>
          {([id, set]) => (
            <li className="w-full text-left rounded p-4 flex items-center gap-2 justify-between bg-white/5">
              <div className="font-bold">
                <a
                  href="javascript:void(0)"
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
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
