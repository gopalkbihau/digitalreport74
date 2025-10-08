import { GoogleGenAI } from '@google/genai';
import { MENU_ITEMS, GLOSSARY_TERMS } from '../constants';

const CACHE_PREFIX = 'translation-cache-en-hi::';
const QUOTA_EXCEEDED_KEY = 'gemini-quota-exceeded';


// Helper function to get from localStorage safely
const getFromCache = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.warn('Could not read from localStorage', e);
        return null;
    }
};

// Helper function to set in localStorage safely
const setInCache = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn('Could not write to localStorage', e);
    }
};

// A manually collated list of all static strings from components.
const ALL_APP_STRINGS: string[] = [
    // HomePage.tsx
    `Performance Audit Report`,
    `On the Efficacy of Implementation of the 74th Constitutional Amendment Act in Urban Local Government in Bihar`,
    // AtAGlance.tsx
    `Audit at a Glance`,
    `A high-level overview of the most critical findings from the performance audit. Click on any stat to jump to the relevant section.`,
    `Overall Staff Vacancy`,
    `Dependency on Grants`,
    `Own Revenue Contribution`,
    `ESC Meeting Shortfall`,
    `Water SLBs Achieved`,
    `Sanitary Landfills Available`,
    `Core Conclusions`,
    `Institutional Weakness: Devolution of functions remains incomplete, and key committees are often non-functional, hindering local governance.`,
    `Financial Dependency: Urban Local Bodies are critically dependent on state grants and have failed to develop their own revenue sources, limiting their autonomy.`,
    `Resource Gaps: Severe staff shortages and a lack of capacity-building cripple the ability of ULBs to perform their duties effectively.`,
    `Poor Service Delivery: Basic services like water supply, sanitation, and waste management fail to meet established benchmarks, directly impacting citizens.`,
    // ExecutiveSummary.tsx
    `This performance audit examined the effectiveness of the implementation of the 74th Constitutional Amendment Act (CAA) in Bihar, focusing on the empowerment of Urban Local Bodies (ULBs). The audit reveals that despite enabling legislation like the Bihar Municipal Act, 2007, the intended objectives of decentralization and self-governance have not been fully achieved. ULBs continue to face significant institutional, financial, and administrative challenges that limit their autonomy and service delivery capabilities.`,
    `Key Findings`,
    `Click on a finding to view details.`,
    `Legal & Institutional Gaps`,
    `76% shortfall in key committee meetings, hindering governance.`,
    `While the State government enacted the Bihar Municipal Act (BMA) in 2007, there was a 14-year delay. The legal provisions were not backed by decisive actions, resulting in a situation where the spirit of the 74th CAA has not been realized. Institutional weaknesses, such as delayed elections, irregular meetings, and the non-formation of key municipal committees, have significantly undermined the effective functioning of ULBs.`,
    `Human Resource Deficiencies`,
    `Up to 98% staff vacancy rate, crippling operational capacity.`,
    `ULBs have limited control over human resources. This has led to severe staff shortages (vacancy rates of 81% to 98% in sampled ULBs) and the absence of a structured capacity-building mechanism, adversely affecting operational efficiency and service delivery.`,
    `Financial Constraints`,
    `Only 8.7% own-revenue contribution, limiting financial autonomy.`,
    `ULBs remain heavily dependent on government grants, which are often delayed. Their authority to levy taxes and user charges is limited, weakening their financial independence and hampering their ability to deliver services. This has resulted in a low contribution from own revenue (8.74% of total revenue).`,
    `Ineffective Service Delivery`,
    `100% failure to meet key benchmarks for water supply services.`,
    `Devolved functions in areas like water supply, public health, and solid waste management are not translating into effective outcomes. There are significant gaps in service delivery, with ULBs failing to meet many of the prescribed Service Level Benchmarks (SLBs).`,
    `Recommendations`,
    `Click on a recommendation to view details.`,
    `Strengthen Governance`,
    `Ensure full devolution of functions and timely formation of committees.`,
    `The State Government should fully devolve all functions and ensure adequate autonomy for ULBs to perform their roles effectively. Timely delimitation of municipalities and formation of key committees should be prioritized to enhance governance and citizen participation.`,
    `Empower Human Resources`,
    `Grant ULBs authority over HR and fill vacancies promptly.`,
    `ULBs must be granted authority over human resource management, with vacancies filled promptly, and staff capacity should be strengthened through regular training.`,
    `Enhance Financial Autonomy`,
    `Implement SFC recommendations and improve own-revenue collection.`,
    `Financial empowerment of ULBs requires timely implementation of State Finance Commission (SFC) recommendations, prompt release of grants, and improved collection of taxes and user charges supported by realistic budgeting.`,
    `Improve Service Delivery`,
    `Ensure universal tap water, robust sanitation, and waste processing.`,
    `ULBs should ensure all households have tap water connections, establish robust grievance redressal mechanisms, prepare and implement comprehensive sanitation plans, and develop adequate waste processing facilities to meet service level benchmarks.`,
    // Chapter 1
    `The 74th Constitutional Amendment Act (CAA), 1992 came into effect on 1st June 1993, introduced Part IX A (The Municipalities), imparting constitutional status to Urban Local Bodies (ULBs). It enabled them to perform effectively as vibrant democratic units of self-government. Article 243W of the 74th CAA authorised the State Legislatures to enact laws to endow local bodies with powers and authority as may be necessary to enable them to function as institutions of Self-Government to enable them to function as institutions of Self-Government and make provisions for devolution of powers and responsibilities.`,
    `The 74th CAA also introduced the Twelfth Schedule, which enumerates 18 specific functions that may be entrusted to Urban Local Bodies (ULBs), as listed in Table 4.1 of Chapter IV.`,
    `The 74th Constitutional Amendment Act (1992), which aimed to strengthen urban local governance, was implemented in Bihar with the enactment of the Bihar Municipal Act, 2007 (BMA, 2007). BMA, 2007 replaced the previous Bihar Municipal Act, 1922 and the Patna Municipal Corporation Act, 1951. The BMA, 2007 along with the Bihar Municipal Accounting Rules, 2014, Bihar Municipal Accounting Manual, 2014 and the Bihar Municipal Budget Manual, 2014 provides the framework for the organization and functioning of Urban Local Bodies (ULBs) in Bihar.`,
    `Audit of 74th CAA is required to ascertain whether the State Government empowered ULBs through the creation of a robust institutional framework as well as transfer of functions, funds and functionaries. Audits can assess whether the State Government have adequately devolved 18 functions to the ULBs and whether desired functions/services were provided to citizens. Further, audit can examine whether ULBs have the necessary powers and resources to carry out the functions assigned to them`,
    // Chapter 2
    `The principal purpose of this performance audit was to understand whether ULBs have been empowered in terms of funds, functions and functionaries to establish themselves as effective institutions of local self-government and whether the 74th CAA has been effectively implemented in the State. Accordingly, the following objectives were framed to assess:`,
    `Whether provisions of the 74th CAA have been adequately covered in the State Legislation;`,
    `Whether ULBs have been empowered by the State government to discharge their functions/responsibilities effectively through creation of appropriately designed institutions/institutional mechanisms and effectiveness of the functions devolved to the ULBs;`,
    `Whether ULBs have been empowered to access adequate resources including sufficient resources for discharge of functions stated to be devolved to them; and`,
    `Whether ULBs have powers to mobilize and incentivise human resources commensurate with their functions.`,
    `The overall objective of this audit is to appreciate whether ULBs of the State have enabled to plan, implement and manage local affairs more effectively and they have effectively delivered essential services like sanitation, water supply, public health and solid waste management to the citizens.`,
    // ... Many more strings from all chapters would go here. This is an abbreviated list for brevity.
];

// Helper to get all translatable strings from constants and the manual list
const getAllTranslatableStrings = (): string[] => {
    const stringsFromConstants: string[] = [];
    
    // Extract from MENU_ITEMS
    const recurseMenuItems = (items: any[]) => {
        items.forEach(item => {
            stringsFromConstants.push(item.label);
            if (item.description) {
                stringsFromConstants.push(item.description);
            }
            if (item.children) {
                recurseMenuItems(item.children);
            }
        });
    };
    recurseMenuItems(MENU_ITEMS);

    // Extract from GLOSSARY_TERMS
    GLOSSARY_TERMS.forEach(term => {
        stringsFromConstants.push(term.term);
        stringsFromConstants.push(term.definition);
    });
    
    // Combine, deduplicate, and filter out very short strings
    const allStrings = new Set([...stringsFromConstants, ...ALL_APP_STRINGS]);
    return Array.from(allStrings).filter(s => s && s.trim().length > 10);
};


export async function translateText(text: string, targetLanguage: string = 'Hindi'): Promise<string> {
  if (sessionStorage.getItem(QUOTA_EXCEEDED_KEY)) {
    throw new Error("Translation service is unavailable due to API quota limits. Please try again later.");
  }
  
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }
  if (!text) {
    return '';
  }
  
  const cacheKey = `${CACHE_PREFIX}${text}`;
  const cachedTranslation = getFromCache(cacheKey);

  if (cachedTranslation) {
    return cachedTranslation;
  }

  const MAX_RETRIES = 5;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Translate the following English text to ${targetLanguage}. Do not add any extra explanation, just provide the translation.\n\nEnglish Text:\n"""\n${text}\n"""\n\nTranslation:`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });
  
      const translatedText = response.text;
      
      if (translatedText) {
          setInCache(cacheKey, translatedText);
          return translatedText; // Success
      }
      throw new Error("Received empty translation from API");

    } catch (error: any) {
      lastError = error;
      console.warn(`Translation attempt ${attempt} of ${MAX_RETRIES} failed.`, error);

      // Check for the specific quota error message
      const errorMessage = error?.message || '';
      if (errorMessage.includes('user has exceeded quota') || errorMessage.includes('exceeded your current quota')) {
          console.error("Gemini API quota exceeded. Disabling translation for this session.");
          sessionStorage.setItem(QUOTA_EXCEEDED_KEY, 'true');
          // Re-throw the specific error to stop retries and inform the caller.
          throw new Error("Translation service is unavailable due to API quota limits. Please try again later.");
      }

      if (attempt === MAX_RETRIES) {
        console.error(`Failed to translate text after ${MAX_RETRIES} attempts.`, error);
        throw new Error(`Failed to translate text after ${MAX_RETRIES} attempts. Please try again later.`);
      }
      // Exponential backoff with jitter before retrying
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This fallback should ideally not be reached if the loop logic is correct
  throw new Error(`Failed to translate text. Last error: ${lastError}`);
}

/**
 * Pre-caches translations for all application strings.
 * Iterates through a master list of strings, translates any that are not already
 * in localStorage, and stores them for future offline use. This process is done
 * sequentially to avoid hitting API rate limits and to stop immediately if a
 * quota error or persistent network error is encountered.
 */
export async function precacheTranslations() {
    if (sessionStorage.getItem(QUOTA_EXCEEDED_KEY)) {
        console.log("Translation pre-caching skipped due to quota limits.");
        return;
    }

    console.log("Starting translation pre-caching...");
    const allStrings = getAllTranslatableStrings();
    const stringsToCache = allStrings.filter(text => !getFromCache(`${CACHE_PREFIX}${text}`));

    if (stringsToCache.length === 0) {
        console.log("All translations are already cached.");
        return;
    }

    console.log(`Found ${stringsToCache.length} new strings to pre-cache.`);

    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;

    // Process strings one by one to immediately stop on quota error or persistent network issues.
    for (const [index, text] of stringsToCache.entries()) {
        if (sessionStorage.getItem(QUOTA_EXCEEDED_KEY)) {
            console.warn("Quota exceeded during pre-caching. Aborting further pre-caching.");
            break;
        }

        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            console.warn(`Aborting pre-caching after ${MAX_CONSECUTIVE_ERRORS} consecutive errors. Will retry on next app load.`);
            break;
        }

        console.log(`Caching string ${index + 1} of ${stringsToCache.length}...`);

        try {
            await translateText(text, 'Hindi');
            consecutiveErrors = 0; // Reset error count on success.
        } catch (error: any) {
            consecutiveErrors++;
            // Log the specific string that failed.
            console.error(`Failed to cache translation for: "${text.substring(0, 50)}..." - ${error.message}`);
            
            // If it's a quota error, we must stop immediately.
            // translateText throws a specific error message for this.
            if (error.message.includes("quota limits")) {
                console.warn("Aborting further pre-caching due to API quota limit.");
                break; // Exit the loop immediately.
            }
        }

        // Add a small delay between requests to be respectful of the API rate limits.
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("Translation pre-caching complete or aborted due to quota/errors.");
}
