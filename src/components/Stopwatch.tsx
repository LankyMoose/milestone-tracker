import { Derive } from "kaioken"
import {
  currentTime,
  finishRun,
  isInactive,
  isRunning,
  pauseRun,
  startOrResumeRun,
} from "../state"
import { formatTime } from "../utils"
import { PlayIcon } from "./icons/PlayIcon"
import { IconButton } from "./IconButton"
import { PauseIcon } from "./icons/PauseIcon"
import { UndoIcon } from "./icons/UndoIcon"
import { shortcuts } from "../shortcuts"
import { ShortcutBadge } from "./ShortcutBadge"

export function Stopwatch() {
  const { togglePause } = shortcuts
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 rounded">
      <span className="font-bold select-none font-mono">
        <Derive from={currentTime}>
          {(time) => {
            const { hours, minutes, seconds, hundredths } = formatTime(time)
            const lgValues =
              hours > 0
                ? [hours, minutes, seconds]
                : minutes > 0
                ? [minutes, seconds]
                : [seconds]
            return (
              <>
                <span className="text-5xl">
                  {lgValues.map((v) => String(v).padStart(2, "0")).join(":")}
                </span>
                <span className="text-4xl">
                  .{String(hundredths).padStart(2, "0")}
                </span>
              </>
            )
          }}
        </Derive>
      </span>
      <div className="flex gap-4 justify-center items-center font-mono">
        <IconButton
          onclick={() => (!isRunning.value ? startOrResumeRun() : pauseRun())}
          className="flex-col"
        >
          <Derive from={isRunning}>
            {(isRunning) =>
              isRunning ? (
                <PauseIcon width="3rem" height="3rem" />
              ) : (
                <PlayIcon width="3rem" height="3rem" />
              )
            }
          </Derive>
          <ShortcutBadge shortcut={togglePause} />
        </IconButton>
        <IconButton
          disabled={isInactive}
          onclick={finishRun}
          className="flex-col"
        >
          <UndoIcon width="3rem" height="3rem" />
          <ShortcutBadge shortcut={null} />
        </IconButton>
        {false && (
          <button
            onclick={() => {
              currentTime.value = 59.9 * 60 * 1000
            }}
          >
            skip to 59 min
          </button>
        )}
      </div>
    </div>
  )
}
