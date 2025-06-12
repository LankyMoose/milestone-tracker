import { ElementProps } from "kaioken"
import { className as cls } from "kaioken/utils"
export function IconButton(props: ElementProps<"button">) {
  return (
    <button
      className={cls(
        "flex items-center gap-1 opacity-75 text-xs",
        "disabled:opacity-25",
        "not-disabled:hover:opacity-100 not-disabled:cursor-pointer"
      )}
      {...props}
    />
  )
}
