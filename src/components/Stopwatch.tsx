import { Derive } from "kaioken"
import {
  currentTime,
  finishRun,
  isInactive,
  isRunning,
  notRunning,
  pauseRun,
  startOrResumeRun,
} from "../state"
import { formatTime } from "../utils"
import { PlayIcon } from "./icons/PlayIcon"
import { IconButton } from "./IconButton"
import { PauseIcon } from "./icons/PauseIcon"
import { UndoIcon } from "./icons/UndoIcon"

export function Stopwatch() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 rounded">
      <span className="font-bold select-none font-mono">
        <Derive from={currentTime}>
          {(time) => {
            const { hours, minutes, seconds, hundredths } = formatTime(time)
            return (
              <>
                <span className="text-5xl">
                  {hours > 0 ? `${hours}:` : ""}
                  {minutes > 0 ? `${minutes}:` : ""}
                  {String(seconds).padStart(minutes > 0 ? 2 : 1, "0")}
                </span>
                <span className="text-4xl">
                  .{String(hundredths).padStart(2, "0")}
                </span>
              </>
            )
          }}
        </Derive>
      </span>
      <div className="flex gap-4 justify-center items-center">
        <IconButton disabled={isRunning} onclick={startOrResumeRun}>
          <PlayIcon width="2rem" height="2rem" />
        </IconButton>
        <IconButton disabled={notRunning} onclick={pauseRun}>
          <PauseIcon width="2rem" height="2rem" />
        </IconButton>
        <IconButton disabled={isInactive} onclick={finishRun}>
          <UndoIcon width="2rem" height="2rem" />
        </IconButton>
      </div>
    </div>
  )
}
