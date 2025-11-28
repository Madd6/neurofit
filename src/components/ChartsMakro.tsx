"use client"

import React from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
} from "@/components/ui/chart"

export const description = "A macros chart"

// Reference image you uploaded (use if needed elsewhere)
// /mnt/data/freepik__background__65885.png

const chartConfig = {
  carbs: { label: "Carbs", color: "#00faff" },
  protein: { label: "Protein", color: "#00ff9d" },
  fat: { label: "Fat", color: "#c900ff" },
} satisfies ChartConfig

type Props = {
  protein: number
  lemak: number
  karbohidrat: number
}

export function ChartRadarDefault({ protein, lemak, karbohidrat }: Props) {
  // sanitize inputs and convert to numbers (fallback 0)
  const p = Number.isFinite(protein) ? protein : 0
  const f = Number.isFinite(lemak) ? lemak : 0
  const c = Number.isFinite(karbohidrat) ? karbohidrat : 0

  // Recharts radar expects an array of objects with the axis label key (we use `type`)
  // and its corresponding numeric value (we use `value`)
  const chartData = [
    { type: chartConfig.protein.label, value: p },
    { type: chartConfig.carbs.label, value: c },
    { type: chartConfig.fat.label, value: f },
  ]

  return (
    <Card className="hidden md:flex bg-background/60 text-sm rounded-xl ">
      <CardContent className=" px-2">
        <div className="w-full h-[230px]">
          {/* ResponsiveContainer ensures the chart scales properly */}
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#1f242d" />
              <PolarAngleAxis dataKey="type" tick={{ fill: "#a4a4a4", fontSize: 10 }} />
              <Radar
                name="Makronutrisi"
                dataKey="value"
                stroke={chartConfig.carbs.color}
                fill={chartConfig.carbs.color}
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

    </Card>
  )
}
