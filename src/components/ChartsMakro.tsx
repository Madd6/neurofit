"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A macros chart"

let chartData = [
        { makro: "protein", data: 100 },
        { makro: "fat", data: 100 },
        { makro: "carbs", data: 100 },
    ]

const chartConfig = {
  data: {
    label: "Gram",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartRadarDefault({protein, lemak, karbohidrat}: {protein: number, lemak: number, karbohidrat: number}) {
    chartData = [
        { makro: "protein", data: protein },
        { makro: "fat", data: lemak },
        { makro: "carbs", data: karbohidrat },
    ]
    return (
    <Card className="md:flex hidden">
      <CardHeader className="items-center pb-4">
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="makro" />
            <PolarGrid />
            <Radar
              dataKey="data"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
