"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { day: "Week 1", registrations: 10, updates: 5 },
  { day: "Week 2", registrations: 15, updates: 8 },
  { day: "Week 3", registrations: 12, updates: 18 },
  { day: "Week 4", registrations: 25, updates: 10 },
  { day: "Week 5", registrations: 22, updates: 15 },
]

export function ActivityChart() {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))"
                }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Line type="monotone" dataKey="registrations" name="New Registrations" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="updates" name="Profile Updates" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
