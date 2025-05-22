import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot } from 'recharts';

const Dashboard = () => {
  // Datos ficticios de satisfacción del cliente por semanas
  const satisfactionData = [
    // Febrero (semanas 5-8)
    { week: 5, satisfaction: 45, month: 'Feb' },
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

  // Encontrar máximo y mínimo para marcadores
  const maxValue = Math.max(...satisfactionData.map(d => d.satisfaction));
  const minValue = Math.min(...satisfactionData.map(d => d.satisfaction));
  const maxPoint = satisfactionData.find(d => d.satisfaction === maxValue);
  const minPoint = satisfactionData.find(d => d.satisfaction === minValue);

  // Función para formatear el eje X
  const formatXAxisTick = (tickItem) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const positions = [2, 6, 11, 15.5, 20, 24.5, 28.5, 33, 37.5, 42, 46.5, 50];
    
    const index = positions.findIndex(pos => Math.abs(pos - tickItem) < 1);
    return index >= 0 ? monthNames[index] : '';
  };

  // Función para crear un gráfico evolutivo compacto
  const createEvolutiveChart = (title) => {
    const maxValue = Math.max(...satisfactionData.map(d => d.satisfaction));
    const minValue = Math.min(...satisfactionData.map(d => d.satisfaction));
    const maxPoint = satisfactionData.find(d => d.satisfaction === maxValue);
    const minPoint = satisfactionData.find(d => d.satisfaction === minValue);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex-1">
        <div className="flex items-center mb-1">
          <h2 className="text-sm font-semibold text-slate-800">
            {title}
          </h2>
        </div>
        
        <div className="flex-1 relative" style={{height: 'calc(100% - 28px)'}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={satisfactionData}
              margin={{ top: 15, right: 6, left: 6, bottom: 15 }}
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
                ticks={[6, 15.5, 24.5, 33, 42, 50]}
                tickFormatter={formatXAxisTick}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#64748b' }}
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#64748b' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 1, r: 1 }}
                activeDot={{ r: 3, stroke: '#3b82f6', strokeWidth: 2 }}
                connectNulls={false}
              />
              {/* Marcadores dinámicos */}
              <ReferenceDot 
                x={maxPoint.week} 
                y={maxPoint.satisfaction} 
                r={4} 
                fill="#10b981" 
                stroke="#ffffff" 
                strokeWidth={1}
              />
              <ReferenceDot 
                x={minPoint.week} 
                y={minPoint.satisfaction} 
                r={4} 
                fill="#ef4444" 
                stroke="#ffffff" 
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
          {/* Etiquetas de porcentajes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute text-xs font-semibold text-green-600" 
                 style={{left: `${(maxPoint.week/52)*100}%`, top: '5px', transform: 'translateX(-50%)'}}>
              {maxValue}%
            </div>
            <div className="absolute text-xs font-semibold text-red-600" 
                 style={{left: `${(minPoint.week/52)*100}%`, bottom: '5px', transform: 'translateX(-50%)'}}>
              {minValue}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-1 flex flex-col">
      <div className="w-full h-full flex flex-col gap-1">
        
        {/* Fila 1 */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {/* Satisfacción del Cliente - Gráfico principal */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex flex-col">
            <div className="flex items-center mb-1">
              <h2 className="text-sm font-semibold text-slate-800">
                Satisfacción atención al Alumno
              </h2>
            </div>
            
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={satisfactionData}
                  margin={{ top: 15, right: 6, left: 6, bottom: 15 }}
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
                    ticks={[6, 15.5, 24.5, 33, 42, 50]}
                    tickFormatter={formatXAxisTick}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#64748b' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 1, r: 1 }}
                    activeDot={{ r: 3, stroke: '#3b82f6', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  {/* Marcadores */}
                  <ReferenceDot 
                    x={maxPoint.week} 
                    y={maxPoint.satisfaction} 
                    r={4} 
                    fill="#10b981" 
                    stroke="#ffffff" 
                    strokeWidth={1}
                  />
                  <ReferenceDot 
                    x={minPoint.week} 
                    y={minPoint.satisfaction} 
                    r={4} 
                    fill="#ef4444" 
                    stroke="#ffffff" 
                    strokeWidth={1}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* Etiquetas de porcentajes */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute text-xs font-semibold text-green-600" 
                     style={{left: `${(maxPoint.week/52)*100}%`, top: '5px', transform: 'translateX(-50%)'}}>
                  {maxValue}%
                </div>
                <div className="absolute text-xs font-semibold text-red-600" 
                     style={{left: `${(minPoint.week/52)*100}%`, bottom: '5px', transform: 'translateX(-50%)'}}>
                  {minValue}%
                </div>
              </div>
            </div>
          </div>
          
          {createEvolutiveChart("Devoluciones")}
        </div>

        {/* Fila 2 */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart("Puntuación Trustpilot")}
          {createEvolutiveChart("Puntuación Google")}
        </div>

        {/* Fila 3 */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart("NPS Business School")}
          {createEvolutiveChart("NPS IA School")}
        </div>

        {/* Fila 4 */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart("SNPS Tech School")}
          {createEvolutiveChart("NPS Pharma")}
        </div>

        {/* Fila 5 */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart("NPS FP")}
          {createEvolutiveChart("NPS Oposiciones")}
        </div>

        {/* Fila 6 */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {createEvolutiveChart("NPS Tecnio")}
          {createEvolutiveChart("NPS B2B")}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;