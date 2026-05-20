"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ChartEmpty({ label }: Readonly<{ label: string }>) {
  return (
    <div className="grid h-72 place-items-center rounded-md border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function AnalyticsCharts({
  completionData,
  categoryData,
}: Readonly<{
  completionData: { label: string; completionRate: number; completed: number; total: number }[];
  categoryData: {
    category: string;
    goals: number;
    completed: number;
    averageProgress: number;
  }[];
}>) {
  const hasCompletionData = completionData.some((item) => item.total > 0);
  const hasCategoryData = categoryData.length > 0;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Completion rate over time</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCompletionData ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData} margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "completionRate" ? `${value}%` : value,
                      name === "completionRate" ? "Completion rate" : name,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmpty label="Completion trends will appear once goals are created and completed." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category performance</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCategoryData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: -16, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "averageProgress" ? `${value}%` : value,
                      name === "averageProgress" ? "Average progress" : name,
                    ]}
                  />
                  <Bar
                    dataKey="averageProgress"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmpty label="Category breakdowns will appear after goals are assigned to categories." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance radar</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCategoryData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "averageProgress" ? `${value}%` : value,
                      name === "averageProgress" ? "Average progress" : name,
                    ]}
                  />
                  <Radar
                    dataKey="averageProgress"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmpty label="Add categorized goals to compare performance across focus areas." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
