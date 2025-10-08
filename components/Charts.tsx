import React, { useState, useId, useRef, useEffect } from 'react';
import type { MenuItemId } from '../types';

// --- Tooltip ---
const Tooltip: React.FC<{ content: string; x: number; y: number; containerRef: React.RefObject<HTMLDivElement> }> = ({ content, x, y, containerRef }) => {
    if (!content || !containerRef.current) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = x - containerRect.left;
    const relativeY = y - containerRect.top;

    return (
        <div
            className="absolute bg-slate-900 text-white text-xs rounded-md px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full z-10 shadow-lg"
            style={{ left: relativeX, top: relativeY, willChange: 'transform' }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

const ChartContainer: React.FC<{ title: string; children: React.ReactNode; className?: string, onClick?: () => void }> = ({ title, children, className = '', onClick }) => (
    <div 
        onClick={onClick} 
        className={`bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-lg dark:shadow-slate-900/50 my-6 w-full pdf-avoid-break transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-teal-400 hover-3d-tilt' : ''}`}
    >
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 text-slate-700 dark:text-slate-200">{title}</h3>
        <div className={`flex items-center justify-center ${onClick ? 'pointer-events-none' : ''}`}>
            {children}
        </div>
    </div>
);


// --- BarChart ---
interface BarChartProps {
    data: { label: string; value: number }[];
    title: string;
    barColor?: string;
    onClick?: () => void;
    linkId?: MenuItemId;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, barColor = 'rgb(20 184 166)', onClick }) => {
    const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const maxValue = Math.max(...data.map(d => d.value));
    const width = 400;
    const height = 250;
    const chartHeight = 200;
    const barWidth = width / data.length * 0.6;
    const barMargin = width / data.length * 0.4;
    const barDepth = 6;

    return (
        <ChartContainer title={title} onClick={onClick}>
            <div ref={containerRef} className="relative w-full max-w-lg">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto font-sans overflow-visible" style={{ perspective: '1000px' }}>
                     <defs>
                         <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
                        </filter>
                    </defs>
                    {data.map((d, i) => {
                        const barHeight = (d.value / maxValue) * chartHeight;
                        const x = i * (barWidth + barMargin) + barMargin / 2;
                        const y = chartHeight - barHeight;
                        const isHovered = hoveredLabel === d.label;
                        const isDimmed = hoveredLabel !== null && !isHovered;
                        const topColor = barColor;
                        const sideColor = `color-mix(in srgb, ${barColor} 70%, black)`;
                        const frontColor = `color-mix(in srgb, ${barColor} 90%, black)`;

                        return (
                            <g 
                                key={d.label}
                                onMouseMove={(e) => {
                                    setTooltip({ content: `<b>${d.label}</b>: ${d.value}`, x: e.clientX, y: e.clientY });
                                    setHoveredLabel(d.label);
                                }}
                                onMouseLeave={() => {
                                    setTooltip({ content: '', x: 0, y: 0 });
                                    setHoveredLabel(null);
                                }}
                                className="transition-transform duration-300 ease-out"
                                style={{
                                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                                    opacity: isDimmed ? 0.3 : 1,
                                    filter: isHovered ? `url(#${id}-shadow)` : 'none',
                                }}
                            >
                                {/* Side */}
                                <path d={`M ${x + barWidth} ${y} l 0 ${barHeight} l ${-barDepth} ${barDepth} l 0 ${-barHeight} z`} fill={sideColor} />
                                {/* Top */}
                                <path d={`M ${x} ${y} l ${barWidth} 0 l ${-barDepth} ${barDepth} l ${-barWidth} 0 z`} fill={topColor} />
                                {/* Front */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={frontColor}
                                >
                                    <animate attributeName="height" from="0" to={barHeight} dur="0.5s" fill="freeze" />
                                    <animate attributeName="y" from={chartHeight} to={y} dur="0.5s" fill="freeze" />
                                </rect>

                                <text
                                    x={x + barWidth / 2}
                                    y={y - 5}
                                    textAnchor="middle"
                                    className="text-xs font-bold fill-current text-slate-600 dark:text-slate-300 transition-opacity duration-300"
                                    style={{ opacity: isDimmed ? 0.5 : 1 }}
                                >
                                    {d.value}
                                </text>

                                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" className="text-xs fill-current text-slate-500 dark:text-slate-400 transition-opacity duration-300" style={{ opacity: isDimmed ? 0.5 : 1 }}>{d.label}</text>
                            </g>
                        );
                    })}
                    <line x1="0" y1={chartHeight} x2={width} y2={chartHeight} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
                </svg>
                <Tooltip {...tooltip} containerRef={containerRef} />
            </div>
        </ChartContainer>
    );
};

// --- GroupedBarChart ---
interface GroupedBarChartProps {
    data: { label: string; values: { group: string; value: number }[] }[];
    title: string;
    colors?: string[];
    onClick?: () => void;
    linkId?: MenuItemId;
}

export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data, title, colors = ['rgb(20 184 166)', 'rgb(13 148 136)'], onClick }) => {
    const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
    const [hoveredItem, setHoveredItem] = useState<{ label: string; group: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const maxValue = Math.max(...data.flatMap(d => d.values.map(v => v.value)));
    const groups = data[0]?.values.map(v => v.group) || [];
    const width = 500;
    const height = 300;
    const chartHeight = 220;
    const barDepth = 4;
    
    const groupWidth = width / data.length;
    const barWidth = groupWidth * 0.3;

    return (
        <ChartContainer title={title} onClick={onClick}>
            <div ref={containerRef} className="relative w-full max-w-xl">
                 <div className="flex justify-center gap-4 mb-2">
                    {groups.map((group, i) => (
                        <div key={group} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                            <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[i] }}></span>
                            {group}
                        </div>
                    ))}
                </div>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto font-sans overflow-visible">
                    <defs>
                         <filter id={`${id}-grouped-shadow`} x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25"/>
                        </filter>
                    </defs>
                    {data.map((d, i) => {
                        const groupX = i * groupWidth;
                        return (
                            <g key={d.label}>
                                {d.values.map((val, j) => {
                                    const barHeight = (val.value / maxValue) * chartHeight;
                                    const x = groupX + (groupWidth * 0.2) + j * barWidth;
                                    const y = chartHeight - barHeight;
                                    const isHovered = hoveredItem?.label === d.label && hoveredItem?.group === val.group;
                                    const isDimmed = hoveredItem !== null && !isHovered;
                                    const topColor = colors[j % colors.length];
                                    const sideColor = `color-mix(in srgb, ${topColor} 70%, black)`;
                                    const frontColor = `color-mix(in srgb, ${topColor} 90%, black)`;
                                    
                                    return (
                                        <g
                                            key={j}
                                            className="transition-all duration-300 ease-out"
                                            style={{
                                                opacity: isDimmed ? 0.2 : 1,
                                                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                                                filter: isHovered ? `url(#${id}-grouped-shadow)` : 'none',
                                            }}
                                            onMouseMove={(e) => {
                                                setTooltip({ content: `<b>${d.label}</b><br/>${val.group}: ${val.value}`, x: e.clientX, y: e.clientY });
                                                setHoveredItem({ label: d.label, group: val.group });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltip({ content: '', x: 0, y: 0 });
                                                setHoveredItem(null);
                                            }}
                                        >
                                            {/* Side */}
                                            <path d={`M ${x + barWidth} ${y} l 0 ${barHeight} l ${-barDepth} ${barDepth} l 0 ${-barHeight} z`} fill={sideColor} />
                                            {/* Top */}
                                            <path d={`M ${x} ${y} l ${barWidth} 0 l ${-barDepth} ${barDepth} l ${-barWidth} 0 z`} fill={topColor} />
                                            {/* Front */}
                                            <rect
                                                x={x}
                                                y={y}
                                                width={barWidth}
                                                height={barHeight}
                                                fill={frontColor}
                                            >
                                                <animate attributeName="height" from="0" to={barHeight} dur="0.5s" fill="freeze" />
                                                <animate attributeName="y" from={chartHeight} to={y} dur="0.5s" fill="freeze" />
                                            </rect>
                                            <text
                                                x={x + barWidth / 2}
                                                y={y - 4}
                                                textAnchor="middle"
                                                className="text-[10px] font-semibold fill-current text-slate-500 dark:text-slate-400"
                                            >
                                                {val.value}
                                            </text>
                                        </g>
                                    );
                                })}
                                <text x={groupX + groupWidth / 2} y={chartHeight + 20} textAnchor="middle" className="text-xs fill-current text-slate-500 dark:text-slate-400 transition-opacity duration-300" style={{ opacity: hoveredItem !== null && hoveredItem.label !== d.label ? 0.5 : 1 }}>{d.label}</text>
                            </g>
                        );
                    })}
                     <line x1="0" y1={chartHeight} x2={width} y2={chartHeight} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
                </svg>
                <Tooltip {...tooltip} containerRef={containerRef} />
            </div>
        </ChartContainer>
    );
};


// --- LineChart ---
interface LineChartProps {
    data: { labels: string[]; datasets: { name: string; points: (number|null)[]; color: string }[] };
    title: string;
    onClick?: () => void;
    linkId?: MenuItemId;
    className?: string;
    highlightedIndex?: number | null;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title, onClick, className, highlightedIndex }) => {
    const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const allPoints = data.datasets.flatMap(d => d.points).filter(p => p !== null) as number[];
    const maxValue = allPoints.length > 0 ? Math.ceil(Math.max(...allPoints) / 10) * 10 : 0;
    const width = 500;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 50, left: 40 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const getX = (index: number) => padding.left + (index / (data.labels.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;

    return (
        <ChartContainer title={title} onClick={onClick} className={className}>
            <div ref={containerRef} className="relative w-full max-w-2xl">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto font-sans overflow-visible">
                    <defs>
                        {data.datasets.map((dataset, i) => (
                            <linearGradient key={i} id={`${id}-gradient-${i}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={dataset.color} stopOpacity="0.2"/>
                                <stop offset="100%" stopColor={dataset.color} stopOpacity="0"/>
                            </linearGradient>
                        ))}
                         <filter id={`${id}-point-shadow`} x="-100%" y="-100%" width="300%" height="300%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
                        </filter>
                    </defs>

                    {/* Y-axis labels and grid lines */}
                    {[...Array(5)].map((_, i) => {
                        const y = padding.top + (i / 4) * chartHeight;
                        const value = Math.round(maxValue * (1 - i/4));
                        return (
                            <g key={i}>
                                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="stroke-slate-200 dark:stroke-slate-700" />
                                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-xs fill-slate-500 dark:fill-slate-400">{value}</text>
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {data.labels.map((label, i) => (
                        <text key={i} x={getX(i)} y={height - padding.bottom + 20} textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400">{label}</text>
                    ))}

                    {data.datasets.map((dataset, i) => {
                        const pathData = dataset.points
                            .map((p, j) => (p !== null ? {x: getX(j), y: getY(p)} : null))
                            .filter(p => p !== null)
                            .map((p, j) => `${j === 0 ? 'M' : 'L'} ${p!.x} ${p!.y}`)
                            .join(' ');
                        
                        const areaPoints = dataset.points
                            .map((p, j) => (p !== null ? {x: getX(j), y: getY(p)} : null));

                        const areaPathData = areaPoints.length > 0 ? 
                            `M ${areaPoints[0]!.x} ${areaPoints[0]!.y} ` +
                            areaPoints.slice(1).map(p => `L ${p!.x} ${p!.y}`).join(' ') +
                            ` L ${areaPoints[areaPoints.length-1]!.x} ${height - padding.bottom} L ${areaPoints[0]!.x} ${height - padding.bottom} Z`
                            : '';
                        return (
                            <g key={dataset.name}>
                                <path d={areaPathData} fill={`url(#${id}-gradient-${i})`} />
                                <path d={pathData} fill="none" stroke={dataset.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        );
                    })}

                     {data.datasets.map((dataset, i) => (
                        <g key={`${dataset.name}-points`}>
                            {dataset.points.map((p, j) => {
                                if (p === null) return null;
                                const isHovered = hoveredIndex === j;
                                const isHighlighted = highlightedIndex === j;
                                const pointRadius = isHovered || isHighlighted ? 8 : 6;
                                return (
                                <g
                                    key={j}
                                    className="cursor-pointer transition-all duration-200"
                                    style={{ filter: isHovered || isHighlighted ? `url(#${id}-point-shadow)` : 'none' }}
                                    onMouseMove={(e) => {
                                        setTooltip({ content: `<b>${data.labels[j]}</b><br/>${dataset.name}: ${p}%`, x: e.clientX, y: e.clientY });
                                        setHoveredIndex(j);
                                    }}
                                    onMouseLeave={() => {
                                        setTooltip({ content: '', x: 0, y: 0 });
                                        setHoveredIndex(null);
                                    }}
                                >
                                    <circle
                                        cx={getX(j)}
                                        cy={getY(p)}
                                        r={pointRadius}
                                        fill={`url(#${id}-point-gradient-${i})`}
                                        stroke={dataset.color}
                                        strokeWidth="2"
                                        style={{ transform: isHovered || isHighlighted ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.2s ease-out' }}
                                    />
                                    <text
                                        x={getX(j)}
                                        y={getY(p) - (isHovered || isHighlighted ? 14 : 10)}
                                        textAnchor="middle"
                                        className={`text-[9px] transition-all duration-200 fill-slate-500 dark:fill-slate-400 ${isHovered || isHighlighted ? 'font-bold text-[12px]' : ''}`}
                                        style={{ fill: isHovered || isHighlighted ? dataset.color : undefined }}
                                    >
                                        {p}
                                    </text>
                                    <radialGradient id={`${id}-point-gradient-${i}`} cx="0.3" cy="0.3" r="0.7">
                                        <stop offset="0%" stopColor="white"/>
                                        <stop offset="100%" stopColor={dataset.color}/>
                                    </radialGradient>
                                </g>
                            )})}
                        </g>
                    ))}
                </svg>
                <div className="flex justify-center gap-4 mt-2">
                    {data.datasets.map((dataset) => (
                        <div key={dataset.name} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dataset.color }}></span>
                            {dataset.name}
                        </div>
                    ))}
                </div>
                <Tooltip {...tooltip} containerRef={containerRef} />
            </div>
        </ChartContainer>
    );
};

// --- DonutChart ---
interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    title: string;
    centerText?: string;
    onClick?: () => void;
    linkId?: MenuItemId;
    onSegmentClick?: (segment: { label: string; value: number; color: string }) => void;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, centerText, onClick, onSegmentClick }) => {
    const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const total = data.reduce((acc, item) => acc + item.value, 0);

    // 3D properties
    const cx = 100;
    const cy = 100;
    const rx = 85;
    const ry = 45; // ry < rx creates the tilted perspective
    const innerRx = 30; // smaller hole for more of a pie look
    const innerRy = 15;
    const depth = 10;
    const explodeDistance = 8;

    const toRadians = (angle: number) => (angle - 90) * Math.PI / 180;

    const segments = data.map((item, index) => {
        const startAngle = (data.slice(0, index).reduce((acc, i) => acc + i.value, 0) / total) * 360;
        const endAngle = startAngle + (item.value / total) * 360;
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        
        const getPath = (yOffset = 0) => {
            if (item.value === total) {
                // To draw a full ellipse with a hole, we use two paths with opposite windings
                return [
                    `M ${cx - rx} ${cy + yOffset}`,
                    `A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy + yOffset}`,
                    `A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy + yOffset}`,
                    'Z', // Outer ellipse
                    `M ${cx - innerRx} ${cy + yOffset}`,
                    `A ${innerRx} ${innerRy} 0 1 0 ${cx + innerRx} ${cy + yOffset}`,
                    `A ${innerRx} ${innerRy} 0 1 0 ${cx - innerRx} ${cy + yOffset}`,
                    'Z' // Inner ellipse (for cutout)
                ].join(' ');
            }

            const startRad = toRadians(startAngle);
            const endRad = toRadians(endAngle);

            const x1_outer = cx + rx * Math.cos(startRad);
            const y1_outer = cy + ry * Math.sin(startRad) + yOffset;
            const x2_outer = cx + rx * Math.cos(endRad);
            const y2_outer = cy + ry * Math.sin(endRad) + yOffset;

            const x1_inner = cx + innerRx * Math.cos(startRad);
            const y1_inner = cy + innerRy * Math.sin(startRad) + yOffset;
            const x2_inner = cx + innerRx * Math.cos(endRad);
            const y2_inner = cy + innerRy * Math.sin(endRad) + yOffset;
            
            const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
            
            return [
                `M ${x1_outer} ${y1_outer}`,
                `A ${rx} ${ry} 0 ${largeArcFlag} 1 ${x2_outer} ${y2_outer}`,
                `L ${x2_inner} ${y2_inner}`,
                `A ${innerRx} ${innerRy} 0 ${largeArcFlag} 0 ${x1_inner} ${y1_inner}`,
                'Z'
            ].join(' ');
        };

        return { ...item, midAngle, topPath: getPath(0), bottomPath: getPath(depth) };
    }).sort((a, b) => a.midAngle > 180 ? -1 : (b.midAngle > 180 ? 1 : 0)); // Simple sort: back half first

    return (
        <ChartContainer title={title} className="max-w-md" onClick={!onSegmentClick ? onClick : undefined}>
            <div ref={containerRef} className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="relative">
                    <svg viewBox="0 0 200 200" className="w-56 h-56 overflow-visible">
                         <defs>
                             <filter id={`${id}-donut-shadow`} x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.25"/>
                            </filter>
                        </defs>
                        {segments.map((item, index) => {
                            const isHovered = hoveredLabel === item.label;
                            const isDimmed = hoveredLabel !== null && !isHovered;

                            const midAngleRad = toRadians(item.midAngle);
                            // Explode along the tilted plane
                            const explodeX = isHovered ? Math.cos(midAngleRad) * explodeDistance : 0;
                            const explodeY = isHovered ? Math.sin(midAngleRad) * explodeDistance * (ry / rx) : 0;

                            const darkerColor = `color-mix(in srgb, ${item.color} 70%, black)`;
                            
                            const isLargeEnough = (item.value / total) * 100 > 5;
                            const textRadiusX = innerRx + (rx - innerRx) / 2;
                            const textRadiusY = innerRy + (ry - innerRy) / 2;
                            const textX = cx + textRadiusX * Math.cos(midAngleRad);
                            const textY = cy + textRadiusY * Math.sin(midAngleRad) + (depth / 2);
                            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

                            return (
                                <g
                                    key={index}
                                    transform={`translate(${explodeX}, ${explodeY})`}
                                    className="transition-transform duration-300 ease-out cursor-pointer"
                                    style={{ opacity: isDimmed ? 0.3 : 1, filter: isHovered ? `url(#${id}-donut-shadow)` : 'none' }}
                                    onClick={(e) => {
                                        if (onSegmentClick) {
                                            e.stopPropagation();
                                            onSegmentClick(item);
                                        }
                                    }}
                                    onMouseMove={(e) => {
                                        setTooltip({ content: `<b>${item.label}</b>: ${item.value} (${percentage}%)`, x: e.clientX, y: e.clientY });
                                        setHoveredLabel(item.label);
                                    }}
                                    onMouseLeave={() => {
                                        setTooltip({ content: '', x: 0, y: 0 });
                                        setHoveredLabel(null);
                                    }}
                                >
                                    <path d={item.bottomPath} fill={darkerColor} fillRule="evenodd" />
                                    <path d={item.topPath} fill={item.color} fillRule="evenodd" />
                                    {isLargeEnough && (
                                        <text
                                            x={textX}
                                            y={textY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-[10px] font-bold fill-white pointer-events-none"
                                            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.7)' }}
                                        >
                                            {percentage}%
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                    {centerText && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-1">
                            <span className="text-center text-xs font-semibold text-slate-600 dark:text-slate-300">{centerText}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    {data.map((item, index) => {
                        const isDimmed = hoveredLabel !== null && hoveredLabel !== item.label;
                        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                        return (
                            <div 
                                key={index} 
                                className="flex items-center text-sm transition-opacity duration-300"
                                style={{ opacity: isDimmed ? 0.4 : 1 }}
                            >
                                <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-slate-600 dark:text-slate-300">{item.label}: {item.value} ({percentage}%)</span>
                            </div>
                        );
                    })}
                </div>
                 <Tooltip {...tooltip} containerRef={containerRef} />
            </div>
        </ChartContainer>
    );
};


// --- ProgressChart ---
interface ProgressChartProps {
    data: { held: number; total: number; label: string };
    title: string;
    onClick?: () => void;
    linkId?: MenuItemId;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title, onClick }) => {
    const percentage = (data.held / data.total) * 100;
    const id = useId();

    return (
        <ChartContainer title={title} onClick={onClick}>
            <div className="w-full max-w-md p-4">
                 <defs>
                    <linearGradient id={`${id}-progress-gradient`} x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="rgb(45 212 191)" />
                        <stop offset="100%" stopColor="rgb(20 184 166)" />
                    </linearGradient>
                </defs>
                <div className="flex justify-between items-center mb-2 font-semibold">
                    <span className="text-teal-600 dark:text-teal-400">{data.held} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Held</span></span>
                    <span className="text-slate-600 dark:text-slate-300">{data.total} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">Stipulated</span></span>
                </div>
                <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, background: `url(#${id}-progress-gradient)` }} />
                </div>
                <p className="text-center text-lg font-bold text-teal-500 mt-3">{percentage.toFixed(2)}% Conducted</p>
            </div>
        </ChartContainer>
    );
};

// --- VacancyRangeIndicator ---
export const VacancyRangeIndicator: React.FC<{ min: number; max: number; title: string, onClick?: () => void }> = ({ min, max, title, onClick }) => {
  return (
    <ChartContainer title={title} onClick={onClick}>
      <div className="w-full max-w-md p-4">
        <div className="flex justify-between items-center text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
        <div className="relative h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 shadow-inner">
          <div
            className="absolute top-0 h-3 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full shadow-md"
            style={{ left: `${min}%`, width: `${max - min}%` }}
          />
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">Range of vacancy positions in sampled ULBs</p>
      </div>
    </ChartContainer>
  );
};

// --- FlowChart for Recruitment Process ---
const FlowStep: React.FC<{ number: number; text: string; }> = ({ number, text }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-sm">{number}</div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
);
const FlowArrow: React.FC = () => (
    <div className="my-2 ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
);

export const FlowChart: React.FC<{ title: string, onClick?: () => void }> = ({ title, onClick }) => {
    return (
        <ChartContainer title={title} className="w-full" onClick={onClick}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {/* Column 1: UD&HD */}
                <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-md">
                    <h4 className="font-bold text-center text-teal-600 dark:text-teal-400 mb-4">UD&amp;HD</h4>
                    <FlowStep number={1} text="Collect Information from ULBs" />
                    <FlowArrow />
                    <FlowStep number={2} text="Send Proposal to BPSC/BSSC/BTSC after approval of competent Authority" />
                </div>

                {/* Column 2: BPSC/BSSC/BTSC */}
                <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-md">
                    <h4 className="font-bold text-center text-teal-600 dark:text-teal-400 mb-4">BPSC/BSSC/BTSC</h4>
                    <FlowStep number={3} text="Advertise the need" />
                    <FlowArrow />
                    <FlowStep number={4} text="Conduct exams/interviews and selects candidates as per requirements" />
                     <FlowArrow />
                    <FlowStep number={5} text="Recommends the candidates for appointments" />
                </div>
                
                {/* Column 3: UD&HD */}
                <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-md">
                     <h4 className="font-bold text-center text-teal-600 dark:text-teal-400 mb-4">UD&amp;HD</h4>
                    <FlowStep number={6} text="Concerned Officers after recommendation by the commissions are allotted to the ULBs" />
                     <FlowArrow />
                    <FlowStep number={7} text="Issue offers of appointment letters" />
                </div>
            </div>
        </ChartContainer>
    );
};

// --- StatCard ---
export const StatCard: React.FC<{ value: string; label: string; onClick?: () => void }> = ({ value, label, onClick }) => {
    const commonClasses = "bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center shadow-md";
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`${commonClasses} w-full transition-all duration-200 hover:bg-teal-100 dark:hover:bg-slate-700/80 hover:ring-2 hover:ring-teal-400 hover:shadow-lg hover:-translate-y-1`}
            >
                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 pointer-events-none">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 pointer-events-none">{label}</p>
            </button>
        );
    }
    return (
        <div className={commonClasses}>
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        </div>
    );
};

// --- MiniDonutChart (for exec summary) ---
export const MiniDonutChart: React.FC<{ percentage: number; color: string; }> = ({ percentage, color }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    // Cap percentage at 100 for visual consistency
    const clampedPercentage = Math.min(100, percentage);
    const strokeDasharray = `${(clampedPercentage / 100) * circumference} ${circumference}`;

    return (
        <div className="relative w-14 h-14 mb-2">
            <svg viewBox="0 0 50 50" className="w-full h-full transform -rotate-90">
                 <filter id="mini-donut-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor={color} floodOpacity="0.5"/>
                </filter>
                <circle
                    cx="25" cy="25" r={radius}
                    fill="transparent"
                    strokeWidth="6"
                    className="stroke-slate-200 dark:stroke-slate-700"
                />
                <circle
                    cx="25" cy="25" r={radius}
                    fill="transparent"
                    strokeWidth="6"
                    stroke={color}
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    filter="url(#mini-donut-shadow)"
                >
                    <animate attributeName="stroke-dasharray" from={`0, ${circumference}`} to={strokeDasharray} dur="1s" fill="freeze" />
                </circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{`${Math.round(percentage)}%`}</span>
            </div>
        </div>
    );
};

// --- StackedBarChart ---
interface StackedBarChartProps {
    data: { label: string; values: { group: string; value: number }[] }[];
    title: string;
    colors?: string[];
    onClick?: () => void;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, title, colors = ['rgb(20 184 166)', 'rgb(244 63 94)'], onClick }) => {
    const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
    const [hoveredItem, setHoveredItem] = useState<{ label: string; group: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const totals = data.map(d => d.values.reduce((sum, v) => sum + v.value, 0));
    const maxValue = Math.ceil(Math.max(...totals) / 100) * 100; // Round up to next 100 for a clean axis
    const groups = data[0]?.values.map(v => v.group) || [];
    const width = 500;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 50, left: 50 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const barWidth = chartWidth / data.length * 0.6;
    const barMargin = chartWidth / data.length * 0.4;

    return (
        <ChartContainer title={title} onClick={onClick}>
            <div ref={containerRef} className="relative w-full max-w-xl">
                 <div className="flex justify-center gap-4 mb-2">
                    {groups.map((group, i) => (
                        <div key={group} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                            <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[i] }}></span>
                            {group}
                        </div>
                    ))}
                </div>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto font-sans overflow-visible">
                    <defs>
                         <filter id={`${id}-stacked-shadow`} x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
                        </filter>
                    </defs>
                    {/* Y-axis labels and grid lines */}
                    {[...Array(5)].map((_, i) => {
                        const y = padding.top + (i / 4) * chartHeight;
                        const value = Math.round(maxValue * (1 - i/4));
                        return (
                            <g key={i}>
                                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="stroke-slate-200 dark:stroke-slate-700" strokeDasharray="2" />
                                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-xs fill-slate-500 dark:fill-slate-400">{value}</text>
                            </g>
                        );
                    })}

                    {data.map((d, i) => {
                        let currentY = padding.top + chartHeight;
                        const x = padding.left + i * (barWidth + barMargin) + barMargin / 2;
                        
                        return (
                            <g key={d.label}>
                                {d.values.map((val, j) => {
                                    const barHeight = (val.value / maxValue) * chartHeight;
                                    currentY -= barHeight;
                                    const y = currentY;
                                    const isHovered = hoveredItem?.label === d.label && hoveredItem?.group === val.group;
                                    const isDimmed = hoveredItem !== null && !isHovered;
                                    const isTallEnough = barHeight > 16;
                                    
                                    return (
                                        <g
                                            key={j}
                                            className="transition-all duration-300 ease-out"
                                            style={{
                                                opacity: isDimmed ? 0.3 : 1,
                                                transform: hoveredItem?.label === d.label ? 'scale(1.02, 1.02)' : 'scale(1, 1)',
                                                transformOrigin: `${x + barWidth/2}px ${padding.top + chartHeight}px`,
                                                filter: isHovered ? `url(#${id}-stacked-shadow)` : 'none',
                                            }}
                                            onMouseMove={(e) => {
                                                setTooltip({ content: `<b>${d.label}</b><br/>${val.group}: ${val.value.toLocaleString()} Cr`, x: e.clientX, y: e.clientY });
                                                setHoveredItem({ label: d.label, group: val.group });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltip({ content: '', x: 0, y: 0 });
                                                setHoveredItem(null);
                                            }}
                                        >
                                            <rect
                                                x={x}
                                                y={y}
                                                width={barWidth}
                                                height={barHeight}
                                                fill={colors[j % colors.length]}
                                                rx="1"
                                            >
                                                <animate attributeName="height" from="0" to={barHeight} dur="0.5s" fill="freeze" />
                                                <animate attributeName="y" from={padding.top + chartHeight} to={y} dur="0.5s" fill="freeze" />
                                            </rect>
                                            {isTallEnough && (
                                                <text
                                                    x={x + barWidth / 2}
                                                    y={y + barHeight / 2}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    className="text-xs font-semibold fill-white pointer-events-none"
                                                >
                                                    {val.value}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                                <text x={x + barWidth / 2} y={height - padding.bottom + 20} textAnchor="middle" className="text-xs fill-current text-slate-500 dark:text-slate-400 transition-opacity duration-300" style={{ opacity: hoveredItem !== null && hoveredItem.label !== d.label ? 0.5 : 1 }}>{d.label}</text>
                            </g>
                        );
                    })}
                     <line x1={padding.left} y1={padding.top + chartHeight} x2={width - padding.right} y2={padding.top + chartHeight} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="1" />
                </svg>
                <Tooltip {...tooltip} containerRef={containerRef} />
            </div>
        </ChartContainer>
    );
};