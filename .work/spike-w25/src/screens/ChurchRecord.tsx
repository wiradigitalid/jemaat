import { Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AddRow,
  FactRow,
  MapFrame,
  Row,
  SectionLabel,
  TextField,
} from '@/components/jemaat/primitives'

/** W25. The handful of facts every other screen reads. */
export function ChurchRecord() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Page top bar. Not a shadcn component: 78px, surface-alt, one action. */}
      <header className="flex items-center gap-3.5 border-b border-border bg-surface-alt px-8 py-5">
        <div className="min-w-0 flex-1">
          <div className="text-lg font-bold">Church record</div>
          <div className="mt-0.5 text-sm text-muted-foreground">Immanuel Church, Sunter</div>
        </div>
        <Button className="h-10 gap-2 rounded-[var(--radius)] font-semibold">
          <Check className="size-[17px]" strokeWidth={1.7} />
          Save
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 gap-7 px-8 py-6.5">
        <div className="flex w-[470px] shrink-0 flex-col gap-4">
          <SectionLabel>This church</SectionLabel>
          <TextField label="NAME" defaultValue="Immanuel Church, Sunter" />
          <TextField
            label="ADDRESS"
            defaultValue="Jl. Danau Sunter Utara Blok A No. 4, Jakarta Utara"
          />
          <div className="flex gap-3.5">
            <div className="flex-1">
              <TextField label="TIME ZONE" defaultValue="WIB · GMT+7" />
            </div>
            <div className="flex-1">
              <TextField label="WORSHIP DAY" defaultValue="Saturday" />
            </div>
          </div>
          <MapFrame height={200} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <SectionLabel>Who can administer</SectionLabel>
          <Card className="gap-0 rounded-[var(--radius-card)] border-border py-0 shadow-none">
            <Row>
              <Avatar className="size-[34px]">
                <AvatarFallback className="bg-secondary text-xs font-bold text-secondary-foreground">
                  LS
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold">Lidya Sutanto</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Added 6 March · +62 812-3456-7890
                </div>
              </div>
              <Badge className="rounded-full bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground">
                You
              </Badge>
            </Row>
            <Row className="border-t border-muted">
              <Avatar className="size-[34px]">
                <AvatarFallback className="bg-secondary text-xs font-bold text-secondary-foreground">
                  MH
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold">Pdt. Marulitua Hutagalung</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Added 6 March · +62 813-9021-4455
                </div>
              </div>
              <span className="text-sm font-semibold text-muted-foreground">Remove</span>
            </Row>
            <AddRow>Add an administrator</AddRow>
            <div className="px-4 pb-3.5 text-xs leading-snug text-muted-foreground">
              Keep at least two, so the register is never locked behind one phone.
            </div>
          </Card>

          <SectionLabel>This register</SectionLabel>
          <Card className="gap-0 divide-y divide-muted rounded-[var(--radius-card)] border-border py-0 shadow-none">
            <FactRow label="HOLDS" value="248 people · 76 households · 5 care groups" />
            <FactRow label="STARTED" value="6 March 2026" />
            <FactRow
              label="LAST EXPORT"
              value="Never"
              action={<span className="text-sm font-bold text-primary">Export now</span>}
            />
          </Card>
          <div className="flex-1" />
        </div>
      </div>
    </div>
  )
}
