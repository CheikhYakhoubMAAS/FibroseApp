import React, { useEffect, useRef } from 'react';

interface FibroseChartProps {
  data: Record<number, number>;
}

const FibroseChart: React.FC<FibroseChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du graphique
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#DC2626'];
    const labels = ['F0 (Normal)', 'F1 (Légère)', 'F2 (Modérée)', 'F3 (Sévère)', 'F4 (Cirrhose)'];
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculer les valeurs
    const values = Object.values(data);
    const total = values.reduce((sum, val) => sum + val, 0);
    const maxValue = Math.max(...values);
    
    // Dimensions
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const barWidth = chartWidth / values.length;
    
    // Dessiner les barres
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = canvas.height - padding - barHeight;
      const width = barWidth * 0.8;
      
      // Barre
      ctx.fillStyle = colors[index];
      ctx.fillRect(x, y, width, barHeight);
      
      // Valeur au-dessus de la barre
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + width / 2, y - 5);
      
      // Label en bas
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px sans-serif';
      const labelY = canvas.height - padding + 20;
      ctx.fillText(labels[index], x + width / 2, labelY);
    });
    
    // Titre
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Répartition par stade de fibrose', canvas.width / 2, 30);
    
  }, [data]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-auto"
      />
    </div>
  );
};

export default FibroseChart;