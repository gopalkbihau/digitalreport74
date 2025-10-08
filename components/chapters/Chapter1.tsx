import React from 'react';
import type { MenuItemId } from '../../types';
import { ChapterSummaryDashboard, Paragraph, SubTitle, OrgChartNode, Chapter1MindMap } from '../ContentElements';
import { BarChart, LineChart, DonutChart } from '../Charts';

interface ChapterProps {
  activeItem?: MenuItemId;
  onItemClick?: (id: MenuItemId) => void;
  notes?: Record<string, { note: string; originalText: string; }>;
  onUpdateNote?: (id: string, text: string, originalText: string) => void;
  onDeleteNote?: (id: string) => void;
  className?: string;
}

// --- Icons for Infographic ---
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const CityscapeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
    </svg>
);
const BuildingBlocksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const OrgChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);
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


const Chapter1StorytellingInfographic: React.FC<{ onItemClick: (id: MenuItemId) => void }> = ({ onItemClick }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <InfoCard icon={<DocumentIcon />} title="The Foundation: 74th CAA" linkId="ch1-1" onItemClick={onItemClick}>
          <p>The 74th Constitutional Amendment Act laid the groundwork, granting constitutional status to Urban Local Bodies (ULBs) to function as institutions of self-government.</p>
      </InfoCard>

      <div className="flex justify-center my-2"><ArrowDownIcon /></div>

      <InfoCard icon={<CityscapeIcon />} title="The Reality: Urbanisation in Bihar" linkId="ch1-2" onItemClick={onItemClick}>
          <p>Despite the mandate, Bihar remains one of India's least urbanized states, with an urbanization rate of just <strong className="font-bold text-rose-600 dark:text-rose-400">11.3%</strong>, far below the national average.</p>
      </InfoCard>

      <div className="flex justify-center my-2"><ArrowDownIcon /></div>
      
      <InfoCard icon={<BuildingBlocksIcon />} title="The Landscape: Profile of ULBs" linkId="ch1-3" onItemClick={onItemClick}>
          <p>The state's urban governance is structured across <strong className="font-bold text-sky-600 dark:text-sky-400">261 ULBs</strong>, categorized into:</p>
          <ul className="list-disc list-inside mt-2 text-sm">
              <li>19 Municipal Corporations</li>
              <li>88 Municipal Councils</li>
              <li>154 Nagar Panchayats</li>
          </ul>
      </InfoCard>
      
      <div className="flex justify-center my-2"><ArrowDownIcon /></div>

      <InfoCard icon={<OrgChartIcon />} title="The System: Organisational Structure" linkId="ch1-4" onItemClick={onItemClick}>
          <p>ULBs are overseen by the Urban Development & Housing Department (UD&HD), with a dual structure comprising a political wing (elected representatives) and an administrative wing (state-appointed officers).</p>
      </InfoCard>
    </div>
  );
};


const Chapter1: React.FC<ChapterProps> = (props) => {
    const { activeItem, onItemClick } = props;
    
    const UrbanizationStatsVisual = () => (
        <div className="w-full max-w-sm p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-center text-sm mb-4 text-slate-600 dark:text-slate-300">Bihar vs. India (2011)</h4>
            <div className="space-y-4">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Urbanisation Rate (%)</p>
                    <div className="mt-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold w-12 text-teal-600 dark:text-teal-400">Bihar</span>
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4 relative">
                                <div className="bg-teal-500 h-4 rounded-full" style={{ width: `${(11.3/31.2)*100}%` }}></div>
                            </div>
                            <span className="text-sm font-bold text-teal-600 dark:text-teal-400 w-10 text-right">11.3</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold w-12 text-sky-600 dark:text-sky-400">India</span>
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                                <div className="bg-sky-500 h-4 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="text-sm font-bold text-sky-600 dark:text-sky-400 w-10 text-right">31.2</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Share of National Population (%)</p>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                            <div className="bg-rose-500 h-4 rounded-full" style={{ width: '8.6%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">8.6%</span>
                    </div>
                </div>
    
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Share of National Urban Population (%)</p>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                            <div className="bg-amber-500 h-4 rounded-full" style={{ width: '3.1%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">3.1%</span>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const UrbanizationImpactVisual = () => (
        <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg h-full border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                {/* Population */}
                <div className="flex flex-col items-center text-center w-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs mt-1">Population</span>
                </div>
                
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>

                {/* Services */}
                 <div className="flex flex-col items-center text-center w-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xs mt-1">Services</span>
                 </div>

                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>

                {/* Needs */}
                 <div className="flex flex-col items-center text-center w-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs mt-1">Resources</span>
                </div>
            </div>
        </div>
    );

    switch(activeItem) {
        case 'ch1-1':
            const SolidArrowDown = () => (
                <div className="flex justify-center my-4" aria-hidden="true">
                    <svg className="h-8 w-8 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                </div>
            );
            return (
                <Paragraph contentId={`${activeItem}-p-combined`} {...props}>
                    <p>
                        The 74th Constitutional Amendment Act (CAA), 1992 came into effect on 1st June 1993, introduced Part IX A (The Municipalities), imparting constitutional status to Urban Local Bodies (ULBs). It enabled them to perform effectively as vibrant democratic units of self-government. Article 243W of the 74th CAA authorised the State Legislatures to enact laws to endow local bodies with powers and authority as may be necessary to enable them to function as institutions of Self-Government to enable them to function as institutions of Self-Government and make provisions for devolution of powers and responsibilities.
                    </p>
                    <SolidArrowDown />
                    <p>
                        The 74th CAA also introduced the Twelfth Schedule, which enumerates 18 specific functions that may be entrusted to Urban Local Bodies (ULBs), as listed in Table 4.1 of Chapter IV.
                    </p>
                    <SolidArrowDown />
                    <p>
                        The 74th Constitutional Amendment Act (1992), which aimed to strengthen urban local governance, was implemented in Bihar with the enactment of the Bihar Municipal Act, 2007 (BMA, 2007). BMA, 2007 replaced the previous Bihar Municipal Act, 1922 and the Patna Municipal Corporation Act, 1951. The BMA, 2007 along with the Bihar Municipal Accounting Rules, 2014, Bihar Municipal Accounting Manual, 2014 and the Bihar Municipal Budget Manual, 2014 provides the framework for the organization and functioning of Urban Local Bodies (ULBs) in Bihar.
                    </p>
                    <SolidArrowDown />
                    <p>
                        Audit of 74th CAA is required to ascertain whether the State Government empowered ULBs through the creation of a robust institutional framework as well as transfer of functions, funds and functionaries. Audits can assess whether the State Government have adequately devolved 18 functions to the ULBs and whether desired functions/services were provided to citizens. Further, audit can examine whether ULBs have the necessary powers and resources to carry out the functions assigned to them
                    </p>
                </Paragraph>
            );
        case 'ch1-2':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>
                        <p className="mb-4">Urbanization in Bihar is far behind all-India average and today Bihar is one of the least urbanized states in the country. Bihar’s urbanisation has increased from lowly figure of 9.59 per cent in 1981 to just 11.29 per cent in 2011, as against 22.89 per cent and 31.16 per cent respectively for all India. Decadal growth of urban population in Bihar vis-à-vis that for the country as a whole may be seen in the chart below.</p>
                        <LineChart
                          title="Trend of Urbanisation in Bihar vs. India (%)"
                          className="!my-0 !shadow-none !bg-transparent dark:!bg-transparent !p-0"
                          data={{
                            labels: ['1961', '1971', '1981', '1991', '2001', '2011', '2021 (Proj.)'],
                            datasets: [
                              { name: 'Bihar', points: [7.41, 7.70, 9.59, 10.05, 10.43, 11.29, 18.80], color: 'rgb(20 184 166)' },
                              { name: 'India', points: [17.84, 19.75, 22.89, 25.50, 27.82, 31.16, 32.29], color: 'rgb(15 118 110)' }
                            ]
                          }}
                        />
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <p>Increasing trend of population can affect the facilities of ULBs. Public services like water supply, sanitation, public health, management of solid waste etc. can become overwhelmed, which required significant funds and functionaries to carry out quality service of these functions. Hence, three categories of ULBs are selected for sampling across the state through IDEA application software.</p>
                            </div>
                            <div className="w-full md:w-auto">
                                <UrbanizationImpactVisual />
                            </div>
                        </div>
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-2`} {...props}>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <p>According to 2011 census, rate of urbanisation in Bihar is only 11.3 per cent compared to the national average of 31.2 per cent. The State accounts for 8.6 per cent of India’s total population, but it has only 3.1 per cent of country’s total urban population. The growth rate of urban population in the decades 2001-2011 & 2011-2021 was 36 per cent and 35 per cent respectively.</p>
                            </div>
                            <div className="w-full md:w-auto">
                                <UrbanizationStatsVisual />
                            </div>
                        </div>
                    </Paragraph>
                    <Paragraph contentId={`${activeItem}-p-3`} {...props}>Urban Bihar faces multiple challenges, ranging from public health issues, poverty, sanitation, waste management, water supply, pollution, depletion of natural resources etc. In this scenario, ULBs have an important role to play, as most of these issues are handled best at the local level.</Paragraph>
                    <Paragraph contentId={`${activeItem}-p-4`} {...props}>ULBs are instruments of decentralised governance. They are best positioned to respond to local felt needs of the people. Resources need to be placed at their disposal to take up schemes of local importance identified by them in the process of decentralised decision-making. With rapid urbanisation and its demand, it is important that ULBs take centre stage in planning for urban centres and service delivery. The resource requirements of urban development are huge and most of ULBs, as they are structured, lack capacity and resources to meet the challenges of urban governance and development. Hence, efficacy of ULBs should be checked through audit.</Paragraph>
                </>
            );
        case 'ch1-3':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>In Bihar, ULBs are categorized on the basis of population in accordance with Section 3 of the BMA, 2007. This Section also authorises the State Government to define municipal bodies on other factors in addition to population such as density of population, the revenue generated for the local administration, the percentage of employment in non-agriculture activities, the economic importance within their jurisdiction. There are 261 ULBs as of March 2024 as detailed below.</Paragraph>
                    <BarChart
                        title="Category-wise ULBs in Bihar (Total: 261)"
                        data={[
                            { label: 'Municipal Corp.', value: 19 },
                            { label: 'Municipal Council', value: 88 },
                            { label: 'Nagar Panchayat', value: 154 }
                        ]}
                        barColor="rgb(20 184 166)"
                    />
                    <Paragraph contentId={`${activeItem}-p-1`} {...props}>All ULBs are governed by the BMA, 2007. Each ULBs consist of such number of elected Councillors as there are wards within the municipal area as determined in accordance with the provisions made under section 13 of the BMA, 2007.</Paragraph>
                </>
            );
        case 'ch1-4':
            return (
                <>
                    <Paragraph contentId={`${activeItem}-p-0`} {...props}>The Urban Development & Housing Department (UD&HD) is the nodal Department for ensuring appropriate and planned growth of cities and towns with adequate infrastructure, amenities and services provided to the citizens of Bihar through the Urban Local Bodies and parastatal agencies. The UD&HD is headed by the Minister. The Principal Secretary, UD&HD is the administrative head of the Department.</Paragraph>
                    <SubTitle contentId={`${activeItem}-st-0`} {...props}>Chart 1.1: Organisational Structure of ULBs</SubTitle>
                    <div className={`bg-white dark:bg-slate-800/50 p-6 rounded-lg my-6 shadow-sm ${props.className || ''}`}>
                      <OrgChartNode title="Minister (UD&HD, GoB)" isRoot>
                        <div className="flex space-x-8">
                          <OrgChartNode title="Municipal Corporation" subtitle="Mayor">
                            <OrgChartNode title="Ward Councillors" />
                          </OrgChartNode>
                          <OrgChartNode title="Municipal Council" subtitle="Municipal Chairperson">
                            <OrgChartNode title="Ward Councillors" />
                          </OrgChartNode>
                          <OrgChartNode title="Nagar Panchayat" subtitle="Municipal President">
                            <OrgChartNode title="Ward Councillors" />
                          </OrgChartNode>
                        </div>
                      </OrgChartNode>

                      <div className="w-full text-center my-4 font-bold text-lg text-teal-600 dark:text-teal-400">Administrative Body</div>

                      <OrgChartNode title="Principal Secretary (UD&HD, GoB)" isRoot>
                        <div className="flex space-x-4 items-start">
                          <OrgChartNode title="Municipal Corporation" subtitle="Municipal Commissioner-cum-Chief Executive Officer">
                              <div className="text-xs bg-slate-200 dark:bg-slate-600 p-2 rounded w-48 text-center text-slate-600 dark:text-slate-300">Controller of Municipal Finance & Accounts, Municipal Internal Auditor, Chief Municipal Engineer, etc.</div>
                          </OrgChartNode>
                          <OrgChartNode title="Municipal Council" subtitle="Municipal Executive Officer">
                              <div className="text-xs bg-slate-200 dark:bg-slate-600 p-2 rounded w-48 text-center text-slate-600 dark:text-slate-300">Municipal Finance Officer, Municipal Engineer, Municipal Health Officer, Municipal Secretary</div>
                          </OrgChartNode>
                          <OrgChartNode title="Nagar Panchayat" subtitle="Municipal Executive Officer">
                              <div className="text-xs bg-slate-200 dark:bg-slate-600 p-2 rounded w-48 text-center text-slate-600 dark:text-slate-300">Municipal Finance Officer, Municipal Engineer, Municipal Health Officer, Municipal Secretary</div>
                          </OrgChartNode>
                        </div>
                      </OrgChartNode>
                    </div>
                </>
            );
        case 'chapter-1':
        default:
            // Ensure onItemClick is not undefined before passing it down
            const handleItemClick = onItemClick || (() => {});
            return (
                 <>
                    <ChapterSummaryDashboard
                        onItemClick={handleItemClick}
                        className={props.className}
                        stats={[
                            { value: '261', label: 'Total ULBs', id: 'ch1-3' },
                            { value: '11.3%', label: 'Bihar Urbanization (2011)', id: 'ch1-2' },
                            { value: '3', label: 'ULB Categories', id: 'ch1-3' },
                            { value: '18', label: 'Functions (12th Schedule)', id: 'ch1-1' }
                        ]}
                        findings={[
                            { text: "74th CAA provides constitutional status to Urban Local Bodies.", id: 'ch1-1' },
                            { text: "Bihar remains one of the least urbanized states in India.", id: 'ch1-2' },
                            { text: "ULBs are classified into Municipal Corporations, Councils, and Nagar Panchayats.", id: 'ch1-3' },
                            { text: "The UD&HD is the nodal department for ULBs in the state.", id: 'ch1-4' }
                        ]}
                        chart={<DonutChart
                            title="ULB Category Breakdown"
                            data={[
                                { label: 'Mun. Corp.', value: 19, color: 'rgb(20 184 166)' },
                                { label: 'Mun. Council', value: 88, color: 'rgb(15 118 110)' },
                                { label: 'Nagar Panchayat', value: 154, color: 'rgb(45 212 191)' },
                            ]}
                            centerText="261 Total"
                            linkId='ch1-3'
                        />}
                    />

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            2. The "Storytelling Infographic" Approach
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This approach treats the summary as a single, cohesive, narrative-driven visual. The user scrolls through a beautifully designed infographic that tells the story of the chapter.
                        </p>
                        <Chapter1StorytellingInfographic onItemClick={handleItemClick} />
                    </div>

                    <div className="mt-16 pdf-avoid-break">
                        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
                            3. The "Connected Mind Map" Approach
                        </h2>
                         <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
                            This is a more abstract but powerful way to show the interconnectedness of the issues within a chapter. It's particularly effective for demonstrating cause and effect.
                        </p>
                        <Chapter1MindMap onItemClick={handleItemClick} />
                    </div>
                 </>
            );
    }
};

export default Chapter1;