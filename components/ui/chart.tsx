"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean
    payload?: any[]
    label?: string
    formatter?: (value: number, name: string, props: any) => React.ReactNode
    labelFormatter?: (label: string) => React.ReactNode
    itemSorter?: (a: any) => number
  }
>(({ className, active, payload, label, formatter, labelFormatter, itemSorter, ...props }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div ref={ref} className="rounded-lg border bg-background p-2 shadow-sm" {...props}>
      {label && <div className="mb-1 font-medium">{labelFormatter ? labelFormatter(label) : label}</div>}
      <div className="flex flex-col gap-0.5">
        {payload
          ?.slice()
          .sort((a, b) => {
            if (itemSorter) {
              return itemSorter(a) - itemSorter(b)
            }
            return 0
          })
          .map((item, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <div>
                {item.name}: {formatter ? formatter(item.value, item.name, item) : item.value}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
})
ChartTooltip.displayName = "ChartTooltip"

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

function DonutChart({
  data,
  category,
  index,
  colors = ["#0080ff", "#00c3ff", "#00e5ff", "#00ffea"],
  valueFormatter = (value: number) => value.toString(),
  className,
}: DonutChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey={category}
            nameKey={index}
            fill="#0080ff"
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip formatter={(value) => valueFormatter(value)} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export { DonutChart, ChartTooltip }
