// import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", teachers: 12, schools: 4 },
  { name: "Feb", teachers: 28, schools: 8 },
  { name: "Mar", teachers: 25, schools: 12 },
  { name: "Apr", teachers: 45, schools: 18 },
  { name: "May", teachers: 35, schools: 24 },
  { name: "Jun", teachers: 60, schools: 35 },
];

export function OverviewChart() {
  return (
    // Height is fixed to 350px to prevent layout shift
    <div className="h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorSchools" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.4}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--popover-foreground))",
            }}
          />

          <Area
            type="monotone"
            dataKey="teachers"
            stroke="gray"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTeachers)"
          />
          <Area
            type="monotone"
            dataKey="schools"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSchools)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
