import React, { useState } from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, Paragraph, Table, Chapter3MindMap } from '../ContentElements';
import { BarChart } from '../Charts';
import InfoModal from '../InfoModal';

interface ChapterProps {
  activeItem?: MenuItemId;
  onItemClick?: (id: MenuItemId) => void;
  notes?: Record<string, { note: string; originalText: string; }>;
  onUpdateNote?: (id: string, text: string, originalText: string) => void;
  onDeleteNote?: (id: string) => void;
  className?: string;
}

const comparisonData = [
    {
        provision: "Article 243Q",
        requirement: "Constitution of Municipalities: It provides for constitution of three types of municipalities namely a Nagar Panchayat for transitional area, a Municipal Council for a smaller urban area and a Municipal Corporation for a larger urban area.",
        stateAct: "Section 3, Section 6 and Section 7 of BMA, 2007"
    },
    {
        provision: "Article 243R",
        requirement: "Composition of Municipalities: All the seats in a Municipality shall be filled by direct elections and by persons with special knowledge in municipal administration nominated by Government. The Legislature of a State may by law, provide for representation to the Municipality, Members of Parliament and Legislative Assembly whose constituencies lie within the municipal area and Members of the Council of States and State Legislative Council who are registered as electors within the city.",
        stateAct: "Section 12 and Section 13 of BMA, 2007"
    },
    {
        provision: "Article 243S",
        requirement: "Constitution and composition of Wards Committee: This provides for constitution of Wards Committees in all municipalities with a population of three lakh or more",
        stateAct: "Section 30 of BMA, 2007"
    },
    {
        provision: "Article 243T",
        requirement: "Reservation of seats: The seats to be reserved for Scheduled Caste (SC)/Scheduled Tribe (ST), Women and Backward Classes for direct election.",
        stateAct: "Section 12 (2) of BMA, 2007"
    },
    {
        provision: "Article 243U",
        requirement: "Duration of Municipalities: The municipality has a fixed tenure of five years from the date of its first meeting and re-election to be held within the six months of end of tenure.",
        stateAct: "Section 12 (5) & (6) of BMA, 2007"
    },
    {
        provision: "Article 243V",
        requirement: (<div>Disqualifications for membership:<ul className='list-disc pl-5 mt-2'><li>If he is so disqualified by or under any law for the time being in force for the purposes of elections of the Legislature of the State concerned.</li><li>If he is so disqualified by or under any law made by the Legislature of the State.</li></ul></div>),
        stateAct: "Section 18 of BMA, 2007"
    },
    {
        provision: "Article 243W",
        requirement: "Powers, authority and responsibilities of the Municipalities: All municipalities would be empowered with such powers as may be necessary to enable them to function as effective institutions of Self-Government. The State Government shall entrust with such powers and authority to enable them to carry out the responsibilities in relation to the 12th Schedule.",
        stateAct: "Section 20, Section 22 and Section 28 of BMA"
    },
    {
        provision: "Article 243X",
        requirement: (<div>Power to impose taxes by, and funds of the Municipalities:<ul className='list-disc pl-5 mt-2'><li>Municipalities would be empowered to levy and collect the taxes, fees, duties, etc.</li><li>Grant-in-aid would be given to the Municipalities from the State</li><li>Constitution of funds for crediting and withdrawal of money by the Municipality</li></ul></div>),
        stateAct: "Section 72, 127 to 133 of BMA, 2007"
    },
    {
        provision: "Article 243Y read with Article 243I",
        requirement: (<div>Finance Commission: State Government shall constitute Finance Commission for<ul className='list-disc pl-5 mt-2'><li>Reviewing the financial position of the Municipalities and taking such steps that help in boosting the financial condition of the municipal bodies</li><li>Distributing between the State and the Municipalities the net proceeds of the taxes, fees, tolls and duties that are charged by the State Government.</li><li>Allotting the funds to the municipal bodies in the State from the Consolidated Fund of the State.</li></ul></div>),
        stateAct: "Section 71 of BMA, 2007"
    },
    {
        provision: "Article 243Z",
        requirement: "Audit of accounts of Municipalities: This provides provision for maintenance of accounts by the Municipalities and the auditing of such accounts.",
        stateAct: "Section 86 and 90 of BMA, 2007"
    },
    {
        provision: "Article 243ZA read with Article 243K",
        requirement: "Elections to the Municipalities: The Superintendence, direction, and control of all procedure of election of the Municipalities shall be vested in the State Election Commission (SEC)",
        stateAct: "Section 14 of BMA, 2007"
    },
    {
        provision: "Article 243 ZD",
        requirement: (<div>Committee for District Planning:<ul className='list-disc pl-5 mt-2'><li>Constitution of District Planning Committee at district level.</li><li>Composition of District Planning Committee.</li><li>Preparation of draft development plan and forwarded to the Government.</li></ul></div>),
        stateAct: "Section 167 of Bihar Panchayat Raj Act, 2006 and Section 274 and 275 of BMA, 2007"
    },
    {
        provision: "Article 243ZE",
        requirement: "Committee for Metropolitan Planning: Provision for constitution of Metropolitan Planning Committee in every Metropolitan area with a population of 10 lakhs or more to prepare a draft development plan for the metropolitan area as a whole.",
        stateAct: "Section 291 of BMA, 2007"
    }
];

const InteractiveComparisonTable: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIndex(Number(e.target.value));
        setAnimationKey(prev => prev + 1); // Trigger re-animation
    };
    
    const selectedData = comparisonData[selectedIndex];

    return (
        <div className="my-6">
            <div className="mb-6">
                <label htmlFor="provision-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select a Constitutional Provision to view details:
                </label>
                <div className="relative">
                    <select
                        id="provision-select"
                        value={selectedIndex}
                        onChange={handleSelectChange}
                        className="w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 appearance-none shadow-sm"
                    >
                        {comparisonData.map((item, index) => (
                            <option key={index} value={index}>{item.provision}</option>
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
                    <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4">{selectedData.provision}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Requirement as per Constitution</h4>
                            <div className="text-slate-600 dark:text-slate-300 mt-1">{selectedData.requirement}</div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Corresponding Provision of State Act</h4>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedData.stateAct}</p>
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
const Chapter3StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
    const ClockIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<CheckIcon />} title="The Legislation: BMA 2007" linkId="ch3-1" onItemClick={onItemClick}>
          <p>The state enacted the Bihar Municipal Act (BMA) 2007 to align with the 74th CAA, covering key provisions for municipal governance.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<ClockIcon />} title="The Delay: 14 Years" linkId="ch3-2" onItemClick={onItemClick}>
          <p>There was a significant 14-year delay in enacting the BMA 2007 after the 74th CAA came into effect, slowing down the empowerment of ULBs.</p>
      </InfoCard>
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      <InfoCard icon={<CheckIcon />} title="The Gaps: Implementation vs. Law" linkId="ch3-1" onItemClick={onItemClick}>
          <p>Despite legal compliance, decisive actions did not follow, leading to delays in elections, non-formation of committees, and weak financial decentralization.</p>
      </InfoCard>
    </div>
  );
};


const Chapter3: React.FC<ChapterProps> = (props) => {
    const { activeItem, onItemClick } = props;
    
    switch(activeItem) {
        case 'ch3-1':
            return (
                 <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>The 74th CAA introduced certain provisions relating to municipal bodies as incorporated in Articles 243Q to 243ZG. To give effect to these provisions the State Government enacted BMA, 2007, by repealing the earlier Bihar and Orissa Municipal Act, 1922. Under BMA, 2007, wherein Municipalities were devolved functions, and responsibilities and powers to carry out these functions were devolved to Municipalities to enable them to discharge their assigned roles. The Act BMA, 2007 was enacted to consolidate and amend the laws relating to Municipal Governments in the State, in conformity with the 74th CAA provisions. Use the dropdown below to explore a comparison of the key constitutional provisions and the corresponding sections in the State's legislation.</Paragraph>
                    <InteractiveComparisonTable />
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>The above analysis shows that while the state has enacted enabling legislation that reflect the key statutes complied with the provisions of the 74th CAA. However, compliance with the constitutional provisions by law does not guarantee effective decentralisation on ground unless followed by effective implementation. Audit observed that the legal provisions were not backed by decisive actions resulting in a situation in which the spirit of the 74th CAA has not fructified. This was especially true in case of provisions pertaining to the devolution of functions and creation of appropriate institutional mechanisms for effective decentralisation.</Paragraph>
                    <Paragraph contentId={`${activeItem}-p-2`} {...props}>Audit noticed that elections in 179 ULBs were delayed from 5 to 23 months and elected representatives for making policy and planning and their implementation was missing, which was an essential element of democracy. Wards Committee was incorporated in BMA, 2007, however, enabling Rules specifying composition, territorial area, term, power and functions of Wards Committee were not framed under these Acts by the State Government for implementation of related provisions of the Acts. Further, Section 127 to 136 of BMA, 2007, empower the ULBs to realize taxes, fees and user charges, but test checked ULBs had not imposed all taxes, fees and user charges as given in Para 6.1.2. As per the constitutional provisions, the State government constituted six SFCs since April 1994. However, first two SFCs did not submit their recommendations to the State and last three SFCs submitted their reports with delays ranging from 30 days to 695 days. There was not only a delay in submission of report of the SFCs, but the State Government also took 18 months and four months to decide on recommendations of two SFCs i.e. fourth and sixth SFCs. Furthermore, State Government did not release appropriate funds to ULBs as per recommendations of the 5th SFC. Funds were also not released by the UD&HD as per time schedule recommended by the 5th & 6th SFC. Though, State Government had provisioned for maintenance of accounts and auditing of such accounts, but none of the test checked ULBs maintained primary books of accounts under the double entry accounting system i.e. cash book, bank book, journal book, general ledger and sub-ledger in the prescribed formats of BMAR. Out of 89 prescribed records of BMAR, 82 records were not maintained. Further, the prescribed procedures and timelines for internal audit were also not followed in most of ULBs. District Planning Committee was not formed in almost all the test-checked district against the provision of the Act. , which Audit findings in this regards are discussed in details in the subsequent chapters.</Paragraph>
                </>
            );
        case 'ch3-2':
            return (
                 <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>Article 243ZF provides that notwithstanding anything in this Part, any provision of any law relating to Municipalities in force in a State immediately before the commencement of THE CONSTITUTION (Seventy-fourth Amendment) Act, 1992, which is inconsistent with the provisions of this Part, shall continue to be in force until amended or repealed by a competent Legislature or other competent authority or until the expiration of one year from such commencement, whichever is earlier.</Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>The ULBs have been in existence as institutions of urban local self-government in a limited way in the State of Bihar since 1920s. Under the Bihar & Orissa Municipal Act, 1922, various Municipalities and Notified Area Committees were constituted. Patna Municipal Act, 1951 paved way for constitution of five Municipal Corporations in major cities/towns of the state. Following the 74th Constitutional Amendment Act 1992, the State Government enacted the Bihar Municipal Act 2007 with delay of 14 years of constitutional provision.</Paragraph>
                </>
            );
        case 'chapter-3':
        default:
            const handleItemClick = onItemClick || (() => {});
            return (
                <>
                    <ChapterSummaryDashboard 
                        className={props.className}
                        onItemClick={handleItemClick}
                        stats={[
                            { value: '14yrs', label: 'Delay in BMA, 2007 Enactment', id: 'ch3-1' },
                            { value: '695', label: 'Max Delay in SFC Report (Days)', id: 'ch3-1' },
                            { value: '23mo', label: 'Max Election Delay', id: 'ch3-1' },
                            { value: '82/89', label: 'Acct. Records Not Kept', id: 'ch3-1' }
                        ]}
                        findings={[
                            { text: "Enabling legislation (BMA, 2007) was significantly delayed.", id: 'ch3-1' },
                            { text: "Legal provisions were not supported by decisive, timely actions.", id: 'ch3-1' },
                            { text: "Significant delays in conducting ULB elections were observed.", id: 'ch3-1' },
                            { text: "Financial decentralization is weak, with delays in SFC reports and poor accounting.", id: 'ch3-1' }
                        ]}
                        chart={<BarChart
                            title="Delay in SFC Report Submission (in Days)"
                            data={[
                                { label: 'Fourth SFC', value: 695 },
                                { label: 'Fifth SFC', value: 305 },
                                { label: 'Sixth SFC', value: 30 },
                            ]}
                            barColor="rgb(20 184 166)"
                            linkId='ch3-1'
                        />}
                    />

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                           This infographic visualizes the timeline and key gaps between the constitutional mandate and the state's legislative response.
                        </p>
                        <Chapter3StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This mind map highlights the core compliance issues stemming from the delayed and incomplete implementation of the 74th CAA.
                        </p>
                        <Chapter3MindMap onItemClick={handleItemClick} />
                    </div>
                </>
            );
    }
};

export default Chapter3;