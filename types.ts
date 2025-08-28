/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// === UI State ===
export type View = 'input' | 'generating' | 'home' | 'process-map' | 'consultant-insights' | 'process-guide' | 'deep-dive' | 'value-stream-map' | 'customer-journey-map' | 'optimization-playbook' | 'project-creation' | 'project-execution' | 'app-guide' | 'project-home' | 'project-charter' | 'communication-plan' | 'compliance-risk';
export type PlatformView = 'process' | 'project';
export type ProjectView = 'overview' | 'kanban' | 'list';
export type ModuleStatus = 'locked' | 'queued' | 'generating' | 'ready' | 'error';

// === Data Structures for Analysis ===
export interface PainPoint { area: string; description: string; impact: string; recommendation: string; associatedStepID?: string; }
export interface OptimizationOpportunity { opportunity: string; description: string; benefit: string; priority: string; effort: string; associatedStepID?: string; }
export interface RpaCandidate { taskName: string; rationale: string; estimatedSaving: string; impact: string; effort: string; associatedStepID?: string; }
export interface AiWorkflowCandidate { processArea: string; description: string; benefit: string; impact: string; effort: string; associatedStepID?: string; }
export interface Anomaly { anomaly: string; description: string; correction: string; associatedStepID?: string; }
export interface ExcelDataItem { stepNumber: number; stepID: string; stepName: string; stepType: string; description: string; actors: string; systemsInvolved: string; inputs: string; outputs: string; laneName: string; issuesOrPainPoints?: string | null; automationOpportunities?: string | null; }
export interface ConsultantInsightsData { painPointAnalysis: PainPoint[]; processOptimizationOpportunities: OptimizationOpportunity[]; strategicSuggestions: { rpaCandidates: RpaCandidate[]; aiWorkflowCandidates: AiWorkflowCandidate[]; }; anomalyDetection: Anomaly[]; }
export interface SopStep { stepName: string; actor: string; description: string; inputs: string[]; outputs: string[]; detailedInstructions: string[]; systemsUsed?: string[]; businessRules?: string[]; exceptions?: string[]; risksAndControls: { risk: string; control: string; }[]; kpisAndMetrics: { metric: string; target: string; }[]; }
export interface SopData { title: string; executiveSummary: string; purpose: string; scope: string; responsibilities: { role: string; responsibilities: string[] }[]; definitions: { term: string; definition: string }[]; procedure: SopStep[]; governanceAndEscalation: { processOwner: string; reviewCycle: string; escalationPath: string; }; }
export interface VsmData { summary: string; metrics: { totalLeadTime: string; valueAddedTime: string; processCycleEfficiency: string; }; flow: { stepNumber: number; stepID: string; stepName: string; processTime: string; waitTime: string; leadTime: string; valueAdded: string; }[]; wastes: { wasteType: string; description: string; associatedStepID: string; }[]; recommendations: { recommendation: string; impact: string; }[]; }
export interface VsmState { data: VsmData | null; sufficientData: boolean; message: string | null; }
export interface CjmData { persona: string; goal: string; journey: { stage: string; actions: string; touchpoints: string; thoughts: string; painPoints: string; opportunities: string; }[]; keyTakeaways: { overallSentiment: string; criticalPainPoint: string; topOpportunity: string; }; }
export interface PlaybookAction { actionTitle: string; problemStatement: string; proposedSolution: string; requiredResources: string[]; suggestedTools: string[]; estimatedEffort: string; expectedImpact: string; successMetrics: string[]; }
export interface PlaybookPhase { phaseName: string; phaseGoal: string; estimatedDuration: string; actions: PlaybookAction[]; }
export interface PlaybookData { playbookTitle: string; executiveSummary: string; strategicInitiatives: { initiativeTitle: string; description: string; goals: string[]; linkedPainPoints: string[]; }[]; implementationPhases: PlaybookPhase[]; implementationRisks: { riskDescription: string; mitigationStrategy: string; }[]; }
export interface ComplianceIssue { issue: string; description: string; severity: string; recommendation: string; associatedStepID: string; }
export interface OperationalRisk { risk: string; description: string; likelihood: string; impact: string; mitigation: string; associatedStepID: string; }
export interface ComplianceRiskData { summary: string; complianceIssues: ComplianceIssue[]; operationalRisks: OperationalRisk[]; }

// === Data Structures for Project Execution ===
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
export type ProjectPriority = 'High' | 'Medium' | 'Low';

export interface ProjectTask {
    id: string;
    title: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    assignee?: string;
    dueDate?: string;
    phase: string;
    description: string;
    metrics: string[];
    resources: string[];
    createdAt: string;
}

export interface ProjectData {
    title: string;
    tasks: ProjectTask[];
}

export interface BudgetBreakdown {
    label: string;
    value: number;
}

export interface ProjectCharterData {
    projectName: string;
    projectSponsor: string;
    projectManager: string;
    problemStatement: string;
    businessCase: string;
    goals: string[];
    successCriteria: { metric: string; target: string; }[];
    scopeIn: string[];
    scopeOut: string[];
    keyDeliverables: string[];
    majorMilestones: { 
        milestone: string; 
        date: string;
        status: 'Completed' | 'In Progress' | 'Upcoming';
    }[];
    estimatedTotalBudget: number;
    budgetBreakdown: BudgetBreakdown[];
    keyStakeholders: { name: string; role: string; influence: string; }[];
    assumptions: string[];
    constraints: string[];
    risks: { description: string; impact: string; mitigation: string; }[];
}

export interface CommunicationPlanItem {
    communicationType: string;
    audience: string;
    method: string;
    frequency: string;
    owner: string;
}
export interface CommunicationPlanData {
    summary: string;
    plan: CommunicationPlanItem[];
}