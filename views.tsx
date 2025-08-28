/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
    ConsultantInsightsData, SopData, CjmData, PlaybookData, ExcelDataItem,
    ProjectData, ProjectView, ProjectTask, ProjectStatus, ModuleStatus, PainPoint, OptimizationOpportunity,
    VsmState, ProjectCharterData, CommunicationPlanData, View, ComplianceRiskData
} from './types.ts';
import {
    ChatBubble, ModuleCard, VisualInsightCard, InsightTag, SopStepCard,
    StatusPill, PriorityPill, ProjectTaskCard, TaskModal, ExportControls, InsightCard, ImpactEffortPill, EditableField,
    StatCard, StatPieChart
} from './components.tsx';

// === UI Components for Different Views ===

const PillarShowcase = ({ title, description, items, icon }) => (
    <div className="showcase-card-container h-full">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 h-full flex flex-col showcase-card shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center mr-4 flex-shrink-0">{icon}</div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <p className="text-indigo-300 text-sm">{description}</p>
                </div>
            </div>
            <div className="space-y-3 mt-4 overflow-y-auto">
                {items.map((item, i) => (
                    <div key={i} className="bg-gray-700/50 p-3 rounded-lg text-sm">
                        <p className="font-semibold text-gray-200">{item.title}</p>
                        <p className="text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const GenerationProgress = ({ statuses }: { statuses: { [key: string]: ModuleStatus } }) => {
    const modules = [
        { key: 'process-map', title: 'Process Map' },
        { key: 'consultant-insights', title: 'Consultant Insights' },
        { key: 'compliance-risk', title: 'Compliance & Risk Analysis' },
        { key: 'customer-journey-map', title: 'Customer Journey Map' },
        { key: 'value-stream-map', title: 'Value Stream Map' },
        { key: 'process-guide', title: 'Process Guide (SOP)' },
        { key: 'optimization-playbook', title: 'Optimization Playbook' },
        { key: 'project-charter', title: 'Project Charter' },
        { key: 'communication-plan', title: 'Communication Plan' },
    ];

    const StatusIcon = ({ status }: { status: ModuleStatus }) => {
        switch (status) {
            case 'generating': return <div className="spinner w-5 h-5 border-2 border-indigo-400 rounded-full"></div>;
            case 'ready': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
            case 'error': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
            case 'queued':
            default: return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
        }
    };

    const statusTextClasses = {
        generating: 'text-indigo-300 animate-pulse',
        ready: 'text-green-400',
        error: 'text-red-400',
        queued: 'text-gray-500',
        locked: 'text-gray-600'
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Generating Intelligence...</h3>
            <p className="text-gray-400 mb-6 text-sm">The AI is analyzing your input and building your process intelligence suite. Please wait, this may take a few moments.</p>
            <div className="space-y-3 overflow-y-auto">
                {modules.map(module => {
                    const status = statuses[module.key] || 'locked';
                    return (
                        <div key={module.key} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                            <span className="text-gray-300">{module.title}</span>
                            <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium capitalize ${statusTextClasses[status] || 'text-gray-500'}`}>{status}</span>
                                <StatusIcon status={status} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

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

export const InputScreen = ({ 
    inputText, setInputText, fileName, handleFileChange, clearFile, analysisLevel, 
    setAnalysisLevel, generalInstructions, setGeneralInstructions, onGenerate, isLoading, 
    error
}: InputScreenProps) => {
    const processItems = [
        { title: 'BPMN 2.0 Process Map', desc: 'Auto-generate flawless, interactive diagrams.' },
        { title: 'Consultant Insights', desc: 'Pinpoint bottlenecks, pain points, & automation opportunities.' },
        { title: 'Value Stream & Customer Journey', desc: 'Analyze flow efficiency and customer experience.' },
        { title: 'Actionable Outputs', desc: 'Generate SOPs and strategic optimization playbooks.' },
    ];
    const projectItems = [
        { title: 'Project Charter', desc: 'Formalize project scope, goals, and stakeholders.' },
        { title: 'Communication Plan', desc: 'Strategize stakeholder communication and reporting.' },
        { title: 'Project Execution', desc: 'Translate playbooks into manageable Kanban boards.' },
        { title: 'From Insight to Action', desc: 'Bridge the gap between process analysis and project delivery.' },
    ];

    const canUseText = !fileName;
    const canUseFile = !inputText;

    return (
        <div className="w-full min-h-full flex flex-col bg-gray-900 text-white subtle-bg-pattern-dark p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Process Intelligence Platform</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">Transform raw text and documents into a full suite of interactive, AI-driven business analyses.</p>
            </div>
            <div className="flex-grow w-full max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 flex flex-col">
                    <div className="flex-grow flex flex-col overflow-y-auto">
                        <h3 className="text-xl font-semibold text-white mb-4">1. Provide Process Information</h3>
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Paste your process description, meeting notes, or any raw text here..."
                            className={`w-full p-4 bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 text-base h-72 resize-none transition-opacity ${!canUseText ? 'opacity-50 bg-gray-900/50 cursor-not-allowed' : 'border-gray-600'}`}
                            disabled={!canUseText}
                            aria-label="Process text input"
                        />
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-600"></div><span className="flex-shrink mx-4 text-gray-500 text-sm">or</span><div className="flex-grow border-t border-gray-600"></div>
                        </div>
                        <div className={`${!canUseFile ? 'opacity-50' : ''}`}>
                            {!fileName ? (
                                <label htmlFor="file-upload-input" className={`w-full flex justify-center items-center px-4 py-3 bg-gray-900 text-indigo-300 rounded-md tracking-wide border-2 border-dashed border-gray-600 transition-colors ${canUseFile ? 'cursor-pointer hover:bg-indigo-900/20 hover:border-indigo-500' : 'cursor-not-allowed'}`}>
                                    <svg className="w-8 h-8 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <div>
                                        <span className="text-base font-semibold block">Upload Document</span>
                                        <span className="text-xs text-gray-400">Supports .txt, .pdf, .docx, .pptx</span>
                                    </div>
                                </label>
                            ) : (
                                <div className="flex justify-between items-center bg-indigo-900/30 text-indigo-200 p-3 rounded-md text-sm h-full">
                                    <span className="font-medium truncate" title={fileName}>{fileName}</span>
                                    <button onClick={clearFile} className="ml-4 text-indigo-300 hover:text-white focus:outline-none p-1 rounded-full hover:bg-indigo-500/50" aria-label="Remove file">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <input id="file-upload-input" type="file" className="hidden" onChange={handleFileChange} disabled={!canUseFile} accept=".txt,.pdf,.doc,.docx,.pptx" />
                    </div>
                    <div className="mt-6 flex-shrink-0">
                        <h3 className="text-xl font-semibold text-white mb-4">2. Configure Analysis</h3>
                        <select
                            value={analysisLevel} onChange={e => setAnalysisLevel(e.target.value)}
                            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 mb-4"
                            aria-label="Select analysis level"
                        >
                            <option>Level 1: High-Level / Executive Summary Map</option>
                            <option>Level 2: End-to-End / Macro Process Map</option>
                            <option>Level 3: Detailed / Departmental Process Map</option>
                            <option>Level 4: Executable / Workflow / System-Specific Map</option>
                        </select>
                        <textarea
                            value={generalInstructions} onChange={e => setGeneralInstructions(e.target.value)}
                            placeholder="Add specific instructions for the AI... (Optional)"
                            className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 resize-none"
                            aria-label="General instructions for AI"
                        />
                    </div>
                    <div className="mt-6 flex-shrink-0">
                        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm mb-4">{error}</p>}
                        <button
                            onClick={onGenerate}
                            disabled={isLoading || (!inputText && !fileName)}
                            className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                            {isLoading ? <div className="spinner w-5 h-5 border-2 border-white rounded-full"></div> : <span>Generate Process & Analyses</span>}
                        </button>
                    </div>
                </div>

                <div className="grid grid-rows-1 lg:grid-rows-2 gap-8">
                    <PillarShowcase 
                        title="Process Intelligent"
                        description="Deconstruct & Analyze"
                        items={processItems}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>}
                    />
                    <PillarShowcase 
                        title="Project Intelligent"
                        description="Strategize & Execute"
                        items={projectItems}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
};

export const ModulePageWrapper = ({ title, children, onBack, exportMenu = null }) => (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200">
        <div className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700 mr-3" aria-label="Go back">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
            </div>
            {exportMenu && <div>{exportMenu}</div>}
        </div>
        <div className="flex-grow overflow-auto">
            {children}
        </div>
    </div>
);

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
    const insightModules = [
        { view: 'process-map', title: 'Process Map', description: "Interactive BPMN 2.0 diagram of your process.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-1.5m-15 0H3.75c0-5.922 4.836-10.74 10.74-10.74 2.263 0 4.34.707 6.01 1.907" /></svg> },
        { view: 'consultant-insights', title: 'Consultant Insights', description: "AI-driven analysis of pain points & opportunities.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> },
        { view: 'process-guide', title: 'Process Guide (SOP)', description: "A comprehensive, step-by-step operational document.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> },
    ];
    const analysisModules = [
        { view: 'value-stream-map', title: 'Value Stream Map', description: "Identifies waste and process flow inefficiencies.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg> },
        { view: 'customer-journey-map', title: 'Customer Journey', description: "Maps the process from the customer's perspective.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg> },
        { view: 'compliance-risk', title: 'Compliance & Risk', description: "Identifies compliance gaps and operational risks.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0A11.953 11.953 0 0 1 12 2.25c1.537 0 3.02.423 4.255 1.172Z" /></svg> },
        { view: 'deep-dive', title: 'Deep Dive Chat', description: "Ask detailed questions and get instant answers.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
    ];
    const strategyModules = [
        { view: 'optimization-playbook', title: 'Optimization Playbook', description: "A strategic, actionable plan for improvement.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> },
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
                {renderSection("Process Insight & Documentation", "Core outputs to visualize, understand, and document your process.", insightModules)}
                {renderSection("Strategic Analysis", "Deeper analytical perspectives to uncover strategic improvement levers.", analysisModules)}
                {renderSection("Actionable Strategy", "Transform insights into a concrete plan for execution.", strategyModules)}
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

export const ProcessGuideView = ({ sopData, isLoading }: { sopData: SopData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!sopData) return <EmptyState title="No Process Guide Available" message="Could not generate the Standard Operating Procedure document." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>} />;

    return (
        <div className="p-8 max-w-4xl mx-auto subtle-bg-pattern-dark">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8 border border-gray-700">
                <h2 className="text-3xl font-extrabold text-gray-100 mb-4">{sopData.title}</h2>
                <p className="text-gray-400 italic">{sopData.executiveSummary}</p>
            </div>
            
            <div className="space-y-8">
                {sopData.procedure.map((step, index) => (
                    <SopStepCard key={index} step={step} index={index} />
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

export const ValueStreamMapView = ({ vsmState, isLoading }: { vsmState: VsmState, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!vsmState.sufficientData) {
        return <EmptyState title="Insufficient Data for VSM" message={vsmState.message || "The provided input lacks specific time durations for tasks and waiting periods, which are essential for VSM calculation."} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />;
    }

    const vsmData = vsmState.data;
    if (!vsmData) return <EmptyState title="No Value Stream Map Available" message="Could not generate the Value Stream Map." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>} />;

    const wastesGrouped = (vsmData.wastes || []).reduce((acc, waste) => {
        acc[waste.associatedStepID] = acc[waste.associatedStepID] || [];
        acc[waste.associatedStepID].push(waste);
        return acc;
    }, {});
    
    return (
        <div className="p-8 subtle-bg-pattern-dark">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <VisualInsightCard title="Total Lead Time" color="blue"><p className="text-3xl font-bold mt-2 text-gray-200">{vsmData.metrics.totalLeadTime}</p></VisualInsightCard>
                <VisualInsightCard title="Value-Added Time" color="green"><p className="text-3xl font-bold mt-2 text-gray-200">{vsmData.metrics.valueAddedTime}</p></VisualInsightCard>
                <VisualInsightCard title="Process Cycle Efficiency" color="purple"><p className="text-3xl font-bold mt-2 text-gray-200">{vsmData.metrics.processCycleEfficiency}</p></VisualInsightCard>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-200">Process Flow</h3>
                <div className="space-y-4">
                    {(vsmData.flow || []).map(step => {
                        const isBottleneck = parseFloat(step.waitTime) > 0 && parseFloat(step.waitTime) > parseFloat(step.processTime);
                        return (
                            <div key={step.stepID} className={`p-4 rounded-lg border-l-8 ${step.valueAdded === 'Yes' ? 'border-green-500' : 'border-red-500'} ${isBottleneck ? 'bottleneck-pulse bg-red-900/30' : 'bg-gray-700'}`}>
                                <h4 className="font-bold text-gray-200">{step.stepNumber}. {step.stepName}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2 text-gray-400">
                                    <p><strong className="text-gray-300">Process Time:</strong> {step.processTime}</p>
                                    <p><strong className="text-gray-300">Wait Time:</strong> {step.waitTime}</p>
                                    <p><strong className="text-gray-300">Lead Time:</strong> {step.leadTime}</p>
                                    <p><strong className="text-gray-300">Value-Added:</strong> {step.valueAdded}</p>
                                </div>
                                {wastesGrouped[step.stepID] && (
                                    <div className="mt-3 pt-3 border-t border-gray-600">
                                        <h5 className="font-semibold text-sm text-gray-300">Identified Wastes:</h5>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {wastesGrouped[step.stepID].map((waste, i) => <InsightTag key={i} color="yellow">{waste.wasteType}</InsightTag>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const CustomerJourneyMapView = ({ cjmData, isLoading }: { cjmData: CjmData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!cjmData) return <EmptyState title="No Customer Journey Map Available" message="Could not generate the Customer Journey Map." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>} />;

    return (
        <div className="p-8 subtle-bg-pattern-dark">
             <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-700">
                <h3 className="text-xl font-bold text-gray-200">Persona: {cjmData.persona}</h3>
                <p className="text-gray-400">Goal: {cjmData.goal}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg shadow-md border border-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            {['Stage', 'Actions', 'Touchpoints', 'Thoughts & Feelings', 'Pain Points', 'Opportunities'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {(cjmData.journey || []).map((j, i) => (
                            <tr key={i} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-200">{j.stage}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{j.actions}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{j.touchpoints}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{j.thoughts}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-red-400">{j.painPoints}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-green-400">{j.opportunities}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const OptimizationPlaybookView = ({ playbookData, isLoading, onCreateProject, isCreatingProject }: { playbookData: PlaybookData | null, isLoading: boolean, onCreateProject: () => void, isCreatingProject: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!playbookData) return <EmptyState title="No Optimization Playbook Available" message="Could not generate the Optimization Playbook." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>} />;

    return (
        <div className="p-8 max-w-6xl mx-auto subtle-bg-pattern-dark">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8 text-center border border-gray-700">
                <h2 className="text-3xl font-extrabold text-gray-100 mb-4">{playbookData.playbookTitle}</h2>
                <p className="text-gray-400 italic max-w-3xl mx-auto">{playbookData.executiveSummary}</p>
                <button
                    onClick={onCreateProject}
                    disabled={isCreatingProject}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                >
                    {isCreatingProject ? 'Creating...' : 'Create Project from Playbook'}
                </button>
            </div>
            
            {(playbookData.implementationPhases || []).map((phase, i) => (
                <div key={i} className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-200 mb-4 pb-2 border-b-2 border-indigo-500">{phase.phaseName}: {phase.phaseGoal}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(phase.actions || []).map((action, j) => (
                            <div key={j} className="bg-gray-800 p-5 rounded-lg shadow-md h-full flex flex-col border border-gray-700">
                                <h4 className="font-bold text-lg mb-2 text-gray-200">{action.actionTitle}</h4>
                                <p className="text-sm text-gray-400 mb-3 flex-grow">{action.proposedSolution}</p>
                                <div className="flex justify-between text-sm font-medium mt-auto">
                                    <InsightTag color="blue">Impact: {action.expectedImpact}</InsightTag>
                                    <InsightTag color="yellow">Effort: {action.estimatedEffort}</InsightTag>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ProjectCreationView = ({ hasPlaybook, onCreateFromPlaybook, onCreateProject }) => {
    const [title, setTitle] = React.useState('');

    return (
        <div className="p-8 max-w-lg mx-auto subtle-bg-pattern-dark">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Create a Project</h2>
            {hasPlaybook && (
                <div className="mb-6">
                    <button onClick={onCreateFromPlaybook} className="w-full p-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
                        Create Project from Playbook
                    </button>
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-700"></div><span className="mx-4 text-gray-500">OR</span><div className="flex-grow border-t border-gray-700"></div>
                    </div>
                </div>
            )}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <h3 className="font-semibold mb-4 text-gray-300">Create a Blank Project</h3>
                <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Project Title"
                    className="w-full p-2 border rounded-md mb-4 bg-gray-900 border-gray-600"
                />
                <button 
                    onClick={() => onCreateProject(title || 'New Project', [])}
                    disabled={!title}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:bg-gray-500"
                >
                    Create Blank Project
                </button>
            </div>
        </div>
    );
};

export const ProjectExecutionView = ({ projectData, setProjectData, onBack, onCreateNew, onExport, playbookData }: { projectData: ProjectData | null, setProjectData: React.Dispatch<React.SetStateAction<ProjectData | null>>, onBack: () => void, onCreateNew: () => void, onExport: () => void, playbookData: PlaybookData | null }) => {
    const [view, setView] = React.useState<ProjectView>('overview');
    const [selectedTask, setSelectedTask] = React.useState<ProjectTask | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [sortConfig, setSortConfig] = React.useState<{ key: keyof ProjectTask; direction: 'ascending' | 'descending' }>({ key: 'createdAt', direction: 'ascending' });

    if (!projectData) {
        return (
             <div className="p-8 text-center subtle-bg-pattern-dark">
                 <h2 className="text-xl font-semibold mb-4 text-gray-200">No Project Loaded</h2>
                 <button onClick={onCreateNew} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Create a New Project</button>
             </div>
        );
    }
    
    const statuses: ProjectStatus[] = ['Not Started', 'In Progress', 'Completed', 'Blocked'];

    const handleTaskClick = (task: ProjectTask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleAddNewTask = (status: ProjectStatus) => {
        setSelectedTask({
            id: `task-${Math.random().toString(36).substr(2, 9)}`,
            title: '',
            status: status,
            priority: 'Medium',
            phase: '',
            description: '',
            metrics: [],
            resources: [],
            createdAt: new Date().toISOString(),
        });
        setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask: ProjectTask) => {
        setProjectData(prev => {
            if (!prev) return null;
            const taskExists = prev.tasks.some(t => t.id === updatedTask.id);
            const tasks = taskExists
                ? prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                : [...prev.tasks, updatedTask];
            return { ...prev, tasks };
        });
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const onDragStart = (e: React.DragEvent, task: ProjectTask) => e.dataTransfer.setData("taskId", task.id);
    const onDrop = (e: React.DragEvent, status: ProjectStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        setProjectData(prev => {
            if (!prev) return null;
            const tasks = prev.tasks.map(t => t.id === taskId ? { ...t, status: status } : t);
            return { ...prev, tasks };
        });
    };
    const onDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const requestSort = (key: keyof ProjectTask) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTasks = React.useMemo(() => {
        let sortableTasks = [...projectData.tasks];
        if (sortConfig !== null) {
            sortableTasks.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableTasks;
    }, [projectData.tasks, sortConfig]);

    const ViewButton = ({ viewType, children, icon }) => (
        <button
            onClick={() => setView(viewType)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${view === viewType ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );

    const ProjectOverview = () => {
        const taskCounts = projectData.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as { [key in ProjectStatus]: number });

        const pieData = [
            { label: 'Not Started', value: taskCounts['Not Started'] || 0 },
            { label: 'In Progress', value: taskCounts['In Progress'] || 0 },
            { label: 'Completed', value: taskCounts['Completed'] || 0 },
            { label: 'Blocked', value: taskCounts['Blocked'] || 0 },
        ];
        const pieColors = ['#4b5563', '#3b82f6', '#22c55e', '#ef4444'];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Tasks" value={projectData.tasks.length} color="blue" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                    <StatCard title="Completed" value={taskCounts['Completed'] || 0} color="green" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <StatCard title="In Progress" value={taskCounts['In Progress'] || 0} color="blue" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <StatCard title="Blocked" value={taskCounts['Blocked'] || 0} color="red" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-gray-100">{playbookData?.playbookTitle || projectData.title}</h3>
                        <p className="text-gray-400 mt-2 italic">{playbookData?.executiveSummary || "A project to implement key optimizations."}</p>
                    </div>
                     <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                         <h3 className="text-xl font-bold text-gray-100 mb-4">Task Status</h3>
                         <StatPieChart data={pieData} colors={pieColors} />
                    </div>
                </div>
            </div>
        );
    };

    const KanbanView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {statuses.map(status => (
                <div key={status} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 h-full flex flex-col" onDrop={(e) => onDrop(e, status)} onDragOver={onDragOver}>
                    <h3 className="font-semibold mb-4 text-gray-300 px-1">{status}</h3>
                    <div className="space-y-3 flex-grow">
                        {projectData.tasks.filter(t => t.status === status).map(task => (
                            <ProjectTaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} onDragStart={(e) => onDragStart(e, task)} />
                        ))}
                    </div>
                     <button onClick={() => handleAddNewTask(status)} className="mt-3 w-full text-left p-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md">+ Add Task</button>
                </div>
            ))}
        </div>
    );
    
    const ListView = () => (
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('title')}>Title</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('status')}>Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('priority')}>Priority</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phase</th>
                    </tr>
                </thead>
                 <tbody className="divide-y divide-gray-700">
                    {sortedTasks.map(task => (
                        <tr key={task.id} onClick={() => handleTaskClick(task)} className="hover:bg-gray-700/50 cursor-pointer">
                            <td className="px-4 py-3 text-sm font-medium text-gray-200">{task.title}</td>
                            <td className="px-4 py-3 text-sm"><StatusPill status={task.status} /></td>
                            <td className="px-4 py-3 text-sm"><PriorityPill priority={task.priority} /></td>
                            <td className="px-4 py-3 text-sm text-gray-400">{task.phase}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <ModulePageWrapper title={projectData.title} onBack={onBack} exportMenu={<ExportControls onExportXLSX={onExport} hasAnalysis={true} />}>
            <div className="p-4 sm:p-6 h-full flex flex-col subtle-bg-pattern-dark">
                <div className="flex-shrink-0 mb-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
                        <ViewButton viewType="overview" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>Overview</ViewButton>
                        <ViewButton viewType="kanban" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>}>Kanban</ViewButton>
                        <ViewButton viewType="list" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}>List</ViewButton>
                    </div>
                </div>
                <div className="flex-grow overflow-auto">
                    {view === 'overview' && <ProjectOverview />}
                    {view === 'kanban' && <KanbanView />}
                    {view === 'list' && <ListView />}
                </div>
            </div>
            {isModalOpen && <TaskModal isOpen={isModalOpen} task={selectedTask} onClose={() => { setIsModalOpen(false); setSelectedTask(null); }} onSave={handleSaveTask} />}
        </ModulePageWrapper>
    );
};

export const AppGuideView = () => (
    <div className="p-8 max-w-4xl mx-auto subtle-bg-pattern-dark">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-200">About the Application</h2>
            <p className="text-gray-400 mb-4">
                This Process Intelligence Platform leverages Generative AI to transform unstructured process descriptions into a comprehensive suite of professional business analysis artifacts. By simply providing text or a document, you can automatically generate BPMN 2.0 process maps, identify optimization opportunities, create detailed SOPs, and much more.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-300">Input Data Guidelines</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold">Text Input</h4>
                    <p className="text-sm text-gray-500">For best results, provide a clear, step-by-step description of the process. Include actors (who does the work), systems used, and key decisions. There's no strict character limit, but clarity is more important than length.</p>
                    <pre className="bg-gray-900 p-2 rounded-md text-xs mt-2 text-gray-400"><code>Example: "First, the AP Clerk receives an invoice. They open SAP and verify the invoice against the purchase order. If it matches, they send it for approval. If not, they contact the vendor."</code></pre>
                </div>
                <div>
                    <h4 className="font-bold">Document Upload (.txt, .pdf, .docx, .pptx)</h4>
                    <p className="text-sm text-gray-500">The application can extract process information from various documents. Ensure the document contains relevant process descriptions. While there's no hard file size limit, larger files may take longer to process. For best performance, use documents under 10MB.</p>
                </div>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-300">Suggested Web Page Structure</h3>
            <p className="text-gray-400 mb-4">To present this application to users, a simple and effective web page could be structured as follows:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong>Hero Section:</strong> A compelling headline like "Turn Process Descriptions into Actionable Intelligence, Instantly." with a call-to-action to start an analysis.</li>
                <li><strong>How It Works:</strong> A simple 3-step visual guide: 1. Input Data (Paste text or upload a file), 2. Set Analysis Level, 3. Generate Intelligence.</li>
                <li><strong>Features/Outputs Section:</strong> A grid showcasing the different outputs (Process Map, Consultant Insights, SOP, etc.) with icons and brief descriptions.</li>
                <li><strong>Input Area:</strong> The main application interface itself, allowing users to directly interact with the tool.</li>
            </ul>
        </div>
    </div>
);

export const ProjectCharterView = ({ charterData, isLoading, setProjectCharterContent }: { charterData: ProjectCharterData | null, isLoading: boolean, setProjectCharterContent: React.Dispatch<React.SetStateAction<ProjectCharterData | null>> }) => {
    if (isLoading) return <LoadingState />;
    if (!charterData) return <EmptyState title="No Project Charter Available" message="The AI is generating your Project Charter. This will be available once the core process analysis is complete." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />;

    const handleUpdate = (field, value) => {
        setProjectCharterContent(prev => prev ? { ...prev, [field]: value } : null);
    };

    const colors = ["#4f46e5", "#ec4899", "#22c55e", "#f59e0b", "#6366f1", "#d946ef"];
    const budgetGradient = (charterData.budgetBreakdown || []).reduce((acc, item, index) => {
        const percentage = (item.value / charterData.estimatedTotalBudget) * 100;
        const color = colors[index % colors.length];
        acc.gradient.push(`${color} ${acc.lastPercentage}% ${acc.lastPercentage + percentage}%`);
        acc.lastPercentage += percentage;
        return acc;
    }, { gradient: [], lastPercentage: 0 }).gradient.join(', ');

    const CharterCard = ({ title, children, icon, className = '' }) => (
        <div className={`bg-gray-800 p-6 rounded-xl border border-gray-700 ${className}`}>
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-500/20 text-indigo-300 rounded-lg mr-3">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-200 uppercase tracking-wider">{title}</h3>
            </div>
            <div className="text-sm">{children}</div>
        </div>
    );
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 subtle-bg-pattern-dark">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-100">
                        <EditableField value={charterData.projectName} onSave={(val) => handleUpdate('projectName', val)} />
                    </h2>
                    <div className="mt-2 flex space-x-6 text-sm text-gray-400">
                        <span><strong>Sponsor:</strong> <EditableField value={charterData.projectSponsor} onSave={(val) => handleUpdate('projectSponsor', val)} /></span>
                        <span><strong>Manager:</strong> <EditableField value={charterData.projectManager} onSave={(val) => handleUpdate('projectManager', val)} /></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <CharterCard title="Business Case" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                            <div className="text-gray-400"><EditableField value={charterData.businessCase} onSave={(val) => handleUpdate('businessCase', val)} multiline={true} /></div>
                        </CharterCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CharterCard title="In Scope" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}>
                                <div className="text-gray-400"><EditableField value={(charterData.scopeIn || []).join('\n')} onSave={(val) => handleUpdate('scopeIn', val.split('\n'))} multiline={true} /></div>
                            </CharterCard>
                             <CharterCard title="Out of Scope" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}>
                                <div className="text-gray-400"><EditableField value={(charterData.scopeOut || []).join('\n')} onSave={(val) => handleUpdate('scopeOut', val.split('\n'))} multiline={true} /></div>
                            </CharterCard>
                        </div>
                    </div>
                     <div className="space-y-6">
                        <CharterCard title="Project Budget" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}>
                            <div className="donut-chart" style={{ background: `conic-gradient(${budgetGradient})` }}>
                                <div className="donut-chart-center"><span className="donut-chart-total">${(charterData.estimatedTotalBudget || 0).toLocaleString()}</span><span className="donut-chart-label">Total</span></div>
                            </div>
                            <ul className="text-xs space-y-1 mt-4 text-gray-400">
                                {(charterData.budgetBreakdown || []).map((item, i) => <li key={i} className="flex items-center justify-between"><span className="flex items-center"><div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors[i % colors.length] }}></div>{item.label}</span><span className="font-medium text-gray-300">${item.value.toLocaleString()}</span></li>)}
                            </ul>
                        </CharterCard>
                     </div>
                </div>

                <CharterCard title="Major Milestones" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                    <div className="relative pl-5 mt-2">
                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-600"></div>
                        {(charterData.majorMilestones || []).map((m, i) => {
                            const statusColor = m.status === 'Completed' ? 'bg-green-500' : m.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-500';
                            return (<div key={i} className="relative mb-6"><div className={`absolute -left-5 top-1 w-5 h-5 rounded-full ${statusColor} border-4 border-gray-800`}></div><p className="font-semibold text-gray-200">{m.milestone}</p><p className="text-xs text-gray-400">{m.date}</p></div>)
                        })}
                    </div>
                </CharterCard>
            </div>
        </div>
    );
};

export const CommunicationPlanView = ({ commsData, isLoading }: { commsData: CommunicationPlanData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!commsData) return <EmptyState title="No Communication Plan Available" message="Could not generate the Communication Plan." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />;

    return (
        <div className="p-4 sm:p-8 subtle-bg-pattern-dark">
            <div className="max-w-5xl mx-auto">
                <div className="bg-gray-800 p-8 rounded-lg shadow-xl mb-8 border border-gray-700">
                    <h2 className="text-3xl font-extrabold text-gray-100">Communication Plan</h2>
                    <p className="text-gray-400 mt-2">{commsData.summary}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg shadow-md border border-gray-700">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {['Communication Type', 'Audience', 'Method', 'Frequency', 'Owner'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {(commsData.plan || []).map((item, i) => (
                                <tr key={i} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-200">{item.communicationType}</td>
                                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{item.audience}</td>
                                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{item.method}</td>
                                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{item.frequency}</td>
                                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-400">{item.owner}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const ComplianceRiskView = ({ complianceRiskData, isLoading }: { complianceRiskData: ComplianceRiskData | null, isLoading: boolean }) => {
    if (isLoading) return <LoadingState />;
    if (!complianceRiskData) return <EmptyState title="No Compliance & Risk Data Available" message="Could not generate the Compliance & Risk analysis." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0A11.953 11.953 0 0 1 12 2.25c1.537 0 3.02.423 4.255 1.172Z" /></svg>} />;
    
    const Table = ({ title, headers, data, children }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-bold text-gray-200 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                 <table className="min-w-full">
                    <thead className="bg-gray-700/50">
                        <tr>{headers.map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 text-gray-300">
                        {(data || []).map((item, index) => children(item, index))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 subtle-bg-pattern-dark">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
                    <h2 className="text-3xl font-extrabold text-gray-100">Compliance & Risk Analysis</h2>
                    <p className="text-gray-400 mt-2">{complianceRiskData.summary}</p>
                </div>

                <Table title="Compliance Issues" headers={['Issue', 'Severity', 'Description', 'Recommendation']} data={complianceRiskData.complianceIssues}>
                    {(item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap font-semibold text-sm">{item.issue}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm"><ImpactEffortPill label="" value={item.severity} /></td>
                            <td className="px-4 py-3 text-sm">{item.description}</td>
                            <td className="px-4 py-3 text-sm">{item.recommendation}</td>
                        </tr>
                    )}
                </Table>
                
                <Table title="Operational Risks" headers={['Risk', 'Likelihood', 'Impact', 'Mitigation Strategy']} data={complianceRiskData.operationalRisks}>
                     {(item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 font-semibold text-sm">{item.risk}</td>
                            <td className="px-4 py-3 text-sm"><ImpactEffortPill label="" value={item.likelihood} /></td>
                            <td className="px-4 py-3 text-sm"><ImpactEffortPill label="" value={item.impact} /></td>
                            <td className="px-4 py-3 text-sm">{item.mitigation}</td>
                        </tr>
                    )}
                </Table>
            </div>
        </div>
    );
};