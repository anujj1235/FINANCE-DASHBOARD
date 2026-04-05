// src/components/Charts.jsx
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const incomeData = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 14500 },
  { month: 'Mar', amount: 17500 },
  { month: 'Apr', amount: 16500 },
  { month: 'May', amount: 17000 },
  { month: 'Jun', amount: 16000 },
  { month: 'Jul', amount: 18000 },
  { month: 'Aug', amount: 17500 },
  { month: 'Sep', amount: 19000 },
  { month: 'Oct', amount: 18500 },
  { month: 'Nov', amount: 20000 },
  { month: 'Dec', amount: 19500 },
];

const expenseData = [
  { month: 'Jan', housing: 10000, food: 5000, transport: 3000, shopping: 4000 },
  { month: 'Feb', housing: 9500, food: 5200, transport: 3100, shopping: 3800 },
  { month: 'Mar', housing: 11000, food: 5500, transport: 3200, shopping: 4500 },
  { month: 'Apr', housing: 10000, food: 5300, transport: 3000, shopping: 4200 },
  { month: 'May', housing: 11000, food: 5800, transport: 3400, shopping: 4800 },
  { month: 'Jun', housing: 10000, food: 5400, transport: 3100, shopping: 4300 },
];

const Charts = ({ type = "income" }) => {
  if (type === "income") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={incomeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={expenseData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip />
        <Legend />
        <Bar dataKey="housing" fill="#ef4444" name="Housing" />
        <Bar dataKey="food" fill="#f59e0b" name="Food" />
        <Bar dataKey="transport" fill="#10b981" name="Transport" />
        <Bar dataKey="shopping" fill="#8b5cf6" name="Shopping" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
