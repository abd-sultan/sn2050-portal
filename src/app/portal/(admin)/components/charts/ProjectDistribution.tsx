import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Projet A', value: 400 },
  { name: 'Projet B', value: 300 },
  { name: 'Projet C', value: 300 },
  { name: 'Projet D', value: 200 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const ProjectDistributionPieChart = () => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-gray-800'>
          Répartition des projets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
            <Legend
              layout='vertical'
              verticalAlign='middle'
              align='right'
              wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectDistributionPieChart;
