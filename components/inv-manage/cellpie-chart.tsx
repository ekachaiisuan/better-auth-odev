'use client';

import { Pie, PieChart, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type Product = {
  name: string;
  quantity: number;
};

type ChartPieSimpleProps = {
  data: Product[];
};

export function CellPieChart({ data }: ChartPieSimpleProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  // โทนน้ำเงินอบอุ่น ไล่จากเข้ม → อ่อน
  const blueGradient = [
    '#1e3a8a', // deep blue
    '#1d4ed8',
    '#2563eb',
    '#3b82f6',
    '#60a5fa',
    '#93c5fd',
  ];

  const total = chartData.reduce((acc, cur) => acc + cur.quantity, 0);

  const chartConfig = Object.fromEntries(
    chartData.map((item, index) => [
      item.name,
      {
        label: item.name,
        color: blueGradient[index % blueGradient.length],
      },
    ]),
  ) satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-96"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <Pie
          data={chartData}
          dataKey="quantity"
          nameKey="name"
          outerRadius={90}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={blueGradient[index % blueGradient.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

