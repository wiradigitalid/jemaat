import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/*
 * The domain layer. shadcn owns the primitives underneath these (Input,
 * Label, Card, Button, Badge, Avatar); everything here is the Jemaat pattern
 * on top, and it is the part that would have to be written whichever library
 * sat below it.
 */

/** Uppercase micro-label. 10px / 700 / 0.09em, from the design system. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">
      {children}
    </div>
  )
}

/** Label + control + optional tag and hint. The canvas field, deskField(). */
export function Field({
  label,
  tag,
  hint,
  children,
}: {
  label: string
  tag?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-bold text-ink-2">{label}</Label>
        {tag ? <span className="text-xs font-semibold text-muted-foreground">{tag}</span> : null}
      </div>
      {children}
      {hint ? <span className="text-xs leading-snug text-muted-foreground">{hint}</span> : null}
    </div>
  )
}

/** 44px control height, 12px radius, white surface. */
export function TextField({
  label,
  tag,
  hint,
  defaultValue,
  className,
}: {
  label: string
  tag?: string
  hint?: string
  defaultValue: string
  className?: string
}) {
  return (
    <Field label={label} tag={tag} hint={hint}>
      <Input
        defaultValue={defaultValue}
        className={cn(
          'h-11 rounded-[var(--radius)] border-input bg-card px-3.5 text-md font-semibold text-foreground',
          className,
        )}
      />
    </Field>
  )
}

/** A row inside a card: divide-y is applied by the parent. */
export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center gap-3 px-4 py-3', className)}>{children}</div>
}

/** The "+ Add an administrator" affordance at the foot of a card. */
export function AddRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-t border-muted px-4 py-3.5">
      <Plus className="size-4 text-primary" strokeWidth={2.2} />
      <span className="text-base font-semibold text-primary">{children}</span>
    </div>
  )
}

/** Label/value row, used by "this register" facts. */
export function FactRow({
  label,
  value,
  action,
}: {
  label: string
  value: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-baseline gap-3.5 px-4 py-3">
      <span className="w-[130px] shrink-0 text-xs font-bold tracking-[0.07em] text-muted-foreground">
        {label}
      </span>
      <span className="flex-1 text-base font-semibold">{value}</span>
      {action}
    </div>
  )
}

/*
 * Map stand-in, ported from the canvas. The real one is react-leaflet with
 * OpenStreetMap tiles and a draggable marker; the drawn version keeps the
 * frame, the zoom stack and the attribution so the layout is honest.
 */
export function MapFrame({ height = 200 }: { height?: number }) {
  const w = 470
  const h = height
  const road = (x1: number, y1: number, x2: number, y2: number, wd: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeWidth={wd} strokeLinecap="round" />
  )
  const blk = (x: number, y: number, bw: number, bh: number, fill = '#E4DCD1') => (
    <rect x={x} y={y} width={bw} height={bh} rx={2} fill={fill} />
  )
  const cx = w * 0.5
  const cy = h * 0.47
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[var(--radius)] border border-border"
      style={{ height: h }}
    >
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="block">
        <rect x={0} y={0} width={w} height={h} fill="#EFE9E0" />
        {blk(w * 0.04, h * 0.06, w * 0.26, h * 0.3)}
        {blk(w * 0.36, h * 0.06, w * 0.3, h * 0.22)}
        {blk(w * 0.72, h * 0.1, w * 0.24, h * 0.26)}
        {blk(w * 0.04, h * 0.62, w * 0.22, h * 0.3)}
        {blk(w * 0.34, h * 0.66, w * 0.3, h * 0.26)}
        {blk(w * 0.7, h * 0.6, w * 0.26, h * 0.32, '#E0E7DC')}
        {road(0, h * 0.5, w, h * 0.47, 9)}
        {road(w * 0.33, 0, w * 0.31, h, 7)}
        {road(w * 0.68, 0, w * 0.7, h, 5)}
        {road(0, h * 0.86, w, h * 0.84, 4)}
        <circle cx={cx} cy={cy} r={13} fill="var(--primary)" opacity={0.16} />
        <path
          d={`M${cx} ${cy + 9} c-4.6 -6.4 -7 -9.6 -7 -12.6 a7 7 0 0 1 14 0 c0 3 -2.4 6.2 -7 12.6z`}
          fill="var(--destructive)"
        />
        <circle cx={cx} cy={cy - 3.8} r={2.4} fill="#FFFFFF" />
      </svg>
      <div className="absolute top-2 right-2 flex flex-col overflow-hidden rounded-lg border border-border bg-card">
        <span className="flex h-6 w-[26px] items-center justify-center border-b border-muted text-ink-2">
          <Plus className="size-3.5" strokeWidth={2.2} />
        </span>
        <span className="flex h-6 w-[26px] items-center justify-center text-md font-bold text-ink-2">
          &minus;
        </span>
      </div>
      <div className="absolute right-0 bottom-0 bg-white/[0.78] px-1.5 py-0.5 text-[8px] font-semibold text-ink-2">
        © OpenStreetMap
      </div>
    </div>
  )
}
