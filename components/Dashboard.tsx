import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Carrier, ShipmentStatus, Shipment } from '../types';

interface DashboardProps {
  shipments: Shipment[];
}

export const Dashboard: React.FC<DashboardProps> = ({ shipments }) => {
  // Calculate KPIs
  const totalRevenue = shipments.reduce((sum, s) => sum + s.price, 0);
  const totalShipments = shipments.length;
  const activeShipments = shipments.filter(s => s.status !== ShipmentStatus.DELIVERED).length;
  const carriersList = Object.values(Carrier);
  
  // Data for Carrier Performance Chart
  // This logic automatically picks up OTO and MAPT from the Enum
  const carrierData = carriersList.map(carrier => {
    const carrierShipments = shipments.filter(s => s.carrier === carrier);
    return {
      name: carrier,
      count: carrierShipments.length,
      revenue: carrierShipments.reduce((sum, s) => sum + s.price, 0)
    };
  });

  // Data for Status Distribution
  const statusCounts = shipments.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Operational Overview</h2>
        <span className="text-sm text-gray-500">Real-time Data</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{totalRevenue} SAR</p>
          <p className="text-xs text-green-500 mt-1 flex items-center">↑ 12% vs last week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Shipments</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{totalShipments}</p>
          <p className="text-xs text-blue-500 mt-1">Across {carriersList.length} carriers</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Orders</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{activeShipments}</p>
          <p className="text-xs text-orange-500 mt-1">Needs attention</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Avg. Margin</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">24%</p>
          <p className="text-xs text-gray-400 mt-1">Target: 25%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Carrier Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Shipments by Carrier</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={carrierData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};