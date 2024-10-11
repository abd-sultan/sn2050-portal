import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { date: '01/10', registrations: 12 },
  { date: '02/10', registrations: 19 },
  { date: '03/10', registrations: 3 },
  { date: '04/10', registrations: 5 },
  { date: '05/10', registrations: 2 },
  { date: '06/10', registrations: 3 },
  { date: '07/10', registrations: 10 },
];

const RegistrationsBarChart = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">Inscriptions journalières</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#818CF8" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <Bar 
              dataKey="registrations" 
              fill="url(#colorGradient)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RegistrationsBarChart;