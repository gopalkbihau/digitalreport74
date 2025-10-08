import React, { useState } from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, SummaryBox, Paragraph, Table, Recommendation, RecommendationsList, SubTitle, Chapter7MindMap } from '../ContentElements';
import { GroupedBarChart } from '../Charts';
import InfoModal from '../InfoModal';

interface ChapterProps {
    activeItem: MenuItemId;
    onItemClick: (id: MenuItemId) => void;
    notes: Record<string, { note: string; originalText: string; }>;
    onUpdateNote?: (id: string, text: string, originalText: string) => void;
    onDeleteNote?: (id: string) => void;
    className?: string;
}

const slbData = [
    ["Coverage of water supply connections", "100%", "03 ULBs", "Gaya,Barauli, Areraj", "Gaya – 57.40%,Barauli – 92.86%,Areraj – 58.44%"],
    ["Per capita supply of water", "135 litres", "04 ULBs", "Saharsa,Gaya, Barauli,Areraj", "Verifiable records were not produced."],
    ["Extent of non-revenue water", "20%", "07 ULBs", "Madhubani, Saharsa, Begusarai,Muzaffarpur, Jamui, Islampur, Manihari", "Verifiable records were not produced."],
    ["Extent of metering of water connection", "100%", "01 ULBs", "Gaya", "Gaya – 67.95%"],
    ["Continuity of water supplied", "24 hours", "02 ULBs", "Saharsa, Gaya", "Verifiable records were not produced."],
    ["Quality of water supplied", "100%", "07 ULBs", "Saharsa, Gaya, Muzaffarpur, Sherghati, Jogbani,Barauli, Sahebganj", "Verifiable records were not produced."],
    ["Cost recovery in water supply services", "100%", "06 ULBs", "Begusarai, Chapra,Muzaffarpur, Sherghati, Jogbani,Sahebganj", "Cost recovery was not done."],
    ["Efficiency in collection of water supply related charges", "90%", "07 ULBs", "Gaya, Chapra,Simri Bakhtiyarpur,Sherghati,Jogbani,Sahebganj,Nabinagar", "Collection was Nil for most, but Chapra collected only ₹ 1.9 lakh during 2019-24."],
    ["Efficiency in redressal of customer complaints", "80%", "07 ULBs", "Madhubani, Saharsa, Gaya, Begusarai,Biharsharif,Muzaffarpur, Parsa Bazar", "Complaint register was not produced."],
];

const PaginatedSLBTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const totalItems = slbData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = slbData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
    };
    
    const startItem = totalItems > 0 ? Math.min(indexOfFirstItem + 1, totalItems) : 0;
    const endItem = Math.min(indexOfLastItem, totalItems);

    return (
        <div className="my-6 pdf-avoid-break">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="items-per-page-slb" className="text-sm text-slate-600 dark:text-slate-300">Show:</label>
                    <select
                        id="items-per-page-slb"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="p-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-sm"
                    >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={9}>All (9)</option>
                    </select>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {startItem}-{endItem} of {totalItems}
                </p>
            </div>
            
            <Table
                caption="Table 7.1: Status of SLB indicators for water supply (as of March 2024)"
                headers={["Indicator", "Benchmark", "No. of ULBs Claimed", "Details", "Actual Status"]}
                data={currentItems}
                rowHeaderColumnIndex={0}
            />

            {totalPages > 1 && (
                 <nav className="flex items-center justify-center mt-4" aria-label="Pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                       Previous
                    </button>
                    <div className="flex items-center gap-1 mx-2">
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === number + 1 ? 'bg-teal-500 text-white shadow' : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                aria-current={currentPage === number + 1 ? 'page' : undefined}
                            >
                                {number + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1"
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </nav>
            )}
        </div>
    );
};

// --- Accordion for Water Supply Section ---

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

const WaterSupplyAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = ({ ...noteProps }) => {
    const [openSections, setOpenSections] = useState(new Set(['slb']));
    const [allowMultiple, setAllowMultiple] = useState(false);
    
    const waterSupplySections = [
        {
            id: 'slb',
            title: '7.1.1 Status of Service Level Benchmark',
            content: <>
                <Paragraph contentId={`ch7-1-slb-p-0`} {...noteProps}>Audit observed that the while the test-checked ULBs had incorporated Service Level Benchmarks relating to Water Supply in their budget and achievements there against none of them achieved all the prescribed benchmarks. Out of 26 test-checked ULBs, six ULBs failed to achieve any benchmark indicators, and only three ULBs reported 100 per cent water supply connection to households in their municipal area (March 2024). However, audit scrutiny of related records revealed gaps between the claims made and actual performance.</Paragraph>
                <PaginatedSLBTable />
            </>
        },
        {
            id: 'schemes',
            title: '7.1.2 Status of water supply schemes',
            content: <Paragraph contentId={`ch7-1-schemes-p-0`} {...noteProps}>The Government of Bihar (GoB) launched Har Ghar Nal Ka Jal (HGNJ) yojana (December 2015), a scheme for adequate supply of tap water. A survey revealed that approximately 82 per cent of families did not have access to drinking water pipeline connections. Projects were approved under AMRUT, JNNURM, and ADB-funded programs, with the remaining to be implemented by ULBs.</Paragraph>
        },
        {
            id: 'connections',
            title: '7.1.3 Failure to provide connections to all households under “Har Ghar Nal Ka Jal scheme”',
            content: <Paragraph contentId={`ch7-1-connections-p-0`} {...noteProps}>Audit observed a shortfall of approximately 17 per cent in providing tap water connections to targeted households. None of the ULBs provided metered water connections except MC Gaya. As a result, the ULBs neither ensured tap water connection to all targeted households nor guaranteed the prescribed quantity of water (135 ltrs).</Paragraph>
        },
        {
            id: 'maintenance',
            title: '7.1.4 Maintenance of water supply schemes',
            content: <Paragraph contentId={`ch7-1-maintenance-p-0`} {...noteProps}>Audit observed that test-checked ULBs failed to maintain proper records relating to O&M activities and associated payments. Water user charge was being collected by only 10 out of 26 test-checked ULBs, contributing to insufficient funds for regular maintenance and timely payment of electricity bills.</Paragraph>
        },
        {
            id: 'monitoring',
            title: '7.1.5 Non-monitoring of functionality of drinking water supply systems',
            content: <Paragraph contentId={`ch7-1-monitoring-p-0`} {...noteProps}>IoT devices, intended for real-time monitoring, were to be installed in 19 ULBs but were only partially installed in six and were non-functional. Similarly, the Supervisory Control and Data Acquisition (SCADA) system was to be installed in seven ULBs, but its status could not be ascertained. This lack of monitoring infrastructure meant the intended objectives of ensuring uninterrupted water supply could not be achieved.</Paragraph>
        },
        {
            id: 'grievance',
            title: '7.1.6 Non-existence of Grievance Redressal Mechanism',
            content: <>
                <Paragraph contentId={`ch7-1-grievance-p-0`} {...noteProps}>Test-checked ULBs did not provide information related to a Grievance Redressal Mechanism. As a result, the audit could not ascertain whether any mechanism existed for receiving complaints from citizens regarding water supply schemes during 2019-24. While the Department mentioned a multi-tier system managed by PHED, it was not established at the ULB level, indicating a lack of clarity and accountability.</Paragraph>
            </>
        },
        {
            id: 'recommendation',
            title: 'Recommendation',
            content: <Recommendation title="Recommendation 11:">ULBs should provide tap water connections to all targeted households within the timeline and a mechanism should be established to ensure adequate and regular supply of water to households.</Recommendation>
        }
    ];

    const handleToggle = (id: string) => {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                if (!allowMultiple) {
                    newSet.clear();
                }
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div>
            <Paragraph contentId={`ch7-1-intro-p-0`} {...noteProps}>As water is a basic need, emphasis has been laid on performance related to reach and access to quality service, and prevalence and effectiveness of the systems to manage the water supply networks. Nine benchmark indicators are to be used as tools for undertaking objective performance analysis by ULBs for improvement in their activities related to water supply.</Paragraph>
            
            <div className="flex items-center justify-end my-4 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                <label htmlFor="expand-all-toggle" className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {allowMultiple ? 'Allow multiple sections open' : 'Open one section at a time'}
                </label>
                <button
                    role="switch"
                    aria-checked={allowMultiple}
                    onClick={() => setAllowMultiple(!allowMultiple)}
                    className={`${allowMultiple ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800`}
                >
                    <span className={`${allowMultiple ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </button>
            </div>
            
            <div className="space-y-2">
                {waterSupplySections.map(section => (
                    <AccordionItem
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        isOpen={openSections.has(section.id)}
                        onToggle={handleToggle}
                    >
                        {section.content}
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

const PublicHealthAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (noteProps) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };
    
    const sections = [
        {
            id: 'ch7-2-1',
            title: '7.2.1 Status of Service Level Benchmark',
            content: (
                <>
                    <Paragraph contentId={`ch7-2-1-p-0`} {...noteProps}>During the audit of 26 test-checked ULBs, it was observed that the status of sewerage and storm water drainage work was not satisfactory. Fifteen ULBs failed to achieve any benchmark indicators, and none of the sampled ULBs met all indicators. Achievements in key performance indicators such as “extent of reuse recycling of sewage” and “adequacy of sewage treatment capacity” were Nil in most ULBs.</Paragraph>
                    <Table caption="Table 7.2: Status of SLB of sewerage & storm water drainage" headers={["Service", "Indicator", "Benchmark", "Details", "Actual Status"]} data={[
                        ["Sewerage", "Coverage of toilets", "100%", "09 ULBs claimed achievement", "Verifiable records were not produced."],
                        ["", "Coverage of sewerage network", "100%", "01 ULB (Begusarai) claimed achievement", "Verifiable records were not produced."],
                        ["", "Collection efficiency", "100%", "02 ULBs claimed achievement", "Network not functional or under construction; records not produced."],
                        ["", "Adequacy of treatment capacity", "100%", "02 ULBs claimed achievement", "STP under construction; records not produced."],
                        ["Storm water drainage", "Incidence of water logging", "0 in number", "10 ULBs claimed achievement", "Data not as per SLB norms (should be in numbers, not percentage)."],
                    ]} rowHeaderColumnIndex={1} />
                </>
            )
        },
        {
            id: 'ch7-2-2',
            title: '7.2.2 Non preparation of city sanitation plan',
            content: (
                <>
                    <Paragraph contentId={`ch7-2-2-p-0`} {...noteProps}>Audit observed that the State Government had prepared a Draft Bihar Urban Sanitation Strategy in 2010 but has not yet finalised it. Without a proper City Sanitation Plan (CSP) for each city, the objectives of Swachh Bharat Mission (SBM) could not be fully achieved.</Paragraph>
                    <Table caption="Approved Toilet Construction under City Sanitation Action Plan" headers={["Component", "Approved No. of Seats"]} data={[
                        ["Individual Household Latrine (IHHL)", "32986"],
                        ["Aspirational Toilet", "195"],
                        ["Public Toilet (PT)", "2959"],
                        ["Community Toilet (CT)", "2315"],
                        ["Urinals", "3179"],
                    ]} rowHeaderColumnIndex={0} />
                    <Recommendation title="Recommendation 12:">City sanitation plans should be prepared and implemented to facilitate adequate sanitation facilities in the municipal areas.</Recommendation>
                </>
            )
        },
        {
            id: 'ch7-2-3',
            title: '7.2.3 Non-availability of sewage treatment facilities',
            content: (
                <Paragraph contentId={`ch7-2-3-p-0`} {...noteProps}>Audit observed that none of the test-checked ULBs, except Sultanganj, had separate sewerage and drainage in the city. As a result, sewage was being discharged into river/water bodies without treatment, posing a serious risk to public health and the environment.</Paragraph>
            )
        },
        {
            id: 'ch7-2-4',
            title: '7.2.4 Non-adherence of timelines of street sweeping',
            content: (
                <>
                    <Paragraph contentId={`ch7-2-4-p-0`} {...noteProps}>Only six test-checked ULBs had prepared a time schedule for street sweeping, and these were not as per State norms. Furthermore, test-checked ULBs did not provide any records to Audit in support of the purchase of personal protective equipment (PPEs) for the safety of waste collectors.</Paragraph>
                    <Recommendation title="Recommendation 13:">ULBs should ensure street sweeping is carried out as per the prescribed schedule and that PPEs are provided to sanitation workers.</Recommendation>
                </>
            )
        },
        {
            id: 'ch7-2-5',
            title: '7.2.5 Inadequate facility of public toilets',
            content: (
                <Paragraph contentId={`ch7-2-5-p-0`} {...noteProps}>Audit observed that none of the test-checked ULBs maintained proper records of public places to assess the need for public toilets. Records revealed 204 public toilets were available in 20 ULBs, but only 190 were functional. Only one test-checked ULB had prepared a maintenance schedule.</Paragraph>
            )
        },
        {
            id: 'ch7-2-6',
            title: '7.2.6 Non-utilisation of grants of public health',
            content: (
                <>
                    <Paragraph contentId={`ch7-2-6-p-0`} {...noteProps}>As per the 15th FC recommendation, grants were allocated for public health infrastructure. However, the amount received during 2021-22 remained blocked for 20 to 32 months in test-checked ULBs and was later transferred to the District Health Society (DHS), where the funds remained parked and unutilised as of December 2024.</Paragraph>
                    <Recommendation title="Recommendation 14:">The State Government should devolve funds, functions, and functionaries related to public health to Urban Local Bodies to enable effective utilisation of public health grants.</Recommendation>
                </>
            )
        }
    ];

    return (
        <div className="space-y-2">
            <Paragraph contentId={`ch7-2-intro-p-0`} {...noteProps}>
                Audit observed that Health Department maintained hospitals and dispensaries, but sanitation services were handled by respective ULBs. No Chief Municipal/Municipal Health Officer was posted in any of the ULBs as of December 2024, and there was an acute shortage of sanitation staff, which adversely affected overall public health management.
            </Paragraph>
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

const SolidWasteManagementAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (noteProps) => {
    const [openId, setOpenId] = useState<string | null>('ch7-3-1'); // Default open first section

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };
    
    const sections = [
        {
            id: 'ch7-3-1',
            title: '7.3.1 Status of Service Level Benchmark',
            content: (
                <>
                    <Paragraph contentId={`ch7-3-1-p-0`} {...noteProps}>Out of 26 test-checked ULBs, 17 failed to achieve any benchmark indicators related to SWM, and none except Chapra met all the benchmarks. For indicators like "Household level coverage" and "Efficiency of collection," verifiable records were not available.</Paragraph>
                    <Table caption="Table 7.3: Status of SLB of SWM services" headers={["Indicator", "Benchmark", "Details", "Actual Status"]} data={[
                        ["Household level coverage", "100%", "09 ULBs claimed achievement", "Verifiable records were not available."],
                        ["Extent of segregation", "100%", "04 ULBs claimed achievement", "Verifiable records were not available."],
                        ["Extent of waste recovered", "80%", "03 ULBs claimed achievement", "Saharsa recovered only 6.36% and Chapra only 10%."],
                        ["Scientific disposal", "100%", "03 ULBs claimed achievement", "Saharsa and Chapra processed only 6.36% and 10% respectively."],
                        ["Cost recovery in SWM services", "100%", "01 ULB (Chapra) claimed achievement", "Chapra recovered only ₹ 28.86 lakh during 2019-24."],
                    ]} rowHeaderColumnIndex={0} />
                </>
            )
        },
        {
            id: 'ch7-3-2',
            title: '7.3.2 Generation, collection and processing of waste',
            content: (
                <Paragraph contentId={`ch7-3-2-p-0`} {...noteProps}>Audit observed that while ULBs collected most of the generated waste, the processing was minimal. Only MC, Gaya processed all its waste; seven ULBs did not process any, and 18 others processed only 0.75% to 75% of the collected waste.</Paragraph>
            )
        },
        {
            id: 'ch7-3-3',
            title: '7.3.3 Inadequate processing centres',
            content: (
                <Paragraph contentId={`ch7-3-3-p-0`} {...noteProps}>Against a requirement of 111 decentralised processing centres and 111 Material Recovery Facilities (MRFs), ULBs were able to develop only 26 centres (of which only seven were functional) and five MRF centres. This shows a significant gap in waste processing infrastructure.</Paragraph>
            )
        },
        {
            id: 'ch7-3-4',
            title: '7.3.4 Non-integration of waste collectors',
            content: (
                <Paragraph contentId={`ch7-3-4-p-0`} {...noteProps}>Registration of waste pickers and waste sellers had not been done by any of the test-checked ULBs. SHG women workers had not been engaged, and the objective of integrating informal waste collectors into the SWM system remained unachieved.</Paragraph>
            )
        },
        {
            id: 'ch7-3-5',
            title: '7.3.5 Non-availability of sanitary landfills',
            content: (
                <Paragraph contentId={`ch7-3-5-p-0`} {...noteProps}>None of the test-checked ULBs, except Barauli, had obtained authorisation from the BSPCB for the development of sanitary landfills. Land was not available in 8 test-checked ULBs for this purpose. Consequently, waste was disposed of in an unscientific manner in open dumping sites.</Paragraph>
            )
        },
        {
            id: 'ch7-3-recs',
            title: 'Recommendations',
            content: (
                <RecommendationsList items={[
                    "State Government should provide appropriate land to ULBs for the development of sanitary landfill sites for scientific disposal of waste. Bye-laws should be notified by all ULBs and management of municipal solid waste should be done as per SWM Rules, 2016.",
                    "ULBs should improve their service delivery system to achieve the target benchmarking of indicators of the Service Level Benchmarks."
                ]} />
            )
        }
    ];

    return (
        <div className="space-y-2">
            <Paragraph contentId={`ch7-3-intro-p-0`} {...noteProps}>
                According to the Solid Waste Management (SWM) Rules, 2016, ULBs are responsible for the entire chain of solid waste management. However, the audit revealed significant shortcomings in this area.
            </Paragraph>
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
const Chapter7StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
    const WaterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a5 5 0 01-.88-9.914A5.002 5.002 0 0112 6c1.398 0 2.673.69 3.428 1.75.165.25.31.512.441.782A5.001 5.001 0 0117 16a5 5 0 01-5 5c-1.398 0-2.673-.69-3.428-1.75a4.972 4.972 0 01-.441-.782z" /></svg>);
    const HealthIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    const WasteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
    
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<WaterIcon />} title="Water Supply Failures" linkId="ch7-1" onItemClick={onItemClick}>
          <p>ULBs failed to meet any of the 9 key Service Level Benchmarks (SLBs) for water supply, and a <strong className="font-bold text-rose-600 dark:text-rose-400">17% shortfall</strong> in providing tap water connections persists.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<HealthIcon />} title="Sanitation & Health Gaps" linkId="ch7-2" onItemClick={onItemClick}>
          <p>No city sanitation plans were prepared, sewage treatment facilities were non-existent, and public health grants remained unutilised, posing risks to citizens.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<WasteIcon />} title="Waste Management Crisis" linkId="ch7-3" onItemClick={onItemClick}>
          <p>Solid waste management is ineffective, with inadequate processing centers, no integration of waste collectors, and a complete lack of scientific sanitary landfills.</p>
      </InfoCard>
    </div>
  );
};


// --- Main Chapter Component ---
const Chapter7: React.FC<Omit<ChapterProps, 'notes' | 'onUpdateNote' | 'onDeleteNote'>> = ({ activeItem, onItemClick, ...noteProps }) => {
    
    switch(activeItem) {
        case 'ch7-effectiveness':
            return (
                <>
                    <SummaryBox>
                        Achievement of various indicators of SLBs by test-checked ULBs in Water Supply, Solid Waste Management and Sewerage and Storm water drainage was unsatisfactory. Water supply to all households was not ensured. There was no mechanism in existence in the test-checked ULBs for receiving complaints of citizens regarding water supply schemes during 2019-24. State Government did not prepare any State Sanitation Strategy to devolve full powers, roles and responsibilities along with financial and personnel resources necessary for ULBs to discharge this core municipal function as per National Urban Sanitation Policy-2008 (NUSP-2008) and SBM guidelines. Performance in collection and processing of Solid Waste by test-checked ULBs was poor. The sampled ULBs had not developed the required number of decentralised processing centres, due to unavailability of land. Against the requirement of 136 decentralised processing centres, ULBs could develop only 49 decentralised processing centres, however, only 16 decentralised processing centres were functional. Sanitary landfill sites were not available in test-checked ULBs.
                    </SummaryBox>
                    <Paragraph contentId={`${activeItem}-p-0`} {...noteProps}>
                        With the implementation of 74th Constitutional Amendment Act, ULBs were vested with the powers and responsibilities of implementation of schemes related to Water supply and Public health, sanitation, conservancy & solid waste management to provide basic amenities for public uses. Ministry of Urban Development has set SLB at the national level for service provision in four key sectors – water supply, sewerage, SWM and storm water drainage. Monitoring performance and improvements is envisaged as the goal of SLB. Benchmarking should be used as a tool for undertaking objective performance analysis by ULBs to improve their activities.
                    </Paragraph>
                     <Paragraph contentId={`${activeItem}-p-1`} {...noteProps}>Also, the 13th FC recommended that State Government must gradually put in place standards for delivery of all essential services provided by local bodies. Accordingly, the UD&HD had notified (March 2011) Service Level Benchmarks SLBs for services to be provided by the ULBs. SLB is well recognized as an important mechanism for introducing accountability in service delivery. Sustained benchmarking can help ULBs and utilities in identifying performance gaps and effecting improvements through the sharing of information and best practices and ultimately resulting in better services to people. The status of effectiveness of selected services in the State are discussed below:</Paragraph>
                </>
            );
        case 'ch7-1':
            return <WaterSupplyAccordion activeItem={activeItem} {...noteProps} onItemClick={onItemClick as (id: MenuItemId) => void} />;
        case 'ch7-2':
            return <PublicHealthAccordion {...noteProps} />;
        case 'ch7-3':
             return <SolidWasteManagementAccordion {...noteProps} />;
        case 'chapter-7':
        default:
            const handleItemClick = onItemClick || (() => {});
            return (
                 <>
                    <ChapterSummaryDashboard
                        onItemClick={handleItemClick}
                        className={noteProps.className}
                        stats={[
                            { value: '0/9', label: 'Water SLBs Achieved', id: 'ch7-1' },
                            { value: '17%', label: 'Tap Connection Shortfall', id: 'ch7-1' },
                            { value: '12%', label: 'Processing Centers Functional', id: 'ch7-3' },
                            { value: '0', label: 'Sanitary Landfills Available', id: 'ch7-3' }
                        ]}
                        findings={[
                            { text: "Service Level Benchmarks for water, sanitation, and waste management are not being met.", id: 'ch7-1' },
                            { text: "Access to basic services like piped water remains incomplete.", id: 'ch7-1' },
                            { text: "Solid waste management suffers from inadequate infrastructure for processing and disposal.", id: 'ch7-3' },
                            { text: "Lack of sanitation plans and grievance redressal mechanisms weakens service delivery.", id: 'ch7-2' }
                        ]}
                        chart={<GroupedBarChart 
                            title="Service Level Benchmark (SLB) Achievement"
                            data={[
                                { label: 'Water Supply', values: [{ group: 'Achieved', value: 0 }, { group: 'Not Achieved', value: 9 }] },
                                { label: 'Sewerage', values: [{ group: 'Achieved', value: 0 }, { group: 'Not Achieved', value: 8 }] },
                                { label: 'SWM', values: [{ group: 'Achieved', value: 1 }, { group: 'Not Achieved', value: 7 }] },
                            ]}
                            colors={['rgb(20 184 166)', 'rgb(244 63 94)']}
                            linkId='ch7-1'
                        />}
                    />

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                           This infographic visualizes the narrative of service delivery failures, from water supply to waste management.
                        </p>
                        <Chapter7StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This mind map connects the central theme of service effectiveness to its various components, highlighting key failures in each area.
                        </p>
                        <Chapter7MindMap onItemClick={handleItemClick} />
                    </div>
                 </>
            );
    }
};

export default Chapter7;