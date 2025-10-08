import React, { useState } from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, SummaryBox, Paragraph, Table, Recommendation, BulletList, SubTitle, Chapter4MindMap } from '../ContentElements';
import { ProgressChart, BarChart } from '../Charts';
import InfoModal from '../InfoModal';
import { findMenuItem } from '../../utils/menu';

interface ChapterProps {
  activeItem?: MenuItemId;
  onItemClick?: (id: MenuItemId) => void;
  notes?: Record<string, { note: string; originalText: string; }>;
  onUpdateNote?: (id: string, text: string, originalText: string) => void;
  onDeleteNote?: (id: string) => void;
  className?: string;
}

const PaginatedTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    
    const functionsData = [
        [1, "Urban planning including town planning.", "Devolved"],
        [2, "Regulation of land-use and construction of buildings.", "Devolved"],
        [3, "Planning for economic and social development.", "Devolved"],
        [4, "Roads and bridges.", "Devolved"],
        [5, "Water supply for domestic, industrial and commercial purposes.", "Devolved"],
        [6, "Public health, sanitation conservancy and solid waste management.", "Devolved"],
        [7, "Fire services.", "Not Devolved"],
        [8, "Urban forestry, protection of the environment and promotion of ecological aspects.", "Devolved"],
        [9, "Safeguarding the interests of weaker sections of society, including the handicapped and mentally retarded.", "Devolved"],
        [10, "Slum improvement and upgradation.", "Devolved"],
        [11, "Urban poverty alleviation.", "Devolved"],
        [12, "Provision of urban amenities and facilities such as parks, gardens, playgrounds.", "Devolved"],
        [13, "Promotion of cultural, educational and aesthetic aspects.", "Devolved"],
        [14, "Burials and burial grounds; cremations, cremation grounds and electric crematoriums.", "Devolved"],
        [15, "Cattle pounds; prevention of cruelty to animals.", "Devolved"],
        [16, "Vital statistics including registration of births and deaths.", "Devolved"],
        [17, "Public amenities including street lighting, parking lots, bus stops and public conveniences.", "Devolved"],
        [18, "Regulation of slaughter houses and tanneries.", "Devolved"]
    ];

    const totalItems = functionsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = functionsData.slice(indexOfFirstItem, indexOfLastItem);

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
                    <label htmlFor="items-per-page" className="text-sm text-slate-600 dark:text-slate-300">Show:</label>
                    <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="p-1 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-sm"
                    >
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={18}>All (18)</option>
                    </select>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {startItem}-{endItem} of {totalItems}
                </p>
            </div>
            
            <Table
                caption="Table 4.1: Status of Devolution of 18 functions to ULBs"
                headers={["Function No.", "Function", "Status of Devolution"]}
                data={currentItems}
                rowHeaderColumnIndex={1}
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

const StateElectionCommissionAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (props) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    const sections = [
        { id: 'ch4-2-1-1', title: '4.2.1.1 Composition', content: (
             <Paragraph contentId={`ch4-2-1-1-p-0`} {...props}>
                As per Article 243K of the Constitution and Section 14 of the Bihar Municipal Act (BMA), 2007, the superintendence, direction, and control of the preparation of electoral rolls and the conduct of all elections to the Municipalities are vested in a State Election Commission (SEC). The SEC consists of a State Election Commissioner appointed by the Governor of Bihar. The Commissioner is an independent authority and cannot be removed from office except in the like manner and on the like grounds as a Judge of a High Court.
            </Paragraph>
        )},
        { id: 'ch4-2-1-2', title: '4.2.1.2 Reservation of seats', content: (
            <>
                <Paragraph contentId={`ch4-2-1-2-p-0`} {...props}>
                    In accordance with Article 243T of the Constitution, the BMA, 2007 provides for the reservation of seats in every Municipality for Scheduled Castes (SC), Scheduled Tribes (ST), and Backward Classes. Not less than one-third of the total number of seats reserved for each category are reserved for women belonging to that category.
                </Paragraph>
                 <Table 
                    headers={["Category", "Reservation Percentage", "Basis"]}
                    data={[
                        ["Scheduled Castes (SC)", "In proportion to their population in the municipal area", "Article 243T(1)"],
                        ["Scheduled Tribes (ST)", "In proportion to their population in the municipal area", "Article 243T(1)"],
                        ["Backward Classes", "As may be specified by the State Legislature", "Article 243T(6)"],
                        ["Women", "Not less than one-third of the total seats", "Article 243T(3)"],
                    ]}
                    caption="Provisions for Reservation of Seats in ULBs"
                />
            </>
        )},
        { id: 'ch4-2-1-3', title: '4.2.1.3 Elections & Formation', content: (
            <>
                <Paragraph contentId={`ch4-2-1-3-p-0`} {...props}>
                    Article 243U of the Constitution mandates a fixed tenure of five years for every Municipality. Audit scrutiny revealed that elections in 179 ULBs were delayed from 5 to 23 months between 2012 and 2022. This delay meant that for extended periods, these ULBs were run by administrators, undermining the principles of democratic self-governance.
                </Paragraph>
                <BarChart 
                    title="Delay in Conducting Municipal Elections (2012-2022)"
                    data={[
                        { label: '< 6 months', value: 45 },
                        { label: '6-12 months', value: 88 },
                        { label: '12-18 months', value: 32 },
                        { label: '> 18 months', value: 14 },
                    ]}
                    barColor="rgb(244 63 94)"
                />
            </>
        )},
        { id: 'ch4-2-1-4', title: '4.2.1.4 Mayor/Chairperson', content: (
            <Paragraph contentId={`ch4-2-1-4-p-0`} {...props}>
                The head of a Municipal Corporation is the Mayor, while the head of a Municipal Council is the Chairperson. They are elected directly by the councillors from amongst themselves. They preside over the meetings of the Municipality and have a term of five years, co-terminus with the term of the Municipality.
            </Paragraph>
        )},
        { id: 'ch4-2-1-5', title: '4.2.1.5 Municipality Meetings', content: (
             <Paragraph contentId={`ch4-2-1-5-p-0`} {...props}>
                As per Section 55 of the BMA, 2007, an ordinary meeting of the Municipality shall be held at least once every month. Audit observed significant shortfalls in holding these mandatory monthly meetings across the test-checked ULBs, leading to delays in decision-making and poor monitoring of projects.
            </Paragraph>
        )},
        { id: 'ch4-2-1-6', title: '4.2.1.6 ESC Meetings', content: (
            <>
                <Paragraph contentId={`ch4-2-1-6-p-0`} {...props}>As per Section 23 of BMA, 2007, the Empowered Standing Committee (ESC) shall meet at least once a month. Thus, a minimum of 60 meetings should have been held during the period 2019-24. Audit observed that out of 26 test-checked ULBs, only three ULBs had conducted more than 50 per cent of the stipulated number of meetings of ESC. The shortfall in conducting meetings ranged between 14 per cent and 93 per cent, hampering timely decision-making.</Paragraph>
                <Recommendation title="Recommendation 4:">
                    The State Government may ensure that meetings of the Empowered Standing Committees are held regularly as per the Act so that important issues of ULBs can be resolved in a timely manner.
                </Recommendation>
            </>
        )},
        { id: 'ch4-2-1-7', title: '4.2.1.7 Accounts Committee', content: (
             <Paragraph contentId={`ch4-2-1-7-p-0`} {...props}>
                Section 27 of the BMA, 2007 provides for the constitution of an Accounts Committee in every Municipality to examine accounts and ensure financial propriety. The audit found that in 21 out of 26 test-checked ULBs, the Accounts Committee was either not constituted or did not hold any meetings during the audit period (2019-24).
            </Paragraph>
        )},
        { id: 'ch4-2-1-8', title: '4.2.1.8 Subject Committees', content: (
            <Paragraph contentId={`ch4-2-1-8-p-0`} {...props}>
                To facilitate efficient decision-making, Section 28 of the BMA, 2007, allows for the formation of Subject Committees for specific functions. The audit observed that this provision was largely unutilized. None of the test-checked ULBs had constituted Subject Committees.
            </Paragraph>
        )},
        { id: 'ch4-2-1-9', title: '4.2.1.9 Streets Technical Committee', content: (
             <Paragraph contentId={`ch4-2-1-9-p-0`} {...props}>
                The Streets Technical Committee is a specialized body envisioned to provide technical expertise on matters related to municipal roads, bridges, and drains. Audit found that this committee was not formed in any of the test-checked ULBs, potentially affecting the quality of public works projects.
            </Paragraph>
        )},
        { id: 'ch4-2-1-10', title: '4.2.1.10 Ad-hoc Committees', content: (
            <Paragraph contentId={`ch4-2-1-10-p-0`} {...props}>
                Section 29 of the BMA, 2007, empowers a Municipality to constitute Ad-hoc Committees for inquiring into and reporting on any specific matter. However, this tool was rarely used by the ULBs.
            </Paragraph>
        )},
        { id: 'ch4-2-1-11', title: '4.2.1.11 Wards Committees', content: (
            <Paragraph contentId={`ch4-2-1-11-p-0`} {...props}>
                Article 243S of the Constitution mandates the constitution of Wards Committees in all municipalities with a population of three lakh or more. Despite the clear constitutional and statutory mandate, the audit found that Wards Committees were not constituted in any of the nine test-checked Municipal Corporations.
            </Paragraph>
        )},
        { id: 'ch4-2-1-12', title: '4.2.1.12 Area Sabha & Ward Committee', content: (
            <Paragraph contentId={`ch4-2-1-12-p-0`} {...props}>
                The Bihar Municipal Community Participation Rules, 2013, provide for the constitution of an Area Sabha for each polling booth area. Audit observed that due to the non-formation of Wards Committees, the entire two-tier structure of grassroots participation, including Area Sabhas, was non-existent.
            </Paragraph>
        )},
    ];

    return (
        <div className="space-y-2">
            <Paragraph contentId={`ch4-2-1-intro-p-0`} {...props}>
                The State Election Commission (SEC) is a cornerstone of democratic local self-governance, responsible for ensuring free and fair elections to Urban Local Bodies. This section provides a comprehensive overview of the SEC's structure and functions in Bihar, covering its composition, the process for reservation of seats, the conduct of elections, and the various committees that form the backbone of municipal administration.
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

const StateGovernmentPowers: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (props) => {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const [allowMultiple, setAllowMultiple] = useState(false);

    const handleToggle = (id: string) => {
        setOpenItems(prevOpen => {
            const newOpenItems = new Set(prevOpen);
            if (newOpenItems.has(id)) {
                newOpenItems.delete(id);
            } else {
                if (!allowMultiple) {
                    newOpenItems.clear(); // Close others if not in multiple mode
                }
                newOpenItems.add(id);
            }
            return newOpenItems;
        });
    };

    const handleModeToggle = () => {
        setAllowMultiple(prev => {
            const newMode = !prev;
            // When switching modes, close all panels to avoid confusion
            setOpenItems(new Set());
            return newMode;
        });
    };
    
    const powers = [
        { id: 'ch4-3-1', title: '4.3.1 Power to frame Rules and Regulations', content: 'The State Government may by notification in the Gazette make rules consistent with the BMA, 2007. It also requires approval of State Legislature in this regard (Section 419 of BMA, 2007). As per Section 423 of BMA, 2007 no regulation made by the Municipality under this Act shall have any effect until it has been approved by the State Government and published in the Official Gazette.' },
        { id: 'ch4-3-2', title: '4.3.2 Power to cancel/modify a regulations or decision taken by ULBs', content: 'State Government may suspend the execution of any a regulation or order of ULBs, if in their opinion it is in excess of the powers conferred under BMA, 2007 or any other law, or contrary to the interest of public or is likely to lead to breach of the peace or cause injury and/or annoyance to the public or any class or body of persons (Section 424 of BMA, 2007).' },
        { id: 'ch4-3-3', title: '4.3.3 Power to dissolve ULBs', content: 'The State Government may, by notification, in which the reasons for so doing shall be stated, dissolve an ULB, in case ULB remain incompetent to perform, or persistently makes default in the performance of the duties imposed on it by or under this or any other Act, or exceed or abuse its power after conducting an enquiry by a committee (consisting member of the State Higher Judicial Service – Chairperson, Chief Councillor of any other Municipality, a Chartered Accountant, an Engineer, an officer of state government, not below the rank of Sub-divisional Officer), constituted by the State Government and the ULB concerned has been given a reasonable opportunity of being heard. \n(Section 69 of BMA, 2007).' },
        { id: 'ch4-3-4', title: '4.3.4 Power to sanction Bye-laws', content: 'Section 321 of BMA, 2007 empowers the State Government to frame Building Bye-law for the municipalities. However, the Bye-law made by Municipality is not valid unless and until approved by the State Government. Further, the State Government notified “Model Bihar Municipality Solid Waste Management Bye-laws, 2019” for adoption by the municipalities under section 421 of the BMA, 2007.' },
        { id: 'ch4-3-5', title: '4.3.5 Power for borrowing money', content: 'Section 107 of BMA, 2007 allows Municipal Corporation to borrow money within the limits set by the comprehensive debt limitation policy framed by the State Government. However, there is no specific provision with regard to borrowing power of Municipal Council and Committee in BMA, 2007.' },
        { id: 'ch4-3-6', title: '4.3.6 Power for lease/ sale of property', content: 'As per Section 104 of BMA, 2007 prior approval of the State Government is required for disposal of any movable/immovable property belonging to the Municipality by the Empowered Standing Committee. Municipality may sell, or grant lease of, or otherwise dispose of, by public auction, any movable property, and may grant lease of, or let out on hire, any immovable property, belonging to the Municipality after prior approval of the State Government.' },
        { id: 'ch4-3-7', title: '4.3.7 Power in respect of taxation', content: 'Section 10 of BMA, 2007 allows the State Government to exempt municipal areas from the operation of any of the provisions of BMA, 2007 considered unsuited thereto, which prohibits power of municipality to levy taxes under section 127 of BMA, 2007. \nAs per Section 127(9) The Municipality may revise the rate of tax on Annual Rental Value with the prior approval of the State Government.' },
        { id: 'ch4-3-8', title: '4.3.8 Power to sanction Budgets', content: 'As per Section 84 of BMA, 2007, budget estimates of municipal corporation, Class ‘A’ Municipal Council, Class ‘B and ‘C’ Municipal Council as well as Nagar Panchayat are sanctioned by the State Government, the Director of Local Bodies and the Regional Deputy Director of Local Bodies respectively. \nThe State Government may designate, reduce and re-designate the post of officers of Municipality. Further, appointments of officers for different posts as may be specified by regulations shall be made by the State Government. (Section 36 of BMA, 2007)' },
        { id: 'ch4-3-9', title: '4.3.9 Creation of posts and appointment', content: 'The State Government may designate, reduce and re-designate the post of officers of Municipality. Further, appointments of officers for different posts as may be specified by regulations shall be made by the State Government. (Section 36 of BMA, 2007)' },
    ];
    
    return (
        <>
            <Paragraph contentId="ch4-3-intro" {...props}>
                While the 74th CAA intended to empower ULBs, the State Government retains significant overriding powers through the Bihar Municipal Act, 2007. This section details the specific legal provisions that limit the functional and financial autonomy of ULBs.
            </Paragraph>
             <div className="flex items-center justify-end my-4 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                <label htmlFor="expand-all-toggle-powers" className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Allow multiple panels open
                </label>
                <button
                    id="expand-all-toggle-powers"
                    role="switch"
                    aria-checked={allowMultiple}
                    onClick={handleModeToggle}
                    className={`${allowMultiple ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800`}
                >
                    <span className="sr-only">Allow multiple panels to be open at once</span>
                    <span className={`${allowMultiple ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </button>
            </div>
            <div className="space-y-2">
                {powers.map(power => (
                    <AccordionItem
                        key={power.id}
                        id={power.id}
                        title={power.title}
                        isOpen={openItems.has(power.id)}
                        onToggle={handleToggle}
                    >
                        <div className="text-slate-600 dark:text-slate-300 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                            {power.content}
                        </div>
                    </AccordionItem>
                ))}
            </div>
        </>
    );
};

const MokshadhamCaseStudy: React.FC = () => {
    const FlameIcon: React.FC = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A17.932 17.932 0 0112 2.828a17.932 17.932 0 011.014 1.014C15.5 5.842 16 9 16 11c2 1 2.657 1.657 2.657 2.657a8 8 0 01-1.014 5.014z" />
        </svg>
    );
    const DropletIcon: React.FC = () => (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a5 5 0 01-.88-9.914A5.002 5.002 0 0112 6c1.398 0 2.673.69 3.428 1.75.165.25.31.512.441.782A5.001 5.001 0 0117 16a5 5 0 01-5 5c-1.398 0-2.673-.69-3.428-1.75a4.972 4.972 0 01-.441-.782z" />
        </svg>
    );
    const ArrowIcon: React.FC = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
    );
    const DownArrowIcon: React.FC = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 dark:text-slate-500 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
      </svg>
    );

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 my-4 pdf-avoid-break">
            <h4 className="text-xl font-bold text-teal-600 dark:text-teal-400 text-center mb-2">Case Study: Mokshadham Initiative & Urban Drainage Infrastructure</h4>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">Under the flagship Saat Nischay-2 programme (2020-25)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center">
                        <FlameIcon />
                    </div>
                    <div>
                        <h5 className="font-semibold text-rose-700 dark:text-rose-400">Mokshadham Initiative</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Constructing Electric Crematoriums to modernize burial and cremation services.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center">
                        <DropletIcon />
                    </div>
                    <div>
                        <h5 className="font-semibold text-sky-700 dark:text-sky-400">Urban Drainage Infrastructure</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Addressing chronic waterlogging through integrated stormwater drainage networks.</p>
                    </div>
                </div>
            </div>

            <div className="text-center mb-8">
                 <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Centralized Implementation Model</h5>
                 <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                     <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg shadow-sm">State Plan Fund</div>
                     <DownArrowIcon />
                     <ArrowIcon />
                     <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-lg border-2 border-teal-500 font-bold shadow-md">BUIDCO (Central Agency)</div>
                     <DownArrowIcon />
                     <ArrowIcon />
                     <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg shadow-sm">ULBs (Minimal Involvement)</div>
                 </div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">This model limited local accountability and hindered the autonomy of ULBs, despite the spirit of the 74th CAA.</p>
            </div>

            <div className="mb-6">
                <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">Project Status (as of June 2024)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h6 className="font-semibold text-rose-700 dark:text-rose-400 mb-3">Mokshadham Initiatives</h6>
                        <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                           <li><strong>Estimates (39 ULBs):</strong> ₹23,415.72 lakh</li>
                           <li><strong>Funds Allocated:</strong> ₹7,650.69 lakh</li>
                        </ul>
                        <p className="text-sm font-semibold mt-3">Funds Allocated: 33%</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1 overflow-hidden">
                            <div className="bg-rose-500 h-2.5 rounded-full" style={{width: '33%'}}></div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h6 className="font-semibold text-sky-700 dark:text-sky-400 mb-3">Urban Drainage Infrastructure</h6>
                        <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                           <li><strong>Estimates (12 ULBs):</strong> ₹2,25,199.54 lakh</li>
                           <li><strong>Funds Allocated:</strong> ₹1,05,040.90 lakh</li>
                        </ul>
                        <p className="text-sm font-semibold mt-3">Funds Allocated: 48%</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1 overflow-hidden">
                            <div className="bg-sky-500 h-2.5 rounded-full" style={{width: '48%'}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">The centralized model has hindered the effective devolution of powers, functions, and financial resources to ULBs. The state must strengthen institutional capacities of ULBs to realize truly decentralized and responsive urban governance.</p>
            </div>
        </div>
    );
};

const ParastatalsAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (props) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    const sections = [
        { 
            id: 'ch4-4-1', 
            title: '4.4.1 Bihar Urban Infrastructure Development Corporation (BUIDCO)', 
            content: (
                <>
                    <Paragraph contentId="ch4-4-1-p-0" {...props}>
                        BMA,2007 mandated functions to ULBs include river bank development under section 47, commercial projects including bus terminals under section 165, water supply under section 169, bus stops under section 242 and drainage and sewage management under section 193 & 194.
                    </Paragraph>
                    <Paragraph contentId="ch4-4-1-p-1" {...props}>
                        <p>In line with efforts to accelerate urban infrastructure development, the State government established the Bihar Urban Infrastructure Development Corporation Ltd. (BUIDCO) on 16th June 2009. As a wholly government owned entity, BUIDCO was designated as the state’s flagship agency to implement and oversee major urban infrastructure projects such as water supply systems, sewerage networks, storm water drainage, and other civic infrastructure amenities.</p>
                        <p className="mt-4">Nonetheless, BUIDCO’s governing body did not include any representation from ULBs, thereby limited the involvement in decision making processes of urban development and undermined ULBs autonomy. Additionally, there was significant overlap of several core urban functions between ULBs and parastatal agencies, limiting the ability of ULBs to independently manage and govern urban services.</p>
                    </Paragraph>
                    <Paragraph contentId="ch4-4-1-p-case-study" {...props} className="!p-0 !bg-transparent !dark:bg-transparent !shadow-none !border-none dark:!shadow-none !hover:shadow-none">
                       <MokshadhamCaseStudy />
                    </Paragraph>
                </>
            )
        },
        { 
            id: 'ch4-4-2', 
            title: '4.4.2 Bihar Urban Development Agency (BUDA)', 
            content: (
                 <>
                    <Paragraph contentId="ch4-4-2-p-0" {...props}>
                        Bihar Urban Development Agency (BUDA) is a State Level Nodal Agency registered under Societies Registration Act, 1860 under the aegis of UD&HD, GoB. Its main objectives are to formulate & suggest the State Government, various policy options for the alleviation of urban poverty, to advise the state Government on preparation of guidelines for the identification of urban poor, non-agricultural labourers, migrant labourers, educated unemployed and artisans in the urban areas, to recommend various plans and schemes for economic, social, cultural and environmental improvements of the identified beneficiaries living in the urban areas or in their peripheries, to channelize funds from Government of India, State Govt. scheduled Banks, financial institution & other sources for ULBs for implementation of the schemes meant for alleviation of urban poverty and for providing Urban Basic Service & environment improvement in the urban areas.
                    </Paragraph>
                    <Paragraph contentId="ch4-4-2-p-1" {...props}>
                        It was observed that the grants released by the Department for implementation of various schemes were transferred to various accounts of BUDA. Thereafter, BUDA transferred the amount to the implementing agency of the scheme or to the urban local bodies. The amount of 40 schemes such as water supply, Housing for All, Master Plan, Smart City, Atal Mission for Rejuvenation and Urban Transformation, Swachh Bharat Mission, Central Finance Commission (CFC) grants etc. was being transferred by BUDA through a total of 77 bank accounts. It was further observed that BUDA did not transfer the central grants to ULBs timely and resultantly, central sponsored schemes were not completed on time. Hence, ULBs did not deliver benefits of these services to their citizens on time. BUDA had parked the amount of closed schemes and amount was not refunded in the concerned head after several directions of Finance Department, GoB.
                    </Paragraph>
                    <Paragraph contentId="ch4-4-2-p-2" {...props}>
                        The Department replied that BUDA always transfer the central grants to ULBs timely. Sometimes in rare cases delay occurs due to some circumstantial reason and long procedure of transferring fund from BUDA to concern ULB's. The reply was not tenable as none of the instalment of CFC grants was released to ULBs within timelines during 2021-22 to 2023-24 (dealt in para 6.1.1.5).
                    </Paragraph>
                </>
            )
        },
        { 
            id: 'ch4-4-3', 
            title: '4.4.3 Patna Metropolitan Area Authority', 
            content: (
                 <>
                    <Paragraph contentId="ch4-4-3-p-0" {...props}>
                        Patna Planning area was specified as Patna Metropolitan Area and Patna Metropolitan Planning Committee was constituted. Patna Metropolitan Area Authority has been constituted for the purpose of implementing Patna Master Plan, 2031 in exercise of the powers conferred by sections 11 of the BUPD Act 2012 read with rule 11 of BUPD Rule, 2014.
                    </Paragraph>
                     <Paragraph contentId="ch4-4-3-p-1" {...props}>
                        The main function undertaken by Patna Metropolitan Area Authority is to approve/ issue NOC for Building Map/Layout under Development Control Regulation, preparation and implementation of Zonal Development Plan, Area Development Scheme for Patna Metropolitan Area in accordance with Patna Master Plan, 2031, construction of affordable housing project under Economically Weaker Section/Low-Income Group scheme etc.
                    </Paragraph>
                    <Paragraph contentId="ch4-4-3-p-2" {...props}>
                        There was no role of ULBs in planning and execution of Patna Master Plan, 2031 and partial role in implementation of various policies, regulation and initiatives in Metropolitan Area, which was against the spirit of 74th CAA as BMA, 2007 stipulates function of urban planning including town planning, regulation of land use, sustainable and inclusive growth of urban areas to ULBs.
                    </Paragraph>
                    <Paragraph contentId="ch4-4-3-p-3" {...props}>
                        Thus, the existence of parastatals significantly eroded the autonomy of the ULBs in the implementation of functions such as urban planning, slum improvement, water supply storm water drainage systems, construction of Nali-Gali and economic, social, cultural & environmental improvements of the identified beneficiaries living in the urban areas.
                    </Paragraph>
                </>
            )
        },
    ];

    return (
        <div className="space-y-2">
            <Paragraph contentId={`ch4-4-intro-p-0`} {...props}>
                The objective of the 74th CAA was to entrust delivery of major civic functions to ULBs. The various departments of the State Government are delivering core civic functions such as urban planning, regulation of land use, water supply and sewerage and public health. Further, functions such as development of urban infrastructure/amenities, urban planning for metropolitan, poverty alleviation, affordable housing, slum improvement and promotion of cultural activities are being delivered by parastatals. The role of parastatals and their impact on the devolved functions is discussed in the subsequent paragraphs.
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
const Chapter4StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
    const DevolutionIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
    const GavelIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.707 21.707L15.536 17.536M6.343 8.343l1.414-1.414m1.414 1.414l-1.414 1.414M3 21l6-6" /></svg>);
    const BuildingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<DevolutionIcon />} title="Status of Devolution" linkId="ch4-1" onItemClick={onItemClick}>
          <p>The state devolved 17 out of 18 functions, but ULB autonomy is restricted by the state's overriding powers.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<GavelIcon />} title="Institutional Weaknesses" linkId="ch4-2" onItemClick={onItemClick}>
          <p>Key committees like DPCs are not formed, and ESC meetings are irregular, hindering effective local governance and planning.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<BuildingIcon />} title="Role of Parastatals" linkId="ch4-4" onItemClick={onItemClick}>
          <p>Agencies like BUIDCO perform functions similar to ULBs, creating overlapping jurisdictions and weakening local autonomy.</p>
      </InfoCard>
    </div>
  );
};


const Chapter4: React.FC<ChapterProps> = (props) => {
    const { activeItem, onItemClick } = props;
    
    switch(activeItem) {
        case 'ch4-devolution':
            return (
                <SummaryBox>
                    Institutional weaknesses such as delayed elections, irregular meetings, and non-formation of key municipal committees had significantly undermined the effective empowerment and functioning of ULBs. The State Government devolved 17 out of 18 functions, however, the autonomy was restricted through overriding powers of the State Government. Further, DPC which has to prepare draft development plan for the District as a whole, were not constituted in 23 districts out of 38 districts of the State. Existence of parastatal bodies in performing functions similar to that of ULBs also weakened the role of ULBs.
                </SummaryBox>
            );
        case 'ch4-1':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>As per Article 243W of the Constitution, the State Legislature may, by law, endow the Municipalities with such powers and authority as may be necessary to enable them to function as institutions of Self-Government. The Twelfth Schedule lists 18 functions that may be entrusted to ULBs.</Paragraph>
                    <PaginatedTable />
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>The State Government had devolved 17 out of 18 functions listed in the 12th Schedule of the Constitution of India. Audit observed that the Fire Services function was not devolved to ULBs and this function remained with the Home (Police) Department. The autonomy of ULBs was restricted as the State Government had retained overriding powers, as discussed in paragraph 4.3.</Paragraph>
                </>
            );
        case 'ch4-2': { // Institutional mechanism
            const menuItem = findMenuItem(activeItem);
            if (!menuItem || !menuItem.children) return null;
            const childItems = menuItem.children.map(child => child.label);
            const childIds = menuItem.children.map(child => child.id);

            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        For the effective implementation of the 74th Constitutional Amendment Act, a robust institutional framework is essential. This section examines the key mechanisms established in Bihar to support urban local governance. It assesses the functioning of the State Election Commission, the role of District and Metropolitan Planning Committees in decentralized planning, and other bodies designed to empower ULBs.
                    </Paragraph>
                    <SubTitle contentId={`${activeItem}-st-0`} {...props}>Explore Sub-sections</SubTitle>
                    <BulletList
                        items={childItems}
                        itemIds={childIds}
                        onItemClick={onItemClick}
                    />
                </>
            );
        }
        case 'ch4-2-1':
            return <StateElectionCommissionAccordion {...props} />;
        case 'ch4-2-2':
             return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>As per Article 243ZD of the Constitution, every State shall constitute at the district level, a District Planning Committee (DPC) to consolidate the plans prepared by the Panchayats and the Municipalities in the district and to prepare a draft development plan for the district as a whole. Audit observed that DPCs were not constituted in 23 out of 38 districts of the State. This non-constitution hampered the consolidation of rural and urban plans at the district level, undermining the objective of decentralized planning.</Paragraph>
                    <Recommendation title="Recommendation 5:">
                        The State Government should take immediate steps for constitution of DPCs in all the districts and ensure their proper functioning.
                    </Recommendation>
                </>
            );
        case 'ch4-2-3':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        Article 243ZE of the Constitution and Section 291 of the Bihar Municipal Act, 2007, mandate the constitution of a Metropolitan Planning Committee (MPC) in every metropolitan area with a population of 10 lakh (one million) or more. The MPC is responsible for preparing a draft development plan for the entire metropolitan region, ensuring integrated development across multiple municipalities and panchayats.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>
                        In Bihar, Patna is the only city that qualifies as a metropolitan area. The audit observed that despite the clear constitutional and statutory requirements, the Metropolitan Planning Committee for Patna had not been constituted by the State Government as of March 2024.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-2`} {...props}>
                        The non-constitution of the MPC has significant implications. It prevents the creation of a comprehensive and integrated development plan for the Patna metropolitan region, leading to fragmented and uncoordinated planning efforts between the Patna Municipal Corporation and the surrounding local bodies. This undermines the objective of planned development for large urban agglomerations.
                    </Paragraph>
                    <Recommendation title="Recommendation 6:">
                        The State Government should take immediate action to constitute the Metropolitan Planning Committee for the Patna metropolitan area and ensure it is provided with the necessary resources to function effectively as envisioned in the Constitution.
                    </Recommendation>
                </>
            );
        case 'ch4-2-4':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        Section 136(A) of the Bihar Municipal Act (BMA), 2007 provides for the constitution of a Property Tax Board by the State Government. The Board is intended to provide technical guidance and support to Urban Local Bodies (ULBs) in the assessment and valuation of properties for taxation purposes. Its key functions include formulating a uniform valuation methodology, assisting in the preparation of assessment lists, and acting as an appellate authority for resolving disputes related to property tax.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>
                        The audit observed that despite the provision in the BMA, 2007, the State Government has not constituted the Property Tax Board as of March 2024. Furthermore, the necessary rules and regulations for the functioning of the Board have not yet been framed.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-2`} {...props}>
                        The absence of the Property Tax Board has resulted in a lack of uniformity and professionalism in the property tax administration across different ULBs. Most ULBs continue to rely on outdated and inconsistent methods for property assessment, which often leads to undervaluation, revenue leakages, and a high number of disputes from property owners. This significantly hampers the ability of ULBs to mobilize their own financial resources, a key objective of the 74th Constitutional Amendment Act.
                    </Paragraph>
                    <Recommendation title="Recommendation 7:">
                        The State Government should constitute the Property Tax Board and frame the necessary rules for its functioning without further delay to ensure a scientific, uniform, and transparent system of property tax administration, thereby strengthening the financial base of ULBs.
                    </Recommendation>
                </>
            );
        case 'ch4-3':
            return <StateGovernmentPowers {...props} />;
        case 'ch4-4':
             return <ParastatalsAccordion {...props} />;
        case 'chapter-4':
        default:
            const handleItemClick = onItemClick || (() => {});
            return (
                <>
                    <ChapterSummaryDashboard 
                        className={props.className}
                        onItemClick={handleItemClick}
                        stats={[
                            { value: '17/18', label: 'Functions Devolved', id: 'ch4-1' },
                            { value: '76%', label: 'Avg. ESC Meeting Shortfall', id: 'ch4-2-1-6' },
                            { value: '60%', label: 'DPCs Not Formed (23/38)', id: 'ch4-2-2' },
                            { value: '100%', label: 'Wards Committees Not Formed', id: 'ch4-2-1-11' }
                        ]}
                        findings={[
                            { text: "Devolution of functions is incomplete, with Fire Services still held by the state.", id: 'ch4-1' },
                            { text: "Key institutional mechanisms like ESCs and DPCs are non-functional or not formed.", id: 'ch4-2' },
                            { text: "State Government retains significant overriding powers, limiting ULB autonomy.", id: 'ch4-3' },
                            { text: "Parastatal bodies create overlapping jurisdictions, weakening ULBs.", id: 'ch4-4' }
                        ]}
                        chart={<ProgressChart
                            title="Shortfall in Empowered Standing Committee Meetings"
                            data={{ held: 14, total: 60, label: 'Meetings' }}
                            linkId='ch4-2-1-6'
                        />}
                    />

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                           This infographic illustrates the key areas where the devolution of power to ULBs has fallen short.
                        </p>
                        <Chapter4StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This mind map connects the central theme of devolution to its various components, from functional transfer to institutional failures.
                        </p>
                        <Chapter4MindMap onItemClick={handleItemClick} />
                    </div>
                </>
            );
    }
};

export default Chapter4;