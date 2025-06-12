import { ElementProps, unwrap } from "kaioken"
import { className as cls } from "kaioken/utils"
type LayoutContainerProps = ElementProps<"div"> & {
  grow?: boolean
  wrap?: boolean
  gap?: string
}

export function Row({
  className,
  grow,
  wrap,
  gap,
  ...props
}: LayoutContainerProps) {
  return (
    <div
      className={cls(
        "flex",
        gap ?? "gap-2",
        grow && "grow",
        wrap && "flex-wrap",
        unwrap(className)
      )}
      {...props}
    />
  )
}

export function Col({
  className,
  grow,
  wrap,
  gap,
  ...props
}: LayoutContainerProps) {
  return (
    <div
      className={cls(
        "flex flex-col",
        gap ?? "gap-2",
        grow && "grow",
        wrap && "wrap",
        unwrap(className)
      )}
      {...props}
    />
  )
}
