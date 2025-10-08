import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-100" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
    </div>
);
const UserIcon = () => (
     <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-200" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);


type Message = {
    role: 'user' | 'model';
    text: string;
};

const QUOTA_EXCEEDED_KEY = 'gemini-quota-exceeded';

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isQuotaExceeded, setIsQuotaExceeded] = useState(!!sessionStorage.getItem(QUOTA_EXCEEDED_KEY));
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const quotaExceeded = !!sessionStorage.getItem(QUOTA_EXCEEDED_KEY);
            setIsQuotaExceeded(quotaExceeded);
            
            if (quotaExceeded) {
                setError("AI chat is unavailable due to API quota limits. Please try again later.");
                setMessages([{ role: 'model', text: "AI assistant is currently unavailable due to API quota limits. Please try again later." }]);
                return;
            }

            if (!chat) {
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                    const newChat = ai.chats.create({
                        model: 'gemini-2.5-flash',
                        config: {
                          systemInstruction: "You are an expert AI assistant for the 'Performance Audit Report on the Efficacy of Implementation of the 74th Constitutional Amendment Act in Urban Local Government in Bihar'. Your purpose is to answer user questions based on the report's findings. Keep your answers concise and directly related to the audit. If a question is outside the scope of the report, politely state that you can only answer questions about this specific audit.",
                        },
                      });
                    setChat(newChat);
                    setMessages([{ role: 'model', text: 'Hello! How can I help you understand the audit report today?' }]);
                } catch (e) {
                    console.error(e);
                    setError('Failed to initialize the AI model. Please ensure the API key is configured correctly.');
                }
            }
        }
    }, [isOpen, chat]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !chat || isQuotaExceeded) return;

        const userMessage: Message = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await chat.sendMessage({ message: userMessage.text });
            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (e: any) {
            console.error(e);
            const errorMessage = e?.message || '';
            if (errorMessage.includes('user has exceeded quota') || errorMessage.includes('exceeded your current quota')) {
                console.error("Gemini API quota exceeded. Disabling AI Chat for this session.");
                sessionStorage.setItem(QUOTA_EXCEEDED_KEY, 'true');
                setIsQuotaExceeded(true);
                setError("AI chat is unavailable due to API quota limits. Please try again later.");
            } else {
                setError('Sorry, I encountered an error trying to respond. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="ai-chat-title" className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] m-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 id="ai-chat-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Ask AI
                    </h2>
                    <button onClick={onClose} aria-label="Close AI Chat" className="p-2 rounded-full text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon />
                    </button>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <BotIcon />}
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'model' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-teal-500 text-white'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                            {msg.role === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <BotIcon />
                            <div className="max-w-md p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center">
                                <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></span>
                                <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-start gap-3">
                            <BotIcon />
                            <div className="max-w-md p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                                <p>{error}</p>
                            </div>
                        </div>
                    )}
                     <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isQuotaExceeded ? "API quota exceeded" : "Ask about the audit report..."}
                            className="w-full px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
                            aria-label="Your question"
                            disabled={isLoading || !chat || isQuotaExceeded}
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim() || !chat || isQuotaExceeded} className="p-2 rounded-full bg-teal-500 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 hover:bg-teal-600 transition-colors" aria-label="Send message">
                            <SendIcon />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default AIChat;