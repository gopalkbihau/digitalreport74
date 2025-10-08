import React, { useState } from 'react';
import { Paragraph, RecommendationsList } from '../ContentElements';

// AccordionItem component, adapted to use slate colors for consistency.
const AccordionItem: React.FC<{
    id: string;
    title: string;
    isOpen: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}> = ({ id, title, isOpen, onToggle, children }) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <h3>
                <button
                    onClick={() => onToggle(id)}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-content-${id}`}
                    className="flex justify-between items-center w-full py-4 px-2 text-left text-2xl font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-md transition-colors"
                >
                    <span className="flex-1 pr-4">{title}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transform transition-transform duration-300 text-slate-500 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </h3>
            <div
                id={`accordion-content-${id}`}
                role="region"
                aria-labelledby={`accordion-header-${id}`}
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="py-4 px-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const recommendationSections = [
    {
        id: 'rec-ch4',
        title: 'From Chapter IV: Devolution & Institutional Mechanism',
        items: [
            "Ensure that meetings of the Empowered Standing Committees (ESCs) are held regularly as per the Act so that important issues of ULBs can be resolved in a timely manner.",
            "Take immediate steps for the constitution of District Planning Committees (DPCs) in all districts and ensure their proper functioning.",
            "Constitute the Metropolitan Planning Committee (MPC) for the Patna metropolitan area and provide it with the necessary resources to function effectively.",
            "Constitute the Property Tax Board and frame the necessary rules for its functioning to ensure a scientific, uniform, and transparent system of property tax administration."
        ]
    },
    {
        id: 'rec-ch5',
        title: 'From Chapter V: Human Resources of ULBs',
        items: [
            "Ensure that vacancies against the sanctioned strength in ULBs are filled in a time-bound manner to enable effective service delivery.",
            "Consider delegating adequate functional and administrative powers to ULBs over their human resources, including assessment and recruitment of staff.",
            "Institutionalise capacity building of ULB functionaries through regular training programmes and make necessary provisions in municipal laws. A portion of grants from State Finance Commissions may be earmarked for this purpose."
        ]
    },
    {
        id: 'rec-ch6',
        title: 'From Chapter VI: Financial Resources of ULBs',
        items: [
            "Motivate ULBs to prepare realistic budgets, taking into account actual income and expenditure after ascertaining the realisable receipts and expenditures of municipal services in a timely manner."
        ]
    },
    {
        id: 'rec-ch7',
        title: 'From Chapter VII: Effectiveness of Devolved Functions',
        items: [
            "ULBs should provide tap water connections to all targeted households within the timeline and establish a mechanism for adequate and regular supply.",
            "City sanitation plans should be prepared and implemented to facilitate adequate sanitation facilities in all municipal areas.",
            "ULBs must ensure street sweeping operations are carried out as per the prescribed schedule and that Personal Protective Equipment (PPE) is provided to sanitation workers.",
            "The State Government should devolve funds, functions, and functionaries related to public health to ULBs to enable effective utilisation of public health grants.",
            "Provide appropriate land to ULBs for the development of sanitary landfill sites for scientific disposal of waste.",
            "ULBs should improve their service delivery systems to achieve the target benchmarking of indicators of the Service Level Benchmarks."
        ]
    }
];

const Recommendations: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>(null); // All collapsed by default

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    return (
        <>
            <Paragraph contentId="rec-intro">
                This chapter provides a consolidated overview of all recommendations made throughout the audit report. These recommendations are intended to address the identified gaps in governance, finance, human resources, and service delivery, with the goal of strengthening Urban Local Bodies (ULBs) in Bihar in line with the 74th Constitutional Amendment Act.
            </Paragraph>

            <div className="space-y-2 mt-8">
                {recommendationSections.map(section => (
                    <AccordionItem
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        isOpen={openId === section.id}
                        onToggle={handleToggle}
                    >
                        <RecommendationsList items={section.items} />
                    </AccordionItem>
                ))}
            </div>
        </>
    );
};

export default Recommendations;