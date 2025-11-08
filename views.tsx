/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
    ConsultantInsightsData, SopData, CjmData, PlaybookData, ExcelDataItem,
    ProjectData, ProjectView, ProjectTask, ProjectStatus, ModuleStatus, PainPoint, OptimizationOpportunity,
    VsmState, ProjectCharterData, CommunicationPlanData, View, ComplianceRiskData, SopStep, VsmData, BudgetBreakdown
} from './types.ts';
import {
    ChatBubble, ModuleCard, VisualInsightCard, InsightTag, SopStepCard as SopStepCardComponent,
    StatusPill, PriorityPill, ProjectTaskCard, TaskModal, ExportControls, InsightCard, ImpactEffortPill, EditableField,
    StatCard, StatPieChart, AssistantGuide
} from './components.tsx';

// === UI Components for Different Views ===

// FIX: Define and export the ModulePageWrapper component to be used across the application.
export const ModulePageWrapper = ({ title, onBack, exportMenu, children }: { title: string; onBack: () => void; exportMenu?: React.ReactNode; children: React.ReactNode; }) => {
    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-200">
            <header className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4 sm:p-6 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-700 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-200">{title}</h1>
                </div>
                {exportMenu}
            </header>
            <main className="flex-grow overflow-y-auto relative">
                {children}
            </main>
        </div>
    );
};

// === START: NEW LANDING PAGE COMPONENTS ===

interface InputScreenProps {
    inputText: string;
    setInputText: (text: string) => void;
    fileName: string;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearFile: () => void;
    analysisLevel: string;
    setAnalysisLevel: (level: string) => void;
    generalInstructions: string;
    setGeneralInstructions: (instructions: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    error: string | null;
}

const Navbar = ({ onOpenModal }) => (
    <nav className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 z-20 sticky top-4">
        <div className="flex justify-between items-center glassmorphism p-2 rounded-full">
            <span className="text-md font-bold text-white ml-4">Process Intelligence Platform</span>
            <button 
                onClick={onOpenModal}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors">
                Analyze Your Process
            </button>
        </div>
    </nav>
);

const BenefitHighlight = ({ icon, title, children }) => (
    <div className="glassmorphism rounded-2xl p-6 text-left">
        <div className="w-10 h-10 mb-4 text-blue-400">
            {icon}
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{children}</p>
    </div>
);

const HeroSection = ({ onOpenModal }) => (
    <section id="hero" className="w-full max-w-5xl mx-auto flex flex-col items-center text-center z-10 py-20 sm:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">Turn Unstructured Talk into an AI-Ready Footprint.</h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
            Make your organization's data document-ready, standardized, and AI-ready. Most business data fails to reach its full potential because it's unstructured. Our deep-thinking analysis helps you build that essential structure, simplifying processes for established businesses and new teams alike.
        </p>
        <button
            onClick={onOpenModal}
            className="mt-10 px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-transform transform hover:scale-105">
            Start Your Analysis
        </button>
         <div className="mt-16 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
            <BenefitHighlight
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>}
                title="Standardize Documents"
            >
                Convert messy notes and transcripts into consistent, professional artifacts ready for any workflow.
            </BenefitHighlight>
            <BenefitHighlight
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>}
                title="Unlock AI Potential"
            >
                Provide the clean, structured data that AI agents need to operate effectively and drive real automation.
            </BenefitHighlight>
            <BenefitHighlight
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>}
                title="Simplify Complexity"
            >
                Gain instant clarity on how your business runs, making it easier to onboard, train, and optimize.
            </BenefitHighlight>
        </div>
    </section>
);

const ModuleListItem = ({ children }) => (
    <li className="flex items-center space-x-3">
        <svg className="w-5 h-5 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <span className="text-gray-300">{children}</span>
    </li>
);

const FeatureSection = () => (
    <section id="features" className="py-16 sm:py-24 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-gray-100">A Full-Suite of Actionable Intelligence</h2>
        <p className="mt-4 text-center text-lg text-gray-400 max-w-3xl mx-auto">One analysis unlocks a complete toolkit for process improvement, strategic planning, and project execution.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
             <div className="glassmorphism rounded-2xl p-8 space-y-4">
                 <h3 className="text-xl font-semibold text-white">Visualize the Structure</h3>
                 <p className="text-gray-400">Instantly generate flawless BPMN 2.0 diagrams to map out your process, providing a clear visual language for your team and AI agents.</p>
                 <div className="aspect-video bg-gray-900/50 rounded-lg p-4 overflow-hidden flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                        <g fill="none" stroke="#007AFF" strokeWidth="1">
                            <rect x="10" y="40" width="30" height="20" rx="2" fill="rgba(0,122,255,0.1)"></rect>
                            <path d="M40 50 L 60 50" strokeDasharray="2,2"></path>
                            <rect x="60" y="40" width="30" height="20" rx="2" fill="rgba(0,122,255,0.1)"></rect>
                            <circle cx="75" cy="50" r="3" fill="#a5b4fc" className="glowing-dot" />
                            <path d="M90 50 L 110 50"></path>
                            <path d="M110 47 L 115 50 L 110 53 Z" fill="#007AFF" stroke="none"></path>
                            <rect x="125" y="40" width="30" height="20" rx="2" fill="rgba(0,122,255,0.1)"></rect>
                            <path d="M155 50 L 175 50" strokeDasharray="2,2"></path>
                            <circle cx="180" cy="50" r="5" strokeWidth="1.5"></circle>
                        </g>
                    </svg>
                 </div>
            </div>
            <div className="glassmorphism rounded-2xl p-8 space-y-4">
                 <h3 className="text-xl font-semibold text-white">Unlock Your Intelligence Suite</h3>
                 <p className="text-gray-400">Your single source of unstructured data is transformed into a rich set of interconnected, professional modules:</p>
                 <ul className="space-y-3 mt-4">
                    <ModuleListItem>Process Maps (BPMN 2.0)</ModuleListItem>
                    <ModuleListItem>Consultant-Grade Insights</ModuleListItem>
                    <ModuleListItem>Value Stream Maps (VSM)</ModuleListItem>
                    <ModuleListItem>Customer Journey Maps (CJM)</ModuleListItem>
                    <ModuleListItem>Standard Operating Procedures (SOP)</ModuleListItem>
                    <ModuleListItem>Deep Thinking Analysis Chat</ModuleListItem>
                    <ModuleListItem>And a full Project Execution plan...</ModuleListItem>
                 </ul>
            </div>
        </div>
    </section>
);

const AnalysisModal = ({ isOpen, onClose, ...props }: { isOpen: boolean, onClose: () => void } & InputScreenProps) => {
    const {
        inputText, setInputText, fileName, handleFileChange, clearFile, analysisLevel,
        setAnalysisLevel, generalInstructions, setGeneralInstructions, onGenerate, isLoading, error
    } = props;
    const canUseText = !fileName;
    const canUseFile = !inputText;

    React.useEffect(() => {
        const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content bg-[#1C1C1E] border border-gray-700 rounded-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Start Your Analysis</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-600 text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">1. Provide Process Information</h3>
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Paste your meeting notes, transcripts, or any raw text here..."
                            className={`w-full p-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-base h-40 resize-none transition-opacity ${!canUseText ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!canUseText}
                            aria-label="Process text input"
                        />
                        <div className="flex items-center my-4"><div className="flex-grow border-t border-gray-700"></div><span className="flex-shrink mx-4 text-gray-500 text-sm">or</span><div className="flex-grow border-t border-gray-700"></div></div>
                         <div className={`${!canUseFile ? 'opacity-50' : ''}`}>
                            {!fileName ? (
                                <label htmlFor="file-upload-input" className={`w-full flex flex-col justify-center items-center p-8 bg-transparent text-gray-400 rounded-md tracking-wide border-2 border-dashed border-gray-600 transition-colors ${canUseFile ? 'cursor-pointer hover:bg-gray-800 hover:border-blue-500' : 'cursor-not-allowed'}`}>
                                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span className="text-base font-semibold block text-gray-300">Upload Document</span>
                                    <span className="text-xs text-gray-500 mt-1">Supports .txt, .pdf, .docx</span>
                                </label>
                            ) : (
                                <div className="flex justify-between items-center bg-gray-700 text-gray-200 p-3 rounded-md text-sm h-full">
                                    <span className="font-medium truncate" title={fileName}>{fileName}</span>
                                    <button onClick={clearFile} className="ml-4 text-gray-400 hover:text-white focus:outline-none p-1 rounded-full hover:bg-gray-600" aria-label="Remove file"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                </div>
                            )}
                        </div>
                        <input id="file-upload-input" type="file" className="hidden" onChange={handleFileChange} disabled={!canUseFile} accept=".txt,.pdf,.doc,.docx" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">2. Configure Analysis</h3>
                        <div className="relative">
                            <select
                                value={analysisLevel}
                                onChange={e => setAnalysisLevel(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 appearance-none pr-8"
                                aria-label="Select analysis level"
                            >
                                <option>Level 2: End-to-End / Macro Process Map</option>
                                <option>Level 1: High-Level / Executive Summary Map</option>
                                <option>Level 3: Detailed / Departmental Process Map</option>
                                <option>Level 4: Executable / Workflow / System-Specific Map</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold text-gray-200 mb-3">3. Add Instructions (Optional)</h3>
                         <textarea
                            value={generalInstructions}
                            onChange={e => setGeneralInstructions(e.target.value)}
                            placeholder="e.g., 'Focus on customer interactions' or 'The primary system is SAP'"
                            className="w-full h-24 p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 resize-none"
                            aria-label="General instructions for AI"
                        />
                    </div>
                </div>
                <div className="flex-shrink-0 p-6 border-t border-gray-700">
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm mb-4">{error}</p>}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                            <span>Your data is encrypted and processed securely.</span>
                        </div>
                        <button onClick={onGenerate} disabled={isLoading || (!inputText && !fileName)} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300">
                            {isLoading ? <div className="spinner w-5 h-5 border-2 border-white rounded-full"></div> : <span>Analyze</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const InputScreen = (props: InputScreenProps) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <div className="w-full min-h-screen flex flex-col items-center p-4 sm:p-0 overflow-y-auto relative">
            <Navbar onOpenModal={() => setIsModalOpen(true)} />
            <main className="w-full flex flex-col items-center z-10 px-4">
                <HeroSection onOpenModal={() => setIsModalOpen(true)} />
                <FeatureSection />
            </main>
            <AnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...props} />
        </div>
    );
};


// === END: NEW LANDING PAGE COMPONENTS ===

const EmptyState = ({ title, message, icon }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-lg">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
        <p className="text-gray-500 mt-2 max-w-sm">{message}</p>
    </div>
);

const LoadingState = () => (
    <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center">
            <div className="spinner w-10 h-10 border-4 border-indigo-500 mb-4"></div>
            <p className="text-gray-400">Loading analysis...</p>
        </div>
    </div>
);

export const HomeScreen = ({ processName, onStartNew, moduleStatuses, onModuleClick, analysisLevel }) => {
    const intelligenceGrid = [
        { view: 'process-map', title: 'Process Map', description: "Interactive BPMN 2.0 diagram of your process.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-1.5m-15 0H3.75c0-5.922 4.836-10.74 10.74-10.74 2.263 0 4.34.707 6.01 1.907" /></svg> },
        { view: 'consultant-insights', title: 'Consultant Insights', description: "AI-driven analysis of pain points & opportunities.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> },
        { view: 'process-guide', title: 'Process Guide (SOP)', description: "A comprehensive, step-by-step operational document.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> },
        { view: 'value-stream-map', title: 'Value Stream Map', description: "Identifies waste and process flow inefficiencies.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg> },
        { view: 'customer-journey-map', title: 'Customer Journey', description: "Maps the process from the customer's perspective.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg> },
        { view: 'compliance-risk', title: 'Compliance & Risk', description: "Identifies compliance gaps and operational risks.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0A11.953 11.953 0 0 1 12 2.25c1.537 0 3.02.423 4.255 1.172Z" /></svg> },
        { view: 'deep-dive', title: 'Deep Dive Chat', description: "Ask detailed questions and get instant answers.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
        { view: 'optimization-playbook', title: 'Optimization Playbook', description: "A strategic, actionable plan for improvement.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> },
        { view: 'project-execution', title: 'Go to Project Hub', description: "Translate strategy into an executable project plan.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg> },
    ];
    
    return (
        <div className="p-6 sm:p-8 overflow-y-auto h-full subtle-bg-pattern-dark">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-sm mb-8">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-indigo-400">Analyzed Process</p>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300">{analysisLevel.split(':')[0]}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-200 capitalize truncate" title={processName}>{processName}</h1>
                    </div>
                    <button 
                        onClick={onStartNew}
                        className="flex-shrink-0 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        Start New Analysis
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                 <h2 className="text-2xl font-bold text-gray-200 mb-2">Process Intelligence Hub</h2>
                 <p className="text-gray-400 mb-6 max-w-3xl">Your complete suite of AI-generated insights. Modules will become available as the analysis progresses.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {intelligenceGrid.map(mod => (
                        <ModuleCard 
                            key={mod.view} title={mod.title} description={mod.description} icon={mod.icon}
                            status={moduleStatuses[mod.view] || 'locked'}
                            onClick={() => onModuleClick(mod.view as View, moduleStatuses[mod.view] || 'locked')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ProjectIntelligentHomeScreen = ({ moduleStatuses, onModuleClick }: { moduleStatuses: { [key: string]: ModuleStatus }, onModuleClick: (view: View, status: ModuleStatus) => void }) => {
    const planningModules = [
        { view: 'project-charter', title: 'Project Charter', description: "Formalize project scope, goals, stakeholders, and risks.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { view: 'communication-plan', title: 'Communication Plan', description: "Strategize stakeholder communication and reporting cadence.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    ];
    
    const executionModules = [
         { view: 'project-execution', title: 'Project Execution', description: "Manage tasks with a Kanban board and track progress.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg> },
    ];

    const renderSection = (title, description, modules) => (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-200 mb-2">{title}</h2>
            <p className="text-gray-400 mb-6 max-w-3xl">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map(mod => (
                    <ModuleCard 
                        key={mod.view} title={mod.title} description={mod.description} icon={mod.icon}
                        status={moduleStatuses[mod.view] || 'locked'}
                        onClick={() => onModuleClick(mod.view as View, moduleStatuses[mod.view] || 'locked')}
                    />
                ))}
            </div>
        </section>
    );

    return (
        <div className="p-6 sm:p-8 overflow-y-auto h-full subtle-bg-pattern-dark">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-sm mb-8">
                <h1 className="text-3xl font-bold text-gray-200">Project Intelligence Hub</h1>
                <p className="text-gray-400 mt-2">Transform your process optimization playbook into an actionable project plan.</p>
            </div>
            
            <div className="max-w-7xl mx-auto">
                {renderSection("Project Planning", "Formalize your improvement initiatives with structured project management artifacts.", planningModules)}
                {renderSection("Project Execution", "Bring your plans to life and manage the implementation process.", executionModules)}
            </div>
        </div>
    );
};

export const ProcessMapView = ({ modelerRef, detailedAnalysis }: { modelerRef: React.RefObject<any>, detailedAnalysis: { excelData: ExcelDataItem[], consultantInsights: ConsultantInsightsData } | null }) => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const [selectedElement, setSelectedElement] = React.useState<any>(null);

    React.useEffect(() => {
        const container = mapContainerRef.current;
        const modeler = modelerRef.current;
        if (container && modeler) {
            modeler.attachTo(container);
            modeler.get('canvas').zoom('fit-viewport');
            
            const eventBus = modeler.get('eventBus');
            const onSelectionChange = (event) => {
                const element = event.newSelection[0];
                if (element && element.type !== 'bpmn:Process' && element.type !== 'bpmn:Participant' && element.type !== 'bpmn:Lane') {
                    const stepData = detailedAnalysis?.excelData.find(d => d.stepID === element.id);
                    setSelectedElement(stepData || { stepName: element.businessObject?.name, stepID: element.id, stepType: element.type });
                } else {
                    setSelectedElement(null);
                }
            };

            eventBus.on('selection.changed', onSelectionChange);
            
            return () => {
                eventBus.off('selection.changed', onSelectionChange);
                modeler.detach();
            };
        }
    }, [modelerRef, detailedAnalysis]);

    const insightsForStep = selectedElement ? (detailedAnalysis?.consultantInsights?.painPointAnalysis ?? []).filter(p => p.associatedStepID === selectedElement.stepID) : [];
    const opportunitiesForStep = selectedElement ? (detailedAnalysis?.consultantInsights?.processOptimizationOpportunities ?? []).filter(p => p.associatedStepID === selectedElement.stepID) : [];

    return (
        <div className="flex h-full">
            <div ref={mapContainerRef} className="flex-grow h-full bpmn-container" />
            <div className={`transition-all duration-300 ease-in-out bg-gray-800 border-l border-gray-700 overflow-y-auto ${selectedElement ? 'w-full max-w-sm sm:w-1/3 sm:max-w-md' : 'w-0'}`}>
                {selectedElement && (
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-200">{selectedElement.stepName}</h3>
                        <p className="text-sm text-gray-500 mt-1">ID: {selectedElement.stepID}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 text-sm text-gray-300">
                             <p><strong>Type:</strong> {selectedElement.stepType}</p>
                             <p><strong>Actor/Role:</strong> {selectedElement.actors}</p>
                             <p><strong>Systems:</strong> {selectedElement.systemsInvolved}</p>
                             <p><strong>Description:</strong> {selectedElement.description}</p>
                        </div>

                        {(insightsForStep.length > 0 || opportunitiesForStep.length > 0) && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="font-semibold text-gray-300 mb-2">Linked Insights</h4>
                                <div className="space-y-3">
                                    {insightsForStep.map((insight, i) => (
                                        <div key={`pain-${i}`} className="bg-red-900/50 border-l-4 border-red-500 p-3 text-sm">
                                            <p className="font-semibold text-red-300">Pain Point</p>
                                            <p className="text-red-300">{insight.description}</p>
                                        </div>
                                    ))}
                                    {opportunitiesForStep.map((opp, i) => (
                                        <div key={`opp-${i}`} className="bg-green-900/50 border-l-4 border-green-500 p-3 text-sm">
                                            <p className="font-semibold text-green-300">{opp.opportunity}</p>
                                            <p className="text-green-300">{opp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ConsultantInsightsView = ({ insights, isLoading }: { insights: ConsultantInsightsData | null, isLoading: boolean }) => {
    const [activeTab, setActiveTab] = React.useState('painPoints');

    if (isLoading) return <LoadingState />;
    if (!insights) return <EmptyState title="No Insights Available" message="Could not generate consultant insights for this process." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>} />;

    const { painPointAnalysis, processOptimizationOpportunities, strategicSuggestions, anomalyDetection } = insights;
    
    const tabs = [
        { id: 'painPoints', label: 'Pain Points', count: painPointAnalysis?.length || 0 },
        { id: 'opportunities', label: 'Opportunities', count: processOptimizationOpportunities?.length || 0 },
        { id: 'automation', label: 'Automation', count: (strategicSuggestions?.rpaCandidates?.length || 0) + (strategicSuggestions?.aiWorkflowCandidates?.length || 0) },
        { id: 'anomalies', label: 'Anomalies', count: anomalyDetection?.length || 0 }
    ];

    const TabButton = ({ id, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center space-x-2 transition-colors ${activeTab === id ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            <span>{label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === id ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{count}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'painPoints':
                return (painPointAnalysis || []).map((p: PainPoint, i) => (
                    <InsightCard key={i} title={p.area} category="Pain Point" impact={p.impact} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                        <p>{p.description}</p><p className="mt-2 font-semibold text-gray-300">Recommendation: <span className="font-normal text-gray-400">{p.recommendation}</span></p>
                    </InsightCard>
                ));
            case 'opportunities':
                return (processOptimizationOpportunities || []).map((p: OptimizationOpportunity, i) => (
                    <InsightCard key={i} title={p.opportunity} category="Optimization Opportunity" impact={p.priority} effort={p.effort} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                         <p>{p.description}</p><p className="mt-2 font-semibold text-gray-300">Benefit: <span className="font-normal text-gray-400">{p.benefit}</span></p>
                    </InsightCard>
                ));
            case 'automation':
                return (
                    <>
                        {(strategicSuggestions?.rpaCandidates || []).map((p, i) => (
                            <InsightCard key={`rpa-${i}`} title={p.taskName} category="RPA Candidate" impact={p.impact} effort={p.effort} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}>
                                <p>{p.rationale}</p><p className="mt-2 font-semibold text-gray-300">Est. Saving: <span className="font-normal text-gray-400">{p.estimatedSaving}</span></p>
                            </InsightCard>
                        ))}
                        {(strategicSuggestions?.aiWorkflowCandidates || []).map((p, i) => (
                            <InsightCard key={`ai-${i}`} title={p.processArea} category="AI Workflow Candidate" impact={p.impact} effort={p.effort} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}>
                                <p>{p.description}</p><p className="mt-2 font-semibold text-gray-300">Benefit: <span className="font-normal text-gray-400">{p.benefit}</span></p>
                            </InsightCard>
                        ))}
                    </>
                );
            case 'anomalies':
                return (anomalyDetection || []).map((p, i) => (
                     <InsightCard key={i} title={p.anomaly} category="Anomaly Detected" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4h.01" /></svg>}>
                        <p>{p.description}</p><p className="mt-2 font-semibold text-gray-300">Correction: <span className="font-normal text-gray-400">{p.correction}</span></p>
                    </InsightCard>
                ));
            default: return null;
        }
    };
    
    return (
        <div className="p-8 h-full subtle-bg-pattern-dark">
            <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 mb-6">
                <div className="flex items-center space-x-2">
                    {tabs.map(tab => <TabButton key={tab.id} {...tab} />)}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderContent()}
            </div>
        </div>
    );
};

const SopStepCard = ({ step, index, onUpdate }: { step: SopStep, index: number, onUpdate: (updatedData: Partial<SopStep>) => void }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-indigo-400 bg-indigo-900/50 rounded-full h-10 w-10 flex items-center justify-center">{index + 1}</span>
            <div className="text-xl font-bold text-gray-200 ml-4">
                <EditableField value={step.stepName} onSave={(val) => onUpdate({ stepName: val })} />
            </div>
        </div>
        <div className="text-sm text-gray-400 mb-4"><strong className="text-gray-300">Actor:</strong> <EditableField value={step.actor} onSave={(val) => onUpdate({ actor: val })} /></div>
        <div className="mb-4 text-gray-300"><EditableField value={step.description} onSave={(val) => onUpdate({ description: val })} multiline /></div>
        
        <div className="prose prose-sm max-w-none prose-invert">
            <h4>Detailed Instructions</h4>
            <EditableField value={(step.detailedInstructions || []).join('\n')} onSave={(val) => onUpdate({ detailedInstructions: val.split('\n') })} multiline />
        </div>
    </div>
);

export const ProcessGuideView = ({ sopData, isLoading, setSopContent }: { sopData: SopData | null, isLoading: boolean, setSopContent: React.Dispatch<React.SetStateAction<SopData | null>> }) => {
    if (isLoading) return <LoadingState />;
    if (!sopData) return <EmptyState title="No Process Guide Available" message="Could not generate the Standard Operating Procedure document." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>} />;

    const handleUpdate = (field: keyof SopData, value: any) => {
        setSopContent(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleStepUpdate = (updatedData: Partial<SopStep>, index: number) => {
        setSopContent(prev => {
            if (!prev) return null;
            const newProcedure = [...prev.procedure];
            newProcedure[index] = { ...newProcedure[index], ...updatedData };
            return { ...prev, procedure: newProcedure };
        });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto subtle-bg-pattern-dark">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8 border border-gray-700">
                <h2 className="text-3xl font-extrabold text-gray-100 mb-4">
                    <EditableField value={sopData.title} onSave={(val) => handleUpdate('title', val)} />
                </h2>
                <div className="text-gray-400 italic">
                    <EditableField value={sopData.executiveSummary} onSave={(val) => handleUpdate('executiveSummary', val)} multiline />
                </div>
            </div>
            
            <div className="space-y-8">
                {(sopData.procedure || []).map((step, index) => (
                    <SopStepCard key={index} step={step} index={index} onUpdate={(data) => handleStepUpdate(data, index)} />
                ))}
            </div>
        </div>
    );
};

export const DeepDiveView = ({ history, isLoading, onQuery, hasFullContext }) => {
    const [query, setQuery] = React.useState('');
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onQuery(query);
            setQuery('');
        }
    };

    if (!hasFullContext) {
        return <EmptyState 
            title="Awaiting Full Context" 
            message="The Deep Dive chat becomes available after the initial Consultant Insights have been generated, providing the AI with full context for your questions."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 subtle-bg-pattern-dark">
            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                {history.map((msg, i) => <ChatBubble key={i} message={msg} />)}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <form onSubmit={handleQuerySubmit} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !query} className="p-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isLoading ? <div className="spinner w-6 h-6 border-2"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const ValueStreamMapView = ({ vsmState, isLoading, setValueStreamMapContent }: { vsmState: VsmState, isLoading: boolean, setValueStreamMapContent: React.Dispatch<React.SetStateAction<VsmState>> }) => {
    if (isLoading) return <LoadingState />;
    if (!vsmState.sufficientData) {
        return <EmptyState title="Insufficient Data for VSM" message={vsmState.message || "The provided input lacks specific time durations for tasks and waiting periods, which are essential for VSM calculation."} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />;
    }

    const vsmData = vsmState.data;
    if (!vsmData) return <EmptyState title="No Value Stream Map Available" message="Could not generate the Value Stream Map." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>} />;
    
    const handleUpdate = <K extends keyof VsmData>(field: K, value: VsmData[K]) => {
        setValueStreamMapContent(prev => ({ ...prev, data: prev.data ? { ...prev.data, [field]: value } : null }));
    };
    
    const handleMetricUpdate = (field: keyof VsmData['metrics'], value: string) => {
        setValueStreamMapContent(prev => {
            if (!prev.data) return prev;
            const newData = { ...prev.data, metrics: { ...prev.data.metrics, [field]: value } };
            return { ...prev, data: newData };
        });
    };

    const handleFlowUpdate = (index: number, field: keyof VsmData['flow'][0], value: string) => {
        setValueStreamMapContent(prev => {
            if (!prev.data) return prev;
            const newFlow = [...prev.data.flow];
            newFlow[index] = { ...newFlow[index], [field]: value };
            return { ...prev, data: { ...prev.data, flow: newFlow } };
        });
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <AssistantGuide guidance="This Value Stream Map analyzes your process to identify value-added vs. non-value-added time, helping pinpoint major sources of waste and inefficiency. All fields are editable—click any value to refine the analysis." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <VisualInsightCard title="Total Lead Time" color="blue"><p className="text-3xl font-bold mt-2 text-gray-200"><EditableField value={vsmData.metrics.totalLeadTime} onSave={(val) => handleMetricUpdate('totalLeadTime', val)} /></p></VisualInsightCard>
                <VisualInsightCard title="Value-Added Time" color="green"><p className="text-3xl font-bold mt-2 text-gray-200"><EditableField value={vsmData.metrics.valueAddedTime} onSave={(val) => handleMetricUpdate('valueAddedTime', val)} /></p></VisualInsightCard>
                <VisualInsightCard title="Process Cycle Efficiency" color="purple"><p className="text-3xl font-bold mt-2 text-gray-200"><EditableField value={vsmData.metrics.processCycleEfficiency} onSave={(val) => handleMetricUpdate('processCycleEfficiency', val)} /></p></VisualInsightCard>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-200">Process Flow Analysis</h3>
                <div className="space-y-4">
                    {(vsmData.flow || []).map((step, index) => {
                        const isBottleneck = parseFloat(step.waitTime) > 0 && parseFloat(step.waitTime) > parseFloat(step.processTime);
                        return (
                            <div key={step.stepID} className={`p-4 rounded-lg border-l-8 ${step.valueAdded === 'Yes' ? 'border-green-500' : 'border-red-500'} ${isBottleneck ? 'bottleneck-pulse bg-red-900/30' : 'bg-gray-700'}`}>
                                <h4 className="font-bold text-gray-200">{step.stepNumber}. <EditableField value={step.stepName} onSave={val => handleFlowUpdate(index, 'stepName', val)} /></h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mt-2 text-gray-400">
                                    <div><strong className="text-gray-300">Process Time:</strong> <EditableField value={step.processTime} onSave={val => handleFlowUpdate(index, 'processTime', val)} /></div>
                                    <div><strong className="text-gray-300">Wait Time:</strong> <EditableField value={step.waitTime} onSave={val => handleFlowUpdate(index, 'waitTime', val)} /></div>
                                    <div><strong className="text-gray-300">Lead Time:</strong> <EditableField value={step.leadTime} onSave={val => handleFlowUpdate(index, 'leadTime', val)} /></div>
                                    <div><strong className="text-gray-300">Value-Added:</strong> <EditableField value={step.valueAdded} onSave={val => handleFlowUpdate(index, 'valueAdded', val)} /></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
// Fix: Add definitions and exports for missing view components
export const CustomerJourneyMapView = ({ cjmData, isLoading }: { cjmData: CjmData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!cjmData) return <EmptyState title="No Customer Journey Map Available" message="Could not generate the Customer Journey Map." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>} />;

    const { persona, goal, journey, keyTakeaways } = cjmData;

    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <AssistantGuide guidance="Understanding the customer's perspective is crucial for true process improvement. This map visualizes the customer's experience, highlighting their actions, thoughts, and pain points." />
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
                <h3 className="text-xl font-bold text-gray-200">Persona: {persona}</h3>
                <p className="text-gray-400 mt-1">Goal: {goal}</p>
            </div>
            
            <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stage</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Touchpoints</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Thoughts & Feelings</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pain Points</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Opportunities</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {(journey || []).map((stage, index) => (
                            <tr key={index} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{stage.stage}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{stage.actions}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{stage.touchpoints}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{stage.thoughts}</td>
                                <td className="px-6 py-4 text-sm text-red-300">{stage.painPoints}</td>
                                <td className="px-6 py-4 text-sm text-green-300">{stage.opportunities}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <VisualInsightCard title="Overall Sentiment" color="blue"><p className="text-2xl font-semibold mt-2">{keyTakeaways.overallSentiment}</p></VisualInsightCard>
                <VisualInsightCard title="Critical Pain Point" color="red"><p className="text-gray-300 mt-2">{keyTakeaways.criticalPainPoint}</p></VisualInsightCard>
                <VisualInsightCard title="Top Opportunity" color="green"><p className="text-gray-300 mt-2">{keyTakeaways.topOpportunity}</p></VisualInsightCard>
            </div>
        </div>
    );
};

export const OptimizationPlaybookView = ({ playbookData, isLoading, onCreateProject, isCreatingProject }: { playbookData: PlaybookData | null, isLoading: boolean, onCreateProject: () => void, isCreatingProject: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!playbookData) return <EmptyState title="No Optimization Playbook Available" message="Could not generate the playbook." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>} />;
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-100">{playbookData.playbookTitle}</h2>
                    <p className="text-gray-400 mt-2 max-w-3xl">{playbookData.executiveSummary}</p>
                </div>
                <button onClick={onCreateProject} disabled={isCreatingProject} className="flex-shrink-0 flex items-center px-4 py-2 bg-indigo-600 text-sm text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isCreatingProject ? <div className="spinner w-4 h-4 border-2 border-white rounded-full mr-2"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg>}
                    Create Project
                </button>
            </div>

            {(playbookData.implementationPhases || []).map((phase, index) => (
                <div key={index} className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-200">{phase.phaseName} <span className="text-base font-normal text-gray-500">({phase.estimatedDuration})</span></h3>
                    <p className="text-gray-400 mt-1 mb-4">{phase.phaseGoal}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(phase.actions || []).map((action, actionIndex) => (
                            <InsightCard key={actionIndex} title={action.actionTitle} category="Action Item" impact={action.expectedImpact} effort={action.estimatedEffort} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}>
                                <p>{action.proposedSolution}</p>
                            </InsightCard>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ComplianceRiskView = ({ complianceRiskData, isLoading }: { complianceRiskData: ComplianceRiskData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!complianceRiskData) return <EmptyState title="No Compliance & Risk Analysis Available" message="Could not generate the compliance and risk analysis." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0A11.953 11.953 0 0 1 12 2.25c1.537 0 3.02.423 4.255 1.172Z" /></svg>} />;

    const { summary, complianceIssues, operationalRisks } = complianceRiskData;

    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <AssistantGuide guidance="This analysis identifies potential compliance issues (e.g., GDPR, SOX) and operational risks (e.g., fraud, errors) within your process. Use this to strengthen your governance and control framework." />
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
                <h3 className="text-xl font-bold mb-2 text-gray-200">Executive Summary</h3>
                <p className="text-gray-400">{summary}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h3 className="text-2xl font-bold mb-4 text-gray-200">Compliance Issues</h3>
                    <div className="space-y-4">
                        {(complianceIssues || []).map((issue, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-200">{issue.issue}</h4>
                                    <ImpactEffortPill label="Severity" value={issue.severity} />
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{issue.description}</p>
                                <p className="text-sm text-gray-300 mt-2 font-semibold">Recommendation: <span className="font-normal text-gray-400">{issue.recommendation}</span></p>
                            </div>
                        ))}
                    </div>
                </section>
                 <section>
                    <h3 className="text-2xl font-bold mb-4 text-gray-200">Operational Risks</h3>
                    <div className="space-y-4">
                        {(operationalRisks || []).map((risk, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h4 className="font-bold text-gray-200">{risk.risk}</h4>
                                <div className="flex space-x-2 mt-1">
                                    <ImpactEffortPill label="Likelihood" value={risk.likelihood} />
                                    <ImpactEffortPill label="Impact" value={risk.impact} />
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{risk.description}</p>
                                <p className="text-sm text-gray-300 mt-2 font-semibold">Mitigation: <span className="font-normal text-gray-400">{risk.mitigation}</span></p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export const ProjectCharterView = ({ charterData, isLoading, setProjectCharterContent }: { charterData: ProjectCharterData | null, isLoading: boolean, setProjectCharterContent: React.Dispatch<React.SetStateAction<ProjectCharterData | null>> }) => {
    if (isLoading) return <LoadingState />;
    if (!charterData) return <EmptyState title="No Project Charter Available" message="Could not generate the project charter." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />;

    const handleUpdate = (field: keyof ProjectCharterData, value: any) => {
        setProjectCharterContent(prev => prev ? { ...prev, [field]: value } : null);
    };
    
    const CharterSection = ({ title, children }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-200">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
    
    const CharterField = ({ label, value, field, multiline = false }: { label: string, value: string, field: keyof ProjectCharterData, multiline?: boolean }) => (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <EditableField value={value} onSave={val => handleUpdate(field, val)} multiline={multiline} />
        </div>
    );

    const budgetColors = ["#4f46e5", "#7c3aed", "#c026d3", "#db2777", "#e11d48"];

    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <AssistantGuide guidance="The Project Charter is a foundational document that formally authorizes a project. It outlines the project's objectives, scope, stakeholders, and high-level plan. Use the editable fields to refine and finalize this charter with your team." />
            
            <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                    <h2 className="text-3xl font-extrabold text-gray-100 -mt-2">
                        <EditableField value={charterData.projectName} onSave={(val) => handleUpdate('projectName', val)} />
                    </h2>
                </div>

                <CharterSection title="Project Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CharterField label="Project Sponsor" value={charterData.projectSponsor} field="projectSponsor" />
                        <CharterField label="Project Manager" value={charterData.projectManager} field="projectManager" />
                    </div>
                    <CharterField label="Problem Statement" value={charterData.problemStatement} field="problemStatement" multiline />
                    <CharterField label="Business Case" value={charterData.businessCase} field="businessCase" multiline />
                </CharterSection>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CharterSection title="Budget">
                        <StatCard title="Estimated Total Budget" value={`$${charterData.estimatedTotalBudget.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} color="green" />
                        <StatPieChart data={charterData.budgetBreakdown} colors={budgetColors} />
                    </CharterSection>
                    <CharterSection title="Stakeholders">
                        <ul className="space-y-3">
                            {(charterData.keyStakeholders || []).map((s, i) => (
                                <li key={i} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md">
                                    <div>
                                        <p className="font-semibold text-gray-200">{s.name}</p>
                                        <p className="text-xs text-gray-400">{s.role}</p>
                                    </div>
                                    <ImpactEffortPill label="Influence" value={s.influence} />
                                </li>
                            ))}
                        </ul>
                    </CharterSection>
                </div>
            </div>
        </div>
    );
};

export const CommunicationPlanView = ({ commsData, isLoading }: { commsData: CommunicationPlanData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!commsData) return <EmptyState title="No Communication Plan Available" message="Could not generate the communication plan." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />;

    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <AssistantGuide guidance="A strong communication plan is key to project success. This plan outlines who needs to be informed, about what, how, and when. Review and refine this plan with your project team." />
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
                <h3 className="text-xl font-bold mb-2 text-gray-200">Communication Strategy Summary</h3>
                <p className="text-gray-400">{commsData.summary}</p>
            </div>
            <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Communication Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Audience</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Frequency</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {(commsData.plan || []).map((item, index) => (
                            <tr key={index} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{item.communicationType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.audience}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.method}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.frequency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.owner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ProjectExecutionView = ({ projectData, setProjectData, onBack, onCreateNew, onExport, playbookData }: { projectData: ProjectData | null, setProjectData: (data: ProjectData) => void, onBack: () => void, onCreateNew: () => void, onExport: () => void, playbookData: PlaybookData | null }) => {
    const [view, setView] = React.useState<ProjectView>('kanban');
    const [selectedTask, setSelectedTask] = React.useState<ProjectTask | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    if (!projectData) return <EmptyState title="No Project Created" message="Create a project from the Optimization Playbook to begin." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg>} />;

    const handleTaskClick = (task: ProjectTask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask: ProjectTask) => {
        setProjectData({
            ...projectData,
            tasks: projectData.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        });
        setIsModalOpen(false);
    };

    const columns: { [key in ProjectStatus]: ProjectTask[] } = {
        'Not Started': projectData.tasks.filter(t => t.status === 'Not Started'),
        'In Progress': projectData.tasks.filter(t => t.status === 'In Progress'),
        'Completed': projectData.tasks.filter(t => t.status === 'Completed'),
        'Blocked': projectData.tasks.filter(t => t.status === 'Blocked'),
    };
    const columnOrder: ProjectStatus[] = ['Not Started', 'In Progress', 'Completed', 'Blocked'];

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {columnOrder.map(status => (
                    <div key={status} className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-200 mb-4">{status} ({columns[status].length})</h3>
                        <div className="space-y-4">
                            {columns[status].map(task => (
                                <ProjectTaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} onDragStart={() => {}} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <TaskModal isOpen={isModalOpen} task={selectedTask} onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} />
        </div>
    );
};

export const ProjectCreationView = () => (
    <div className="p-8">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="mt-4 text-gray-400">This is a placeholder for the project creation form.</p>
    </div>
);

export const AppGuideView = () => (
    <div className="p-8">
        <h1 className="text-2xl font-bold">Application Guide</h1>
        <p className="mt-4 text-gray-400">This is a placeholder for the application guide.</p>
    </div>
);
