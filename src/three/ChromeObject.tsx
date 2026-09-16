import { lazy, Suspense } from 'react'
import type { ComponentProps } from 'react'

const Impl = lazy(() => import('./ChromeObjectImpl'))
type Props = ComponentProps<typeof Impl>

/** Defers the three.js bundle until an object is actually mounted; shows the bubble gradient until then. */
export default function ChromeObject(props: Props) {
  return (
    <Suspense fallback={<div className={props.className} style={{ ...props.style, borderRadius: '50%', background: 'var(--grad-bubble)', opacity: 0.9, transform: 'scale(0.62)' }} />}>
      <Impl {...props} />
    </Suspense>
  )
}
