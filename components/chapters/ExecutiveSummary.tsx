import React, { useState } from 'react';
import { Paragraph, SubTitle, ExecutiveSummaryMindMap } from '../ContentElements';
import { MiniDonutChart } from '../Charts';
import InfoModal from '../InfoModal';
import type { MenuItemId } from '../../types';

interface ChapterProps {
  activeItem?: MenuItemId;
  onItemClick?: (id: MenuItemId) => void;
  notes?: Record<string, { note: string; originalText: string; }>;
  onUpdateNote?: (id: string, text: string, originalText: string) => void;
  onDeleteNote?: (id: string) => void;
  className?: string;
}


const KeyFindingChart: React.FC<{ chart: React.ReactNode; title: string; text: string; onClick: () => void; }> = ({ chart, title, text, onClick }) => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { currentTarget: el } = e;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;
        const rotateX = ((y / height) - 0.5) * -1 * 15; // Max 7.5 deg tilt
        const rotateY = ((x / width) - 0.5) * 15; // Max 7.5 deg tilt
        
        setStyle({
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        });
    };
    
    return (
        <div className="perspective-container h-full">
            <button 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={style}
                onClick={onClick}
                className="w-full flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg h-full border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-800/80 hover:ring-2 hover:ring-teal-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 card-3d-interactive"
            >
                {chart}
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex-grow">{text}</p>
            </button>
        </div>
    );
};

const findingsData = [
    {
        title: "Legal & Institutional Gaps",
        shortText: "76% shortfall in key committee meetings, hindering governance.",
        chart: <MiniDonutChart percentage={76} color="rgb(20 184 166)" />,
        longText: "While the State government enacted the Bihar Municipal Act (BMA) in 2007, there was a 14-year delay. The legal provisions were not backed by decisive actions, resulting in a situation where the spirit of the 74th CAA has not been realized. Institutional weaknesses, such as delayed elections, irregular meetings, and the non-formation of key municipal committees, have significantly undermined the effective functioning of ULBs."
    },
    {
        title: "Human Resource Deficiencies",
        shortText: "Up to 98% staff vacancy rate, crippling operational capacity.",
        chart: <MiniDonutChart percentage={98} color="rgb(15 118 110)" />,
        longText: "ULBs have limited control over human resources. This has led to severe staff shortages (vacancy rates of 81% to 98% in sampled ULBs) and the absence of a structured capacity-building mechanism, adversely affecting operational efficiency and service delivery."
    },
    {
        title: "Financial Constraints",
        shortText: "Only 8.7% own-revenue contribution, limiting financial autonomy.",
        chart: <MiniDonutChart percentage={8.7} color="rgb(45 212 191)" />,
        longText: "ULBs remain heavily dependent on government grants, which are often delayed. Their authority to levy taxes and user charges is limited, weakening their financial independence and hampering their ability to deliver services. This has resulted in a low contribution from own revenue (8.74% of total revenue)."
    },
    {
        title: "Ineffective Service Delivery",
        shortText: "100% failure to meet key benchmarks for water supply services.",
        chart: <MiniDonutChart percentage={100} color="rgb(153 246 228)" />,
        longText: "Devolved functions in areas like water supply, public health, and solid waste management are not translating into effective outcomes. There are significant gaps in service delivery, with ULBs failing to meet many of the prescribed Service Level Benchmarks (SLBs)."
    }
];

// --- Recommendation Icons ---
const GovernanceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);
const HumanResourceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598m-1.5-6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
    </svg>
);
const FinanceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ServiceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 15.75l-2.472 2.472a3.375 3.375 0 004.773 4.773L11.42 15.17z" />
    </svg>
);

// --- Recommendation Card Component ---
const RecommendationCard: React.FC<{ icon: React.ReactNode; title: string; text: string; onClick: () => void; }> = ({ icon, title, text, onClick }) => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { currentTarget: el } = e;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;
        const rotateX = ((y / height) - 0.5) * -1 * 15; // Max 7.5 deg tilt
        const rotateY = ((x / width) - 0.5) * 15; // Max 7.5 deg tilt
        
        setStyle({
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
        });
    };

    return (
        <div className="perspective-container h-full">
            <button 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={style}
                onClick={onClick}
                className="w-full flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg h-full border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-800/80 hover:ring-2 hover:ring-teal-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 card-3d-interactive"
            >
                <div className="mb-2">{icon}</div>
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex-grow">{text}</p>
            </button>
        </div>
    );
};

const recommendationsData = [
    {
        title: "Strengthen Governance",
        shortText: "Ensure full devolution of functions and timely formation of committees.",
        icon: <GovernanceIcon className="w-10 h-10 text-teal-500" />,
        longText: "The State Government should fully devolve all functions and ensure adequate autonomy for ULBs to perform their roles effectively. Timely delimitation of municipalities and formation of key committees should be prioritized to enhance governance and citizen participation."
    },
    {
        title: "Empower Human Resources",
        shortText: "Grant ULBs authority over HR and fill vacancies promptly.",
        icon: <HumanResourceIcon className="w-10 h-10 text-teal-500" />,
        longText: "ULBs must be granted authority over human resource management, with vacancies filled promptly, and staff capacity should be strengthened through regular training."
    },
    {
        title: "Enhance Financial Autonomy",
        shortText: "Implement SFC recommendations and improve own-revenue collection.",
        icon: <FinanceIcon className="w-10 h-10 text-teal-500" />,
        longText: "Financial empowerment of ULBs requires timely implementation of State Finance Commission (SFC) recommendations, prompt release of grants, and improved collection of taxes and user charges supported by realistic budgeting."
    },
    {
        title: "Improve Service Delivery",
        shortText: "Ensure universal tap water, robust sanitation, and waste processing.",
        icon: <ServiceIcon className="w-10 h-10 text-teal-500" />,
        longText: "ULBs should ensure all households have tap water connections, establish robust grievance redressal mechanisms, prepare and implement comprehensive sanitation plans, and develop adequate waste processing facilities to meet service level benchmarks."
    }
];

// --- Storytelling Infographic Components ---
const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; linkId: MenuItemId; onItemClick: (id: MenuItemId) => void; }> = ({ icon, title, children, linkId, onItemClick }) => {
    return (
        <button onClick={() => onItemClick(linkId)} className="w-full text-left p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-lg hover:shadow-xl hover:ring-2 hover:ring-teal-400 transition-all duration-300 hover-3d-scale">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-teal-700 dark:text-teal-300">{title}</h3>
                    <div className="mt-2 text-slate-600 dark:text-slate-300">
                        {children}
                    </div>
                </div>
            </div>
        </button>
    );
};
const ExecutiveSummaryStorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<GovernanceIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />} title="Problem: Institutional Gaps" linkId="chapter-4" onItemClick={onItemClick}>
          <p>Key committees are non-functional, devolution is incomplete, and elections are delayed, undermining local governance.</p>
      </InfoCard>
      <InfoCard icon={<HumanResourceIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />} title="Problem: HR Deficiencies" linkId="chapter-5" onItemClick={onItemClick}>
          <p>Severe staff shortages (up to 98% vacancy) and lack of training cripple the ability of ULBs to function effectively.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<FinanceIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />} title="Solution: Recommendations" linkId="recommendations" onItemClick={onItemClick}>
          <p>A set of targeted recommendations to strengthen governance, empower human resources, enhance financial autonomy, and improve service delivery.</p>
      </InfoCard>
    </div>
  );
};


const ExecutiveSummary: React.FC<ChapterProps> = (props) => {
    const [modalData, setModalData] = useState<{ title: string; content: string; } | null>(null);
    const handleItemClick = props.onItemClick || (() => {});

    return (
        <>
            <Paragraph contentId="exec-summary-p-0" {...props}>
                This performance audit examined the effectiveness of the implementation of the 74th Constitutional Amendment Act (CAA) in Bihar, focusing on the empowerment of Urban Local Bodies (ULBs). The audit reveals that despite enabling legislation like the Bihar Municipal Act, 2007, the intended objectives of decentralization and self-governance have not been fully achieved. ULBs continue to face significant institutional, financial, and administrative challenges that limit their autonomy and service delivery capabilities.
            </Paragraph>
            <SubTitle contentId="exec-summary-st-0" {...props}>Key Findings</SubTitle>
            <div className={`bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm mb-4 border border-slate-200 dark:border-slate-700 ${props.className || ''}`}>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">Click on a finding to view details.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {findingsData.map(finding => (
                         <KeyFindingChart
                            key={finding.title}
                            chart={finding.chart}
                            title={finding.title}
                            text={finding.shortText}
                            onClick={() => setModalData({ title: finding.title, content: finding.longText })}
                        />
                    ))}
                </div>
            </div>
            
            <SubTitle contentId="exec-summary-st-1" {...props}>Recommendations</SubTitle>
            <div className={`bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm mb-4 border border-slate-200 dark:border-slate-700 ${props.className || ''}`}>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">Click on a recommendation to view details.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendationsData.map(rec => (
                         <RecommendationCard
                            key={rec.title}
                            icon={rec.icon}
                            title={rec.title}
                            text={rec.shortText}
                            onClick={() => setModalData({ title: rec.title, content: rec.longText })}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-16 pdf-avoid-break">
                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                    The "Storytelling Infographic" Approach
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                    This infographic presents the core problems identified in the audit and connects them to the proposed solutions.
                </p>
                <ExecutiveSummaryStorytellingInfographic onItemClick={handleItemClick} />
            </div>

            <div className="mt-16 pdf-avoid-break">
                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                    The "Connected Mind Map" Approach
                </h2>
                 <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                    This mind map provides a high-level overview of the audit's key findings and the resulting recommendations.
                </p>
                <ExecutiveSummaryMindMap onItemClick={handleItemClick} />
            </div>

            <InfoModal
                isOpen={!!modalData}
                onClose={() => setModalData(null)}
                title={modalData?.title || ''}
            >
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{modalData?.content}</p>
            </InfoModal>
        </>
    );
};

export default ExecutiveSummary;