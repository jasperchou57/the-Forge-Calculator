'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  prob: number;
  color: string;
}

interface RechartsChartProps {
  data: ChartData[];
  title: string;
}

const RechartsChart: React.FC<RechartsChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="h-44 w-full relative">
      <div className="absolute top-0 left-0 text-xs text-gray-500 font-mono">
        {title}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20} margin={{ top: 20 }}>
          <XAxis
            dataKey="name"
            stroke="#333"
            tick={{ fill: '#666', fontSize: 9, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#161719', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
            itemStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Chance']}
          />
          <Bar dataKey="prob" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsChart;
