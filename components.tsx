/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SopStep, ProjectTask, ProjectStatus, ProjectPriority, ModuleStatus, PlatformView } from './types.ts';

export const PlatformTabs = ({ platformView, setPlatformView }: { platformView: PlatformView, setPlatformView: (view: PlatformView) => void }) => {
    const TabButton = ({ view, label }: { view: PlatformView, label: string }) => (
        <button
            onClick={() => setPlatformView(view)}
            className={`whitespace-nowrap py-3 px-4 text-sm font-semibold border-b-4 transition-colors duration-200 focus:outline-none ${
                platformView === view
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-4 sm:px-6 flex-shrink-0">
            <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                <TabButton view="process" label="Process Intelligent" />
                <TabButton view="project" label="Project Intelligent" />
            </nav>
        </div>
    );
};

export const EditableField = ({ value, onSave, multiline = false, placeholder = "Click to edit" }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState(value);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !multiline) {
            handleSave();
        } else if (e.key === 'Escape') {
            setCurrentValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        const commonProps = {
            ref: inputRef,
            value: currentValue,
            onChange: (e) => setCurrentValue(e.target.value),
            onBlur: handleSave,
            onKeyDown: handleKeyDown,
            className: "w-full bg-gray-900 border border-indigo-500 rounded-md p-1 -m-1 text-sm text-gray-200 focus:outline-none",
        };
        return multiline 
            ? <textarea {...commonProps} rows={4} /> 
            : <input type="text" {...commonProps} />;
    }

    return (
        <div onClick={() => setIsEditing(true)} className="editable-field">
            {value || <span className="text-gray-500 italic">{placeholder}</span>}
        </div>
    );
};

export const AssistantGuide = ({ guidance }: { guidance: string }) => (
    <div className="flex items-start gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
        </div>
        <div className="text-gray-300 text-sm pt-1">
            <p>{guidance}</p>
        </div>
    </div>
);

export const InsightSection = ({ title, children, icon }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-5 flex flex-col h-full">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-semibold text-gray-200 ml-3">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const ChatBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;
    const Icon = isUser ? 
        (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>) :
        (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>);
    
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">{Icon}</div>}
            <div className={`max-w-lg p-3 rounded-lg shadow-sm ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-700 border border-gray-600 text-gray-200'} ${isError ? 'bg-red-900/50 border-red-500 text-red-300' : ''}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
             {isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">{Icon}</div>}
        </div>
    );
};

export const FeedbackToast = ({ show, onHide }) => {
    React.useEffect(() => {
        if (show) {
            const timer = setTimeout(onHide, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    return (
        <div className={`feedback-toast ${show ? 'show' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Layout preference updated.
        </div>
    );
};

export const ExportControls = ({ onExportBPMN, onExportSVG, onExportPNG, onExportXLSX, onExportTXT, onExportDOCX, hasAnalysis }: { onExportBPMN?: () => void; onExportSVG?: () => void; onExportPNG?: () => void; onExportXLSX?: () => void; onExportTXT?: () => void; onExportDOCX?: () => void; hasAnalysis: boolean; }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const ExportButton = ({ onClick, children, disabled, fileType }) => (
        <button
            onClick={() => { if(!disabled) { onClick(); setIsOpen(false); } }}
            disabled={disabled}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {children} <span className="ml-auto text-xs text-gray-500">{fileType}</span>
        </button>
    );

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                    <div className="py-1">
                        {onExportBPMN && <ExportButton onClick={onExportBPMN} disabled={!hasAnalysis} fileType=".bpmn">Process Model</ExportButton>}
                        {onExportSVG && <ExportButton onClick={onExportSVG} disabled={!hasAnalysis} fileType=".svg">Vector Image</ExportButton>}
                        {onExportPNG && <ExportButton onClick={onExportPNG} disabled={!hasAnalysis} fileType=".png">PNG Image</ExportButton>}
                        {(onExportXLSX || onExportTXT || onExportDOCX) && <div className="border-t my-1 border-gray-700" />}
                        {onExportXLSX && <ExportButton onClick={onExportXLSX} disabled={!hasAnalysis} fileType=".xlsx">Analysis Data</ExportButton>}
                        {onExportDOCX && <ExportButton onClick={onExportDOCX} disabled={!hasAnalysis} fileType=".doc">Word Document</ExportButton>}
                        {onExportTXT && <ExportButton onClick={onExportTXT} disabled={!hasAnalysis} fileType=".txt">Text Document</ExportButton>}
                    </div>
                </div>
            )}
        </div>
    );
};

export const ProcessMapControls = ({ isRedoLoading, onRedoMap, mapAnalysisLevel, setMapAnalysisLevel }) => {
    return (
        <div className="flex items-center space-x-2">
            <select
                value={mapAnalysisLevel}
                onChange={e => setMapAnalysisLevel(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg shadow-sm px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                disabled={isRedoLoading}
            >
                <option>Level 1: High-Level / Executive Summary Map</option>
                <option>Level 2: End-to-End / Macro Process Map</option>
                <option>Level 3: Detailed / Departmental Process Map</option>
                <option>Level 4: Executable / Workflow / System-Specific Map</option>
            </select>
            <button
                onClick={() => onRedoMap(mapAnalysisLevel)}
                disabled={isRedoLoading}
                className="flex items-center px-4 py-2 bg-indigo-600 text-sm text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {isRedoLoading ? (
                    <div className="spinner w-4 h-4 border-2 border-white rounded-full mr-2"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20L10 14M20 4l-6 6" />
                    </svg>
                )}
                Redraw Map
            </button>
        </div>
    );
};

export const ModuleCard = ({ title, description, icon, status, onClick }) => {
    const baseClasses = "relative group p-6 rounded-xl border-2 flex flex-col items-start text-left transition-all duration-300 h-full";
    const statusClasses = {
        ready: "border-gray-700 bg-gray-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer",
        generating: "border-indigo-600 bg-gray-800 cursor-not-allowed module-generating",
        queued: "border-dashed border-gray-600 bg-gray-800/50 opacity-70 cursor-not-allowed",
        error: "border-red-500 bg-red-900/20 hover:border-red-400 cursor-pointer",
        locked: "border-gray-700 bg-gray-800/60 cursor-not-allowed opacity-60",
        pending: "border-dashed border-indigo-500 bg-gray-800 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer",
    };

    const StatusIndicator = () => {
        const base = "absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full";
        switch (status) {
            case 'generating': return <div className={`${base} bg-indigo-500/20 text-indigo-400`}><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;
            case 'ready': return <div className={`${base} bg-green-500/20 text-green-400`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>;
            case 'error': return <div className={`${base} bg-red-500/20 text-red-400`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></div>;
            case 'queued': return <div className={`${base} bg-gray-700 text-gray-400`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
            case 'locked': return <div className={`${base} bg-gray-700 text-gray-400`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6.364-8.364l-1.414-1.414M21 12h-2M4 12H2m15.364-6.364l-1.414 1.414M6.364 6.364L4.95 4.95M12 19.5v-2m0-15v2m-6.364 14.364l1.414-1.414M17.636 17.636l1.414 1.414" /></svg></div>
            default: return null;
        }
    };

    return (
        <div className={`${baseClasses} ${statusClasses[status]}`} onClick={onClick}>
            <StatusIndicator />
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 mb-4">
                {icon}
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-200">{title}</h3>
                <p className="text-sm text-gray-400 mt-2">{description}</p>
            </div>
            <div className="mt-4 w-full">
                {status === 'error' && <span className="text-sm font-semibold text-red-400 hover:underline">Click to Retry</span>}
                {status === 'ready' && <span className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">Open &rarr;</span>}
                {status === 'pending' && <span className="text-sm font-semibold text-indigo-400">Generate &rarr;</span>}
            </div>
        </div>
    );
};


export const VisualInsightCard = ({ title, color, children }) => {
    const colors = {
        red: 'border-red-500',
        green: 'border-green-500',
        blue: 'border-blue-500',
        purple: 'border-purple-500',
        yellow: 'border-yellow-500',
    };
    const borderClass = colors[color] || 'border-gray-600';

    return (
        <div className={`bg-gray-800 p-5 rounded-lg shadow-md border-t-4 ${borderClass} h-full`}>
            <h3 className="text-md font-bold text-gray-200">{title}</h3>
            {children}
        </div>
    );
};

export const InsightTag = ({ color, children }) => {
    const colors = {
        gray: 'bg-gray-700 text-gray-300',
        blue: 'bg-blue-900/50 text-blue-300',
        yellow: 'bg-yellow-900/50 text-yellow-300',
    };
    const colorClass = colors[color] || 'bg-gray-700 text-gray-300';
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {children}
        </span>
    );
};

export const ImpactEffortPill = ({ label, value }: { label: string, value: string }) => {
    const lowColor = 'bg-green-900/50 text-green-300';
    const mediumColor = 'bg-yellow-900/50 text-yellow-300';
    const highColor = 'bg-red-900/50 text-red-300';
    const color = value?.toLowerCase() === 'low' ? lowColor : value?.toLowerCase() === 'medium' ? mediumColor : highColor;

    return (
        <div className={`px-2.5 py-1 rounded-full flex items-center text-xs font-semibold ${color}`}>
            <span>{label}{label ? ': ' : ''}{value}</span>
        </div>
    );
};

export const SopStepCard = ({ step, index }: { step: SopStep, index: number }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-indigo-400 bg-indigo-900/50 rounded-full h-10 w-10 flex items-center justify-center">{index + 1}</span>
            <h3 className="text-xl font-bold text-gray-200 ml-4">{step.stepName}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4"><strong className="text-gray-300">Actor:</strong> {step.actor}</p>
        <p className="mb-4 text-gray-300">{step.description}</p>
        
        <div className="prose prose-sm max-w-none prose-invert">
            <h4>Detailed Instructions</h4>
            <ol>
                {(step.detailedInstructions || []).map((instr, i) => <li key={i}>{instr}</li>)}
            </ol>
            
            {(step.risksAndControls && step.risksAndControls.length > 0) && (
                <>
                    <h4>Risks & Controls</h4>
                    <ul>
                        {step.risksAndControls.map((rc, i) => (
                            <li key={i}><strong>Risk:</strong> {rc.risk} <br/> <strong>Control:</strong> {rc.control}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    </div>
);

export const InsightCard = ({ title, category, impact, effort, icon, children }: { title: string, category: string, impact?: string, effort?: string, icon: React.ReactNode, children: React.ReactNode }) => {
    const categoryColors = {
        'Pain Point': 'bg-red-900/50 text-red-300',
        'Optimization Opportunity': 'bg-green-900/50 text-green-300',
        'RPA Candidate': 'bg-blue-900/50 text-blue-300',
        'AI Workflow Candidate': 'bg-purple-900/50 text-purple-300',
        'Anomaly Detected': 'bg-yellow-900/50 text-yellow-300',
    };

    return (
        <div className="bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-700 flex flex-col h-full">
            <div className="flex items-start mb-3">
                <div className="flex-shrink-0 mr-3">{icon}</div>
                <div className="flex-grow">
                    <h4 className="font-bold text-gray-200">{title}</h4>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${categoryColors[category] || 'bg-gray-700 text-gray-300'}`}>{category}</span>
                </div>
            </div>
            <div className="text-sm text-gray-400 mb-3 flex-grow">
                {children}
            </div>
            <div className="flex items-center justify-end space-x-2 text-xs font-medium">
                {impact && <ImpactEffortPill label="Impact" value={impact} />}
                {effort && <ImpactEffortPill label="Effort" value={effort} />}
            </div>
        </div>
    );
};

export const StatusPill = ({ status }: { status: ProjectStatus }) => {
    const colors: { [key in ProjectStatus]: string } = {
        'Not Started': 'bg-gray-700 text-gray-300',
        'In Progress': 'bg-blue-900 text-blue-300',
        'Completed': 'bg-green-900 text-green-300',
        'Blocked': 'bg-red-900 text-red-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>{status}</span>;
};

export const PriorityPill = ({ priority }: { priority: ProjectPriority }) => {
    const colors: { [key in ProjectPriority]: string } = {
        'Low': 'bg-green-900/50 text-green-300',
        'Medium': 'bg-yellow-900/50 text-yellow-300',
        'High': 'bg-red-900/50 text-red-300',
    };
    const icons: { [key in ProjectPriority]: React.ReactNode } = {
        'Low': <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
        'Medium': <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>,
        'High': <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
    };
    return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${colors[priority]}`}>{icons[priority]} {priority}</span>;
};

export const ProjectTaskCard = ({ task, onClick, onDragStart }: { task: ProjectTask, onClick: () => void, onDragStart: (e: React.DragEvent) => void }) => (
    <div
        onClick={onClick}
        onDragStart={onDragStart}
        draggable
        className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 cursor-pointer hover:shadow-md hover:border-indigo-500"
    >
        <p className="font-semibold text-sm text-gray-200 mb-2">{task.title}</p>
        <div className="flex items-center justify-between">
            <StatusPill status={task.status} />
            <PriorityPill priority={task.priority} />
        </div>
    </div>
);

export const TaskModal = ({ isOpen, task, onClose, onSave }: { isOpen: boolean, task: ProjectTask | null, onClose: () => void, onSave: (task: ProjectTask) => void }) => {
    const [editedTask, setEditedTask] = React.useState<ProjectTask | null>(task);

    React.useEffect(() => {
        setEditedTask(task);
    }, [task]);

    if (!isOpen || !editedTask) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedTask(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = () => {
        if (editedTask) {
            onSave(editedTask);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-gray-200">Task Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 text-gray-400">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto py-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400">Title</label>
                        <input type="text" name="title" value={editedTask.title} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400">Description</label>
                        <textarea name="description" value={editedTask.description} onChange={handleChange} rows={4} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Status</label>
                            <select name="status" value={editedTask.status} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm p-2">
                                <option>Not Started</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Blocked</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Priority</label>
                            <select name="priority" value={editedTask.priority} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm p-2">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-700 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md mr-2 hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-900/50', text: 'text-blue-300' },
        green: { bg: 'bg-green-900/50', text: 'text-green-300' },
        gray: { bg: 'bg-gray-700', text: 'text-gray-300' },
        red: { bg: 'bg-red-900/50', text: 'text-red-300' },
    };
    const { bg, text } = colorClasses[color] || colorClasses.gray;
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${bg} ${text}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-200">{value}</p>
            </div>
        </div>
    );
};

export const StatPieChart = ({ data, colors }) => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    const gradient = data.reduce((acc, item, index) => {
        const percentage = (item.value / total) * 100;
        const color = colors[index % colors.length];
        acc.gradient.push(`${color} ${acc.lastPercentage}% ${acc.lastPercentage + percentage}%`);
        acc.lastPercentage += percentage;
        return acc;
    }, { gradient: [], lastPercentage: 0 }).gradient.join(', ');

    return (
        <div className="flex flex-col items-center">
            <div 
                className="w-36 h-36 rounded-full"
                style={{ background: `conic-gradient(${gradient})` }}
            ></div>
            <div className="mt-4 w-full space-y-2 text-sm">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[i % colors.length] }}></span>
                            {item.label}
                        </span>
                        <span className="font-semibold">{item.value} ({total > 0 ? Math.round((item.value/total)*100) : 0}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};