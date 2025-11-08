/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
// Fix: Removed AppGuideView and ProjectCreationView as they are not used and were causing import errors.
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    ExcelDataItem, ConsultantInsightsData, SopData, VsmData, CjmData, PlaybookData, View, ProjectData, ProjectTask,
    ProjectStatus, ProjectPriority, ModuleStatus, PlatformView, VsmState, ProjectCharterData, CommunicationPlanData, ComplianceRiskData
} from './types.ts';
import { 
    InputScreen, HomeScreen, ProcessMapView, ConsultantInsightsView, 
    ProcessGuideView, DeepDiveView, ValueStreamMapView, CustomerJourneyMapView, 
    OptimizationPlaybookView, ModulePageWrapper, ProjectExecutionView,
    ProjectIntelligentHomeScreen, ProjectCharterView, CommunicationPlanView,
    ComplianceRiskView
} from './views.tsx';
import { 
    getApiErrorMessage, parseAndCleanApiResponse, INITIAL_BPMN_XML, getMimeType, debounce
} from './utils.ts';
import {
    buildConstructionPrompt, buildAnalysisPrompt, buildSopPrompt, buildVsmPrompt,
    buildCjmPrompt, buildPlaybookPrompt, detailedAnalysisSchema, sopSchema,
    vsmSchema, cjmSchema, playbookSchema, buildVsmSufficiencyCheckPrompt, vsmSufficiencySchema,
    buildProjectCharterPrompt, projectCharterSchema, buildCommunicationPlanPrompt, communicationPlanSchema,
    buildComplianceRiskPrompt, complianceRiskSchema
} from './services.ts';
import { 
    ExportControls, FeedbackToast, ProcessMapControls, PlatformTabs
} from './components.tsx';
import { 
    executeBpmnCommand, adjustLayout, analyzeAndLearnFromLayout 
} from './services.ts';
import { 
    exportAsBPMN, exportAsSVG, exportAsPNG, exportAnalysisAsXLSX, exportSopAsText, 
    exportSopAsXLSX, exportVsmAsXLSX, exportCjmAsXLSX, exportPlaybookAsXLSX,
    exportProjectAsXLSX, exportSopAsDocx, exportCommunicationPlanAsXLSX, exportComplianceRiskAsXLSX
} from './services.ts';

declare const BpmnJS: any;

export const App = () => {
    // === State Management ===
    
    // UI State
    const [platformView, setPlatformView] = React.useState<PlatformView>('process');
    const [currentView, setCurrentView] = React.useState<View>('input');
    const [error, setError] = React.useState<string | null>(null);

    // Module Status State
    const [moduleStatuses, setModuleStatuses] = React.useState<{ [key: string]: ModuleStatus }>({
        'consultant-insights': 'locked', 'customer-journey-map': 'locked', 'value-stream-map': 'locked',
        'process-guide': 'locked', 'optimization-playbook': 'locked', 'project-execution': 'locked', 
        'deep-dive': 'locked', 'process-map': 'locked', 'project-charter': 'locked', 'communication-plan': 'locked',
        'compliance-risk': 'locked'
    });

    // Input State
    const [inputText, setInputText] = React.useState('');
    const [fileName, setFileName] = React.useState('');
    const [fileData, setFileData] = React.useState<{ base64: string; mimeType: string; } | null>(null);
    const [analysisLevel, setAnalysisLevel] = React.useState('Level 2: End-to-End / Macro Process Map');
    const [generalInstructions, setGeneralInstructions] = React.useState('');
    const [originalInput, setOriginalInput] = React.useState(''); // Persist original input for retries
    
    // Generated Content State
    const [processName, setProcessName] = React.useState('process');
    const [hasGeneratedMap, setHasGeneratedMap] = React.useState(false);
    const [detailedAnalysis, setDetailedAnalysis] = React.useState<{ excelData: ExcelDataItem[], consultantInsights: ConsultantInsightsData } | null>(null);
    const [sopContent, setSopContent] = React.useState<SopData | null>(null);
    const [valueStreamMapContent, setValueStreamMapContent] = React.useState<VsmState>({ data: null, sufficientData: false, message: null });
    const [customerJourneyMapContent, setCustomerJourneyMapContent] = React.useState<CjmData | null>(null);
    const [complianceRiskContent, setComplianceRiskContent] = React.useState<ComplianceRiskData | null>(null);
    const [playbookContent, setPlaybookContent] = React.useState<PlaybookData | null>(null);
    const [projectCharterContent, setProjectCharterContent] = React.useState<ProjectCharterData | null>(null);
    const [communicationPlanContent, setCommunicationPlanContent] = React.useState<CommunicationPlanData | null>(null);
    const [projectData, setProjectData] = React.useState<ProjectData | null>(null);
    const [deepDiveHistory, setDeepDiveHistory] = React.useState<any[]>([]);

    // Loading State (for manual retries)
    const [isInsightsLoading, setIsInsightsLoading] = React.useState(false);
    const [isSopLoading, setIsSopLoading] = React.useState(false);
    const [isValueStreamMapLoading, setIsValueStreamMapLoading] = React.useState(false);
    const [isCustomerJourneyMapLoading, setIsCustomerJourneyMapLoading] = React.useState(false);
    const [isComplianceRiskLoading, setIsComplianceRiskLoading] = React.useState(false);
    const [isPlaybookLoading, setIsPlaybookLoading] = React.useState(false);
    const [isProjectCharterLoading, setIsProjectCharterLoading] = React.useState(false);
    const [isCommunicationPlanLoading, setIsCommunicationPlanLoading] = React.useState(false);
    const [isProjectLoading, setIsProjectLoading] = React.useState(false);
    const [isDeepDiveLoading, setIsDeepDiveLoading] = React.useState(false);
    const [isMapRedoLoading, setIsMapRedoLoading] = React.useState(false);

    // Error states for retry mechanism
    const [isInsightsError, setIsInsightsError] = React.useState(false);
    const [isSopError, setIsSopError] = React.useState(false);
    const [isValueStreamMapError, setIsValueStreamMapError] = React.useState(false);
    const [isCustomerJourneyMapError, setIsCustomerJourneyMapError] = React.useState(false);
    const [isComplianceRiskError, setIsComplianceRiskError] = React.useState(false);
    const [isPlaybookError, setIsPlaybookError] = React.useState(false);
    const [isProjectCharterError, setIsProjectCharterError] = React.useState(false);
    const [isCommunicationPlanError, setIsCommunicationPlanError] = React.useState(false);
    const [isProjectError, setIsProjectError] = React.useState(false);

    // AI Feedback Loop State
    const [learnedLayoutParameters, setLearnedLayoutParameters] = React.useState<{ hSpacing: number; vPadding: number } | null>(null);
    const [showFeedbackToast, setShowFeedbackToast] = React.useState(false);

    // BPMN modeler instance and refs
    const modelerRef = React.useRef<any>(null); // Holds the BpmnJS instance
    const bpmnContainerRef = React.useRef<HTMLDivElement>(null); // For the persistent, hidden container

    // State for map redrawing
    const [mapAnalysisLevel, setMapAnalysisLevel] = React.useState(analysisLevel);
    React.useEffect(() => { setMapAnalysisLevel(analysisLevel); }, [analysisLevel]);

    // Refs
    const chatRef = React.useRef<Chat | null>(null);
    const constructionCommandsRef = React.useRef<any[]>([]); // For the current visual map
    const analysisCommandsRef = React.useRef<any[]>([]); // For the data analysis modules
    const prevPlatformViewRef = React.useRef<PlatformView>(platformView);

    React.useEffect(() => {
        if (!modelerRef.current && bpmnContainerRef.current) {
            const modeler = new BpmnJS({ container: bpmnContainerRef.current });
            modelerRef.current = modeler;
            modeler.importXML(INITIAL_BPMN_XML).catch(err => {
                console.error('Error initializing BPMN canvas:', err);
                setError('Could not initialize the diagram canvas.');
            });
        }
    }, []);

    const resetGeneratedContent = () => {
        setProcessName('process');
        setHasGeneratedMap(false);
        setDetailedAnalysis(null);
        setSopContent(null);
        setValueStreamMapContent({ data: null, sufficientData: false, message: null });
        setCustomerJourneyMapContent(null);
        setComplianceRiskContent(null);
        setPlaybookContent(null);
        setProjectCharterContent(null);
        setCommunicationPlanContent(null);
        setProjectData(null);
        setDeepDiveHistory([]);
        setOriginalInput('');
        
        setIsInsightsLoading(false); setIsSopLoading(false); setIsValueStreamMapLoading(false);
        setIsCustomerJourneyMapLoading(false); setIsComplianceRiskLoading(false); setIsPlaybookLoading(false); 
        setIsProjectCharterLoading(false); setIsCommunicationPlanLoading(false); 
        setIsProjectLoading(false); setIsDeepDiveLoading(false); setIsMapRedoLoading(false);
        
        setIsInsightsError(false); setIsSopError(false); setIsValueStreamMapError(false);
        setIsCustomerJourneyMapError(false); setIsComplianceRiskError(false); setIsPlaybookError(false); 
        setIsProjectCharterError(false); setIsCommunicationPlanError(false); setIsProjectError(false);
        
        setModuleStatuses({
            'consultant-insights': 'locked', 'customer-journey-map': 'locked', 'value-stream-map': 'locked',
            'process-guide': 'locked', 'optimization-playbook': 'locked', 'project-execution': 'locked',
            'deep-dive': 'locked', 'process-map': 'locked', 'project-charter': 'locked', 'communication-plan': 'locked',
            'compliance-risk': 'locked'
        });

        chatRef.current = null;
        constructionCommandsRef.current = [];
        analysisCommandsRef.current = [];
        if (modelerRef.current) {
            modelerRef.current.importXML(INITIAL_BPMN_XML).catch(err => {
                console.error('Error resetting diagram:', err);
            });
        }
    }
    
    const handleStartNewAnalysis = () => {
        setPlatformView('process');
        setCurrentView('input');
        setError(null);
        resetGeneratedContent();
    };

    const clearFile = () => {
        setFileName('');
        setFileData(null);
        const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSetInputText = (text: string) => {
        setInputText(text);
        if (text) clearFile();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            clearFile();
            return;
        }
        const supportedTypes = ['txt', 'pdf', 'docx', 'pptx'];
        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    
        if (!supportedTypes.includes(extension)) {
            setError(`Unsupported file type: .${extension}. Please upload .txt, .pdf, .docx, or .pptx.`);
            clearFile();
            return;
        }
    
        setError(null);
    
        if (extension === 'txt') {
            setInputText(''); // Clear any pasted text to avoid confusion
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (readEvent) => {
                const result = readEvent.target?.result;
                if (typeof result === 'string') {
                    setInputText(result);
                    setFileData(null); // Ensure no file data is sent
                } else {
                    setError('Failed to read text file content.');
                    clearFile();
                }
            };
            reader.onerror = () => {
                setError('Error reading text file.');
                clearFile();
            };
            reader.readAsText(file);
        } else {
            // For other complex document types, guide the user to copy-paste to avoid API errors.
            setError(`For best results with documents like '${file.name}', please open the file, copy the text, and paste it directly into the text area.`);
            clearFile(); // Reset the file input to prevent confusion
        }
    };
    
    const getOriginalInput = () => {
        if (fileData) return `The user uploaded a document named '${fileName}'.`;
        return `The user provided the following text input: "${inputText}"`;
    };
    
    const debouncedLayoutAnalyzer = React.useCallback(
        debounce(() => {
            const layoutParams = analyzeAndLearnFromLayout(modelerRef.current);
            if (layoutParams) {
                setLearnedLayoutParameters(layoutParams);
                setShowFeedbackToast(true);
            }
        }, 2000), []
    );
    
    const generateWithRetry = async (generationFunc, ...args) => {
        let attempts = 0;
        const maxAttempts = 3;
        const initialDelay = 2000; // Start with 2 seconds

        while (attempts < maxAttempts) {
            try {
                return await generationFunc(...args);
            } catch (err) {
                attempts++;
                const delay = initialDelay * Math.pow(2, attempts - 1); // Exponential backoff
                console.warn(`Attempt ${attempts} failed for ${generationFunc.name}. Retrying in ${delay}ms...`, err);
                if (attempts >= maxAttempts) {
                    console.error(`All retry attempts failed for ${generationFunc.name}.`);
                    throw err; // Re-throw the error after all retries fail
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    const startGenerationPipeline = async (ai: GoogleGenAI, inputForAnalysis: string, newLevel: string) => {
        setAnalysisLevel(newLevel);
    
        const runModule = async (key: string, func: Function, ...args: any[]) => {
            setModuleStatuses(prev => ({ ...prev, [key]: 'generating' }));
            try {
                const result = await generateWithRetry(func, ...args);
                if (result === undefined || (typeof result === 'object' && result !== null && 'sufficientData' in result && result.sufficientData === false)) {
                    setModuleStatuses(prev => ({ ...prev, [key]: 'ready' }));
                } else if (!result) {
                    throw new Error(`${key} generation returned null or failed after retry.`);
                } else {
                    setModuleStatuses(prev => ({ ...prev, [key]: 'ready' }));
                }
                return result;
            } catch (err) {
                console.error(`Generation failed for ${key} after retry:`, err);
                setModuleStatuses(prev => ({ ...prev, [key]: 'error' }));
                throw err;
            }
        };

        try {
            // --- PHASE 1: CORE ANALYSIS ---
            const analysisResult = await runModule('consultant-insights', handleGenerateAnalysisAndInsights, ai, inputForAnalysis);
            if (analysisResult) {
                setProcessName(analysisResult.processName);
                const systemInstruction = `You are "Process Intelligence Assistant", an expert AI consultant. You have been provided with the full context of a business process. Use this data to provide specific, credible answers. **CRITICAL FORMATTING RULE:** Your responses MUST be plain text. DO NOT use any markdown.`;
                chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction } });
                setModuleStatuses(prev => ({ ...prev, 'deep-dive': 'ready' })); // Unlock Deep Dive early
            }

            // --- PHASE 2: DETAILED DOCUMENTATION & STRATEGIC ANALYSIS (Strictly Sequential) ---
            await runModule('process-guide', handleGenerateSop, ai, inputForAnalysis, analysisResult);
            const vsmResult = await runModule('value-stream-map', handleGenerateValueStreamMap, ai, inputForAnalysis, analysisResult);
            await runModule('customer-journey-map', handleGenerateCustomerJourneyMap, ai, inputForAnalysis, analysisResult);
            await runModule('compliance-risk', handleGenerateComplianceRisk, ai, inputForAnalysis, analysisResult);
            
            // --- PHASE 3: ACTIONABLE STRATEGY ---
            const playbookResult = await runModule('optimization-playbook', handleGeneratePlaybook, ai, inputForAnalysis, analysisResult, vsmResult);
            if (playbookResult) {
                setModuleStatuses(prev => ({ ...prev, 'project-execution': 'ready' }));
            }
            
            // --- PHASE 4: PROJECT INTELLIGENCE ---
            const charterResult = await runModule('project-charter', handleGenerateProjectCharter, ai, inputForAnalysis, analysisResult, playbookResult);
            await runModule('communication-plan', handleGenerateCommunicationPlan, ai, inputForAnalysis, charterResult);
            
        } catch (error) {
            console.error("A critical module failed, halting generation pipeline.", error);
        }
    };
    
    const handleGenerate = async () => {
        if (!process.env.API_KEY) { setError('API key is not configured.'); return; }
        // CRITICAL FIX: Input validation / hallucination prevention
        if ((!inputText || inputText.length < 250) && !fileData) {
            setError('Please provide a more detailed process description (at least 250 characters) or upload a file to ensure a high-quality analysis and avoid generating inaccurate content.');
            return;
        }

        setError(null);
        resetGeneratedContent();
        const originalInputForAnalysis = getOriginalInput();
        setOriginalInput(originalInputForAnalysis);

        setModuleStatuses({
            'process-map': 'generating', 'consultant-insights': 'queued', 'customer-journey-map': 'queued',
            'value-stream-map': 'queued', 'process-guide': 'queued', 'optimization-playbook': 'queued', 
            'compliance-risk': 'queued', 'project-charter': 'queued', 'project-execution': 'locked', 
            'deep-dive': 'locked', 'communication-plan': 'queued',
        });
        
        try {
            if (modelerRef.current) { await modelerRef.current.importXML(INITIAL_BPMN_XML); }
        } catch (e) {
            setError(`A critical error occurred while preparing the diagram canvas: ${e.message}`);
            setCurrentView('input'); return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            // Phase 1: Build Diagram via Streaming
            constructionCommandsRef.current = [];
            const constructionPrompt = buildConstructionPrompt(fileData ? null : inputText, !!fileData, analysisLevel, generalInstructions, learnedLayoutParameters);
            const parts: any[] = [{ text: constructionPrompt }];
            if (fileData) { parts.push({ inlineData: { data: fileData.base64, mimeType: fileData.mimeType } }); }
            
            const constructionResponseStream = await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: [{ parts }] });
            let buffer = '';
            for await (const chunk of constructionResponseStream) {
                buffer += chunk.text;
                let braceCount = 0, objectEnd = -1, firstBrace = buffer.indexOf('{');
                if (firstBrace === -1) continue;
                for (let i = firstBrace; i < buffer.length; i++) {
                    if (buffer[i] === '{') braceCount++; else if (buffer[i] === '}') braceCount--;
                    if (braceCount === 0 && i > firstBrace) { objectEnd = i; break; }
                }
                if (objectEnd !== -1) {
                    const objectStr = buffer.substring(firstBrace, objectEnd + 1);
                    buffer = buffer.substring(objectEnd + 1);
                    try {
                        const command = parseAndCleanApiResponse(objectStr);
                        constructionCommandsRef.current.push(command);
                        executeBpmnCommand(command, modelerRef.current);
                    } catch (e) { console.warn("Skipping malformed JSON chunk in stream:", objectStr, e); }
                }
            }
            adjustLayout(modelerRef.current);
            setHasGeneratedMap(true);
            analysisCommandsRef.current = [...constructionCommandsRef.current]; // Store commands for analysis
            setModuleStatuses(prev => ({ ...prev, 'process-map': 'ready' }));

            if (constructionCommandsRef.current.length === 0) { throw new Error("Diagram construction failed; no commands were generated."); }
            
            // --- NAVIGATION FIX: Immediately go to the dashboard ---
            setPlatformView('process');
            setCurrentView('home');

            // Start the sequential generation pipeline in the background
            await startGenerationPipeline(ai, originalInputForAnalysis, analysisLevel);

        } catch (err) {
            console.error("Main generation process failed:", err);
            setError(`Error during generation: ${getApiErrorMessage(err)}`);
            setModuleStatuses(prev => ({ ...prev, 'process-map': 'error' }));
            setCurrentView('input'); // Stay on input screen on failure
        }
    };
    
    const handleRedoMap = async (newLevel: string) => {
        if (!process.env.API_KEY || isMapRedoLoading) return;
        setIsMapRedoLoading(true);
        setError(null);
        setMapAnalysisLevel(newLevel);
    
        setModuleStatuses(prev => ({ ...prev, 'process-map': 'generating' }));
    
        try {
            // Re-draw the map
            await modelerRef.current.importXML(INITIAL_BPMN_XML);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            constructionCommandsRef.current = []; // Reset commands for the new map
            const constructionPrompt = buildConstructionPrompt(fileData ? null : inputText, !!fileData, newLevel, generalInstructions, learnedLayoutParameters);
            const parts: any[] = [{ text: constructionPrompt }];
            if (fileData) { parts.push({ inlineData: { data: fileData.base64, mimeType: fileData.mimeType } }); }
            
            const constructionResponseStream = await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: [{ parts }] });
            let buffer = '';
            for await (const chunk of constructionResponseStream) {
                buffer += chunk.text;
                let braceCount = 0, objectEnd = -1, firstBrace = buffer.indexOf('{');
                if (firstBrace === -1) continue;
                for (let i = firstBrace; i < buffer.length; i++) {
                    if (buffer[i] === '{') braceCount++; else if (buffer[i] === '}') braceCount--;
                    if (braceCount === 0 && i > firstBrace) { objectEnd = i; break; }
                }
                if (objectEnd !== -1) {
                    const objectStr = buffer.substring(firstBrace, objectEnd + 1);
                    buffer = buffer.substring(objectEnd + 1);
                    try {
                        const command = parseAndCleanApiResponse(objectStr);
                        constructionCommandsRef.current.push(command);
                        executeBpmnCommand(command, modelerRef.current);
                    } catch (e) { console.warn("Skipping malformed JSON chunk in stream:", objectStr, e); }
                }
            }
            adjustLayout(modelerRef.current);
            setModuleStatuses(prev => ({ ...prev, 'process-map': 'ready' }));
            // NOTE: No call to resetGeneratedContent() or startGenerationPipeline()
    
        } catch (err) {
            setError(`Error redrawing map: ${getApiErrorMessage(err)}`);
            setModuleStatuses(prev => ({...prev, 'process-map': 'error' }));
        } finally {
            setIsMapRedoLoading(false);
        }
    };

    const handleGenerateAnalysisAndInsights = React.useCallback(async (aiInstance, originalInputParam) => {
        if (detailedAnalysis && !isInsightsError) return detailedAnalysis;
        setIsInsightsError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const analysisPrompt = buildAnalysisPrompt(analysisLevel, generalInstructions, analysisCommandsRef.current, originalInputParam);
            const analysisResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: analysisPrompt, config: { responseMimeType: "application/json", responseSchema: detailedAnalysisSchema, thinkingConfig: { thinkingBudget: 1024 } } });
            const analysisResult = parseAndCleanApiResponse(analysisResponse.text);
            setDetailedAnalysis(analysisResult);
            return analysisResult;
        } catch (err) {
            console.error("Error generating consultant insights:", err);
            setIsInsightsError(true);
            setModuleStatuses(prev => ({ ...prev, 'consultant-insights': 'error' }));
            throw err;
        }
    }, [detailedAnalysis, isInsightsError, analysisLevel, generalInstructions]);

    const handleGenerateComplianceRisk = React.useCallback(async (aiInstance, originalInputParam, analysisData) => {
        if (complianceRiskContent && !isComplianceRiskError) return complianceRiskContent;
        setIsComplianceRiskError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const prompt = buildComplianceRiskPrompt(originalInputParam, analysisData, analysisCommandsRef.current);
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: complianceRiskSchema } });
            const result = parseAndCleanApiResponse(response.text);
            setComplianceRiskContent(result);
            return result;
        } catch (err) {
            console.error("Error generating compliance & risk:", err);
            setIsComplianceRiskError(true);
            throw err;
        }
    }, [complianceRiskContent, isComplianceRiskError]);
    
    const handleGenerateSop = React.useCallback(async (aiInstance, originalInputParam, analysisData) => {
        if (sopContent && !isSopError) return sopContent;
        setIsSopError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const sopPrompt = buildSopPrompt(analysisData.processName, analysisData.excelData, analysisData.consultantInsights, originalInputParam);
            const sopResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: sopPrompt, config: { responseMimeType: "application/json", responseSchema: sopSchema } });
            const sopResult = parseAndCleanApiResponse(sopResponse.text);
            setSopContent(sopResult);
            return sopResult;
        } catch (err) {
            console.error("Error generating SOP:", err);
            setIsSopError(true);
            throw err;
        }
    }, [sopContent, isSopError]);

    const handleGenerateValueStreamMap = React.useCallback(async (aiInstance, originalInputParam, analysisData) => {
        if (valueStreamMapContent.data && !isValueStreamMapError) return valueStreamMapContent;
        setIsValueStreamMapError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });

        try {
            const sufficiencyPrompt = buildVsmSufficiencyCheckPrompt(originalInputParam);
            const sufficiencyResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: sufficiencyPrompt, config: { responseMimeType: "application/json", responseSchema: vsmSufficiencySchema } });
            const sufficiencyResult = parseAndCleanApiResponse(sufficiencyResponse.text);

            if (!sufficiencyResult.isSufficient) {
                const insufficientState = { data: null, sufficientData: false, message: sufficiencyResult.reason };
                setValueStreamMapContent(insufficientState);
                return insufficientState;
            }

            const vsmPrompt = buildVsmPrompt(analysisData.processName, analysisData.excelData, analysisData.consultantInsights, originalInputParam);
            const vsmResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: vsmPrompt, config: { responseMimeType: "application/json", responseSchema: vsmSchema } });
            const vsmResult = parseAndCleanApiResponse(vsmResponse.text);
            const sufficientState = { data: vsmResult, sufficientData: true, message: null };
            setValueStreamMapContent(sufficientState);
            return sufficientState;
        } catch (err) {
            console.error("Error generating Value Stream Map:", err);
            setIsValueStreamMapError(true);
            throw err;
        }
    }, [valueStreamMapContent, isValueStreamMapError]);

    const handleGenerateCustomerJourneyMap = React.useCallback(async (aiInstance, originalInputParam, analysisData) => {
        if (customerJourneyMapContent && !isCustomerJourneyMapError) return customerJourneyMapContent;
        setIsCustomerJourneyMapError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const cjmPrompt = buildCjmPrompt(analysisData.processName, analysisData.excelData, analysisData.consultantInsights, originalInputParam);
            const cjmResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: cjmPrompt, config: { responseMimeType: "application/json", responseSchema: cjmSchema } });
            const cjmResult = parseAndCleanApiResponse(cjmResponse.text);
            setCustomerJourneyMapContent(cjmResult);
            return cjmResult;
        } catch (err) {
            console.error("Error generating Customer Journey Map:", err);
            setIsCustomerJourneyMapError(true);
            throw err;
        }
    }, [customerJourneyMapContent, isCustomerJourneyMapError]);
    
    const handleGeneratePlaybook = React.useCallback(async (aiInstance, originalInputParam, analysisData, vsmData) => {
        if (playbookContent && !isPlaybookError) return playbookContent;
        setIsPlaybookError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const playbookPrompt = buildPlaybookPrompt(analysisData.processName, analysisData, vsmData.data, originalInputParam);
            const playbookResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: playbookPrompt, config: { responseMimeType: "application/json", responseSchema: playbookSchema } });
            const playbookResult = parseAndCleanApiResponse(playbookResponse.text);
            setPlaybookContent(playbookResult);
            return playbookResult;
        } catch (err) {
            console.error("Error generating playbook:", err);
            setIsPlaybookError(true);
            throw err;
        }
    }, [playbookContent, isPlaybookError]);

    const handleGenerateProjectCharter = React.useCallback(async (aiInstance, originalInputParam, analysisData, playbookData) => {
        if (projectCharterContent && !isProjectCharterError) return projectCharterContent;
        setIsProjectCharterError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const prompt = buildProjectCharterPrompt(originalInputParam, analysisData, playbookData);
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: projectCharterSchema } });
            const result = parseAndCleanApiResponse(response.text);
            setProjectCharterContent(result);
            return result;
        } catch (err) {
            console.error("Error generating Project Charter:", err);
            setIsProjectCharterError(true);
            throw err;
        }
    }, [projectCharterContent, isProjectCharterError]);

    const handleGenerateCommunicationPlan = React.useCallback(async (aiInstance, originalInputParam, charterData) => {
        if (communicationPlanContent && !isCommunicationPlanError) return communicationPlanContent;
        setIsCommunicationPlanError(false);
        const ai = aiInstance || new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const prompt = buildCommunicationPlanPrompt(charterData, originalInputParam);
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: communicationPlanSchema } });
            const result = parseAndCleanApiResponse(response.text);
            setCommunicationPlanContent(result);
            return result;
        } catch (err) {
            console.error("Error generating Communication Plan:", err);
            setIsCommunicationPlanError(true);
            throw err;
        }
    }, [communicationPlanContent, isCommunicationPlanError]);
    
    const handleDeepDiveQuery = async (query: string) => {
        if (isDeepDiveLoading || !chatRef.current) return;
        const userMessage = { role: 'user', text: query };
        setDeepDiveHistory(prev => [...prev, userMessage]);
        setIsDeepDiveLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: query });
            const modelMessage = { role: 'model', text: response.text };
            setDeepDiveHistory(prev => [...prev, modelMessage]);
        } catch (err) {
            const errorMessage = { role: 'model', text: `Sorry, an error occurred: ${getApiErrorMessage(err)}`, isError: true };
            setDeepDiveHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsDeepDiveLoading(false);
        }
    };

    const handleCreateProjectFromPlaybook = () => {
        if (!playbookContent) return;
        setIsProjectLoading(true);
        try {
            const tasks: ProjectTask[] = playbookContent.implementationPhases.flatMap(phase =>
                phase.actions.map(action => ({
                    id: `task-${Math.random().toString(36).substr(2, 9)}`,
                    title: action.actionTitle,
                    status: 'Not Started',
                    priority: action.expectedImpact === 'High' ? 'High' : action.expectedImpact === 'Medium' ? 'Medium' : 'Low',
                    phase: phase.phaseName,
                    description: action.proposedSolution,
                    metrics: action.successMetrics || [],
                    resources: [...(action.requiredResources || []), ...(action.suggestedTools || [])],
                    createdAt: new Date().toISOString(),
                }))
            );
            const newProjectData = {
                title: playbookContent.playbookTitle,
                tasks: tasks
            };
            setProjectData(newProjectData);
            setPlatformView('project');
            setCurrentView('project-execution');
        } catch (err) {
            setError(`Error creating project: ${getApiErrorMessage(err)}`);
        } finally {
            setIsProjectLoading(false);
        }
    };
    
    const handleModuleClick = (view: View, status: ModuleStatus) => {
        if (status === 'locked' || status === 'generating' || status === 'queued') return;

        if (status === 'error') {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            setModuleStatuses(prev => ({ ...prev, [view]: 'generating' }));
            switch (view) {
                case 'consultant-insights':
                    setIsInsightsLoading(true);
                    generateWithRetry(handleGenerateAnalysisAndInsights, ai, originalInput)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsInsightsLoading(false));
                    break;
                case 'compliance-risk':
                    setIsComplianceRiskLoading(true);
                    generateWithRetry(handleGenerateComplianceRisk, ai, originalInput, detailedAnalysis)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsComplianceRiskLoading(false));
                    break;
                case 'customer-journey-map':
                     setIsCustomerJourneyMapLoading(true);
                     generateWithRetry(handleGenerateCustomerJourneyMap, ai, originalInput, detailedAnalysis)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsCustomerJourneyMapLoading(false));
                    break;
                case 'value-stream-map':
                    setIsValueStreamMapLoading(true);
                    generateWithRetry(handleGenerateValueStreamMap, ai, originalInput, detailedAnalysis)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsValueStreamMapLoading(false));
                    break;
                case 'process-guide':
                    setIsSopLoading(true);
                    generateWithRetry(handleGenerateSop, ai, originalInput, detailedAnalysis)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsSopLoading(false));
                    break;
                case 'optimization-playbook':
                    setIsPlaybookLoading(true);
                    generateWithRetry(handleGeneratePlaybook, ai, originalInput, detailedAnalysis, valueStreamMapContent)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsPlaybookLoading(false));
                    break;
                 case 'project-charter':
                    setIsProjectCharterLoading(true);
                    generateWithRetry(handleGenerateProjectCharter, ai, originalInput, detailedAnalysis, playbookContent)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsProjectCharterLoading(false));
                    break;
                case 'communication-plan':
                    setIsCommunicationPlanLoading(true);
                    generateWithRetry(handleGenerateCommunicationPlan, ai, originalInput, projectCharterContent)
                        .then(() => setModuleStatuses(prev => ({ ...prev, [view]: 'ready' })))
                        .catch(() => setModuleStatuses(prev => ({ ...prev, [view]: 'error' })))
                        .finally(() => setIsCommunicationPlanLoading(false));
                    break;
            }
            return;
        }
        
        if (platformView === 'project') {
             switch(view) {
                case 'project-charter':
                case 'communication-plan':
                case 'project-execution':
                    setCurrentView(view);
                    break;
                default:
                    setPlatformView('process');
                    setCurrentView(view);
                    break;
             }
        } else {
             setCurrentView(view);
        }
    };
    
    const renderProcessView = () => {
        switch (currentView) {
            case 'input': return <InputScreen inputText={inputText} setInputText={handleSetInputText} fileName={fileName} handleFileChange={handleFileChange} clearFile={clearFile} analysisLevel={analysisLevel} setAnalysisLevel={setAnalysisLevel} generalInstructions={generalInstructions} setGeneralInstructions={setGeneralInstructions} onGenerate={handleGenerate} isLoading={Object.values(moduleStatuses).some(s => s === 'generating' || s === 'queued')} error={error} />;
            case 'home': return <HomeScreen processName={processName} onStartNew={handleStartNewAnalysis} moduleStatuses={moduleStatuses} onModuleClick={handleModuleClick} analysisLevel={analysisLevel} />;
            case 'process-map': return <ModulePageWrapper title="Process Map" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportBPMN={() => exportAsBPMN(modelerRef.current, processName)} onExportSVG={() => exportAsSVG(modelerRef.current, processName)} onExportPNG={() => exportAsPNG(modelerRef.current, processName)} hasAnalysis={hasGeneratedMap} />}>
                <div className="flex flex-col h-full">
                    <div className="flex-shrink-0 p-2 bg-gray-800 border-b border-gray-700 flex justify-end">
                        <ProcessMapControls isRedoLoading={isMapRedoLoading} onRedoMap={handleRedoMap} mapAnalysisLevel={mapAnalysisLevel} setMapAnalysisLevel={setMapAnalysisLevel} />
                    </div>
                    <div className="flex-grow relative">
                        <ProcessMapView modelerRef={modelerRef} detailedAnalysis={detailedAnalysis} />
                    </div>
                </div>
            </ModulePageWrapper>;
            case 'consultant-insights': return <ModulePageWrapper title="Consultant Insights" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportXLSX={() => exportAnalysisAsXLSX(detailedAnalysis, processName)} hasAnalysis={!!detailedAnalysis} />}> <ConsultantInsightsView insights={detailedAnalysis?.consultantInsights} isLoading={isInsightsLoading} /></ModulePageWrapper>;
            case 'process-guide': return <ModulePageWrapper title="Process Guide (SOP)" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportXLSX={() => exportSopAsXLSX(sopContent, processName)} onExportTXT={() => exportSopAsText(sopContent, processName)} onExportDOCX={() => exportSopAsDocx(sopContent, processName)} hasAnalysis={!!sopContent} />}><ProcessGuideView sopData={sopContent} isLoading={isSopLoading} setSopContent={setSopContent} /></ModulePageWrapper>;
            case 'deep-dive': return <ModulePageWrapper title="Deep Dive Chat" onBack={() => setCurrentView('home')}><DeepDiveView history={deepDiveHistory} isLoading={isDeepDiveLoading} onQuery={handleDeepDiveQuery} hasFullContext={!!chatRef.current} /></ModulePageWrapper>;
            case 'value-stream-map': return <ModulePageWrapper title="Value Stream Map" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportXLSX={() => exportVsmAsXLSX(valueStreamMapContent.data, detailedAnalysis, processName)} hasAnalysis={!!valueStreamMapContent.data} />}><ValueStreamMapView vsmState={valueStreamMapContent} isLoading={isValueStreamMapLoading} setValueStreamMapContent={setValueStreamMapContent} /></ModulePageWrapper>;
            case 'customer-journey-map': return <ModulePageWrapper title="Customer Journey Map" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportXLSX={() => exportCjmAsXLSX(customerJourneyMapContent, processName)} hasAnalysis={!!customerJourneyMapContent} />}><CustomerJourneyMapView cjmData={customerJourneyMapContent} isLoading={isCustomerJourneyMapLoading} /></ModulePageWrapper>;
            case 'compliance-risk': return <ModulePageWrapper title="Compliance & Risk Analysis" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportXLSX={() => exportComplianceRiskAsXLSX(complianceRiskContent, processName)} hasAnalysis={!!complianceRiskContent} />}><ComplianceRiskView complianceRiskData={complianceRiskContent} isLoading={isComplianceRiskLoading} /></ModulePageWrapper>;
            case 'optimization-playbook': return <ModulePageWrapper title="Optimization Playbook" onBack={() => setCurrentView('home')} exportMenu={<ExportControls onExportXLSX={() => exportPlaybookAsXLSX(playbookContent, processName)} hasAnalysis={!!playbookContent} />}><OptimizationPlaybookView playbookData={playbookContent} isLoading={isPlaybookLoading} onCreateProject={handleCreateProjectFromPlaybook} isCreatingProject={isProjectLoading} /></ModulePageWrapper>;
            case 'project-charter': return <ModulePageWrapper title="Project Charter" onBack={() => setCurrentView('project-home')} exportMenu={<ExportControls onExportXLSX={() => { /* Implement export */}} hasAnalysis={!!projectCharterContent} />}><ProjectCharterView charterData={projectCharterContent} isLoading={isProjectCharterLoading} setProjectCharterContent={setProjectCharterContent} /></ModulePageWrapper>;
            case 'communication-plan': return <ModulePageWrapper title="Communication Plan" onBack={() => setCurrentView('project-home')} exportMenu={<ExportControls onExportXLSX={() => exportCommunicationPlanAsXLSX(communicationPlanContent, projectCharterContent?.projectName || 'Project')} hasAnalysis={!!communicationPlanContent} />}><CommunicationPlanView commsData={communicationPlanContent} isLoading={isCommunicationPlanLoading} /></ModulePageWrapper>;
            case 'project-execution': return <ProjectExecutionView projectData={projectData} setProjectData={setProjectData} onBack={() => setCurrentView('project-home')} onCreateNew={() => setCurrentView('project-creation')} onExport={() => exportProjectAsXLSX(projectData)} playbookData={playbookContent} />;
            default: return <InputScreen inputText={inputText} setInputText={handleSetInputText} fileName={fileName} handleFileChange={handleFileChange} clearFile={clearFile} analysisLevel={analysisLevel} setAnalysisLevel={setAnalysisLevel} generalInstructions={generalInstructions} setGeneralInstructions={setGeneralInstructions} onGenerate={handleGenerate} isLoading={Object.values(moduleStatuses).some(s => s === 'generating' || s === 'queued')} error={error} />;
        }
    };

    const renderCurrentView = () => {
        if (currentView === 'input') {
             return renderProcessView();
        }

        // After generation starts, show the dashboard with progress
        if (Object.values(moduleStatuses).some(s => s === 'generating' || s === 'queued') && currentView === 'home') {
            return <HomeScreen processName={processName} onStartNew={handleStartNewAnalysis} moduleStatuses={moduleStatuses} onModuleClick={handleModuleClick} analysisLevel={analysisLevel} />;
        }
        
        if (platformView === 'process') {
            if (currentView.startsWith('project')) setCurrentView('home');
            return renderProcessView();
        }
        if (platformView === 'project') {
            if (currentView === 'project-charter' || currentView === 'communication-plan' || currentView === 'project-execution') {
                return renderProcessView();
            }
            return <ProjectIntelligentHomeScreen moduleStatuses={moduleStatuses} onModuleClick={handleModuleClick} />;
        }
        return <p>Error: Unknown platform view.</p>;
    }
    
    React.useEffect(() => {
        if (prevPlatformViewRef.current === 'process' && platformView === 'project' && currentView === 'process-map') {
            // Persist map view when switching to project tab
        } else if (prevPlatformViewRef.current === 'project' && platformView === 'process' && currentView === 'process-map') {
            // Persist map view when switching back to process tab
        }
        prevPlatformViewRef.current = platformView;
    }, [platformView, currentView]);


    return (
        <div className="w-screen h-screen bg-gray-900 flex flex-col">
             {currentView !== 'input' && (
                <PlatformTabs platformView={platformView} setPlatformView={setPlatformView} />
            )}
            <div className="flex-grow overflow-y-auto relative">
                {renderCurrentView()}
            </div>
            <FeedbackToast show={showFeedbackToast} onHide={() => setShowFeedbackToast(false)} />
            {/* Persistent container for BPMN Modeler initialization */}
            <div id="bpmn-container-hidden" ref={bpmnContainerRef} style={{ display: 'none' }}></div>
        </div>
    );
};
