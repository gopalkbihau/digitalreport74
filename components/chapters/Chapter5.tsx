import React, { useState } from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, SummaryBox, Paragraph, RecommendationsList, SubTitle, Table, Recommendation, BulletList, Chapter5MindMap } from '../ContentElements';
import { DonutChart, VacancyRangeIndicator, FlowChart } from '../Charts';
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

const RecruitmentAccordion: React.FC<Omit<ChapterProps, 'activeItem' | 'onItemClick'>> = (props) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    const sections = [
        { id: 'ch5-2-1', title: '5.2.1 Shortage of human resources', content: (
            <>
                <Paragraph contentId={`ch5-2-1-p-0`} {...props}>
                    UD&HD in line with the spirit of the 74th CAA, restructured the posts under the ULBs across three tiers – Municipal Corporations, Municipal Councils and Nagar Panchayats through three different resolutions issued during May 2018 to March 2021. Under these resolutions, a total of 12,563 posts across 70 cadres were sanctioned, as detailed in Table 5.4 below.
                </Paragraph>
                <Table
                    headers={["Category of ULBs", "Resolution No. 2503 (03.05.2018)", "Resolution No. 1435 (05.03.2019)", "Resolution No. 1526 (31.03.2021)", "Total Posts Sanctioned"]}
                    data={[
                        ["Municipal Corporations", 525, 2920, 926, 4371],
                        ["Municipal Councils", 782, 2074, 1665, 4521],
                        ["Nagar Panchayats", 1105, 819, 1747, 3671],
                        [<strong>Total</strong>, <strong>2412</strong>, <strong>5813</strong>, <strong>4338</strong>, <strong>12563</strong>],
                    ]}
                    caption="Table 5.4: Statement showing sanctioned strength for different categories of ULBs"
                />
                <Paragraph contentId={`ch5-2-1-p-1`} {...props}>
                    Further, UD&HD informed that a total 13,423 posts were sanctioned under the Department and out of these 12,411 posts (92 per cent) were vacant (August 2025). Process of appointment against sanctioned posts was very slow and appointment was made against only four types of posts during 2020-24. Posts were vacant due to different reasons viz. posts covered by Hon’ble court, promotional posts, finalization of rule formation and external service.
                </Paragraph>
                 <DonutChart
                    title="Overall Vacancy Distribution in Test-Checked ULBs"
                    data={[
                        { label: 'Vacant', value: 94, color: 'rgb(100 116 139)' }, // slate-500
                        { label: 'Filled', value: 6, color: 'rgb(20 184 166)' }, // teal-500
                    ]}
                />
                <Paragraph contentId={`ch5-2-1-p-2`} {...props}>
                    These observations indicate that a severe and persistent shortage of human resources existed in ULBs across the State, impacting their ability to deliver devolved municipal functions effectively.
                </Paragraph>
            </>
        )},
        { id: 'ch5-2-2', title: '5.2.2 Executive head of ULBs', content: (
            <>
                <Paragraph contentId={`ch5-2-2-p-0`} {...props}>
                    As per section 27 B of the BMA (Amendment), 2011, the Chief Municipal Officer is the Principal Executive Officer of the Municipality and all officers and other employees of the Municipality are to be subordinated to him. He is responsible for the day-to-day administration and implementation of municipal policies and directives issued by ESC/municipal board/Department.
                </Paragraph>
                <Paragraph contentId={`ch5-2-2-p-1`} {...props}>
                    Audit observed that 64 posts (25 per cent) were remained vacant out of total sanctioned strength of 258 at state level and requisition for appointment of 59 posts was sent to the Bihar Public Service Commission in September 2024. But, appointment procedure was under process and these posts were vacant up to July 2025. Thus, shortage of Executive Officers impacted the devolution of funds, functions and functionaries of the municipality.
                </Paragraph>
            </>
        )},
        { id: 'ch5-2-3', title: '5.2.3 Shortage of manpower in engineering/architect cadre', content: (
             <>
                <Paragraph contentId={`ch5-2-3-p-0`} {...props}>
                    Proper and timely execution of all development works and proper maintenance of all urban infrastructures depend upon the availability of technical staff. Audit observed that against a sanctioned strength of 1248 posts in the engineering/architect cadre, 878 posts (70 per cent) were vacant.
                </Paragraph>
                 <Table
                    headers={["Service/Cadre", "Designation", "Sanctioned", "In Position", "Vacant", "Status (July 2025)"]}
                    data={[
                        ["Bihar Subordinate Eng. Cadre", "Junior Engineer (Civil)", 562, 50, 512, "Requisition for 512 posts sent to BTSC."],
                        ["Bihar Subordinate Eng. Cadre", "Junior Engineer (Mechanical)", 70, 0, 70, "Service of 46 JE (Mech) & 12 JE (Elec) received from other departments."],
                        ["Bihar Subordinate Eng. Cadre", "Junior Engineer (Electrical)", 50, 0, 50, " "],
                        ["Bihar Architecture Service Cadre", "Associate Architect", 11, 0, 11, "Promotional post."],
                        ["Bihar Architecture Service Cadre", "Assistant Town Planner", 35, 0, 35, "Requisition sent to BPSC."],
                        ["Bihar Architecture Service Cadre", "Assistant Architect", 56, 0, 56, " "],
                        ["Bihar Architecture Service Cadre", "Assistant Town Planning Supervisor", 113, 77, 36, " "],
                        ["Bihar Engineering Service Cadre", "Assistant Engineer (Civil)", 277, 192, 85, "Requisition sent to BPSC."],
                        ["Bihar Engineering Service Cadre", "Assistant Engineer (Mechanical)", 68, 51, 17, " "],
                        ["Bihar Engineering Service Cadre", "Assistant Engineer (Electrical)", 6, 0, 6, " "],
                        [<strong>Total</strong>, "", <strong>1248</strong>, <strong>370</strong>, <strong>878</strong>, ""],
                    ]}
                    caption="Table 5.5: Status of engineering/architect posts"
                    rowHeaderColumnIndex={0}
                />
                 <Paragraph contentId={`ch5-2-3-p-1`} {...props}>
                    It indicated that due to unavailability of technical staff at the state level, ULBs were dependent on technical staff of other department or contractual staff to perform their duties. The Department replied (August 2025) that recruitment to fill the post of Engineers, Assistant Town Planner and Assistant Town Panning Supervisor was under process, while for the post of Assistant Architect recommendation has been received for appointment and after training they will be posted in ULBs.
                </Paragraph>
            </>
        )},
        { id: 'ch5-2-4', title: '5.2.4 Deficiency of staff in Revenue services', content: (
            <>
                <Paragraph contentId={`ch5-2-4-p-0`} {...props}>
                    For timely and proper assessment of all buildings and lands to property tax and to ensure collection of taxes and non-taxes, availability of staff of revenue services is imperative. However, Audit observed that 796 posts of various revenue cadre were sanctioned at the State level, but all these posts were vacant. Further, it was also observed that in test-checked ULBs, overall 91 per cent posts of revenue cadre were vacant.
                </Paragraph>
                <Table
                    headers={["Name of Post", "N. Nigam (SS/PIP)", "N. Parishad (SS/PIP)", "N. Panchayat (SS/PIP)", "Total (SS/PIP)"]}
                    data={[
                        ["Additional Chief Revenue & Accounts Officer", "9 / 0", "9 / 0", "0 / 0", "18 / 0"],
                        ["Asst. Revenue & Accounts Officer", "18 / 1", "9 / 0", "8 / 0", "35 / 1"],
                        ["Revenue Inspector", "94 / 15", "22 / 2", "11 / 0", "127 / 17"],
                        ["Amin", "27 / 1", "18 / 0", "8 / 0", "53 / 1"],
                        ["UDC", "9 / 1", "9 / 0", "8 / 0", "26 / 1"],
                        ["LDC", "27 / 5", "18 / 3", "16 / 0", "61 / 8"],
                        [<strong>Total</strong>, <strong>184 / 23</strong>, <strong>85 / 5</strong>, <strong>51 / 0</strong>, <strong>320 / 28</strong>],
                    ]}
                    caption="Table 5.6: Status of manpower in test-checked ULBs under Revenue Services (SS: Sanctioned Strength, PIP: Person in Position)"
                    rowHeaderColumnIndex={0}
                />
                <Paragraph contentId={`ch5-2-4-p-1`} {...props}>
                    Thus, acute shortage of manpower in Revenue services impacted the ability of ULBs to assess, levy and collect own revenues both (tax and non-tax) efficiently. As a result, the financial viability and resource mobilisation capacity of ULBs remained significantly constrained.
                </Paragraph>
            </>
        )},
        { id: 'ch5-2-5', title: '5.2.5 Insufficient staff for sanitation activities', content: (
             <>
                <Paragraph contentId={`ch5-2-5-p-0`} {...props}>
                    As per Municipal Solid Waste Management Manual, 2016, sufficient sanitation staff is essential to keep the city/town clean. Audit observed that in test-checked ULBs, overall 97 per cent of sanctioned posts related to sanitation activities were vacant as of March 2024.
                </Paragraph>
                 <Table
                    headers={["Name of Post", "N. Nigam (SS/PIP)", "N. Parishad (SS/PIP)", "N. Panchayat (SS/PIP)", "Total (SS/PIP)"]}
                    data={[
                        ["Public Sanitation & Waste Management officer", "9 / 0", "9 / 0", "0 / 0", "18 / 0"],
                        ["Asst. Public Sanitation & Waste Management officer", "18 / 16", "9 / 9", "8 / 8", "35 / 33"],
                        ["Chief Sanitary Inspector", "18 / 0", "9 / 1", "0 / 0", "27 / 1"],
                        ["Sanitary Inspector", "430 / 5", "83 / 0", "21 / 0", "534 / 5"],
                        ["Safai Jamadar", "1,290 / 22", "246 / 5", "63 / 1", "1,599 / 28"],
                        ["UDC", "0 / 0", "9 / 0", "0 / 0", "9 / 0"],
                        ["LDC", "27 / 0", "18 / 0", "16 / 0", "61 / 0"],
                        [<strong>Total</strong>, <strong>1,792 / 43</strong>, <strong>383 / 15</strong>, <strong>108 / 9</strong>, <strong>2,283 / 67</strong>],
                    ]}
                    caption="Table 5.7: Sanctioned strength and persons in position for Sanitation activities (SS: Sanctioned Strength, PIP: Person in Position)"
                    rowHeaderColumnIndex={0}
                />
                 <Paragraph contentId={`ch5-2-5-p-1`} {...props}>
                    Thus, insufficiency of manpower of sanitation activities led to non-achievement of Service Level Benchmark (SLB) of Solid Waste Management (SWM) and sewerage.
                </Paragraph>
            </>
        )},
        { id: 'ch5-2-6', title: '5.2.6 Assessment of human resources', content: (
            <>
                <Paragraph contentId={`ch5-2-6-p-0`} {...props}>
                    The assessment of manpower should be based on the functions undertaken by ULBs with a view that majority of the functions which are service oriented have to be discharged within a reasonable time period. This assessment could be done best by ULBs themselves considering various criteria such as the extent of geographical area to be covered, the extent and type of population, the number of properties existing etc.
                </Paragraph>
                <Paragraph contentId={`ch5-2-6-p-1`} {...props}>
                    As per provisions of Section 37 of BMA, 2007 the municipalities were authorised to assess the requirement of manpower for performing their duties. Audit observed that none of the test-checked ULBs had assessed the requirement of manpower during the period 2019-20 to 2023-24.
                </Paragraph>
            </>
        )},
    ];

    return (
        <div className="space-y-2">
             <Paragraph contentId={`ch5-2-intro-p-0`} {...props}>
                In accordance with the Acts and the Rules governing municipal services, the State Government regulates the method of recruitment, conditions of service, pay and allowance, discipline and conduct of staff and officers of ULBs. Various Services/Recruitment Rules list out the Appointing /Cadre Controlling Authorities for various municipal posts as indicated below.
            </Paragraph>
             <Table
                headers={["Various posts", "Cadre Controlling Authority"]}
                data={[
                    ["Assistant Revenue & Accounts Officer, Revenue and Accounts Officer, Additional Chief Revenue and Accounts Officer", <div><p><strong>Appointing Authority:</strong> Director, Directorate of Municipal Administration, UD&HD</p><p><strong>Cadre Controlling Authority:</strong> Principal Secretary/Secretary, UD&HD</p></div>],
                    ["Municipal Executive Officer, Secretary of Authority, Municipal Secretary, Dy. Municipal Commissioner, Project Officer cum Dy. Director, etc.", <div><p><strong>Appointing Authority:</strong> Governor of Bihar</p><p><strong>Cadre Controlling Authority:</strong> Principal Secretary/Secretary, UD&HD</p></div>],
                    ["Assistant Public Sanitary and Waste Management Officer, Dy. Public Sanitary and Waste Management Officer, Public Sanitary and Waste Management Officer", <div><p><strong>Appointing Authority:</strong> Director, Directorate of Municipal Administration, UD&HD</p><p><strong>Cadre Controlling Authority:</strong> Principal Secretary/Secretary, UD&HD</p></div>],
                    ["City Manager", <div><p><strong>Appointing Authority:</strong> Director, Directorate of Municipal Administration, UD&HD</p><p><strong>Cadre Controlling Authority:</strong> Director, Directorate of Municipal Administration, UD&HD</p></div>],
                    ["Lower Division Clerk, Higher Division Clerk, Head Clerk", <div><p><strong>Appointing Authority:</strong> Director, Directorate of Municipal Administration, UD&HD</p><p><strong>Cadre Controlling Authority:</strong> Director, Directorate of Municipal Administration, UD&HD</p></div>],
                    ["Junior Engineer", <div><p><strong>Appointing Authority:</strong> Engineer in chief, Any other officer authorised for this purpose by the UD&HD</p></div>],
                    ["Assistant Town Planning Supervisor, Dy. Town Planning Supervisor", <div><p><strong>Appointing Authority:</strong> UD&HD</p></div>],
                ]}
                caption="Table 5.3: Statement showing the Appointing/Cadre controlling authorities for recruitment"
                rowHeaderColumnIndex={0}
            />
            <FlowChart title="Chart 5.1: Flow chart of recruitment process through BPSC/BSSC/BTSC" />

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
const Chapter5StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
    const HRIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
    const ChartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
    const BrainIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.705 11A8.001 8.001 0 0121.055 11" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 01-8.32-5.753" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.32-5.753" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-3.333 0-6 2.686-6 6v3a6 6 0 006 6h0a6 6 0 006-6v-3c0-3.314-2.667-6-6-6z" /></svg>);
    
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<HRIcon />} title="Limited Powers" linkId="ch5-1" onItemClick={onItemClick}>
          <p>ULBs lack authority over their own human resources, with the State Government controlling recruitment, transfers, and service conditions.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<ChartIcon />} title="Severe Staff Shortages" linkId="ch5-2" onItemClick={onItemClick}>
          <p>A centralized and slow recruitment process has led to critical vacancies, with an overall shortage of <strong className="font-bold text-rose-600 dark:text-rose-400">92%</strong> across test-checked ULBs.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<BrainIcon />} title="Lack of Capacity Building" linkId="ch5-4" onItemClick={onItemClick}>
          <p>There is no structured mechanism for training and skill development for municipal staff, hindering their ability to perform effectively.</p>
      </InfoCard>
    </div>
  );
};


const Chapter5: React.FC<ChapterProps> = (props) => {
    const { activeItem, onItemClick } = props;
   
    switch(activeItem) {
        case 'ch5-hr':
            return (
                <SummaryBox>
                    ULBs had limited control over human resources. There were huge shortages of human resources including technical staff in ULBs. There was no structured mechanism in place for capacity building of the various cadres. This adversely affected their operational efficiency and service delivery.
                </SummaryBox>
            );
        case 'ch5-1':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        Availability of adequate and qualified manpower is paramount to ensure discharge of municipal functions. The devolved functions can be carried out effectively by ULBs only when they are supported with sufficient manpower and have control over recruitment of human resources. Further, adequate devolution of functionaries could in turn improve the collection of own revenue, utilisation of devolved funds and carrying out the functions to the extent of which they were devolved.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>
                        In the light of the provisions and spirit of the 74th CAA and the BMA. 2007 enacted by the State Government, the ULBs in the State have been given the responsibility to perform extensive and many important functions and responsibilities. For proper discharge of the functions and responsibilities of the ULBs, the Department had created various types of posts. The broad framework of functions carried out by ULBs is depicted in Table 5.1.
                    </Paragraph>
                    <Table
                        headers={["Sr. No.", "Wing/sections", "Section of the BMA", "Functions"]}
                        data={[
                            ["1.", "Administration", "Section 36 to 41", "Proper discharge of the functions and responsibilities assigned to the municipal bodies such as their implementation, supervision and monitoring."],
                            ["2.", "Sanitation and Solid Waste Management", "Section 45 and 220 to 230", "Solid and liquid waste management along with sanitation is an important task of all municipal bodies."],
                            ["3.", "Welfare and Registration", "Section 47(5) and 349 to 360", "Issuing certificates in various matters from birth/death certificate in the municipal bodies from time to time and proper discharge of works done for the welfare of the citizens of the municipal bodies."],
                            ["4.", "Revenue and Accounts", "Section 126 to 144", "Proper revenue collection and maintenance, assessment and collection of various taxes, rent, advertisements and other property related activities."],
                            ["5.", "Town Planning", "Section 47 (1) and 312 to 341", "Proper arrangements for construction and map approval etc. in accordance with the rules and regulations established in the municipal bodies."],
                            ["6.", "Planning", "Section 45 and 292 to 311", "Proper monitoring of central/state sponsored schemes that are implemented in the municipal bodies."],
                            ["7.", "Health", "Section 47 (3) and 250 to 261", "To provide basic civic amenities to the public viz. keeping the cleanliness and hygiene of the municipal bodies."],
                            ["8.", "Enforcement and Vigilance", "Section 429 to 440", "Enforcement and monitoring of unnecessary difficulties faced by the people living in the municipal bodies viz. encroachment."],
                        ]}
                        caption="Table 5.1: Broad framework of functions carried out by ULBs"
                        rowHeaderColumnIndex={0}
                    />
                     <Paragraph contentId={`${activeItem}-p-2`} {...props}>
                        The constitution of municipal services and assessment of manpower should be based on the functions undertaken by ULBs with a view that majority of the functions which are service oriented have to be discharged within a reasonable time period. This assessment could best be done by ULBs themselves considering various criteria such as the extent of geographical area to be covered, the extent of population, the number of properties existing, etc.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-3`} {...props}>
                        Audit observed that ULBs did not have authority to constitute municipal services, to determine the strength of the Municipal Services so constituted or to recruit the required staff. As per Section 38 of Bihar Municipal Act 2007, these powers are vested with the State Government. The State Government has the power to make rules relating to recruitment, pay, transfer and other conditions of service of persons appointed to the said Services. ULBs were dependent upon State Grants for payment of salary of their staff. State Government sanctions grant under different heads for payment of salary of Municipal Commissioner/ Executive Officers/City Managers/Town Planner/ Assistant Public Sanitary and Waste Management Officer etc. The salary of contractual staff was paid through municipal fund. Further, Rules framed under State Municipal Acts allow the State Government/appointing authority to transfer any officer of a municipality to another municipality or local authority or any Government department. Performance appraisal of key functionaries of Municipal Bodies is vested with the State Level administrative authorities.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-4`} {...props}>
                        The status of exercising power in respect of executive functionaries provided to the ULBs in the State is given in the Table 5.2. The details in respect of the powers of executive functionaries are discussed in subsequent paragraphs.
                    </Paragraph>
                     <Table
                        headers={["Activities relating to functionaries", "Authorities exercising the power in respect of functionaries", "Remarks"]}
                        data={[
                            [<div><p>Creation of municipal services</p><p className="mt-2">Making rules relating to recruitment, pay, transfer and other conditions of service of persons appointed to the municipal Services and revision thereof</p></div>, "State Government", "Provision has been made under article 36 (1) of Bihar Municipal Act 2007 for various posts in ULBs of Bihar. As per Section 43 (1) of Bihar Municipal Act 2007, the State Govt. has authority to create service rules. However, service rules for only few of the posts have been made by the UD&HD."],
                            ["Grouping of municipal services in order to define rank and responsibilities", "State Government", "No clear classification of the post of municipal services except the posts created/defined through the above-mentioned service rules as mentioned in footnote."],
                            ["Providing sanctioned strength to the posts of municipal services", "State Government", "Sanctioned strength for the newly/upgraded municipalities as well as already existed is decided as per provision made under article 36 (1) of Bihar Municipal Act 2007."],
                            ["Selection and Recruitment to the posts of municipal services", "Bihar Public Service Commission (BPSC) and Bihar Staff Selection Commission (BSSC) or any other authority that the Government may nominate", "UD&HD requisitioned to BPSC and BSSC for selection of newly created posts. Appointing authorities make recruitment on the basis of recommendation by BPSC and BSSC."],
                            ["Deployment of executive head and staffs including engaging through outsourcing", "State Government, Secretary, UD&HD,", "ULBs have been empowered by UD&HD to recruit outsourcing staff vide letter No.3453 dated 29.06.2018."],
                            ["Power to impose penalty and an appeal against any order imposing penalty on any officer or employee", "State Government, Secretary, UD&HD", "The concerned appointing authorities to the posts of municipal services are empowered to impose penalty. Appointing authorities for some important posts are discussed in subsequent paragraphs."],
                            ["Power to transfer any officer or employee within/outside municipalities", "State Government, Secretary, UD&HD (Appointing Authority)", "Appointing Authority to the posts of municipal services are State Government, Secretary, UD&HD and Municipal Commissioner/Municipal Executive Officer (for the staff recruited by the concerned ULBs) as detailed in Table 5.3"],
                            ["Annual Confidential Report (ACR) of Executive Head of Municipalities", "", <div><p>In case of Municipal Commissioner (IAS):-</p><ol className='list-decimal pl-5'><li>Reporting Officer- Pr. Secretary, UD&HD, Bihar</li><li>Reviewing Officer- Minister in charge of the Dept.</li><li>Accepting Officer- Chief Minister</li></ol><p className='mt-2'>In case of employee of Bihar Municipal Services and Departmental Cadre Executive Officers:-</p><ol start={4} className='list-decimal pl-5'><li>Reporting Officer- District Magistrate</li><li>Reviewing Officer- Secretary/Pr. Secretary</li><li>Accepting Officer- Minister in charge of the Dept.</li></ol><p className='mt-2'>In case of other officers from Bihar Administrative Services (other than executive Officers):-</p><ol start={7} className='list-decimal pl-5'><li>Reporting Officer- Municipal Commissioner</li><li>Reviewing Officer- Secretary/Pr. Secretary</li><li>Accepting Officer- Minister in charge of the Dept.</li></ol></div>],
                            ["Provisions for capacity building in Acts/Rules", "Provisions not made in Acts/Rules.", "Both the State Municipal Acts and Rules mentioned above are silent about Capacity Building. As per recommendation No.9.6.5 of 5th SFC, Bihar, funds received as grants had to be utilised for capacity building in addition to the other work."],
                            ["Budgetary provisions for capacity building", "UD&HD and ULBs", "No such information was provided by the UD&HD as detailed in para 5.3, However, budget provisions were not made by ULBs."],
                            ["Induction Training/ Job-oriented Training", "Secretary, UD&HD (Appointing Authority)", "Induction training was provided to newly appointed employees."],
                        ]}
                        caption="Table 5.2: Status of exercising power in respect of executive functionaries provided to the ULBs in the State"
                        rowHeaderColumnIndex={0}
                    />
                    <Paragraph contentId={`${activeItem}-p-5`} {...props}>
                        The 2nd ARC also opined that city government should have the power to appoint all officials including the Commissioner and to hold them accountable. However, ULBs have limited administrative power over their staffs which may cause inefficient/improper execution of their devolved function.
                    </Paragraph>
                </>
            );
        case 'ch5-2':
            return <RecruitmentAccordion {...props} />;
        case 'ch5-3':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        The power to promote officials, initiate disciplinary action, impose penalty etc. in respect of the officials of ULBs have not been delegated to ULBs and the same rests with the State Government/ Secretary/Municipal Commissioner/Executive Officer. ULBs were permitted by the UD&HD, Bihar for recruitment of staff through outsourcing and daily wages workers were allowed to engage only for cleaning work. Thus, they have limited administrative power over their staffs which may cause inefficient/improper execution of their devolved function. The 2nd ARC also opined that city government should have the power to appoint all officials including the Commissioner and to hold them to account.
                    </Paragraph>
                    <RecommendationsList items={[
                        "The State Government may ensure that vacancies against the sanctioned strength in ULBs are filled in a time-bound manner so as to enable Urban Local Bodies to effectively deliver devolved functions and improve service delivery to citizens.",
                        "State Government may consider delegating adequate functional and administrative powers to ULBs over their human resources in matters such as assessment and recruitment of staff for discharging devolved functions efficiently."
                    ]} />
                </>
            );
        case 'ch5-4':
             return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        Capacity building is important for strengthening the capabilities of personnel and for equipping them with advanced skills to deliver better services. Second Administrative Reform Commission recommended (October 2007) that the capacity building efforts in rural and urban local self-governing institutions must encompass both elected representatives and appointed staff. It emphasised the need for regular training, professional and skill development and inclusion of focussed programmes particularly for women members.
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>
                        The 5th and 6th SFCs suggested that a portion of grants should be used for capacity building and training, but this was not followed.
                    </Paragraph>
                    <SubTitle contentId={`${activeItem}-st-0`} {...props}>Shortcomings in Capacity Building</SubTitle>
                    <BulletList items={[
                        "Bihar Municipal Act, 2007 has no provision for Capacity Building.",
                        "No enabling provision in the Municipal Service/Clerical Cadre Rules, 2021. A promised Urban Development Academy has not been formed.",
                        "The State Government did not draw any plan for capacity building as recommended by the Second Administrative Reform Commission.",
                        "No grant was used for capacity building and training as mentioned in the recommendations of the 5th and 6th SFCs.",
                    ]} />
                    <Paragraph contentId={`${activeItem}-p-2`} {...props}>
                        Audit noted that the State Government has not adopted any mechanism to prepare training need analysis to assess training requirement for various cadre/employees of ULBs. During the field visit, it was observed that out of 26 test-checked ULBs, only four ULBs organized merely five training programmes for 490 staff during 2019-24.
                    </Paragraph>
                    {/* FIX: This Table component was incomplete, causing a syntax error. Fixed by adding rowHeaderColumnIndex */}
                    <Table 
                        headers={["ULBs", "Name of Training", "No. of Training organised", "No. of participants", "Budget (in ₹ lakh)", "Expenditure (in ₹ lakh)"]}
                        data={[
                            ["MC, Saharsa", "Training of newly appointed City Managers", 1, 35, 2.00, 1.89],
                            ["MC, Biharsharif", "Training of Sanitary Supervisor and workers", 2, 250, 5.00, 4.75],
                            ["MC, Muzaffarpur", "e-Governance training", 1, 150, 3.50, 3.50],
                            ["NP, Barauli", "Accounts and audit training", 1, 55, 1.50, 1.25],
                            [<strong>Total</strong>, "", <strong>5</strong>, <strong>490</strong>, <strong>12.00</strong>, <strong>11.39</strong>]
                        ]}
                        caption="Table 5.8: Details of training programmes organised"
                        rowHeaderColumnIndex={0}
                    />
                    <Recommendation title="Recommendation 9:">
                        The State Government may institutionalise the capacity building of functionaries of ULBs by amending the Acts/Rules. Regular training and capacity-building programmes should be conducted for both elected representatives and officials of ULBs. Further, a portion of the grant received from the State/Central Finance Commission may be earmarked for this purpose.
                    </Recommendation>
                </>
            );
        case 'chapter-5':
        default:
            const handleItemClick = onItemClick || (() => {});
            return (
                 <>
                    <ChapterSummaryDashboard
                        onItemClick={handleItemClick}
                        className={props.className}
                        stats={[
                            { value: '92%', label: 'Overall Staff Vacancy', id: 'ch5-2-1' },
                            { value: '81-98%', label: 'Vacancy Range', id: 'ch5-2-1' },
                            { value: '0', label: 'Capacity Building Grants Used', id: 'ch5-4' },
                            { value: 'State', label: 'HR Control', id: 'ch5-1' }
                        ]}
                        findings={[
                            { text: "ULBs have limited to no control over their own human resources.", id: 'ch5-1' },
                            { text: "There is a critical shortage of staff, with vacancy rates up to 98%.", id: 'ch5-2' },
                            { text: "Recruitment processes are centralized and slow, failing to meet local needs.", id: 'ch5-2' },
                            { text: "No structured mechanism exists for capacity building and training of municipal staff.", id: 'ch5-4' }
                        ]}
                        chart={<DonutChart
                            title="Overall Staff Vacancy in Test-Checked ULBs"
                            data={[
                                { label: 'Vacant', value: 92, color: 'rgb(244 63 94)' },
                                { label: 'Filled', value: 8, color: 'rgb(20 184 166)' },
                            ]}
                            linkId='ch5-2-1'
                        />}
                        diagram={<FlowChart title="Recruitment Process Overview" linkId="ch5-2"/>}
                    />
                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                           This infographic visualizes the narrative of human resource challenges, from centralized control to the resulting operational gaps.
                        </p>
                        <Chapter5StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This mind map shows how limited HR powers directly contribute to recruitment issues and a lack of capacity building.
                        </p>
                        <Chapter5MindMap onItemClick={handleItemClick} />
                    </div>
                </>
            );
    }
};

export default Chapter5;
