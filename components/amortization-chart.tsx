"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
} from "@/components/ui/chart";
import { Bar, Line } from "recharts";

interface AmortizationChartProps {
  data: {
    month: number;
    standardBalance: number;
    extraBalance: number;
    standardPrincipal: number;
    standardInterest: number;
    extraPrincipal: number;
    extraInterest: number;
  }[];
}

export default function AmortizationChart({ data }: AmortizationChartProps) {
  const [chartType, setChartType] = useState<"balance" | "payment">("balance");

  // Prepare data for the chart
  const chartData = data
    .filter((_, index) => index % 12 === 0 || index === data.length - 1)
    .map((item) => {
      const year = Math.ceil(item.month / 12);
      return {
        year,
        standardBalance: item.standardBalance,
        extraBalance: item.extraBalance,
        standardPrincipal: item.standardPrincipal,
        standardInterest: item.standardInterest,
        extraPrincipal: item.extraPrincipal,
        extraInterest: item.extraInterest,
      };
    });

  // Calculate cumulative interest and principal for payment chart
  const paymentData = data.reduce((acc, item, index) => {
    const year = Math.ceil(item.month / 12);

    if (!acc[year]) {
      acc[year] = {
        year,
        standardPrincipal: 0,
        standardInterest: 0,
        extraPrincipal: 0,
        extraInterest: 0,
      };
    }

    acc[year].standardPrincipal += item.standardPrincipal;
    acc[year].standardInterest += item.standardInterest;
    acc[year].extraPrincipal += item.extraPrincipal;
    acc[year].extraInterest += item.extraInterest;

    return acc;
  }, {} as Record<number, any>);

  const paymentChartData = Object.values(paymentData);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Amortization Visualization
            </CardTitle>
            <CardDescription>
              Compare standard vs. extra payment strategies
            </CardDescription>
          </div>
          <Tabs
            value={chartType}
            onValueChange={(value) =>
              setChartType(value as "balance" | "payment")
            }
          >
            <TabsList className="grid w-[240px] grid-cols-2">
              <TabsTrigger value="balance">Balance</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* todo: fix this */}
        {/* {chartType === "balance" ? (
          <ChartContainer className="aspect-[4/3]">
            <Chart>
              <Line
                type="monotone"
                dataKey="standardBalance"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Standard Balance"
              />
              <Line
                type="monotone"
                dataKey="extraBalance"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="With Extra Payments"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent>
                    {({ payload }) => {
                      if (!payload?.length) return null
                      return (
                        <div>
                          <p className="text-sm font-medium">Year {payload[0].payload.year}</p>
                          <div className="mt-2 space-y-1">
                            <ChartTooltipItem
                              name="Standard Balance"
                              value={formatCurrency(payload[0].value as number)}
                              color="#6366f1"
                            />
                            <ChartTooltipItem
                              name="With Extra Payments"
                              value={formatCurrency(payload[1].value as number)}
                              color="#10b981"
                            />
                          </div>
                        </div>
                      )
                    }}
                  </ChartTooltipContent>
                }
              />
            </Chart>
            <ChartLegend>
              <ChartLegendItem name="Standard Balance" color="#6366f1" />
              <ChartLegendItem name="With Extra Payments" color="#10b981" />
            </ChartLegend>
          </ChartContainer>
        ) : (
          <ChartContainer className="aspect-[4/3]">
            <Chart>
              <Bar dataKey="standardInterest" stackId="standard" fill="#6366f1" name="Standard Interest" />
              <Bar dataKey="standardPrincipal" stackId="standard" fill="#a5b4fc" name="Standard Principal" />
              <Bar dataKey="extraInterest" stackId="extra" fill="#10b981" name="Extra Interest" />
              <Bar dataKey="extraPrincipal" stackId="extra" fill="#6ee7b7" name="Extra Principal" />
              <ChartTooltip
                content={
                  <ChartTooltipContent>
                    {({ payload }) => {
                      if (!payload?.length) return null
                      return (
                        <div>
                          <p className="text-sm font-medium">Year {payload[0].payload.year}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium">Standard Payment</p>
                            <ChartTooltipItem
                              name="Principal"
                              value={formatCurrency(payload[1].value as number)}
                              color="#a5b4fc"
                            />
                            <ChartTooltipItem
                              name="Interest"
                              value={formatCurrency(payload[0].value as number)}
                              color="#6366f1"
                            />
                            <div className="my-1 h-px bg-border" />
                            <p className="text-xs font-medium">With Extra Payments</p>
                            <ChartTooltipItem
                              name="Principal"
                              value={formatCurrency(payload[3].value as number)}
                              color="#6ee7b7"
                            />
                            <ChartTooltipItem
                              name="Interest"
                              value={formatCurrency(payload[2].value as number)}
                              color="#10b981"
                            />
                          </div>
                        </div>
                      )
                    }}
                  </ChartTooltipContent>
                }
              />
            </Chart>
            <ChartLegend>
              <ChartLegendItem name="Standard Interest" color="#6366f1" />
              <ChartLegendItem name="Standard Principal" color="#a5b4fc" />
              <ChartLegendItem name="Extra Interest" color="#10b981" />
              <ChartLegendItem name="Extra Principal" color="#6ee7b7" />
            </ChartLegend>
          </ChartContainer>
        )} */}
      </CardContent>
    </Card>
  );
}
