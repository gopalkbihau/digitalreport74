import React, { useState } from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, SummaryBox, Paragraph, Table, Recommendation, SubTitle, Chapter6MindMap } from '../ContentElements';
import { DonutChart, BarChart, LineChart, StackedBarChart } from '../Charts';
import InfoModal from '../InfoModal';

interface ChapterProps {
    activeItem?: MenuItemId;
    onItemClick?: (id: MenuItemId) => void;
    notes?: Record<string, { note: string; originalText: string; }>;
    onUpdateNote?: (id: string, text: string, originalText: string) => void;
    onDeleteNote?: (id: string) => void;
    className?: string;
}

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
                    className="flex justify-between items-center w-full py-4 px-2 text-left text-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-md"
                >
                    <span>{title}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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

const SourcesOfRevenueAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (noteProps) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    const sections = [
        {
            id: 'ch6-1-1',
            title: '6.1.1 Finance Commission Transfers',
            content: (
                <>
                    <Paragraph contentId={`ch6-1-1-p-0`} {...noteProps}>The State government constituted six SFCs since April 1994. However, the first two did not submit recommendations, and the last three submitted reports with delays from 30 to 695 days. This resulted in missed opportunities to enhance municipal revenue.</Paragraph>
                    <BarChart title="Chart 6.1: Delay in Submission of Reports by SFCs (in days)" data={[
                        { label: 'Fourth SFC', value: 695 },
                        { label: 'Fifth SFC', value: 305 },
                        { label: 'Sixth SFC', value: 30 },
                    ]}/>
                </>
            )
        },
        {
            id: 'ch6-1-2',
            title: '6.1.2 Own revenue sources',
            content: (
                <Paragraph contentId={`ch6-1-2-p-0`} {...noteProps}>The internal revenue base of ULBs in the State remains limited. While the 5th SFC reported 13.2% of own revenue against total revenue during 2010-15, the 6th SFC reported a decline to just 7%. Audit scrutiny revealed that test-checked ULBs had not imposed several permitted taxes and user charges, leading to a very low contribution of own revenue to total revenue.</Paragraph>
            )
        }
    ];

    return (
        <div className="space-y-2">
            {sections.map(section => (
                <AccordionItem
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    isOpen={openId === section.id}
                    onToggle={handleToggle}
                >
                    {section.content}
                </AccordionItem>
            ))}
        </div>
    );
};

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
const Chapter6StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
    const RevenueIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
    const BudgetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
    const AccountingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 0v6m0-6L9 13" /></svg>);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<RevenueIcon />} title="High Dependency on Grants" linkId="ch6-1" onItemClick={onItemClick}>
          <p>ULBs are heavily dependent on government grants (86.2%), with own-revenue contributing only 8.74%. SFC report delays worsen the situation.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<BudgetIcon />} title="Unrealistic Budgeting" linkId="ch6-2" onItemClick={onItemClick}>
          <p>Budgets are often unrealistic, with significant deviations between estimates and actuals, indicating poor financial planning and control.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<AccountingIcon />} title="Weak Accounting Practices" linkId="ch6-5" onItemClick={onItemClick}>
          <p>None of the test-checked ULBs maintained accounts under the double-entry system, and most required records were not kept, hindering financial transparency.</p>
      </InfoCard>
    </div>
  );
};

const Chapter6: React.FC<ChapterProps> = (props) => {
    const { activeItem, onItemClick } = props;
   
    switch(activeItem) {
        case 'ch6-fr':
            return (
                <SummaryBox>
                    The financial independence of ULBs was weakened due to heavy dependency on grants, limited authority to levy taxes/user charges, delays in release of SFC grants, unrealistic budget estimates and weak accounting practices.
                </SummaryBox>
            );
        case 'ch6-1':
            return (
                <SourcesOfRevenueAccordion {...props} />
            );
        case 'ch6-2':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        Audit observed that test-checked ULBs had prepared unrealistic budget estimates. During 2019-24, total receipt of the ULBs was between 20 per cent and 70 per cent of their budget estimates. Similarly, their expenditure was between 15 per cent and 64 per cent of the budget estimates. Further, it was also observed that most of the test-checked ULBs had not included committed liabilities in their budget.
                    </Paragraph>
                    <Recommendation title="Recommendation 10:">
                        The State Government may motivate ULBs to prepare realistic budget, taking into account the actual income and expenditure and after ascertaining the realisable receipts and expenditures of municipal services in a timely manner.
                    </Recommendation>
                </>
            );
        case 'ch6-3':
            return (
                <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                    Audit observed that none of the ULBs, except MC, Gaya, maintained proper records of revenue and capital expenditure. As a result, expenditure under these heads could not be ascertained. Total expenditure of test-checked ULBs against total revenue was only 60 per cent during 2019-24. Poor expenditure indicates poor planning, slow implementation of schemes and inefficient financial management.
                </Paragraph>
            );
        case 'ch6-4':
            return (
                <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                    Utilisation Certificates (UCs) provide assurance that funds have been used for their intended purposes. As of March 2024, a total of 1,027 UCs amounting to ₹1,438.45 crore were outstanding from various ULBs for grants received up to March 2023. The non-submission of UCs indicates a lack of accountability and could result in the withholding of future grants.
                </Paragraph>
            );
        case 'ch6-5':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        The Bihar Municipal Accounting Manual, 2014, mandates the maintenance of accounts on a double-entry accrual basis. However, audit observed that none of the test-checked ULBs maintained their primary books of accounts (cash book, bank book, journal, etc.) in the prescribed formats. Out of 89 prescribed records, 82 were not maintained. Financial statements were also not prepared by any of the ULBs.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>
                        The internal audit function was also found to be weak. Internal audit was conducted in only 11 out of 26 test-checked ULBs during 2019-24, and even then, it was not as per the prescribed procedures. The absence of a robust accounting and internal audit mechanism weakens financial control and transparency.
                    </Paragraph>
                </>
            );
        case 'chapter-6':
        default:
            const handleItemClick = onItemClick || (() => {});
            return (
                 <>
                    <ChapterSummaryDashboard
                        onItemClick={handleItemClick}
                        className={props.className}
                        stats={[
                            { value: '86.2%', label: 'Dependency on Grants', id: 'ch6-1' },
                            { value: '8.74%', label: 'Own Revenue Contribution', id: 'ch6-1' },
                            { value: '60%', label: 'Avg. Expenditure Rate', id: 'ch6-3' },
                            { value: '82/89', label: 'Acct. Records Not Kept', id: 'ch6-5' }
                        ]}
                        findings={[
                            { text: "ULBs are heavily dependent on state and central grants, with weak own-revenue generation.", id: 'ch6-1' },
                            { text: "Budgeting is unrealistic, with large variations between estimates and actuals.", id: 'ch6-2' },
                            { text: "Poor expenditure rates indicate inefficient financial management and planning.", id: 'ch6-3' },
                            { text: "Accounting practices are weak, with a failure to adopt the double-entry system.", id: 'ch6-5' }
                        ]}
                        chart={<StackedBarChart 
                            title="Revenue Composition of ULBs (2019-24)"
                            data={[
                                { label: '2019-20', values: [{ group: 'Own Revenue', value: 9 }, { group: 'Grants', value: 91 }] },
                                { label: '2020-21', values: [{ group: 'Own Revenue', value: 7 }, { group: 'Grants', value: 93 }] },
                                { label: '2021-22', values: [{ group: 'Own Revenue', value: 8 }, { group: 'Grants', value: 92 }] },
                                { label: '2022-23', values: [{ group: 'Own Revenue', value: 10 }, { group: 'Grants', value: 90 }] },
                                { label: '2023-24', values: [{ group: 'Own Revenue', value: 9 }, { group: 'Grants', value: 91 }] },
                            ]}
                            colors={['rgb(20 184 166)', 'rgb(100 116 139)']}
                            linkId='ch6-1'
                        />}
                    />
                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                           This infographic illustrates the key financial challenges faced by ULBs, from revenue dependency to poor accounting.
                        </p>
                        <Chapter6StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This mind map connects the central theme of financial resources to its various components, showing how revenue, budgeting, and accounting issues are interrelated.
                        </p>
                        <Chapter6MindMap onItemClick={handleItemClick} />
                    </div>
                 </>
            );
    }
};

export default Chapter6;
