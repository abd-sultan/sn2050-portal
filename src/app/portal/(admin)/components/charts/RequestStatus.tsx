import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { date: '01/10', en_attente: 4, traitées: 2, rendez_vous: 1 },
  { date: '02/10', en_attente: 3, traitées: 3, rendez_vous: 2 },
  { date: '03/10', en_attente: 2, traitées: 4, rendez_vous: 1 },
  { date: '04/10', en_attente: 7, traitées: 1, rendez_vous: 3 },
  { date: '05/10', en_attente: 5, traitées: 2, rendez_vous: 4 },
  { date: '06/10', en_attente: 6, traitées: 3, rendez_vous: 2 },
  { date: '07/10', en_attente: 8, traitées: 1, rendez_vous: 5 },
];

const RequestStatusStackedBarChart = () => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-gray-800'>
          Statut des demandes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200' />
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey='en_attente' stackId='a' fill='#4F46E5' />
            <Bar dataKey='traitées' stackId='a' fill='#10B981' />
            <Bar dataKey='rendez_vous' stackId='a' fill='#F59E0B' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RequestStatusStackedBarChart;
