import React, { useState } from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, Paragraph, Chapter2MindMap } from '../ContentElements';
import { DonutChart } from '../Charts';
import InfoModal from '../InfoModal';

interface ChapterProps {
  activeItem?: MenuItemId;
  onItemClick?: (id: MenuItemId) => void;
  notes?: Record<string, { note: string; originalText: string; }>;
  onUpdateNote?: (id: string, text: string, originalText: string) => void;
  onDeleteNote?: (id: string) => void;
  className?: string;
}

// --- Icons for the Audit Objectives Flowchart ---
const LegislationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const InstitutionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const ResourcesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const HumanResourcesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AuditObjectiveCard: React.FC<{ icon: React.ReactNode; text: string; }> = ({ icon, text }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 h-full">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg flex items-center justify-center shadow-md">
            {icon}
        </div>
        <p className="text-slate-600 dark:text-slate-300 pt-1">{text}</p>
    </div>
);


// --- Icons for the Audit Criteria Flowchart ---
const GavelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.707 21.707L15.536 17.536M6.343 8.343l1.414-1.414m1.414 1.414l-1.414 1.414M3 21l6-6" />
    </svg>
);

const FinanceChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const GearsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AuditCriteriaFlowchart: React.FC = () => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm my-6">
        <p className="!p-0 !bg-transparent !dark:bg-transparent !shadow-none !mb-6 text-lg text-center text-slate-700 dark:text-slate-300">
            The criteria for the Performance Audit (PA) were derived from the following sources:
        </p>
        <div className="flex justify-center my-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
            {/* Branch 1 */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <GavelIcon />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Constitutional & Statutory Framework</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 text-left">
                    <li>74th Constitution Amendment Act, 1992</li>
                    <li>Bihar Municipal Act, 2007</li>
                    <li>Community Participation Rules, 2013</li>
                    <li>ESC Conduct of Business Rules, 2010</li>
                </ul>
            </div>

            {/* Branch 2 */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                 <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <FinanceChartIcon />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Financial Norms & Rules</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 text-left">
                    <li>Bihar Municipal Accounting Manual, 2014</li>
                    <li>Bihar Municipal Accounting Rules, 2014</li>
                    <li>Bihar Municipal Budget Manual, 2014</li>
                    <li>Bihar Property Tax Rules, 2013</li>
                </ul>
            </div>

            {/* Branch 3 */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                 <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-300 to-teal-400 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <GearsIcon />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Sectoral & Functional Rules</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 text-left">
                    <li>Bihar Urban Planning and Development Act, 2012</li>
                    <li>Bihar Urban Planning and Development Rule, 2014</li>
                    <li>Central/State Finance Commission Reports</li>
                    <li>Solid Waste Management Rules, 2016</li>
                    <li>Govt. orders, notifications, etc.</li>
                </ul>
            </div>
        </div>
    </div>
);

const findingsData = [
    { 
        chapter: "III - Compliance with provisions of 74th CAA", 
        objective: "Whether provisions of the 74th CAA have been adequately covered in the State Legislation", 
        criteria: "Provisions of 74th Constitutional Amendment Act (CAA), 1992, etc.", 
        findings: <ul className='list-disc pl-5 mt-2'><li>In conformity with 74th CAA, the State Government enacted the Bihar Municipal Act (BMA) 2007 but with a delay of 14 years.</li></ul>, 
        conclusion: "The legal provisions were not backed by decisive actions resulting in a situation in which the spirit of the 74th CAA has not fructified."
    },
    { 
        chapter: "IV – Devolution of functions and institutional mechanism", 
        objective: "Whether ULBs have been empowered by the State government to discharge their functions/responsibilities effectively", 
        criteria: "Schedule 12 of Constitution, BMA 2007, Govt. notifications, etc.", 
        findings: <ul className='list-disc pl-5 mt-2'><li>State Government devolved functions except fire services, but the autonomy was restricted.</li><li>Delayed elections in the ULBs and irregular convention of meetings of municipal boards/ ESCs</li><li>Non formation of various municipal committees/ bodies.</li></ul>, 
        conclusion: "Institutional weaknesses such as delayed elections, irregular meetings, and non-formation of key municipal committees had significantly undermined the effective empowerment and functioning of ULBs."
    },
    { 
        chapter: "V – Human resources of ULBs", 
        objective: "Whether ULBs have powers to mobilize and incentivise human resources commensurate with their functions", 
        criteria: "BMA 2007, State Human Resources policies, recruitment norms, etc.", 
        findings: <ul className='list-disc pl-5 mt-2'><li>Limited powers over human resources of ULBs</li><li>Shortage of human resources and technical staff</li><li>Lack of structured mechanisms in place for capacity building of the various cadres.</li></ul>, 
        conclusion: "ULBs had limited control over human resources, further impacted by staff shortages and the absence of a structured capacity-building mechanism, all of which adversely affected their operational efficiency and service delivery."
    },
    { 
        chapter: "VI – Financial resources of ULBs", 
        objective: "Whether ULBs have been empowered to access adequate resources including sufficient resources", 
        criteria: "BMA, 2007, BMAR 2014, BMAM 2014, BMBM 2014, etc.", 
        findings: <ul className='list-disc pl-5 mt-2'><li>ULBs were heavily dependent on government grants (86.20 per cent).</li><li>Unrealistic budget estimates were prepared with significant deviations.</li><li>Own revenue generation was very low (8.74 per cent).</li><li>Weak accounting practices with no double-entry system.</li></ul>, 
        conclusion: "ULBs' financial independence was weakened by heavy grant dependency, limited authority to levy taxes, and poor financial management, hampering their ability to deliver services."
    },
    { 
        chapter: "VII – Effectiveness of devolved functions", 
        objective: "Whether ULBs have effectively delivered essential services to the citizens", 
        criteria: "SWM Rules 2016, National Urban Sanitation Policy, SLBs, etc.", 
        findings: <ul className='list-disc pl-5 mt-2'><li>SLBs for water supply, sewerage, and SWM were not achieved.</li><li>17 per cent shortfall in providing tap water connections.</li><li>Poor performance in solid waste collection and processing.</li><li>No sanitary landfills available in test-checked ULBs.</li></ul>, 
        conclusion: "The effectiveness of devolved functions was poor. Basic services like water supply, sanitation, and waste management failed to meet established benchmarks, directly impacting citizens."
    }
];

const InteractiveFindingsTable: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIndex(Number(e.target.value));
        setAnimationKey(prev => prev + 1); // Trigger re-animation
    };
    
    const selectedData = findingsData[selectedIndex];

    return (
        <div className="my-6">
            <div className="mb-6">
                <label htmlFor="chapter-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select a Chapter to view details:
                </label>
                <div className="relative">
                    <select
                        id="chapter-select"
                        value={selectedIndex}
                        onChange={handleSelectChange}
                        className="w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 appearance-none shadow-sm"
                    >
                        {findingsData.map((item, index) => (
                            <option key={index} value={index}>{item.chapter}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>
            </div>

            {selectedData && (
                <div key={animationKey} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 animate-fadeIn">
                    <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4">{selectedData.chapter}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Audit Objective</h4>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedData.objective}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Audit Criteria</h4>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedData.criteria}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Key Audit Findings</h4>
                            <div className="text-slate-600 dark:text-slate-300 mt-1">{selectedData.findings}</div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Audit Conclusion</h4>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedData.conclusion}</p>
                        </div>
                    </div>
                </div>
            )}
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

const Chapter2StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<GavelIcon />} title="The 'Why': Audit Objective" linkId="ch2-1" onItemClick={onItemClick}>
          <p>To assess if ULBs are empowered with the funds, functions, and functionaries needed to be effective institutions of local self-government.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<FinanceChartIcon />} title="The 'How': Audit Criteria" linkId="ch2-2" onItemClick={onItemClick}>
          <p>The audit was based on the 74th CAA, Bihar Municipal Act 2007, and various financial and sectoral rules and guidelines.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<GearsIcon />} title="The 'What': Audit Scope" linkId="ch2-3" onItemClick={onItemClick}>
          <p>The audit covered the period 2019-24, sampling 26 ULBs across Bihar, representing 26% of the state's urban population.</p>
      </InfoCard>
    </div>
  );
};


const Chapter2: React.FC<ChapterProps> = (props) => {
    const { activeItem, onItemClick } = props;
    
    switch(activeItem) {
        case 'ch2-1':
            return (
                <>
                  <Paragraph contentId={`${activeItem}-p-0`} {...props}>The principal purpose of this performance audit was to understand whether ULBs have been empowered in terms of funds, functions and functionaries to establish themselves as effective institutions of local self-government and whether the 74th CAA has been effectively implemented in the State. Accordingly, the following objectives were framed to assess:</Paragraph>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <AuditObjectiveCard 
                        icon={<LegislationIcon />}
                        text="Whether provisions of the 74th CAA have been adequately covered in the State Legislation;"
                    />
                    <AuditObjectiveCard 
                        icon={<InstitutionsIcon />}
                        text="Whether ULBs have been empowered by the State government to discharge their functions/responsibilities effectively through creation of appropriately designed institutions/institutional mechanisms and effectiveness of the functions devolved to the ULBs;"
                    />
                    <AuditObjectiveCard 
                        icon={<ResourcesIcon />}
                        text="Whether ULBs have been empowered to access adequate resources including sufficient resources for discharge of functions stated to be devolved to them; and"
                    />
                    <AuditObjectiveCard 
                        icon={<HumanResourcesIcon />}
                        text="Whether ULBs have powers to mobilize and incentivise human resources commensurate with their functions."
                    />
                  </div>

                  <Paragraph contentId={`${activeItem}-p-1`} {...props}>The overall objective of this audit is to appreciate whether ULBs of the State have enabled to plan, implement and manage local affairs more effectively and they have effectively delivered essential services like sanitation, water supply, public health and solid waste management to the citizens.</Paragraph>
                </>
            );
        case 'ch2-2':
            return (
                <>
                    <AuditCriteriaFlowchart />
                </>
            );
        case 'ch2-3':
             return (
                <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                    <p>The Performance Audit covering the period April 2019 to March 2024 was carried out from August 2024 to December 2024. Status of efficacy of implementation of 74th Constitutional Amendment Act in ULBs in the Bihar was done through data collection and information gathered from the UD&amp;HD, Government of Bihar, reports of State Finance Commission (SFC) and the sampled ULBs. There were 261 ULBs (19 Municipal Corporations, 88 Municipal Councils and 154 Nagar Panchayats) in the State of Bihar, as on 31 March 2024. However, only 141 ULBs were functional during the financial years 2019-20 to 2023-24. These spread across nine Divisions/38 Districts, in the State. ULBs were selected by applying Simple Random Sampling (Revenue Division-wise), using IDEA application software. From each category of ULBs, samples of audit units were drawn in such a manner that one Municipal Corporation, one Municipal Council and one Nagar Panchayat were selected from each Division so that equal representation may be ensured. Based on the methodology, nine Municipal Corporations, nine Municipal Councils and eight Nagar Panchayats, were selected. The list of selected ULBs is indicated in Appendix-2.1. The sample also covers 26.06 per cent of the urban population of the State.</p>
                    <p className="mt-4">To form an opinion regarding the effectiveness of functions stated to have been devolved, audit selected the following two functions, out of 18 functions identified in the 12th schedule, audit analysed these in detail:</p>
                    <ol className="list-[lower-roman] list-inside space-y-2 my-4 pl-4">
                        <li>Water supply for domestic, industrial and commercial purpose; and</li>
                        <li>Public health, sanitation conservancy and solid waste management.</li>
                    </ol>
                    <p>Apart from above selected functions, issues related to levy and realisation of Property Tax and Water charges were also scrutinised in order to assess the revenue buoyancy of the ULBs.</p>
                    <p className="mt-4">The audit methodology involved requisition of records/information, document analysis and responses to audit queries.</p>
                    <p className="mt-4">An Entry Conference was held on 2 August 2024 with the Principal Secretary, UD&amp;HD, in which the audit methodology, scope, objectives and criteria were explained. An Exit Conference was held on 10 July 2025 with the UD&amp;HD to discuss and obtain their views on the audit findings. Replies of the sampled ULBs have been incorporated in an appropriate place in the report.</p>
                </Paragraph>
            );
        case 'ch2-4':
             return (
                <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                    <p>Audit acknowledges the cooperation and assistance extended by the implementing department (UD&amp;HD) and their units during conduct of this PA. However, it is noted that all requisitioned records were not produced by the test-checked units as detailed below.</p>
                    <p className="mt-4">Audit queries and formats were issued to the UD&amp;HD during the months of July and August 2024. However, audit could not get all information and replies to these audit queries as of January 2025 despite repeated reminders. Further, replies of some of audit observation which were provided by the department were either incomplete or not relevant.</p>
                    <p className="mt-4">Similarly, of the 26 test-checked ULBs, eight ULBs did not provide replies to of audit observations issued between to them during the month of August and December 2024. The remaining 18 test-checked ULBs submitted replies that were either incomplete or lacked not relevance. Furthermore, in many instances, the required records were either not produced to audit or not maintained by the concerned ULBs. This non-production of records may have impacted the comprehensiveness of audit findings.</p>
                </Paragraph>
            );
        case 'ch2-5':
            return (
                 <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>The audit findings related to status of devolution of functions, funds and functionaries are presented in following Chapters:</Paragraph>
                    <InteractiveFindingsTable />
                </>
            );
        case 'chapter-2':
        default:
            const handleItemClick = onItemClick || (() => {});
            return (
                 <>
                    <ChapterSummaryDashboard 
                        className={props.className}
                        onItemClick={handleItemClick}
                        stats={[
                            { value: '26', label: 'ULBs Sampled for Audit', id: 'ch2-3' },
                            { value: '2019-24', label: 'Audit Period Covered', id: 'ch2-3' },
                            { value: '4', label: 'Primary Objectives', id: 'ch2-1' },
                            { value: '141/261', label: 'Functional ULBs', id: 'ch2-3' }
                        ]}
                        findings={[
                            { text: "The audit assesses if ULBs are empowered as per the 74th CAA.", id: 'ch2-1' },
                            { text: "Criteria are derived from constitutional, state, and sectoral laws.", id: 'ch2-2' },
                            { text: "A representative sample of ULBs was selected across Bihar.", id: 'ch2-3' },
                            { text: "Findings are organized into five key thematic chapters.", id: 'ch2-5' }
                        ]}
                        chart={<DonutChart
                            title="Sampled ULBs by Type (%)"
                            data={[
                                { label: 'Mun. Corp.', value: 35, color: 'rgb(20 184 166)' },
                                { label: 'Mun. Council', value: 35, color: 'rgb(15 118 110)' },
                                { label: 'Nagar Panchayat', value: 30, color: 'rgb(45 212 191)' },
                            ]}
                            centerText="26 Total"
                            linkId='ch2-3'
                        />}
                    />

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                           This infographic illustrates the structured approach taken by the audit, from defining objectives to selecting the scope.
                        </p>
                        <Chapter2StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This mind map provides a visual breakdown of the audit's methodology, connecting the core objective to its criteria and scope.
                        </p>
                        <Chapter2MindMap onItemClick={handleItemClick} />
                    </div>
                </>
            );
    }
};

export default Chapter2;