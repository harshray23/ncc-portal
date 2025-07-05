"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "BLC", total: 120, attended: 115 },
  { name: "RDC", total: 80, attended: 78 },
  { name: "ATC", total: 150, attended: 142 },
  { name: "TSC", total: 100, attended: 95 },
  { name: "CATC", total: 200, attended: 190 },
]

export function AttendanceChart() {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))"
                }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Bar dataKey="total" fill="hsl(var(--secondary))" name="Total Cadets" radius={[4, 4, 0, 0]} />
            <Bar dataKey="attended" fill="hsl(var(--primary))" name="Attended" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
