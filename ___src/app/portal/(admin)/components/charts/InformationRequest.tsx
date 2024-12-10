import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '___src/components/ui/card';

const data = [
  { date: '01/10', requests: 4 },
  { date: '02/10', requests: 3 },
  { date: '03/10', requests: 2 },
  { date: '04/10', requests: 7 },
  { date: '05/10', requests: 5 },
  { date: '06/10', requests: 6 },
  { date: '07/10', requests: 8 },
];

const InfoRequestsLineChart = () => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-gray-800'>
          Demandes d'information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart
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
            <defs>
              <linearGradient id='colorRequests' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#4F46E5' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#4F46E5' stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type='monotone'
              dataKey='requests'
              stroke='#4F46E5'
              strokeWidth={2}
              dot={{ r: 4, fill: '#4F46E5' }}
              activeDot={{ r: 6, fill: '#4F46E5' }}
              fill='url(#colorRequests)'
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InfoRequestsLineChart;
