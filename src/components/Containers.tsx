import { ElementProps, unwrap } from "kaioken"

type LayoutContainerProps = ElementProps<"div"> & {
  grow?: boolean
  wrap?: boolean
}

export function Row({ className, grow, wrap, ...props }: LayoutContainerProps) {
  return (
    <div
      className={[
        "flex gap-2",
        grow && "grow",
        wrap && "flex-wrap",
        unwrap(className),
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
}

export function Col({ className, grow, wrap, ...props }: LayoutContainerProps) {
  return (
    <div
      className={[
        "flex flex-col gap-2",
        grow && "grow",
        wrap && "wrap",
        unwrap(className),
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
}
