import React, { useState, useRef, useContext } from 'react';
import type { MenuItemId } from '../types';
import { StatCard } from './Charts';
import { ChapterStyleContext } from './ChapterStyleContext';

// --- Icons for Editable Components ---
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


interface EditableProps {
    contentId: string;
    notes: Record<string, { note: string; originalText: string; }>;
    onUpdateNote?: (id: string, text: string, originalText: string) => void;
    onDeleteNote?: (id: string) => void;
}

const getReactNodeText = (node: React.ReactNode): string => {
    if (node === null || typeof node === 'boolean' || typeof node === 'undefined') {
        return '';
    }
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(getReactNodeText).join('');
    }
    if (React.isValidElement(node) && node.props.children) {
        return getReactNodeText(node.props.children);
    }
    return '';
};


const withEditable = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const ComponentWithEditable: React.FC<P & EditableProps> = (props) => {
        const { contentId, notes, onUpdateNote, onDeleteNote, ...restProps } = props;
        const isAnnotationEnabled = !!onUpdateNote && !!onDeleteNote;
        
        if (!isAnnotationEnabled) {
            return <WrappedComponent {...(restProps as P)} />;
        }

        // All hooks are called conditionally, but the condition is stable for the component's lifecycle.
        // This is a safe and accepted use case for disabling rules.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isEditing, setIsEditing] = useState(false);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [noteText, setNoteText] = useState(notes[contentId]?.note || '');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        
        const userNote = notes[contentId]?.note;

        const handleSave = () => {
            const originalText = getReactNodeText((restProps as any).children);
            onUpdateNote(contentId, noteText, originalText);
            setIsEditing(false);
        };

        const handleCancel = () => {
            setNoteText(notes[contentId]?.note || '');
            setIsEditing(false);
        };
        
        const handleDelete = () => {
            onDeleteNote(contentId);
            setNoteText('');
            setIsEditing(false);
        }
        
        // Auto-resize textarea
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (isEditing && textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
        }, [isEditing, noteText]);

        return (
            <div className="editable-container">
                <WrappedComponent {...(restProps as P)} />
                <button
                    onClick={() => setIsEditing(true)}
                    className="note-icon p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-teal-100 dark:hover:bg-teal-800 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    aria-label="Add or edit note for this section"
                    title="Add/Edit Note"
                >
                    <EditIcon className="w-4 h-4" />
                </button>
                
                {isEditing ? (
                    <div className="my-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-inner">
                        <textarea
                            ref={textareaRef}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                            placeholder="Type your personal note here..."
                            rows={3}
                        />
                        <div className="flex items-center justify-end gap-2 mt-2">
                            {userNote && <button onClick={handleDelete} className="p-2 text-slate-500 hover:text-red-500 dark:hover:text-red-400" title="Delete Note"><TrashIcon className="w-5 h-5"/></button>}
                            <button onClick={handleCancel} className="px-3 py-1 text-sm rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="px-3 py-1 text-sm rounded-md bg-teal-500 text-white hover:bg-teal-600 transition-colors">Save Note</button>
                        </div>
                    </div>
                ) : userNote ? (
                    <div className="user-note">
                        <p>{userNote}</p>
                    </div>
                ) : null}
            </div>
        );
    };
    return ComponentWithEditable;
};


const BaseSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sectionTitleBgClass } = useContext(ChapterStyleContext);
  return (
    <h2 className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4 p-3 rounded-lg ${sectionTitleBgClass || ''}`}>
        {children}
    </h2>
  );
};
export const SectionTitle = withEditable(BaseSectionTitle);

const BaseSubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { subTitleBgClass, subTitleBorderTopClass } = useContext(ChapterStyleContext);
  return (
    <h3 className={`text-xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3 px-3 pt-3 pb-2 ${subTitleBgClass} ${subTitleBorderTopClass}`}>
        {children}
    </h3>
  );
};
export const SubTitle = withEditable(BaseSubTitle);

const BaseParagraph: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md hover:shadow-lg dark:shadow-slate-900/50 transition-shadow duration-300 mb-4 pdf-avoid-break ${className || ''}`}>
    {children}
  </div>
);
export const Paragraph = withEditable(BaseParagraph);


export const Table: React.FC<{ headers: (string|React.ReactNode)[], data: (string|number|React.ReactNode)[][], caption?: string, rowHeaderColumnIndex?: number }> = ({ headers, data, caption, rowHeaderColumnIndex }) => (
  <div className="my-6 overflow-x-auto pdf-avoid-break">
    <table className="w-full text-left border-collapse bg-white dark:bg-slate-800/50 rounded-lg shadow-md dark:shadow-slate-900/50">
      {caption && <caption className="p-2 text-center text-sm text-slate-500 dark:text-slate-400 caption-bottom">{caption}</caption>}
      <thead>
        <tr className="bg-slate-100 dark:bg-slate-700/50">
          {headers.map((header, i) => (
            <th key={i} scope="col" className="p-4 font-bold uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
            {row.map((cell, j) => {
                if (j === rowHeaderColumnIndex) {
                    return (
                        <th scope="row" key={j} className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold align-top text-left">{cell}</th>
                    )
                }
                return (
                    <td key={j} className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 align-top">{cell}</td>
                )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const BulletList: React.FC<{ items: (string|React.ReactNode)[], onItemClick?: (id: MenuItemId) => void, itemIds?: MenuItemId[] }> = ({ items, onItemClick, itemIds }) => {
    const listItems = items.map((item, index) => {
      const isClickable = onItemClick && itemIds && itemIds[index];
      const commonProps = {
        key: index,
        className: `space-y-2 ${isClickable ? 'cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors' : ''}`,
        onClick: isClickable ? () => onItemClick(itemIds![index]) : undefined,
      };

      return <li {...commonProps}>{item}</li>
    });

    return (
        <ul className="list-disc list-inside bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md dark:shadow-slate-900/50 mb-4 space-y-2 pdf-avoid-break">
            {listItems}
        </ul>
    );
};

export const OrgChartNode: React.FC<{ title: string, subtitle?: string, children?: React.ReactNode, isRoot?: boolean }> = ({ title, subtitle, children, isRoot }) => (
    <div className={`flex flex-col items-center p-2 ${!isRoot ? 'mt-4' : ''}`}>
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-center shadow-md border border-slate-200 dark:border-slate-600">
            <div className="font-bold text-slate-800 dark:text-slate-100">{title}</div>
            {subtitle && <div className="text-xs text-teal-500 dark:text-teal-400">{subtitle}</div>}
        </div>
        {children && (
            <>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-500"></div>
                <div className="flex justify-center">
                    {children}
                </div>
            </>
        )}
    </div>
);

export const SummaryBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-400 p-6 rounded-r-lg my-6 italic text-teal-900/80 dark:text-teal-300 pdf-avoid-break">
        {children}
    </div>
);

export const Recommendation: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="border border-teal-400/50 bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg my-4 pdf-avoid-break">
        <h4 className="font-bold text-teal-700 dark:text-teal-300 mb-2">{title}</h4>
        <div className="text-teal-600 dark:text-teal-400">{children}</div>
    </div>
);

export const RecommendationsList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
    <div className="border border-teal-400/50 bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg my-6 pdf-avoid-break">
        <h4 className="font-bold text-teal-700 dark:text-teal-300 mb-4 text-lg">Recommendations</h4>
        <ol className="list-decimal list-inside space-y-4 text-teal-600/90 dark:text-teal-400">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ol>
    </div>
);


const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export const FindingCard: React.FC<{ text: string; onClick: () => void; }> = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="group w-full text-left p-3 flex items-center justify-between bg-white dark:bg-slate-800/50 rounded-md shadow-sm hover:shadow-md hover:bg-teal-50/50 dark:hover:bg-slate-700/70 hover:ring-1 hover:ring-teal-300 dark:hover:ring-teal-600 transition-all duration-200"
    >
        <span className="text-sm text-slate-600 dark:text-slate-300 flex-1 pr-2">{text}</span>
        <ChevronRightIcon />
    </button>
);


// --- ChapterSummaryDashboard Component ---
interface ChapterSummaryDashboardProps {
  stats: { value: string; label: string, id: MenuItemId }[];
  findings: { text: string; id: MenuItemId }[];
  chart: React.ReactElement<{ linkId?: MenuItemId, onClick?: () => void }>;
  onItemClick: (id: MenuItemId) => void;
  className?: string;
  diagram?: React.ReactElement<{ linkId?: MenuItemId, onClick?: () => void }>;
}
export const ChapterSummaryDashboard: React.FC<ChapterSummaryDashboardProps> = ({ stats, findings, chart, onItemClick, className, diagram }) => (
    <div className={`mb-10 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/40 rounded-xl ${className || ''} pdf-avoid-break`}>
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Chapter Dashboard</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">An interactive overview. Click any item to explore.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left Column: Stats and Findings */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-200">Key Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map(stat => <StatCard key={stat.label} value={stat.value} label={stat.label} onClick={() => onItemClick(stat.id)} />)}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-200">Main Findings</h4>
                    <div className="space-y-2">
                        {findings.map((finding, i) => <FindingCard key={i} text={finding.text} onClick={() => onItemClick(finding.id)} />)}
                    </div>
                </div>
            </div>

            {/* Right Column: Chart and Diagram */}
            <div className="lg:col-span-3 flex flex-col gap-6 justify-center">
                 {React.cloneElement(chart, { onClick: () => chart.props.linkId && onItemClick(chart.props.linkId) })}
                 {diagram && (
                     <div className="w-full">
                        {React.cloneElement(diagram, { onClick: () => diagram.props.linkId && onItemClick(diagram.props.linkId) })}
                     </div>
                 )}
            </div>
        </div>
    </div>
);


// ======================= MIND MAP BASE COMPONENTS =======================
const MindMapNode: React.FC<{
    id: MenuItemId; x: number; y: number; w: number; h: number;
    label: string[]; isCentral?: boolean; isPrimary?: boolean; isHovered: boolean;
    onItemClick: (id: MenuItemId) => void; onHover: (id: MenuItemId | null) => void;
}> = ({ id, x, y, w, h, label, isCentral, isPrimary, isHovered, onItemClick, onHover }) => {
    const textLines = label;
    const lineHeight = 14;
    const textYStart = y - (textLines.length - 1) * (lineHeight / 2);

    return (
        <g
            onClick={() => onItemClick(id)}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            className="cursor-pointer"
            aria-label={`Navigate to section: ${label.join(' ')}`}
        >
            <rect
                x={x - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                rx={isCentral ? h / 2 : 10}
                className={`stroke-2 transition-all duration-300 ${
                    isHovered
                        ? 'fill-teal-100 dark:fill-teal-800/80 stroke-teal-500'
                        : isCentral
                        ? 'fill-teal-50 dark:fill-teal-900/50 stroke-teal-300 dark:stroke-teal-700'
                        : isPrimary
                        ? 'fill-sky-50 dark:fill-sky-900/50 stroke-sky-300 dark:stroke-sky-700'
                        : 'fill-slate-50 dark:fill-slate-800/50 stroke-slate-300 dark:stroke-slate-700'
                }`}
            />
            {textLines.map((line, i) => (
                <text
                    key={i}
                    x={x}
                    y={textYStart + i * lineHeight}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-xs font-semibold select-none pointer-events-none transition-colors duration-300 ${
                        isHovered
                            ? 'fill-teal-800 dark:fill-teal-200'
                            : 'fill-slate-700 dark:fill-slate-300'
                    }`}
                >
                    {line}
                </text>
            ))}
        </g>
    );
};

const MindMapConnector: React.FC<{
    from: { x: number; y: number }; to: { x: number; y: number }; isHighlighted: boolean;
}> = ({ from, to, isHighlighted }) => {
    const d = `M${from.x},${from.y} C${from.x},${(from.y + to.y) / 2} ${to.x},${(from.y + to.y) / 2} ${to.x},${to.y}`;
    return (
        <path
            d={d}
            fill="none"
            className={`transition-all duration-300 ${
                isHighlighted
                    ? 'stroke-teal-400 stroke-2'
                    : 'stroke-slate-300 dark:stroke-slate-600 stroke-[1.5]'
            }`}
        />
    );
};

const BaseMindMap: React.FC<{
    nodes: any; connections: any[]; onItemClick: (id: MenuItemId) => void;
    title: string; description: string; className?: string; viewBox: string;
}> = ({ nodes, connections, onItemClick, title, description, className, viewBox }) => {
    const [hoveredId, setHoveredId] = useState<MenuItemId | null>(null);

    return (
        <div className={`my-6 bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg dark:shadow-slate-900/50 transition-shadow duration-300 ${className || ''} pdf-avoid-break`}>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">{description}</p>
            <svg viewBox={viewBox} className="w-full h-auto" role="img" aria-labelledby="mindmap-title">
                <title id="mindmap-title">{title}</title>
                <g>
                    {connections.map((conn, i) => {
                        const fromNode = nodes[conn.from];
                        const toNode = nodes[conn.to];
                        const isHighlighted = hoveredId !== null && (fromNode.id === hoveredId || toNode.id === hoveredId);
                        return (
                            <g key={i} opacity={hoveredId && !isHighlighted ? 0.2 : 1} style={{ transition: 'opacity 0.3s' }}>
                                <MindMapConnector from={fromNode} to={toNode} isHighlighted={!!isHighlighted} />
                            </g>
                        );
                    })}
                </g>
                <g>
                    {Object.values(nodes).map((node: any, i) => {
                        const isHovered = node.id === hoveredId;
                        const isDimmed = hoveredId !== null && !isHovered;
                        return (
                             <g key={i} opacity={isDimmed ? 0.3 : 1} style={{ transition: 'opacity 0.3s' }}>
                                <MindMapNode {...node} isHovered={isHovered} onItemClick={onItemClick} onHover={setHoveredId} />
                             </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

// ======================= CHAPTER 1 MIND MAP =======================
export const Chapter1MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-1', x: 400, y: 300, w: 120, h: 50, label: ['Chapter I', 'Introduction'], isCentral: true },
        c1_1: { id: 'ch1-1', x: 400, y: 100, w: 120, h: 40, label: ['74th Const. Act'], isPrimary: true },
        c1_1_1: { id: 'ch1-1', x: 250, y: 50, w: 130, h: 40, label: ['Constitutional', 'Status for ULBs'] },
        c1_1_2: { id: 'ch1-1', x: 550, y: 50, w: 120, h: 40, label: ['18 Devolved', 'Functions'] },
        c1_2: { id: 'ch1-2', x: 650, y: 300, w: 120, h: 40, label: ['Urbanisation'], isPrimary: true },
        c1_2_1: { id: 'ch1-2', x: 750, y: 225, w: 140, h: 40, label: ['11.3% in Bihar', '(2011)'] },
        c1_2_2: { id: 'ch1-2', x: 750, y: 375, w: 140, h: 40, label: ['vs 31.2%', 'National Avg'] },
        c1_3: { id: 'ch1-3', x: 400, y: 500, w: 120, h: 40, label: ['Profile of ULBs'], isPrimary: true },
        c1_3_1: { id: 'ch1-3', x: 400, y: 580, w: 120, h: 40, label: ['261 Total ULBs'] },
        c1_3_1_1: { id: 'ch1-3', x: 200, y: 620, w: 120, h: 40, label: ['19 Mun. Corps'] },
        c1_3_1_2: { id: 'ch1-3', x: 400, y: 620, w: 120, h: 40, label: ['88 Mun. Councils'] },
        c1_3_1_3: { id: 'ch1-3', x: 600, y: 620, w: 140, h: 40, label: ['154 Nagar Panchayats'] },
        c1_4: { id: 'ch1-4', x: 150, y: 300, w: 120, h: 40, label: ['Org. Structure'], isPrimary: true },
        c1_4_1: { id: 'ch1-4', x: 50, y: 225, w: 110, h: 40, label: ['Political Wing'] },
        c1_4_2: { id: 'ch1-4', x: 50, y: 375, w: 130, h: 40, label: ['Administrative', 'Wing'] },
    };
    const connections = [
        { from: 'central', to: 'c1_1' }, { from: 'c1_1', to: 'c1_1_1' }, { from: 'c1_1', to: 'c1_1_2' },
        { from: 'central', to: 'c1_2' }, { from: 'c1_2', to: 'c1_2_1' }, { from: 'c1_2', to: 'c1_2_2' },
        { from: 'central', to: 'c1_3' }, { from: 'c1_3', to: 'c1_3_1' }, { from: 'c1_3_1', to: 'c1_3_1_1' }, { from: 'c1_3_1', to: 'c1_3_1_2' }, { from: 'c1_3_1', to: 'c1_3_1_3' },
        { from: 'central', to: 'c1_4' }, { from: 'c1_4', to: 'c1_4_1' }, { from: 'c1_4', to: 'c1_4_2' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter I: An Interactive Overview" description="Hover over and click on nodes to explore the chapter's key concepts." className={className} viewBox="0 0 800 670" />;
};

// ======================= OTHER CHAPTER MIND MAPS =======================
export const ExecutiveSummaryMindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'exec-summary', x: 400, y: 300, w: 140, h: 50, label: ['Executive', 'Summary'], isCentral: true },
        findings: { id: 'exec-summary', x: 200, y: 300, w: 120, h: 40, label: ['Key Findings'], isPrimary: true },
        f1: { id: 'chapter-4', x: 100, y: 150, w: 120, h: 40, label: ['Institutional', 'Gaps'] },
        f2: { id: 'chapter-5', x: 100, y: 250, w: 120, h: 40, label: ['HR', 'Deficiencies'] },
        f3: { id: 'chapter-6', x: 100, y: 350, w: 120, h: 40, label: ['Financial', 'Constraints'] },
        f4: { id: 'chapter-7', x: 100, y: 450, w: 120, h: 40, label: ['Ineffective', 'Services'] },
        recs: { id: 'recommendations', x: 600, y: 300, w: 140, h: 40, label: ['Recommendations'], isPrimary: true },
        r1: { id: 'recommendations', x: 700, y: 150, w: 120, h: 40, label: ['Strengthen', 'Governance'] },
        r2: { id: 'recommendations', x: 700, y: 250, w: 120, h: 40, label: ['Empower HR'] },
        r3: { id: 'recommendations', x: 700, y: 350, w: 120, h: 40, label: ['Enhance', 'Finances'] },
        r4: { id: 'recommendations', x: 700, y: 450, w: 120, h: 40, label: ['Improve', 'Services'] },
    };
    const connections = [
        { from: 'central', to: 'findings' }, { from: 'findings', to: 'f1' }, { from: 'findings', to: 'f2' }, { from: 'findings', to: 'f3' }, { from: 'findings', to: 'f4' },
        { from: 'central', to: 'recs' }, { from: 'recs', to: 'r1' }, { from: 'recs', to: 'r2' }, { from: 'recs', to: 'r3' }, { from: 'recs', to: 'r4' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Executive Summary: An Interactive Overview" description="A high-level view of the audit's main findings and recommendations." className={className} viewBox="0 0 800 600" />;
};
export const Chapter2MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-2', x: 400, y: 200, w: 140, h: 50, label: ['Chapter II', 'Methodology'], isCentral: true },
        objective: { id: 'ch2-1', x: 150, y: 200, w: 120, h: 40, label: ['Audit Objective'], isPrimary: true },
        o1: { id: 'ch2-1', x: 150, y: 100, w: 120, h: 40, label: ['Assess', 'Empowerment'] },
        criteria: { id: 'ch2-2', x: 400, y: 350, w: 120, h: 40, label: ['Audit Criteria'], isPrimary: true },
        c1: { id: 'ch2-2', x: 250, y: 450, w: 120, h: 40, label: ['74th CAA'] },
        c2: { id: 'ch2-2', x: 400, y: 450, w: 120, h: 40, label: ['BMA 2007'] },
        c3: { id: 'ch2-2', x: 550, y: 450, w: 120, h: 40, label: ['SFC Reports'] },
        scope: { id: 'ch2-3', x: 650, y: 200, w: 120, h: 40, label: ['Audit Scope'], isPrimary: true },
        s1: { id: 'ch2-3', x: 650, y: 100, w: 120, h: 40, label: ['2019-2024'] },
        s2: { id: 'ch2-3', x: 650, y: 300, w: 120, h: 40, label: ['26 ULBs', 'Sampled'] },
    };
    const connections = [
        { from: 'central', to: 'objective' }, { from: 'objective', to: 'o1' },
        { from: 'central', to: 'criteria' }, { from: 'criteria', to: 'c1' }, { from: 'criteria', to: 'c2' }, { from: 'criteria', to: 'c3' },
        { from: 'central', to: 'scope' }, { from: 'scope', to: 's1' }, { from: 'scope', to: 's2' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter II: An Interactive Overview" description="Exploring the audit's objectives, criteria, and scope." className={className} viewBox="0 0 800 550" />;
};
export const Chapter3MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-3', x: 400, y: 100, w: 140, h: 50, label: ['Chapter III', 'Compliance'], isCentral: true },
        comp: { id: 'ch3-1', x: 400, y: 250, w: 140, h: 40, label: ['Legislation', 'Comparison'], isPrimary: true },
        c1: { id: 'ch3-1', x: 150, y: 350, w: 120, h: 40, label: ['14 Year Delay', 'in BMA 2007'] },
        c2: { id: 'ch3-1', x: 400, y: 350, w: 120, h: 40, label: ['Election', 'Delays'] },
        c3: { id: 'ch3-1', x: 650, y: 350, w: 120, h: 40, label: ['SFC Report', 'Delays'] },
    };
    const connections = [
        { from: 'central', to: 'comp' }, { from: 'comp', to: 'c1' }, { from: 'comp', to: 'c2' }, { from: 'comp', to: 'c3' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter III: An Interactive Overview" description="Assessing the state's legislative compliance with the 74th CAA." className={className} viewBox="0 0 800 450" />;
};
export const Chapter4MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-4', x: 400, y: 300, w: 140, h: 50, label: ['Chapter IV', 'Devolution'], isCentral: true },
        status: { id: 'ch4-1', x: 400, y: 100, w: 140, h: 40, label: ['17 of 18', 'Functions Devolved'], isPrimary: true },
        im: { id: 'ch4-2', x: 150, y: 300, w: 140, h: 40, label: ['Institutional', 'Mechanisms'], isPrimary: true },
        im1: { id: 'ch4-2-1', x: 50, y: 200, w: 120, h: 40, label: ['ESC Meeting', 'Shortfalls'] },
        im2: { id: 'ch4-2-2', x: 50, y: 400, w: 120, h: 40, label: ['DPCs/MPCs', 'Not Formed'] },
        powers: { id: 'ch4-3', x: 650, y: 200, w: 140, h: 40, label: ['State Govt.', 'Powers'] },
        para: { id: 'ch4-4', x: 650, y: 400, w: 120, h: 40, label: ['Parastatals'] },
    };
    const connections = [
        { from: 'central', to: 'status' }, { from: 'central', to: 'im' }, { from: 'im', to: 'im1' }, { from: 'im', to: 'im2' },
        { from: 'central', to: 'powers' }, { from: 'central', to: 'para' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter IV: An Interactive Overview" description="Examining the state of devolution and institutional support for ULBs." className={className} viewBox="0 0 800 500" />;
};
export const Chapter5MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-5', x: 400, y: 100, w: 140, h: 50, label: ['Chapter V', 'Human Resources'], isCentral: true },
        limited: { id: 'ch5-1', x: 150, y: 200, w: 120, h: 40, label: ['Limited Powers'], isPrimary: true },
        recruit: { id: 'ch5-2', x: 400, y: 250, w: 120, h: 40, label: ['Recruitment'], isPrimary: true },
        vacancy: { id: 'ch5-2-1', x: 400, y: 350, w: 120, h: 40, label: ['92% Vacancy'] },
        capacity: { id: 'ch5-4', x: 650, y: 200, w: 140, h: 40, label: ['Capacity Building', '(Lacking)'], isPrimary: true },
    };
    const connections = [
        { from: 'central', to: 'limited' }, { from: 'central', to: 'recruit' }, { from: 'recruit', to: 'vacancy' }, { from: 'central', to: 'capacity' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter V: An Interactive Overview" description="Analyzing the critical human resource challenges facing ULBs." className={className} viewBox="0 0 800 450" />;
};
export const Chapter6MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-6', x: 400, y: 300, w: 140, h: 50, label: ['Chapter VI', 'Financials'], isCentral: true },
        revenue: { id: 'ch6-1', x: 200, y: 150, w: 140, h: 40, label: ['Sources of', 'Revenue'], isPrimary: true },
        r1: { id: 'ch6-1', x: 100, y: 50, w: 120, h: 40, label: ['86% Grants'] },
        r2: { id: 'ch6-1', x: 300, y: 50, w: 120, h: 40, label: ['9% Own Revenue'] },
        budget: { id: 'ch6-2', x: 600, y: 150, w: 120, h: 40, label: ['Budgeting'], isPrimary: true },
        exp: { id: 'ch6-3', x: 200, y: 450, w: 120, h: 40, label: ['Expenditure'], isPrimary: true },
        acct: { id: 'ch6-5', x: 600, y: 450, w: 120, h: 40, label: ['Accounting'], isPrimary: true },
    };
    const connections = [
        { from: 'central', to: 'revenue' }, { from: 'revenue', to: 'r1' }, { from: 'revenue', to: 'r2' },
        { from: 'central', to: 'budget' }, { from: 'central', to: 'exp' }, { from: 'central', to: 'acct' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter VI: An Interactive Overview" description="A look into the financial health and management of ULBs." className={className} viewBox="0 0 800 550" />;
};
export const Chapter7MindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'chapter-7', x: 400, y: 300, w: 140, h: 50, label: ['Chapter VII', 'Effectiveness'], isCentral: true },
        water: { id: 'ch7-1', x: 150, y: 300, w: 120, h: 40, label: ['Water Supply'], isPrimary: true },
        w1: { id: 'ch7-1', x: 50, y: 200, w: 120, h: 40, label: ['0/9 SLBs Met'] },
        w2: { id: 'ch7-1', x: 50, y: 400, w: 140, h: 40, label: ['17% Connection', 'Shortfall'] },
        health: { id: 'ch7-2', x: 400, y: 100, w: 120, h: 40, label: ['Sanitation'], isPrimary: true },
        h1: { id: 'ch7-2', x: 250, y: 50, w: 120, h: 40, label: ['No City Plans'] },
        h2: { id: 'ch7-2', x: 550, y: 50, w: 120, h: 40, label: ['No Sewage', 'Treatment'] },
        swm: { id: 'ch7-3', x: 650, y: 300, w: 120, h: 40, label: ['SWM'], isPrimary: true },
        s1: { id: 'ch7-3', x: 750, y: 200, w: 120, h: 40, label: ['No Landfills'] },
        s2: { id: 'ch7-3', x: 750, y: 400, w: 120, h: 40, label: ['Poor Processing'] },
    };
    const connections = [
        { from: 'central', to: 'water' }, { from: 'water', to: 'w1' }, { from: 'water', to: 'w2' },
        { from: 'central', to: 'health' }, { from: 'health', to: 'h1' }, { from: 'health', to: 'h2' },
        { from: 'central', to: 'swm' }, { from: 'swm', to: 's1' }, { from: 'swm', to: 's2' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Chapter VII: An Interactive Overview" description="Evaluating the effectiveness of key devolved municipal services." className={className} viewBox="0 0 800 500" />;
};
export const RecommendationsMindMap: React.FC<{ onItemClick: (id: MenuItemId) => void; className?: string }> = ({ onItemClick, className }) => {
    const nodes = {
        central: { id: 'recommendations', x: 400, y: 100, w: 160, h: 50, label: ['Consolidated', 'Recommendations'], isCentral: true },
        gov: { id: 'recommendations', x: 150, y: 250, w: 120, h: 40, label: ['Governance'], isPrimary: true },
        hr: { id: 'recommendations', x: 325, y: 250, w: 120, h: 40, label: ['Human Resources'], isPrimary: true },
        fin: { id: 'recommendations', x: 500, y: 250, w: 120, h: 40, label: ['Finances'], isPrimary: true },
        serv: { id: 'recommendations', x: 675, y: 250, w: 120, h: 40, label: ['Services'], isPrimary: true },
    };
    const connections = [
        { from: 'central', to: 'gov' }, { from: 'central', to: 'hr' }, { from: 'central', to: 'fin' }, { from: 'central', to: 'serv' },
    ];
    return <BaseMindMap nodes={nodes} connections={connections} onItemClick={onItemClick} title="Recommendations: An Interactive Overview" description="Exploring the key areas for improvement identified in the audit." className={className} viewBox="0 0 800 350" />;
};