import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

const Dashboard = () => {
  // Datos ficticios de satisfacción del cliente por semanas
  const satisfactionData = [
    // Febrero (semanas 5-8)
    { week: 5, satisfaction: 72, month: 'Feb' },
    { week: 6, satisfaction: 75, month: 'Feb' },
    { week: 7, satisfaction: 73, month: 'Feb' },
    { week: 8, satisfaction: 78, month: 'Feb' },
    
    // Marzo (semanas 9-13)
    { week: 9, satisfaction: 76, month: 'Mar' },
    { week: 10, satisfaction: 74, month: 'Mar' },
    { week: 11, satisfaction: 79, month: 'Mar' },
    { week: 12, satisfaction: 77, month: 'Mar' },
    { week: 13, satisfaction: 81, month: 'Mar' },
    
    // Abril (semanas 14-17)
    { week: 14, satisfaction: 83, month: 'Abr' },
    { week: 15, satisfaction: 80, month: 'Abr' },
    { week: 16, satisfaction: 78, month: 'Abr' },
    { week: 17, satisfaction: 75, month: 'Abr' },
    
    // Mayo (semanas 18-22)
    { week: 18, satisfaction: 73, month: 'May' },
    { week: 19, satisfaction: 71, month: 'May' },
    { week: 20, satisfaction: 69, month: 'May' },
    { week: 21, satisfaction: 67, month: 'May' },
    { week: 22, satisfaction: 70, month: 'May' },
    
    // Junio (semanas 23-26)
    { week: 23, satisfaction: 72, month: 'Jun' },
    { week: 24, satisfaction: 69, month: 'Jun' },
    { week: 25, satisfaction: 66, month: 'Jun' },
    { week: 26, satisfaction: 68, month: 'Jun' },
  ];

  // Componente personalizado para mostrar las etiquetas de porcentaje alternando posición
  const CustomLabel = (props) => {
    const { x, y, value, index } = props;
    // Alternar posición: arriba del punto (números pares) y abajo del punto (números impares)
    const yOffset = index % 2 === 0 ? -18 : 25;
    
    return (
      <text 
        x={x} 
        y={y + yOffset} 
        textAnchor="middle" 
        className="fill-slate-700 text-xs font-medium"
      >
        {value}%
      </text>
    );
  };

  // Mapeo de meses para el eje X
  const monthPositions = {
    'Ene': 2, 'Feb': 6, 'Mar': 11, 'Abr': 15.5, 'May': 20, 'Jun': 24.5,
    'Jul': 28.5, 'Ago': 33, 'Sep': 37.5, 'Oct': 42, 'Nov': 46.5, 'Dic': 50
  };

  // Función para formatear el eje X
  const formatXAxisTick = (tickItem) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const positions = [2, 6, 11, 15.5, 20, 24.5, 28.5, 33, 37.5, 42, 46.5, 50];
    
    const index = positions.findIndex(pos => Math.abs(pos - tickItem) < 1);
    return index >= 0 ? monthNames[index] : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3">
      <div className="max-w-7xl mx-auto">
        
        {/* Gráfico de satisfacción del cliente - 30% de la altura */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 h-80">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold text-slate-800">
              Satisfacción del Cliente
            </h2>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={satisfactionData}
                margin={{ top: 30, right: 15, left: 15, bottom: 30 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e2e8f0" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="week"
                  type="number"
                  scale="linear"
                  domain={[1, 52]}
                  ticks={[2, 6, 11, 15.5, 20, 24.5, 28.5, 33, 37.5, 42, 46.5, 50]}
                  tickFormatter={formatXAxisTick}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  connectNulls={false}
                >
                  <LabelList content={CustomLabel} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Espacio para futuros componentes del dashboard - 70% restante */}
        <div className="mt-3 flex-1">
          <div className="grid grid-cols-12 gap-3 h-96">
            {/* Espacios preparados para nuevos gráficos */}
            <div className="col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Próximo Gráfico</p>
                </div>
              </div>
            </div>
            
            <div className="col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Próximo Gráfico</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;