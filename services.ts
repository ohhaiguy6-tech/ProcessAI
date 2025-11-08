/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Type } from "@google/genai";
import { ConsultantInsightsData, VsmData, ExcelDataItem, ProjectData, CommunicationPlanData, PlaybookData, ComplianceRiskData } from "./types.ts";

declare const XLSX: any;

// === Schemas ===
export const detailedAnalysisSchema = { type: Type.OBJECT, properties: { processName: { type: Type.STRING, description: "A concise and descriptive name for the overall business process." }, excelData: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stepNumber: { type: Type.NUMBER, description: "Unique, sequential number for the process step, starting from 1." }, stepID: { type: Type.STRING }, stepName: { type: Type.STRING }, stepType: { type: Type.STRING, description: "The specific BPMN 2.0 element type (e.g., bpmn:UserTask, bpmn:StartEvent)." }, description: { type: Type.STRING }, actors: { type: Type.STRING }, systemsInvolved: { type: Type.STRING }, inputs: { type: Type.STRING }, outputs: { type: Type.STRING }, laneName: { type: Type.STRING }, issuesOrPainPoints: { type: Type.STRING, nullable: true }, automationOpportunities: { type: Type.STRING, nullable: true }, }, required: ["stepNumber", "stepID", "stepName", "stepType", "description", "actors", "systemsInvolved", "inputs", "outputs", "laneName"] } }, consultantInsights: { type: Type.OBJECT, properties: { painPointAnalysis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { area: { type: Type.STRING }, description: { type: Type.STRING }, impact: { type: Type.STRING }, recommendation: { type: Type.STRING }, associatedStepID: { type: Type.STRING, nullable: true } } } }, processOptimizationOpportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { opportunity: { type: Type.STRING }, description: { type: Type.STRING }, benefit: { type: Type.STRING }, priority: { type: Type.STRING }, effort: { type: Type.STRING }, associatedStepID: { type: Type.STRING, nullable: true } } } }, strategicSuggestions: { type: Type.OBJECT, properties: { rpaCandidates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { taskName: { type: Type.STRING }, rationale: { type: Type.STRING }, estimatedSaving: { type: Type.STRING }, impact: { type: Type.STRING }, effort: { type: Type.STRING }, associatedStepID: { type: Type.STRING, nullable: true } } } }, aiWorkflowCandidates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { processArea: { type: Type.STRING }, description: { type: Type.STRING }, benefit: { type: Type.STRING }, impact: { type: Type.STRING }, effort: { type: Type.STRING }, associatedStepID: { type: Type.STRING, nullable: true } } } } }, }, anomalyDetection: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { anomaly: { type: Type.STRING }, description: { type: Type.STRING }, correction: { type: Type.STRING }, associatedStepID: { type: Type.STRING, nullable: true } } } } }, } }, required: ["processName", "excelData", "consultantInsights"] };
export const sopSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise, professional title for the SOP document. Must be under 150 characters." },
        executiveSummary: { type: Type.STRING, description: "A high-level summary (2-4 sentences) of the process's purpose, key stages, and intended outcome." },
        purpose: { type: Type.STRING, description: "A clear statement explaining why this process exists and what it aims to achieve." },
        scope: { type: Type.STRING, description: "Defines the boundaries of the process. What's included, what's excluded, start/end points, and relevant departments or scenarios." },
        responsibilities: {
            type: Type.ARRAY,
            description: "List of roles involved in the process and their specific responsibilities.",
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING, description: "The job title or system name (e.g., 'AP Clerk', 'ERP System')." },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key duties for this role." }
                },
                required: ["role", "responsibilities"]
            }
        },
        definitions: {
            type: Type.ARRAY,
            description: "A glossary of key terms, acronyms, or concepts used in the SOP.",
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { type: Type.STRING },
                    definition: { type: Type.STRING }
                },
                required: ["term", "definition"]
            }
        },
        procedure: {
            type: Type.ARRAY,
            description: "The detailed, step-by-step instructions for executing the process.",
            items: {
                type: Type.OBJECT,
                properties: {
                    stepName: { type: Type.STRING, description: "A clear, action-oriented name for the step (e.g., 'Verify Invoice Details')." },
                    actor: { type: Type.STRING, description: "The role responsible for performing this step." },
                    description: { type: Type.STRING, description: "A brief overview of the step's purpose." },
                    inputs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What is required to begin this step (e.g., 'Approved Purchase Order', 'Vendor Invoice')." },
                    outputs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The tangible result or outcome of completing this step (e.g., 'Verified Invoice', 'Payment Request Created')." },
                    detailedInstructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A numbered or bulleted list of specific actions to be taken." },
                    systemsUsed: {
                        type: Type.ARRAY,
                        description: "List of specific systems or software applications used in this step (e.g., 'SAP FICO', 'Salesforce CRM'). If none, must be an empty array [].",
                        items: { type: Type.STRING }
                    },
                    businessRules: {
                        type: Type.ARRAY,
                        description: "Key business rules or policies governing this step (e.g., 'All invoices over $10,000 require manager approval'). If none, must be an empty array [].",
                        items: { type: Type.STRING }
                    },
                    exceptions: {
                        type: Type.ARRAY,
                        description: "Common exceptions or error scenarios and how to handle them. If none, must be an empty array [].",
                        items: { type: Type.STRING }
                    },
                    risksAndControls: {
                        type: Type.ARRAY,
                        description: "Potential risks in this step and the controls to mitigate them. If none, must be an empty array [].",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                risk: { type: Type.STRING, description: "A description of a potential risk (e.g., 'Incorrect invoice data entry')." },
                                control: { type: Type.STRING, description: "The mitigating control for the risk (e.g., 'System-level validation against PO')." }
                            },
                            required: ["risk", "control"]
                        }
                    },
                    kpisAndMetrics: {
                        type: Type.ARRAY,
                        description: "Key Performance Indicators to measure the success of this step. If none, must be an empty array [].",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                metric: { type: Type.STRING, description: "The name of the metric (e.g., 'Processing Time')." },
                                target: { type: Type.STRING, description: "The target value or goal for the metric (e.g., 'Less than 24 hours')." }
                            },
                             required: ["metric", "target"]
                        }
                    }
                },
                required: ["stepName", "actor", "description", "inputs", "outputs", "detailedInstructions", "systemsUsed", "businessRules", "exceptions", "risksAndControls", "kpisAndMetrics"]
            }
        },
        governanceAndEscalation: {
            type: Type.OBJECT,
            properties: {
                processOwner: { type: Type.STRING, description: "The single role ultimately responsible for the process performance." },
                reviewCycle: { type: Type.STRING, description: "How often the SOP should be reviewed (e.g., 'Annually')." },
                escalationPath: { type: Type.STRING, description: "The procedure for handling exceptions or issues that cannot be resolved within the process." }
            },
            required: ["processOwner", "reviewCycle", "escalationPath"]
        }
    },
    required: ["title", "executiveSummary", "purpose", "scope", "responsibilities", "procedure", "governanceAndEscalation"]
};
export const vsmSufficiencySchema = { type: Type.OBJECT, properties: { isSufficient: { type: Type.BOOLEAN }, reason: { type: Type.STRING } }, required: ["isSufficient", "reason"] };
export const vsmSchema = { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, metrics: { type: Type.OBJECT, properties: { totalLeadTime: { type: Type.STRING }, valueAddedTime: { type: Type.STRING }, processCycleEfficiency: { type: Type.STRING } } }, flow: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stepNumber: { type: Type.NUMBER }, stepID: { type: Type.STRING }, stepName: { type: Type.STRING }, processTime: { type: Type.STRING }, waitTime: { type: Type.STRING }, leadTime: { type: Type.STRING }, valueAdded: { type: Type.STRING } } } }, wastes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { wasteType: { type: Type.STRING }, description: { type: Type.STRING }, associatedStepID: { type: Type.STRING } } } }, recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { recommendation: { type: Type.STRING }, impact: { type: Type.STRING } } } } } };
export const cjmSchema = { type: Type.OBJECT, properties: { persona: { type: Type.STRING }, goal: { type: Type.STRING }, journey: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stage: { type: Type.STRING }, actions: { type: Type.STRING }, touchpoints: { type: Type.STRING }, thoughts: { type: Type.STRING }, painPoints: { type: Type.STRING }, opportunities: { type: Type.STRING } } } }, keyTakeaways: { type: Type.OBJECT, properties: { overallSentiment: { type: Type.STRING }, criticalPainPoint: { type: Type.STRING }, topOpportunity: { type: Type.STRING } } } } };
export const playbookSchema = { type: Type.OBJECT, properties: { playbookTitle: { type: Type.STRING, description: "A short, professional title for the optimization playbook." }, executiveSummary: { type: Type.STRING, description: "A high-level summary (3-5 sentences) of the proposed transformation, its goals, and expected business value." }, strategicInitiatives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { initiativeTitle: { type: Type.STRING, description: "The name of a high-level strategic theme, e.g., 'Enhance Customer Onboarding'." }, description: { type: Type.STRING, description: "A brief description of the strategic initiative." }, goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of measurable goals for this initiative." }, linkedPainPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key pain points or wastes this initiative addresses." } }, required: ["initiativeTitle", "description", "goals"] } }, implementationPhases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phaseName: { type: Type.STRING, description: "Name of the phase, e.g., 'Phase 1: Foundational Quick Wins'." }, phaseGoal: { type: Type.STRING, description: "The primary objective of this phase." }, estimatedDuration: { type: Type.STRING, description: "An estimated timeline for the phase, e.g., '1-3 Months'." }, actions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { actionTitle: { type: Type.STRING, description: "A clear, actionable project or task title." }, problemStatement: { type: Type.STRING, description: "The specific problem this action solves, referencing source analysis." }, proposedSolution: { type: Type.STRING, description: "The detailed proposed solution." }, requiredResources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Roles or skills needed, e.g., 'Project Manager', 'Developer'." }, suggestedTools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific technologies or tools, e.g., 'RPA Software', 'Zendesk'." }, estimatedEffort: { type: Type.STRING, description: "Relative effort: Low, Medium, or High." }, expectedImpact: { type: Type.STRING, description: "Expected business impact: Low, Medium, or High." }, successMetrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "KPIs to measure success, e.g., 'Reduce processing time by 20%'." } }, required: ["actionTitle", "problemStatement", "proposedSolution", "estimatedEffort", "expectedImpact"] } } }, required: ["phaseName", "phaseGoal", "estimatedDuration", "actions"] } }, implementationRisks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { riskDescription: { type: Type.STRING }, mitigationStrategy: { type: Type.STRING } }, required: ["riskDescription", "mitigationStrategy"] } } }, required: ["playbookTitle", "executiveSummary", "strategicInitiatives", "implementationPhases", "implementationRisks"] };
export const projectCharterSchema = {
    type: Type.OBJECT,
    properties: {
        projectName: { type: Type.STRING },
        projectSponsor: { type: Type.STRING, description: "Infer a likely executive sponsor role, e.g., 'VP of Operations'." },
        projectManager: { type: Type.STRING, description: "Infer a likely project manager role, e.g., 'Process Improvement Lead'." },
        problemStatement: { type: Type.STRING },
        businessCase: { type: Type.STRING, description: "Justification for the project, linking it to strategic goals and expected ROI." },
        goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific, measurable, achievable, relevant, time-bound (SMART) goals." },
        successCriteria: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, target: { type: Type.STRING } }, required: ["metric", "target"] } },
        scopeIn: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What is explicitly included in the project." },
        scopeOut: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What is explicitly excluded from the project." },
        keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
        majorMilestones: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    milestone: { type: Type.STRING },
                    date: { type: Type.STRING, description: "An estimated completion date or timeframe, e.g., 'End of Q3'." },
                    status: { type: Type.STRING, enum: ['Completed', 'In Progress', 'Upcoming'] }
                }
            }
        },
        estimatedTotalBudget: { type: Type.NUMBER, description: "A high-level total budget estimate as a number, e.g., 75000." },
        budgetBreakdown: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING, description: "Budget category, e.g., 'Software Licensing', 'Personnel'." },
                    value: { type: Type.NUMBER, description: "The numeric value for this category." }
                }
            }
        },
        keyStakeholders: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, influence: { type: Type.STRING, description: "e.g., High, Medium, Low" } } } },
        assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
        risks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, impact: { type: Type.STRING }, mitigation: { type: Type.STRING } } } }
    },
    required: ["projectName", "problemStatement", "businessCase", "goals", "successCriteria", "scopeIn", "scopeOut", "keyDeliverables", "majorMilestones", "estimatedTotalBudget", "budgetBreakdown", "keyStakeholders", "assumptions", "constraints", "risks"]
};
export const communicationPlanSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief summary of the communication strategy." },
        plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    communicationType: { type: Type.STRING, description: "The purpose of the communication, e.g., 'Project Kick-off Meeting', 'Weekly Status Report'." },
                    audience: { type: Type.STRING, description: "The target stakeholder group, e.g., 'Project Team', 'Executive Sponsors'." },
                    method: { type: Type.STRING, description: "The channel for communication, e.g., 'Email', 'Team Meeting', 'SharePoint'." },
                    frequency: { type: Type.STRING, description: "How often the communication occurs, e.g., 'Once', 'Weekly', 'Monthly'." },
                    owner: { type: Type.STRING, description: "The role responsible for the communication, e.g., 'Project Manager'." }
                },
                required: ["communicationType", "audience", "method", "frequency", "owner"]
            }
        }
    },
    required: ["summary", "plan"]
};
export const complianceRiskSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A high-level summary of the process's compliance and risk posture." },
        complianceIssues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    issue: { type: Type.STRING, description: "A concise name for the potential compliance issue." },
                    description: { type: Type.STRING, description: "A detailed description of the issue and the regulations it might violate (e.g., GDPR, SOX, HIPAA)." },
                    severity: { type: Type.STRING, description: "The severity of the issue (e.g., High, Medium, Low)." },
                    recommendation: { type: Type.STRING, description: "A concrete recommendation to address the issue." },
                    associatedStepID: { type: Type.STRING, description: "The ID of the process step where the issue occurs." }
                },
                required: ["issue", "description", "severity", "recommendation", "associatedStepID"]
            }
        },
        operationalRisks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    risk: { type: Type.STRING, description: "A concise name for the operational risk." },
                    description: { type: Type.STRING, description: "A detailed description of the operational risk (e.g., single point of failure, data entry error, fraud)." },
                    likelihood: { type: Type.STRING, description: "The likelihood of the risk occurring (e.g., High, Medium, Low)." },
                    impact: { type: Type.STRING, description: "The potential impact if the risk occurs (e.g., High, Medium, Low)." },
                    mitigation: { type: Type.STRING, description: "A proposed strategy to mitigate the risk." },
                    associatedStepID: { type: Type.STRING, description: "The ID of the process step where the risk is most relevant." }
                },
                required: ["risk", "description", "likelihood", "impact", "mitigation", "associatedStepID"]
            }
        }
    },
    required: ["summary", "complianceIssues", "operationalRisks"]
};


// === Prompts ===

const getJsonOutputRules = () => `
---
**CRITICAL JSON OUTPUT RULES (MANDATORY):**
1.  **COMPLETE & VALID JSON:** Your entire output MUST be a single, complete, and syntactically perfect JSON object. It must start with \`{\` and end with \`}\`. Do not truncate the output. Ensure all brackets, braces, and quotes are correctly paired.
2.  **ESCAPE DOUBLE QUOTES:** You MUST properly escape any double quotes (\") that appear inside a JSON string value by prepending a backslash (e.g., \`"description": "The user said \\"it was easy\\""\`). This is a non-negotiable rule.
3.  **STRICT SCHEMA ADHERENCE:** Adhere strictly to the provided 'responseSchema'. Do not invent new properties or deviate from the specified data types.
---
`;

const getBpmnConstructionRules = () => {
    return `
---
**BPMN 2.0 Core Rules & Best Practices (MANDATORY ADHERENCE - ZERO TOLERANCE FOR DEVIATION):**

**PHILOSOPHY: You are building a professional, pixel-perfect, and flawless diagram. Clarity, precision, and readability are your only goals. Your output must be immediately usable in a corporate environment.**

1.  **Flow Direction & Readability:**
    *   **Rule:** The primary process flow is strictly **left to right**. Vertical flow is for secondary paths (e.g., inside a gateway branch). Backwards-flowing lines are forbidden except in clearly defined loops.

2.  **Start and End Events:**
    *   **Rule:** Every process MUST begin with exactly one **Start Event** (thin circle). It has no incoming sequence flows.
    *   **Rule:** Every process path MUST terminate at an **End Event** (thick circle). It has no outgoing sequence flows. Multiple End Events are encouraged to show different outcomes.

3.  **Gateways (Flow Control):**
    *   **Rule:** Gateways split and merge the flow. Label gateway splits with a clear question (e.g., "Is Validation Successful?").
    *   **CRITICAL RULE:** Every splitting gateway MUST have a corresponding joining gateway of the same type. This is non-negotiable for logical consistency.
    *   **Exclusive Gateway (XOR - 'X'):** Splits into ONE path. Outgoing flows must have mutually exclusive conditions (e.g., "Yes", "No").
    *   **Parallel Gateway (AND - '+'):** Splits into ALL paths simultaneously. Do not use conditions. The joining gateway MUST wait for ALL parallel paths to complete.
    *   **Inclusive Gateway (OR - 'O'):** Splits into ONE OR MORE paths based on conditions. Use with extreme care.

4.  **Pools and Lanes (Structural Foundation):**
    *   **CRITICAL RULE:** The entire diagram is constructed within **one pre-existing main Pool (Participant)**. You MUST place all elements inside this pool. DO NOT create another pool.
    *   **Rule:** You MUST create a dedicated **Lane** for each unique actor, role, system, or department. Every task, event, and gateway must reside inside its designated lane.
    *   **System Capability:** The system features an **advanced dynamic layout engine**. It will **automatically resize the Pool and Lanes** to perfectly fit your content. Trust the engine.

5.  **Activities (Tasks) & Naming:**
    *   **Rule:** You MUST use specific task types for professional clarity.
        *   \`bpmn:UserTask\`: Human + Software (e.g., 'Review Form').
        *   \`bpmn:ServiceTask\`: Automated system task (e.g., 'Call Inventory API').
        *   \`bpmn:ManualTask\`: Human, no software (e.g., 'Pack Box').
        *   \`bpmn:SendTask\`: Sends a message.
        *   \`bpmn:ReceiveTask\`: Waits for a message.
        *   \`bpmn:ScriptTask\`: Automated script.
        *   \`bpmn:BusinessRuleTask\`: Decision via rules engine.
    *   **Rule:** Name tasks using a "Verb-Noun" convention (e.g., "Process Payment").
    *   **SHAPE RULE:** Task elements MUST be created with a standard aspect ratio. Use a width of 100 and a height of 80. Avoid creating long, thin rectangles for tasks.

6.  **Element Placement - STRICT RULES:**
    *   **Data Objects (\`bpmn:DataObjectReference\`):** If used, MUST be positioned directly **ABOVE** the associated task.
    *   **Annotations (\`bpmn:TextAnnotation\`):** If used, MUST be associated with a Task and positioned on the **DOWN-SIDE, RIGHT-HAND side** of the task box. Use sparingly only for essential context.

7.  **Layout & Routing - THE ZERO OVERLAP MANDATE:**
    *   **SYSTEM CAPABILITY:** The system uses an **advanced, non-overlapping, automatic line router**. You do not specify waypoints.
    *   **YOUR CRITICAL RESPONSIBILITY:** Your primary job is to create an **extremely clean and spacious layout**. This is how you guarantee a professional diagram.
        *   **ZERO TOLERANCE:** There must be **NO instance of any sequence flow (arrow) visually crossing through, running under, or obstructing ANY other process element**. This includes Task boxes, Gateways, Events, Data Objects, Annotations, lane lines, or other sequence flows.
        *   **PROACTIVE SPACING (YOUR #1 JOB):** You MUST leave **GENEROUS** horizontal and vertical space between all elements. Think of creating wide, clear "rivers" for the connection lines to flow through. Add extra space proactively. This is the most important factor in preventing overlaps and creating a readable map. The layout engine will *not* fix a cluttered initial placement.
    *   **Alignment:** Ensure elements on the same horizontal axis have similar Y-coordinates. Ensure elements in the same vertical column have similar X-coordinates.

8.  **Forbidden Elements & Critical Rules:**
    *   **CRITICAL RULE:** You are modeling a single process. You MUST NOT create container elements like \`bpmn:SubProcess\` or additional \`bpmn:Participant\`s.
    *   **CRITICAL RULE - NO BLANK LABELS:** Every Task, Gateway, and Event shape you create using 'addShape' MUST have a non-empty, descriptive 'label'. Generating shapes with blank labels is a critical failure and will be rejected. This rule is absolute.
    *   **CRITICAL RULE - FLAWLESS CONNECTIONS:** After creating all shapes, you MUST connect them logically using 'addConnection'. Double-check that every shape (except start/end events) has at least one incoming and one outgoing connection. You MUST correctly use the 'id's you generated for the shapes.

9.  **FINAL VALIDATION (MANDATORY):**
    *   **Mental "Token" Check:** Before outputting the JSON, mentally simulate a "token" flowing through your diagram. Ensure there are no deadlocks, infinite loops, or illogical paths. The logic must be flawless from Start to End.
    *   **Visual Scan:** Mentally scan your coordinate layout. Is there ample space? Are there any potential overlaps? If so, fix them *before* generating the commands.
---
`;
};

export const buildConstructionPrompt = (mainInput: string | null, isFile: boolean, level: string, customInstructions: string, learnedParams: { hSpacing: number; vPadding: number } | null) => {
    const getProcessInputSection = () => {
        if (isFile) return "The business process description is provided in the attached document. Directly analyze the document's content to build the BPMN diagram.";
        return `The business process description is provided in the following text: "${mainInput || 'No textual description provided.'}"`;
    };
    
    const processInputSection = getProcessInputSection();

    const feedbackLoopSection = learnedParams ? `
---
**CRITICAL AI Feedback Loop: User Layout Preferences**
The user has previously adjusted the layout. This is a strong hint. You MUST prioritize these preferences to generate a map that meets the user's expectations.

- **User's Preferred Horizontal Spacing:** ${Math.round(learnedParams.hSpacing)} units between the centers of elements in adjacent columns.
- **User's Preferred Vertical Padding:** ${Math.round(learnedParams.vPadding)} units of space between the top/bottom lane boundaries and the nearest elements.
---
` : '';

    return `
You are an expert **BPMN Process Modeler** following **BPMN 2.0 best practices**. Your task is to analyze a business process and output a stream of JSON commands to build a professional, clean, and executable BPMN 2.0 diagram in real-time.

---
**Primary Directive: Enforce Analysis Level Detail**
You MUST strictly adhere to the requested analysis level. This is not a suggestion. You must AGGREGATE for high levels and ADD DETAIL for low levels.

- **Level 1:** You MUST consolidate the user's detailed input into only 3-7 major process stages. IGNORE minor details, decisions, and error paths. The goal is a strategic summary.
- **Level 2:** Show the main activities and key decision points (10-20 steps). Consolidate granular tasks into larger activities.
- **Level 3:** Model the process with significant detail. Show individual tasks, error paths, and specific decision logic.
- **Level 4:** Model every single detail with technical precision. Your diagram should be a direct blueprint for a developer, including system-specific actions.

${getBpmnConstructionRules()}

${feedbackLoopSection}

**Your Process:**
1.  **Analyze Input:** Read the provided process description. A main Participant (Pool) already exists on the canvas.
2.  **Identify & Create Lanes:** First, identify all unique actors/roles/systems. For each, create a 'bpmn:Lane' using the 'createLane' command. The code will automatically place these lanes inside the existing main pool. You must provide the layout (x, y, width, height) for each lane.
3.  **Place Shapes:** Then, for each step in the process, add a BPMN shape (Task, Event, Gateway) using the 'addShape' command.
    *   **MANDATORY:** You MUST assign a unique, sequential \`stepNumber\` property to every shape, starting from 1.
    *   **MANDATORY:** You MUST prepend the \`stepNumber\` to the shape's \`label\` (e.g., \`"label": "1. Submit Form"\`).
    *   **MANDATORY:** You MUST place it within the correct lane by setting its 'parent' property to the 'id' of the lane you created.
    *   **MANDATORY:** You MUST use the most specific BPMN task type where appropriate (e.g., \`bpmn:UserTask\`, \`bpmn:ServiceTask\`), as detailed in the rules.
4.  **Connect Shapes:** Finally, connect the shapes using the 'addConnection' command.

---
**Input for Processing:**
- **Process Input Source:** ${processInputSection}
- **Analysis Depth Requested:** "${level}"
- **General Instructions:** "${customInstructions || 'None.'}"
---

**CRITICAL COMMAND REQUIREMENTS:**
1.  **JSON Stream:** Your entire output will be a stream of individual JSON objects. Each object must represent one command.
2.  **Command Structure:** Each command object must have a 'command' property.
    *   Lane: \`{ "command": "createLane", "id": "...", "label": "...", ... }\`
    *   Shape: \`{ "command": "addShape", "id": "...", "type": "bpmn:UserTask", "label": "1. Do Something", "stepNumber": 1, "parent": "lane_id", ... }\`
    *   Connection: \`{ "command": "addConnection", "id": "...", "sourceId": "...", "targetId": "..." }\`
3.  **Command Order:** The command order is critical. You MUST create all lanes first, then all shapes, then all connections.
4.  **Layout Logic:** You are responsible for the layout. Calculate X/Y coordinates to ensure the diagram is **extremely well-spaced, aligned, and flows clearly from left to right**. The final layout engine will fine-tune your work, but your initial placement is critical. A good guideline is about **450 units of horizontal space** between element centers in adjacent columns, and at least **200 units of vertical space** between parallel tasks in the same lane. **Prioritize preventing overlaps above all else.** Do not place elements so close that their connection lines might cross other elements.
5.  **IDs:** The 'id' for each command must be unique.
`;
};

export const buildAnalysisPrompt = (analysisLevel, generalInstructions, constructionCommands, originalInput) => {
    const instructions = `Provide the full, detailed analysis, including the process name, the granular 'excelData', and the comprehensive 'consultantInsights'. For every insight, you MUST provide the 'associatedStepID' that links it back to the specific step in the process where it was identified.`;
    
    return `
You are an **EXPERT Business Process Analyst**. Your task is to generate a detailed analysis based on the complete context of a business process, provided through the user's original input and the resulting BPMN construction commands.

**Analysis Context:**
- **User's Original Input (Primary Source):** """${originalInput}"""
- **Analysis Depth Requested:** "${analysisLevel}"
- **General Instructions:** "${generalInstructions || 'None.'}"
- **Current Task:** ${instructions}

**BPMN Construction Commands (Secondary Source / Structural Reference):**
\`\`\`json
${JSON.stringify(constructionCommands, null, 2)}
\`\`\`

${getJsonOutputRules()}

**Additional Requirements:**
1.  **Data Consistency:** The data in the 'excelData' array MUST correspond directly to the commands provided. Do not invent steps.
2.  **Insight Quality:** Your insights in 'consultantInsights' must be derived from a deep analysis of the **User's Original Input**. Use the BPMN commands to structure these insights and link them to specific steps. Provide realistic 'priority'/'impact' and 'effort' levels (High, Medium, or Low).
3.  **CRITICAL - Link Insights to Steps:** For every individual insight you generate (Pain Point, Optimization, RPA Candidate, etc.), you MUST populate the 'associatedStepID' field with the 'id' of the corresponding process step from the construction commands. This traceability is mandatory.
`;
};

const getSopFrameworkText = () => `
<SOP_FRAMEWORK_DOCUMENT>
    
    ### 1. Purpose
    Define best practices and structure for AI to convert unstructured operational information (meetings, notes, chat logs, etc.) into a well-formatted, professional SOP document.

    ### 2. Input Data Types
    AI should handle various unstructured sources, such as:
    *   Meeting transcripts between consultants, process owners, and technical managers
    *   Email summaries or business discussions
    *   Process flow notes, user stories, and technical documentation

    ### 3. Data Structuring Process
    The AI should follow a 3-stage conversion pipeline:
    
    **Stage 1: Data Understanding**
    *   Identify key process roles (e.g., Process Owner, User, Driver, Tech Manager).
    *   Extract intent, tasks, tools, KPIs, dependencies, and risks from unstructured text.
    *   Filter out conversational or filler language.
    
    **Stage 2: SOP Structuring**
    *   Organize extracted data into a defined SOP framework.
    *   Ensure clarity, actionability, and natural tone (no placeholders like “fill in date”).
    
    **Stage 3: SOP Refinement**
    *   Validate logical flow: Purpose → Scope → Roles → Procedure → Exceptions → Review Cycle.
    *   Maintain consistent terminology, plain professional language, and readability.

    ### 4. SOP Document Format
    
    **A. Cover Page**
    *   **SOP Title:** Clear, descriptive name (Editable, Mandatory)
    *   **Version:** Auto-increment (e.g., v1.0) (Editable, Mandatory)
    *   **Created By:** AI or Author name (Editable, Mandatory)
    *   **Created Date:** Auto-filled (Editable, Mandatory)
    *   **Reviewed By:** Role/Name (Editable, Mandatory)
    *   **Approval Status:** Draft / Approved (Editable, Mandatory)
    
    **B. Index Page**
    Auto-generated with clickable sections for easy navigation:
    *   Overview, Purpose, Scope, Roles and Responsibilities, Procedure Steps, Tools/Systems Used, Risk & Mitigation, Review Cycle, Change History.

    **C. SOP Body Template**
    1.  **Purpose:** Explain the intent and business value of the SOP clearly.
    2.  **Scope:** Define what the SOP covers (departments, systems, limits).
    3.  **Roles and Responsibilities:** List key stakeholders and their duties.
    4.  **Procedure Steps:**
        *   Sequential, action-based steps.
        *   Use numbering and bullet hierarchy.
        *   Include "Expected Outcome" per step.
    5.  **Tools & References:** Link to relevant systems, dashboards, or documents.
    6.  **Risk & Mitigation:** Highlight known risks and control measures.
    7.  **Change History:** Version, Date, Changes, Updated By.
    8.  **Review Cycle:** Define frequency (e.g., Quarterly, Annually).

    ### 5. Tone & Style Guidelines
    *   **Professional, human-like tone** (avoid robotic or template language).
    *   **Use active voice:** "The system verifies input” instead of “Input should be verified."
    *   **Avoid placeholders** like “fill name here” — generate or leave editable fields with brackets [Role Name].
    *   Keep sentences **clear, short, and business-oriented**.

    ### 6. AI Functional Capabilities
    *   **Edit Mode:** Allow user to modify sections manually while retaining structure.
    *   **Filter & Search:** Quickly locate sections or SOPs by keyword, role, or system.
    *   **Version Control:** Auto-track changes with timestamps and author ID.
    *   **SOP Regeneration:** AI refines or rewrites SOPs based on updated unstructured data.
    *   **Validation Check:** Detect missing mandatory sections before publishing.
    *   **Export:** Generate in formats (Word, PDF, HTML).

    ### 7. SOP Generation Workflow (AI Perspective)
    1.  **Input Parsing:** Capture and segment unstructured text.
    2.  **Entity Extraction:** Identify key business entities and actions.
    3.  **Mapping to Template:** Match extracted info to SOP structure.
    4.  **Tone Normalization:** Rewrite into professional, human-like prose.
    5.  **Formatting:** Apply layout, table, numbering, and metadata.
    6.  **Output Generation:** Produce structured, editable SOP document.

    ### 8. Quality and Compliance Checks
    *   Each SOP must pass **Consistency Check** (terminology, versioning, date).
    *   Ensure **Role alignment** (no missing owners or undefined approvers).
    *   Maintain **Review Logs** for audit and governance purposes.

</SOP_FRAMEWORK_DOCUMENT>
`;

export const buildSopPrompt = (processName, excelData, insights, originalInput) => {
    return `
You are an expert technical writer and business process consultant tasked with creating a world-class Standard Operating Procedure (SOP). Your output must be a single, valid JSON object that strictly adheres to the provided schema.

**CRITICAL FRAMEWORK MANDATE:**
You MUST adhere to the following comprehensive framework for generating the SOP. This is not a suggestion; it is a strict set of rules for structure, content, tone, and format that you must follow precisely.
${getSopFrameworkText()}

**CRITICAL DATA SOURCING MANDATE:**
Your primary source of truth is the **User's Original Input**. You must read it carefully to understand the nuances, unspoken rules, and true context of the process. The 'Structured Process Steps' and 'Consultant Insights' are valuable structured summaries, but the original text contains the most detail. Synthesize information from all sources to create the most accurate and comprehensive SOP possible.

**Analysis Context:**
- **Process Name:** ${processName}
- **User's Original Input (Primary Source):** """${originalInput}"""
- **Structured Process Steps Data (Reference):**
\`\`\`json
${JSON.stringify(excelData.map(({ stepNumber, stepName, actors, description, systemsInvolved }) => ({ stepNumber, stepName, actors, description, systemsInvolved })), null, 2)}
\`\`\`
- **High-Level Consultant Insights (Reference for risks, KPIs, scope):**
\`\`\`json
${JSON.stringify(insights, null, 2)}
\`\`\`

${getJsonOutputRules()}

**TASK: GENERATE DETAILED SOP JSON**
Based on all the context provided, populate each section of the JSON schema with high-quality, professional content. Be precise and avoid generic statements.

- **CRITICAL COMPLETENESS RULE**: For every single field in the schema, especially within the 'procedure' array, you MUST provide a value. If information for a field (like 'exceptions' or 'businessRules') is not present in the source data, you must infer logical possibilities based on your expertise or explicitly state the absence of information by providing an empty array \`[]\`. **Do not leave any required fields null, undefined, or missing.** This is mandatory for a successful generation.
- **"procedure"**: This is the most critical section. For each step, provide exhaustive detail for all sub-fields like "detailedInstructions", "risksAndControls", "kpisAndMetrics", etc., drawing heavily from the user's original input.

**Final Instruction:** Generate the complete, detailed SOP as a single, valid JSON object now. Do not include any text, markdown, or commentary outside of the JSON structure itself.
`;
};

export const buildVsmSufficiencyCheckPrompt = (originalInput: string) => {
    return `
    You are a Lean Six Sigma expert. Your task is to determine if the user's provided text contains enough specific, quantitative data to create a meaningful Value Stream Map (VSM).
    A meaningful VSM requires concrete details like:
    - Specific time durations (e.g., "takes 5 minutes", "waits for 2 hours", "3-day approval cycle").
    - Clear distinctions between value-added work and non-value-added waiting/rework/transport.
    - Mentions of inventory, batch sizes, or queue lengths.

    Analyze the following user input:
    """
    ${originalInput}
    """

    Based on your analysis, respond with a JSON object.
    - If the text contains enough specific, quantitative data to calculate process time, wait time, and efficiency, set "isSufficient" to true. The "reason" should state why (e.g., "The user provided specific timings for key steps.").
    - If the text is purely descriptive without concrete numbers or clear value distinctions, set "isSufficient" to false. The "reason" MUST clearly explain what specific information is missing (e.g., "The input lacks specific time durations for tasks and waiting periods, which are essential for VSM calculation.").
    
    ${getJsonOutputRules()}
    `;
};

const getVsmFrameworkText = () => `
<VSM_FRAMEWORK_DOCUMENT>
    ### 1. Purpose
    Define best practices and structure for AI to convert unstructured operational and process data into a well-structured Value Stream Map (VSM) document. This ensures consistency, visibility, and improvement tracking across process stages and stakeholders.

    ### 2. Input Data Types
    AI should handle unstructured sources such as meeting notes, process logs, user stories, team discussions, KPI reports, and system transactions to extract process flow details.

    ### 3. Data Structuring Process
    - **Stage 1: Data Understanding** – Identify process actors, actions, systems, inputs, and outputs.
    - **Stage 2: Mapping** - Translate extracted data into a structured flow: Supplier → Input → Process → Output → Customer.
    - **Stage 3: Refinement** – Validate time, waste, delay, and efficiency metrics across the mapped flow.

    ### 4. VSM Document Format
    - **Body Template includes:** Purpose, Scope, Process Overview, Current State Map, Future State Map, Metrics Summary, Bottlenecks, Improvement Actions, Review Cycle, and Change History.

    ### 5. Tone & Style Guidelines
    Use professional, clear, and analytical tone. Avoid vague terms. Use active voice and data-backed statements. Focus on flow efficiency, measurable improvements, and actionable insights.

    ### 6. AI Functional Capabilities
    Edit Mode, Filter/Search, Version Control, Map Regeneration, Validation Check, Export. AI should enable comparison between Current and Future State Maps and highlight improvement points automatically.

    ### 7. VSM Generation Workflow (AI Perspective)
    Input Parsing → Process Entity Extraction → Flow Mapping → Data Normalization → Visualization Layer → Output Generation.
    
    ### 8. Quality & Compliance Checks
    Ensure completeness of process flow, correct time and waste metrics, stakeholder alignment, and version tracking. Maintain audit trail of changes and improvement history.
</VSM_FRAMEWORK_DOCUMENT>
`;

export const buildVsmPrompt = (processName, excelData, insights, originalInput) => `
You are a Lean Six Sigma Master Black Belt specializing in Value Stream Mapping (VSM). Your task is to analyze the provided business process and generate a comprehensive VSM analysis as a single JSON object.

**CRITICAL FRAMEWORK MANDATE:**
You MUST adhere to the following comprehensive framework for generating the VSM. This is not a suggestion; it is a strict set of rules for structure, content, tone, and format that you must follow precisely.
${getVsmFrameworkText()}

**CRITICAL ANALYSIS MANDATE:**
Your primary task is to derive the value stream directly from the user's 'Original Input'. The 'Detailed Process Steps' from the BPMN map are for reference only. You are NOT required to create a VSM step for every BPMN step. You MUST consolidate, expand, or re-interpret the flow based on what creates or destroys value from a Lean perspective. The final 'flow' in your JSON output should reflect YOUR expert VSM analysis, not a simple copy of the BPMN structure.

**Time Analysis Mandate:**
1.  **Prioritize Explicit Data:** Meticulously scan the 'Original Input' text for any explicit time durations (e.g., "5 minutes," "waited 2 hours," "3-day approval"). These are your primary source of truth.
2.  **Use Explicit Data:** If you find reliable, explicit time data, use it directly to populate the 'processTime' and 'waitTime' fields.
3.  **Infer When Necessary:** If, and only if, explicit time data is absent, you may infer reasonable, standard timings for tasks.
4.  **Acknowledge Inference:** If you infer timings, you MUST state this in the 'summary' field.

**VA/NVA Analysis Mandate:**
Semantically analyze each task description from the 'Original Input' to categorize it as Value-Added (VA) or Non-Value-Added (NVA).
- **VA:** Directly transforms the product/service in a way the customer is willing to pay for.
- **NVA:** Waste. This includes waiting, inspection, data transportation, rework, approvals that don't add value, etc. Be aggressive in identifying NVA.

**CONTEXT FOR ANALYSIS:**
- Process Name: ${processName}
- Original Input (Primary Source): """${originalInput}"""
- Detailed Process Steps (Reference): ${JSON.stringify(excelData)}
- Consultant Insights (Reference for bottlenecks): ${JSON.stringify(insights)}

${getJsonOutputRules()}

**MANDATE & JSON OUTPUT STRUCTURE:**
Generate a single JSON object that adheres strictly to the provided schema.
- **"summary"**: (string) A brief summary (2-4 sentences) of the current process flow and its overall efficiency.
- **"flow"**: (array of objects) Each object represents a step FROM YOUR INDEPENDENT ANALYSIS.
- **"wastes"**: (array of objects) For each identified waste, specify its type, describe it, and link it to the relevant 'associatedStepID' from the BPMN map if a clear link exists.
- **"recommendations"**: (array of objects) Actionable improvement suggestions.
---
Generate the complete, data-driven VSM analysis as a JSON object now.`;

export const buildCjmPrompt = (processName, excelData, insights, originalInput) => `
You are a Customer Experience (CX) strategist. Your task is to create a Customer Journey Map (CJM) based on the provided business process, shifting the perspective entirely to the customer. Output a single, valid JSON object.

**CRITICAL PERSPECTIVE MANDATE:**
Your analysis MUST be derived primarily from the 'Original Input'. Infer the customer's journey from the user's description of the process. The 'Detailed Process Steps' and 'Consultant Insights' are secondary context. Do not simply re-label process steps as journey stages; you must synthesize a true customer-centric journey.

**CONTEXT:**
- Process Name: ${processName}
- Original Input (Primary Source): ${originalInput} (Pay close attention to any mention of customers, clients, or users).
- Detailed Process Steps (Reference): ${JSON.stringify(excelData)}
- Consultant Insights (Reference for pain points): ${JSON.stringify(insights)}

${getJsonOutputRules()}

**MANDATE & JSON OUTPUT STRUCTURE:**
Generate a single JSON object that adheres strictly to the provided schema.
- **Adopt the Customer's Perspective:** Analyze every step based on how a customer would interact with or be affected by it.
- **Map Touchpoints:** Identify every point of interaction (touchpoint) between the customer and the business.
- **Infer Customer Emotions:** Based on the process details (e.g., delays, handoffs, approvals), infer the likely emotional state of the customer at each stage (e.g., Happy, Neutral, Frustrated).
- **Identify Pain Points & Moments of Delight:** Pinpoint what makes the journey difficult and what makes it positive for the customer.
---
Generate the complete CJM as a JSON object now.`;

export const buildPlaybookPrompt = (processName, analysisData, vsmData, originalInput) => `
You are a top-tier management consultant specializing in business process re-engineering and digital transformation. Your task is to create a strategic "Optimization Playbook" that serves as a ready-to-use project plan.

**CRITICAL MANDATE: Synthesize All Provided Intelligence**
You MUST analyze and synthesize information from ALL of the following data sources to create a coherent, data-driven, and actionable transformation plan. Your playbook must directly address the specific issues identified in these analyses.

1.  **Original User Input (The "Context"):** This is your primary source for understanding the user's goals and priorities, even unstated ones.
2.  **Consultant Insights (The "What"):** Contains the core pain points, bottlenecks, and automation/AI opportunities. This is your primary source for identifying WHAT needs to be fixed.
3.  **Value Stream Map (The "Why"):** Contains analysis of waste (TIMWOOD), process inefficiencies, and lead times. Use this to justify WHY the changes are needed (e.g., "to eliminate 2 days of wait time identified in VSM").

**CONTEXT FOR ANALYSIS:**
- Process Name: ${processName}
- Original User Input: ${originalInput}
- Consultant Insights: ${JSON.stringify(analysisData.consultantInsights)}
- Value Stream Map Analysis: ${JSON.stringify(vsmData)}

${getJsonOutputRules()}

**MANDATE & JSON OUTPUT STRUCTURE:**
Generate a single, complete JSON object that strictly adheres to the provided schema.

-   **"playbookTitle"**: Create a professional title, e.g., "Playbook for Optimizing the ${processName} Process".
-   **"implementationPhases"**: This is CRITICAL. Create a logical, phased approach (e.g., Phase 1: Quick Wins, Phase 2: Core Re-engineering, Phase 3: Strategic Transformation).
-   **"actions"**: For each action within a phase:
    -   **"problemStatement"**: Be specific. Reference the source (e.g., "Addresses 'Manual Data Re-entry' pain point and 'Transportation' waste from VSM.").
    -   **"successMetrics"**: Define measurable KPIs to track success.
-   **"implementationRisks"**: Identify potential challenges and propose mitigation strategies.

---
Generate the complete, data-driven Optimization Playbook as a single JSON object now.
`;

export const buildProjectCharterPrompt = (originalInput: string, analysisData: { consultantInsights: ConsultantInsightsData } | null, playbookData: PlaybookData | null) => {
    const contextSections = [];
    if (analysisData) {
        contextSections.push(`
<context_source name="Consultant Insights">
${JSON.stringify(analysisData.consultantInsights, null, 2)}
</context_source>
`);
    }
    if (playbookData) {
        contextSections.push(`
<context_source name="Optimization Playbook">
${JSON.stringify(playbookData, null, 2)}
</context_source>
`);
    }

    return `
    You are a certified Project Management Professional (PMP) with deep expertise in creating formal, comprehensive project charters, based on PMI best practices. Your task is to create a professional Project Charter to improve the business process described by the user.

    **CRITICAL MANDATE:** You MUST synthesize information from ALL available sources. Your primary source of truth is the user's original input. You must analyze it to understand the core problem and the implied goals of an improvement project. Use the other analysis documents (like 'Consultant Insights' or an 'Optimization Playbook') to enrich the charter with specific details, risks, stakeholders, and project actions.

    **DATA SOURCES FOR YOUR ANALYSIS:**

    <context_source name="User's Original Process Description (Primary Source)">
    """${originalInput}"""
    </context_source>

    ${contextSections.join('\n')}

    **YOUR TASK:**
    Synthesize all available information to create a comprehensive, professional project charter that adheres to the provided JSON schema. Infer reasonable details for roles (Sponsor, PM), budget, and timelines based on the scale of the process described. The goal is to formalize an improvement project based on the user's provided context.

    ${getJsonOutputRules()}

    **ADDITIONAL INSTRUCTIONS:**
    - **Success Criteria:** This is critical. Do not just copy goals. Define specific, measurable metrics that will determine if the project was a success (e.g., Metric: 'Invoice Processing Time', Target: 'Reduce by 30%').
    - **Stakeholders & Risks:** Present these sections as structured data, ready for a formal document. Infer these from the roles and problems described in the source texts.
    - **Budget:** You MUST provide a numeric \`estimatedTotalBudget\` and a \`budgetBreakdown\` array. Create a logical breakdown into 3-5 categories (e.g., Personnel, Software, Training) that sums up to the total.
    - **Milestones:** You MUST assign a \`status\` ('Completed', 'In Progress', or 'Upcoming') to each milestone. For a new project, most should be 'Upcoming'.

    Generate the complete Project Charter as a single JSON object now.
    `;
};

export const buildCommunicationPlanPrompt = (projectCharterData, originalInput) => {
    return `
    You are a certified Project Management Professional (PMP) specializing in project communications. Your task is to create a strategic Communication Plan based on a Project Charter.

    **CRITICAL MANDATE:** Analyze the project charter, especially the list of key stakeholders, to devise a logical and effective communication strategy. Your plan should ensure all stakeholders are kept informed at the appropriate level and frequency.

    **CONTEXT:**
    - **User's Original Process Input:** """${originalInput}"""
    - **Project Charter:**
    \`\`\`json
    ${JSON.stringify(projectCharterData, null, 2)}
    \`\`\`

    ${getJsonOutputRules()}

    **INSTRUCTIONS:**
    Based on the charter, create a communication plan that covers key project events like kick-offs, status updates, milestone reviews, and project closure. Tailor the communication methods and frequency to the different stakeholder groups identified in the charter.

    Generate the complete Communication Plan as a single JSON object now.
    `;
};

export const buildComplianceRiskPrompt = (originalInput, analysisData, constructionCommands) => {
    return `
You are an expert in GRC (Governance, Risk, and Compliance) and operational risk management. Your task is to analyze a business process and identify potential compliance issues and operational risks.

**CRITICAL MANDATE: Synthesize All Provided Intelligence**
You MUST analyze and synthesize information from ALL available data sources to identify risks.

1.  **Original User Input:** The primary source for understanding the process context, industry, and any mentioned controls (or lack thereof).
2.  **Consultant Insights & Process Steps:** Use this structured data to pinpoint specific steps where risks are likely to occur. Pay close attention to handoffs, manual data entry, approvals, and system interactions.

**CONTEXT FOR ANALYSIS:**
- **User's Original Input:** """${originalInput}"""
- **Consultant Insights:** """${JSON.stringify(analysisData.consultantInsights)}"""
- **BPMN Construction Commands (for step IDs):** """${JSON.stringify(constructionCommands)}"""

${getJsonOutputRules()}

**YOUR TASK:**
Generate a single, complete JSON object that strictly adheres to the provided schema.

-   **"complianceIssues"**: Identify potential violations of common regulations (e.g., GDPR for data handling, SOX for financial controls, HIPAA for health information). If the industry isn't specified, assume general business regulations.
-   **"operationalRisks"**: Identify risks related to process execution, such as fraud, errors, bottlenecks, single points of failure, or lack of oversight.
-   **"associatedStepID"**: This is CRITICAL. For every single issue and risk you identify, you MUST link it to the specific step from the 'BPMN Construction Commands' where it is most likely to occur. This traceability is mandatory.

---
Generate the complete Compliance & Risk analysis as a single JSON object now.
`;
};


// === BPMN Diagram Logic ===
export const executeBpmnCommand = (command: any, modeler: any) => {
    if (!modeler) return;
    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');

    const participantShape = elementRegistry.find(el => el.type === 'bpmn:Participant');
    if (!participantShape) {
        console.error("Fatal: Participant/Pool shape not found. Cannot construct diagram.");
        return;
    }

    const { id, type, label, parent, sourceId, targetId } = command;

    switch (command.command) {
        case 'createLane': {
            const x = parseFloat(command.x);
            const y = parseFloat(command.y);
            const width = parseFloat(command.width);
            const height = parseFloat(command.height);

            if (!isFinite(x) || !isFinite(y)) {
                console.warn(`Skipping lane with invalid coordinates:`, command);
                return;
            }

            const safeWidth = Math.max(isFinite(width) ? width : 600, 300);
            const safeHeight = Math.max(isFinite(height) ? height : 100, 100);
            const laneDimensions = { x, y, width: safeWidth, height: safeHeight };

            const lane = modeling.createShape({ type: 'bpmn:Lane' }, laneDimensions, participantShape, { isHorizontal: true });
            modeling.updateLabel(lane, label);
            elementRegistry.updateId(lane, id);
            break;
        }
        case 'addShape': {
            const hostShape = elementRegistry.get(parent);
            const parentShape = hostShape || participantShape;

            const x = parseFloat(command.x);
            const y = parseFloat(command.y);

            if (!isFinite(x) || !isFinite(y)) {
                console.warn(`Skipping shape with invalid coordinates:`, command);
                return;
            }

            let defaultWidth = 100, defaultHeight = 80; // Task
            if (type.includes('Event')) { defaultWidth = 36; defaultHeight = 36; } 
            else if (type.includes('Gateway')) { defaultWidth = 50; defaultHeight = 50; }
            
            let width = parseFloat(command.width);
            let height = parseFloat(command.height);

            if (!isFinite(width) || width <= 0) width = defaultWidth;
            if (!isFinite(height) || height <= 0) height = defaultHeight;
            
            // Clamp and round the dimensions to prevent errors
            const finalWidth = Math.round(Math.max(width, 10));
            const finalHeight = Math.round(Math.max(height, 10));
            
            const newShape = modeling.createShape({ type }, { x, y, width: finalWidth, height: finalHeight }, parentShape);
            modeling.updateLabel(newShape, label);
            elementRegistry.updateId(newShape, id);
            break;
        }
        case 'addConnection': {
            const source = elementRegistry.get(sourceId);
            const target = elementRegistry.get(targetId);
            if (source && target) {
                modeling.connect(source, target);
            } else {
                console.warn(`Could not create connection from '${sourceId}' to '${targetId}'. One or both elements not found.`);
            }
            break;
        }
        default:
            console.warn(`Unknown command: ${command.command}`);
    }
};

export const adjustLayout = (modeler: any) => {
    if (!modeler) return;

    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');
    
    const participant = elementRegistry.find(el => el.type === 'bpmn:Participant' && isFinite(el.x) && isFinite(el.y));
    if (!participant) {
         console.warn("Layout aborted: Valid Participant/Pool not found.");
         return;
    }

    const allLanes = elementRegistry.filter(el => 
        el.type === 'bpmn:Lane' && 
        el.parent?.id === participant.id &&
        isFinite(el.x) && isFinite(el.y) && isFinite(el.width) && isFinite(el.height)
    );

    if (allLanes.length === 0) {
        modeler.get('canvas').zoom('fit-viewport', 'auto');
        return;
    }

    const POOL_HEADER_WIDTH = 30;
    const PADDING_X = 200;
    const PADDING_Y = 180;
    const ELEMENT_V_SPACING = 200;
    const COLUMN_H_SPACING = 450;
    const MIN_LANE_HEIGHT = 400;
    const COLUMN_GROUPING_THRESHOLD = 75;

    const allFlowNodes = elementRegistry
        .filter(el => 
            el.businessObject?.$instanceOf('bpmn:FlowNode') &&
            allLanes.some(lane => lane.id === el.parent?.id) &&
            isFinite(el.x) && isFinite(el.y) && isFinite(el.width) && isFinite(el.height)
        )
        .sort((a, b) => (a.x + a.width / 2) - (b.x + b.width / 2));

    if (allFlowNodes.length === 0) {
         modeler.get('canvas').zoom('fit-viewport', 'auto');
         return;
    }

    const columns = [];
    if (allFlowNodes.length > 0) {
        let currentColumn = [allFlowNodes[0]];
        columns.push(currentColumn);
        for (let i = 1; i < allFlowNodes.length; i++) {
            const el = allFlowNodes[i];
            const lastColumn = columns[columns.length - 1];
            const lastColAvgX = lastColumn.reduce((sum, item) => sum + item.x + item.width / 2, 0) / lastColumn.length;
            if (Math.abs((el.x + el.width / 2) - lastColAvgX) < COLUMN_GROUPING_THRESHOLD) {
                lastColumn.push(el);
            } else {
                currentColumn = [el];
                columns.push(currentColumn);
            }
        }
    }

    const columnMetrics = columns.map(col => ({
        elements: col,
        width: Math.max(...col.map(el => el.width))
    }));

    const laneData = allLanes.map(lane => {
        const requiredHeight = Math.max(0, ...columnMetrics.map(metric => {
            const elementsInLaneInCol = metric.elements.filter(el => el.parent?.id === lane.id);
            if (elementsInLaneInCol.length === 0) return 0;
            
            const totalElementHeight = elementsInLaneInCol.reduce((sum, el) => sum + el.height, 0);
            const totalSpacing = Math.max(0, elementsInLaneInCol.length - 1) * ELEMENT_V_SPACING;
            return totalElementHeight + totalSpacing;
        }));
        
        const finalHeight = Math.max(MIN_LANE_HEIGHT, requiredHeight + 2 * PADDING_Y);
        return { lane, finalHeight, originalY: lane.y };
    });

    const maxLaneHeight = laneData.length > 0 ? Math.max(...laneData.map(d => d.finalHeight)) : MIN_LANE_HEIGHT;

    laneData.sort((a, b) => a.originalY - b.originalY);

    const totalContentWidth = columnMetrics.reduce((sum, metric) => sum + metric.width, 0) + Math.max(0, columnMetrics.length - 1) * COLUMN_H_SPACING;
    const finalLaneWidth = totalContentWidth + 2 * PADDING_X;
    const totalPoolHeight = laneData.length * maxLaneHeight;

    let currentLaneY = participant.y;
    laneData.forEach(data => {
        modeling.resizeShape(data.lane, { 
            x: participant.x + POOL_HEADER_WIDTH, 
            y: currentLaneY, 
            width: finalLaneWidth, 
            height: maxLaneHeight
        });
        currentLaneY += maxLaneHeight;
    });

    let currentColumnX = participant.x + POOL_HEADER_WIDTH + PADDING_X;
    columnMetrics.forEach(metric => {
        laneData.forEach(({ lane }) => {
            const freshLane = elementRegistry.get(lane.id);
            if (!freshLane) return;

            const elementsToPosition = metric.elements
                .filter(el => el.parent?.id === freshLane.id)
                .sort((a, b) => a.y - b.y);

            if (elementsToPosition.length > 0) {
                const groupHeight = elementsToPosition.reduce((sum, el) => sum + el.height, 0) + Math.max(0, elementsToPosition.length - 1) * ELEMENT_V_SPACING;
                let currentElementY = freshLane.y + (freshLane.height - groupHeight) / 2;

                elementsToPosition.forEach(el => {
                    const elementX = currentColumnX + (metric.width - el.width) / 2;
                    const delta = { x: elementX - el.x, y: currentElementY - el.y };
                    
                    if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {
                        modeling.moveShapes([el], delta);
                    }
                    currentElementY += el.height + ELEMENT_V_SPACING;
                });
            }
        });
        currentColumnX += metric.width + COLUMN_H_SPACING;
    });

    modeling.resizeShape(participant, { 
        x: participant.x, 
        y: participant.y, 
        width: finalLaneWidth + POOL_HEADER_WIDTH, 
        height: Math.max(MIN_LANE_HEIGHT, totalPoolHeight) 
    });
    
    const allConnections = elementRegistry.filter(el => el.type === 'bpmn:SequenceFlow');
    if(allConnections.length > 0) {
        modeling.layoutConnections(allConnections);
    }
    
    modeler.get('canvas').zoom('fit-viewport', 'auto');
};

export const analyzeAndLearnFromLayout = (modeler) => {
    if (!modeler) return null;

    const elementRegistry = modeler.get('elementRegistry');
    const allFlowNodes = elementRegistry.filter(el =>
        el.businessObject?.$instanceOf('bpmn:FlowNode') && el.parent?.type === 'bpmn:Lane' &&
        isFinite(el.x) && isFinite(el.y)
    ).sort((a, b) => (a.x + a.width / 2) - (b.x + b.width / 2));

    if (allFlowNodes.length < 2) return null;

    const COLUMN_GROUPING_THRESHOLD = 40;
    const columns = [];
    if (allFlowNodes.length > 0) {
        let currentColumn = [allFlowNodes[0]];
        columns.push(currentColumn);
        for (let i = 1; i < allFlowNodes.length; i++) {
            const el = allFlowNodes[i];
            const lastColumn = columns[columns.length - 1];
            const lastColAvgX = lastColumn.reduce((sum, item) => sum + item.x + item.width / 2, 0) / lastColumn.length;
            if (Math.abs((el.x + el.width / 2) - lastColAvgX) < COLUMN_GROUPING_THRESHOLD) {
                lastColumn.push(el);
            } else {
                currentColumn = [el];
                columns.push(currentColumn);
            }
        }
    }

    let totalHSpacing = 0;
    let hSpacingCount = 0;
    if (columns.length > 1) {
        for (let i = 0; i < columns.length - 1; i++) {
            const col1AvgX = columns[i].reduce((sum, item) => sum + item.x + item.width / 2, 0) / columns[i].length;
            const col2AvgX = columns[i+1].reduce((sum, item) => sum + item.x + item.width / 2, 0) / columns[i+1].length;
            totalHSpacing += (col2AvgX - col1AvgX);
            hSpacingCount++;
        }
    }
    const learnedHSpacing = hSpacingCount > 0 ? totalHSpacing / hSpacingCount : 220;

    let totalVPadding = 0;
    let vPaddingCount = 0;
    const allLanes = elementRegistry.filter(el => el.type === 'bpmn:Lane');

    allLanes.forEach(lane => {
        const elementsInLane = allFlowNodes.filter(el => el.parent.id === lane.id);
        if (elementsInLane.length > 0) {
            const minY = Math.min(...elementsInLane.map(el => el.y));
            const maxY = Math.max(...elementsInLane.map(el => el.y + el.height));
            totalVPadding += (minY - lane.y);
            totalVPadding += (lane.y + lane.height - maxY);
            vPaddingCount += 2;
        }
    });
    const learnedVPadding = vPaddingCount > 0 ? totalVPadding / vPaddingCount : 70;

    return { hSpacing: learnedHSpacing, vPadding: learnedVPadding };
};

// === Export Functions ===
const triggerDownload = (data: string, fileName: string, mimeType: string, isDataUrl: boolean = false) => {
    const a = document.createElement('a');
    a.href = isDataUrl ? data : URL.createObjectURL(new Blob([data], { type: mimeType }));
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!isDataUrl) URL.revokeObjectURL(a.href);
};
export const exportAsBPMN = async (modeler, processName) => { if (modeler) { const { xml } = await modeler.saveXML({ format: true }); triggerDownload(xml, `${processName}.bpmn`, 'application/xml'); } };
export const exportAsSVG = async (modeler, processName) => { if (modeler) { const { svg } = await modeler.saveSVG(); triggerDownload(svg, `${processName}.svg`, 'image/svg+xml'); } };
export const exportAsPNG = async (modeler, processName) => {
    if (!modeler) return;
    const { svg } = await modeler.saveSVG();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    img.onload = () => {
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        triggerDownload(pngUrl, `${processName}.png`, 'image/png', true);
        URL.revokeObjectURL(url);
    };
    img.src = url;
};

const exportDataAsXLSX = (sheets: { sheetName: string, data: any[] }[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    sheets.forEach(({ sheetName, data }) => {
        if (data && data.length > 0) {
             const worksheet = XLSX.utils.json_to_sheet(data);
             XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
    });
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportAnalysisAsXLSX = (detailedAnalysis, processName) => {
    if (!detailedAnalysis) return;
    const sheets = [];
    
    sheets.push({ sheetName: 'Process Map', data: (detailedAnalysis.excelData || []).map(d => ({
        'ID': d.stepID,
        'Name': d.stepName,
        'Type': d.stepType,
        'Role': d.actors,
        'Description': d.description,
        'Lane': d.laneName,
        'Inputs': d.inputs,
        'Outputs': d.outputs,
    }))});

    if (detailedAnalysis.consultantInsights) {
        const insights = detailedAnalysis.consultantInsights;
        const insightsData = [
            ...((insights.painPointAnalysis || []).map(p => ({ 'Insight ID': p.associatedStepID, 'Type': 'Pain Point', 'Description': p.description, 'Recommendation': p.recommendation, 'Priority': null, 'Impact': p.impact, 'Effort': null, 'Associated Process Element ID': p.associatedStepID }))),
            ...((insights.processOptimizationOpportunities || []).map(p => ({ 'Insight ID': p.associatedStepID, 'Type': 'Optimization', 'Description': p.description, 'Recommendation': p.benefit, 'Priority': p.priority, 'Impact': null, 'Effort': p.effort, 'Associated Process Element ID': p.associatedStepID }))),
            ...((insights.strategicSuggestions?.rpaCandidates || []).map(p => ({ 'Insight ID': p.associatedStepID, 'Type': 'RPA Candidate', 'Description': p.rationale, 'Recommendation': null, 'Priority': null, 'Impact': p.impact, 'Effort': p.effort, 'Associated Process Element ID': p.associatedStepID }))),
            ...((insights.strategicSuggestions?.aiWorkflowCandidates || []).map(p => ({ 'Insight ID': p.associatedStepID, 'Type': 'AI Workflow', 'Description': p.description, 'Recommendation': p.benefit, 'Priority': null, 'Impact': p.impact, 'Effort': p.effort, 'Associated Process Element ID': p.associatedStepID }))),
            ...((insights.anomalyDetection || []).map(p => ({ 'Insight ID': p.associatedStepID, 'Type': 'Anomaly', 'Description': p.description, 'Recommendation': p.correction, 'Priority': null, 'Impact': null, 'Effort': null, 'Associated Process Element ID': p.associatedStepID }))),
        ];
        if (insightsData.length > 0) {
             sheets.push({ sheetName: 'Consultant Insights', data: insightsData });
        }
    }
    exportDataAsXLSX(sheets, `${processName}_Consultant_Insights`);
};

export const exportSopAsText = (sopContent, processName) => {
    if (!sopContent) return;
    const { title, executiveSummary, purpose, scope, responsibilities, definitions, procedure, governanceAndEscalation } = sopContent;
    let textContent = `${title}\n\n`;
    textContent += `=========================\nEXECUTIVE SUMMARY\n=========================\n${executiveSummary}\n\n`;
    textContent += `=========================\nPURPOSE & SCOPE\n=========================\nPurpose: ${purpose}\nScope: ${scope}\n\n`;

    textContent += `=========================\nRESPONSIBILITIES\n=========================\n`;
    (responsibilities || []).forEach(role => {
        textContent += `${role.role}:\n`;
        (role.responsibilities || []).forEach(resp => { textContent += `  - ${resp}\n`; });
        textContent += `\n`;
    });

    if (definitions && definitions.length > 0) {
        textContent += `=========================\nDEFINITIONS\n=========================\n`;
        (definitions || []).forEach(def => { textContent += `${def.term}: ${def.definition}\n`; });
        textContent += `\n`;
    }

    textContent += `=========================\nPROCEDURE\n=========================\n`;
    (procedure || []).forEach((step, index) => {
        textContent += `STEP ${index + 1}: ${step.stepName}\n`;
        textContent += `  Actor: ${step.actor}\n`;
        textContent += `  Description: ${step.description}\n`;
        textContent += `  Inputs:\n${(step.inputs || []).map(i => `    - ${i}`).join('\n')}\n`;
        textContent += `  Outputs:\n${(step.outputs || []).map(o => `    - ${o}`).join('\n')}\n`;
        textContent += `  Detailed Instructions:\n${(step.detailedInstructions || []).map((inst, i) => `    ${i + 1}. ${inst}`).join('\n')}\n`;
        if (step.risksAndControls && step.risksAndControls.length > 0) {
            textContent += `  Risks & Controls:\n`;
            step.risksAndControls.forEach(rc => { textContent += `    - Risk: ${rc.risk}\n    - Control: ${rc.control}\n`; });
        }
        if (step.kpisAndMetrics && step.kpisAndMetrics.length > 0) {
            textContent += `  KPIs & Metrics:\n`;
            step.kpisAndMetrics.forEach(kpi => { textContent += `    - Metric: ${kpi.metric}\n    - Target: ${kpi.target}\n`; });
        }
        textContent += `\n-------------------------\n\n`;
    });

    if (governanceAndEscalation) {
        textContent += `=========================\nGOVERNANCE & ESCALATION\n=========================\n`;
        textContent += `Process Owner: ${governanceAndEscalation.processOwner}\n`;
        textContent += `Review Cycle: ${governanceAndEscalation.reviewCycle}\n`;
        textContent += `Escalation Path: ${governanceAndEscalation.escalationPath}\n`;
    }

    triggerDownload(textContent, `${processName}_SOP.txt`, 'text/plain');
};

export const exportSopAsDocx = (sopContent, processName) => {
    if (!sopContent) return;
    const { title, executiveSummary, purpose, scope, responsibilities, definitions, procedure, governanceAndEscalation } = sopContent;
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${title}</title></head>
        <body>
            <h1>${title}</h1>
            <h2>Executive Summary</h2><p>${executiveSummary}</p>
            <h2>Purpose & Scope</h2><p><strong>Purpose:</strong> ${purpose}</p><p><strong>Scope:</strong> ${scope}</p>
            <h2>Responsibilities</h2>`;
    (responsibilities || []).forEach(role => {
        htmlContent += `<h3>${role.role}</h3><ul>${(role.responsibilities || []).map(r => `<li>${r}</li>`).join('')}</ul>`;
    });
    if (definitions && definitions.length > 0) {
        htmlContent += `<h2>Definitions</h2>`;
        (definitions || []).forEach(d => { htmlContent += `<p><strong>${d.term}:</strong> ${d.definition}</p>`; });
    }
    htmlContent += '<h2>Procedure</h2>';
    (procedure || []).forEach((step, index) => {
        htmlContent += `
            <div style='margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc;'>
            <h3>Step ${index + 1}: ${step.stepName}</h3>
            <p><strong>Actor:</strong> ${step.actor}</p>
            <p><strong>Description:</strong> ${step.description}</p>
            <h4>Detailed Instructions</h4>
            <ol>${(step.detailedInstructions || []).map(instr => `<li>${instr}</li>`).join('')}</ol>
            </div>
        `;
    });
     if (governanceAndEscalation) {
        htmlContent += `<h2>Governance & Escalation</h2>
        <p><strong>Process Owner:</strong> ${governanceAndEscalation.processOwner}</p>
        <p><strong>Review Cycle:</strong> ${governanceAndEscalation.reviewCycle}</p>
        <p><strong>Escalation Path:</strong> ${governanceAndEscalation.escalationPath}</p>`;
    }
    htmlContent += `</body></html>`;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${processName}_SOP.doc`, 'application/msword', true);
};

export const exportSopAsXLSX = (sopContent, processName) => {
    if (!sopContent) return;
    const { title, executiveSummary, purpose, scope, responsibilities, definitions, procedure, governanceAndEscalation } = sopContent;
    const sheets = [];
    
    const overviewData = [
        { Section: "Title", Content: title },
        { Section: "Executive Summary", Content: executiveSummary },
        { Section: "Purpose", Content: purpose },
        { Section: "Scope", Content: scope }
    ];
    sheets.push({ sheetName: 'Overview', data: overviewData });

    const responsibilitiesData = (responsibilities || []).flatMap(r => (r.responsibilities || []).map(desc => ({ Role: r.role, Responsibility: desc })));
    if (responsibilitiesData.length > 0) sheets.push({ sheetName: 'Responsibilities', data: responsibilitiesData });

    if (definitions && definitions.length > 0) {
        const definitionsData = (definitions || []).map(d => ({ Term: d.term, Definition: d.definition }));
        sheets.push({ sheetName: 'Definitions', data: definitionsData });
    }

    const procedureData = (procedure || []).flatMap((p, i) => 
        (p.detailedInstructions || ['No instructions provided']).map((instr, j) => ({
            'Step Number': j === 0 ? i + 1 : '',
            'Step Name': j === 0 ? p.stepName : '',
            'Actor': j === 0 ? p.actor : '',
            'Description': j === 0 ? p.description : '',
            'Inputs': j === 0 ? (p.inputs || []).join(', ') : '',
            'Outputs': j === 0 ? (p.outputs || []).join(', ') : '',
            'Instruction Step': j + 1,
            'Instruction': instr,
            'Risks': j === 0 ? (p.risksAndControls || []).map(rc => rc.risk).join('; ') : '',
            'Controls': j === 0 ? (p.risksAndControls || []).map(rc => rc.control).join('; ') : '',
            'KPIs': j === 0 ? (p.kpisAndMetrics || []).map(k => `${k.metric} (${k.target})`).join('; ') : '',
        }))
    );
    if (procedureData.length > 0) sheets.push({ sheetName: 'Procedure', data: procedureData });
    
    if (governanceAndEscalation) {
        const governanceData = [
            { Item: "Process Owner", Value: governanceAndEscalation.processOwner },
            { Item: "Review Cycle", Value: governanceAndEscalation.reviewCycle },
            { Item: "Escalation Path", Value: governanceAndEscalation.escalationPath },
        ];
        sheets.push({ sheetName: 'Governance', data: governanceData });
    }
    
    exportDataAsXLSX(sheets, `${processName}_SOP`);
};

export const exportVsmAsXLSX = (valueStreamMapContent, detailedAnalysis, processName) => {
    if (!valueStreamMapContent) return;
    const { metrics, flow, wastes, recommendations } = valueStreamMapContent;
    const sheets = [];
    sheets.push({ sheetName: 'Process Steps', data: (flow || []).map(f => ({
        'ID': f.stepID,
        'Name': f.stepName,
        'Description': detailedAnalysis?.excelData.find(d => d.stepID === f.stepID)?.description || '',
        'Type (VA/NVA)': f.valueAdded,
        'Process Time': f.processTime,
        'Queue Time': f.waitTime,
        'Lead Time': f.leadTime,
    }))});
    sheets.push({ sheetName: 'Metrics', data: [{
        'Total Lead Time': metrics?.totalLeadTime,
        'Value-Added Time': metrics?.valueAddedTime,
        'Process Cycle Efficiency': metrics?.processCycleEfficiency,
    }] });
    sheets.push({ sheetName: 'Identified Wastes', data: (wastes || []).map(w => ({
        'Associated Process Step ID': w.associatedStepID,
        'Type of Waste': w.wasteType,
        'Description': w.description,
    }))});
    sheets.push({ sheetName: 'Recommendations', data: (recommendations || []).map(r => ({
        'Recommendation': r.recommendation,
        'Impact': r.impact,
    }))});
    exportDataAsXLSX(sheets, `${processName}_Value_Stream_Map`);
};

export const exportCjmAsXLSX = (customerJourneyMapContent, processName) => {
    if (!customerJourneyMapContent) return;
    const { persona, goal, journey, keyTakeaways } = customerJourneyMapContent;
    const journeyData = (journey || []).map(j => ({
        'Customer Stage': j.stage,
        'Customer Action': j.actions,
        'Touchpoint': j.touchpoints,
        'Customer Thought/Feeling': j.thoughts,
        'Pain Point': j.painPoints,
        'Opportunity': j.opportunities
    }));
    const overviewData = [
        { Item: 'Persona', Value: persona },
        { Item: 'Goal', Value: goal },
        { Item: 'Overall Sentiment', Value: keyTakeaways?.overallSentiment },
        { Item: 'Critical Pain Point', Value: keyTakeaways?.criticalPainPoint },
        { Item: 'Top Opportunity', Value: keyTakeaways?.topOpportunity },
    ];
    exportDataAsXLSX([
        { sheetName: 'Journey Map', data: journeyData },
        { sheetName: 'Overview & Takeaways', data: overviewData },
    ], `${processName}_Customer_Journey_Map`);
};

export const exportPlaybookAsXLSX = (playbookContent, processName) => {
    if (!playbookContent) return;
    const { playbookTitle, executiveSummary, strategicInitiatives, implementationPhases, implementationRisks } = playbookContent;
    const sheets = [];
    
    sheets.push({ sheetName: 'Overview', data: [
        { Item: 'Playbook Title', Value: playbookTitle },
        { Item: 'Executive Summary', Value: executiveSummary }
    ]});

    sheets.push({ sheetName: 'Strategic Initiatives', data: (strategicInitiatives || []).map(i => ({
        'Initiative': i.initiativeTitle,
        'Description': i.description,
        'Goals': (i.goals || []).join('; '),
        'Linked Pain Points': (i.linkedPainPoints || []).join('; ')
    }))});

    const actionPlanData = (implementationPhases || []).flatMap(phase => 
        (phase.actions || []).map(action => ({
            'Phase': phase.phaseName,
            'Action': action.actionTitle,
            'Problem Statement': action.problemStatement,
            'Proposed Solution': action.proposedSolution,
            'Impact': action.expectedImpact,
            'Effort': action.estimatedEffort,
            'Success Metrics': (action.successMetrics || []).join('; '),
            'Required Resources': (action.requiredResources || []).join(', '),
            'Suggested Tools': (action.suggestedTools || []).join(', ')
        }))
    );
    sheets.push({ sheetName: 'Action Plan', data: actionPlanData });

    sheets.push({ sheetName: 'Implementation Risks', data: (implementationRisks || []).map(r => ({
        'Risk': r.riskDescription,
        'Mitigation Strategy': r.mitigationStrategy
    }))});
    
    exportDataAsXLSX(sheets, `${processName}_Optimization_Playbook`);
};

export const exportProjectAsXLSX = (projectData: ProjectData) => {
    if (!projectData || !projectData.tasks) return;
    const tasksData = projectData.tasks.map(task => ({
        'ID': task.id,
        'Title': task.title,
        'Status': task.status,
        'Priority': task.priority,
        'Phase': task.phase,
        'Assignee': task.assignee || 'N/A',
        'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
        'Description': task.description,
        'Success Metrics': (task.metrics || []).join('; '),
        'Resources/Tools': (task.resources || []).join('; '),
        'Created At': new Date(task.createdAt).toISOString(),
    }));
    exportDataAsXLSX([{ sheetName: 'Project Tasks', data: tasksData }], `${projectData.title}_Project_Plan`);
};

export const exportCommunicationPlanAsXLSX = (communicationPlanData: CommunicationPlanData, projectName: string) => {
    if (!communicationPlanData) return;
    const planData = (communicationPlanData.plan || []).map(item => ({
        'Communication Type / Purpose': item.communicationType,
        'Audience': item.audience,
        'Method / Channel': item.method,
        'Frequency': item.frequency,
        'Owner': item.owner,
    }));
    const summaryData = [{
        'Communication Strategy Summary': communicationPlanData.summary
    }];

    exportDataAsXLSX([
        { sheetName: 'Communication Plan', data: planData },
        { sheetName: 'Summary', data: summaryData },
    ], `${projectName}_Communication_Plan`);
};

export const exportComplianceRiskAsXLSX = (complianceRiskData: ComplianceRiskData, projectName: string) => {
    if (!complianceRiskData) return;
    const complianceData = (complianceRiskData.complianceIssues || []).map(item => ({
        'Associated Step ID': item.associatedStepID,
        'Compliance Issue': item.issue,
        'Description': item.description,
        'Severity': item.severity,
        'Recommendation': item.recommendation,
    }));
    const riskData = (complianceRiskData.operationalRisks || []).map(item => ({
        'Associated Step ID': item.associatedStepID,
        'Operational Risk': item.risk,
        'Description': item.description,
        'Likelihood': item.likelihood,
        'Impact': item.impact,
        'Mitigation Strategy': item.mitigation,
    }));
    const summaryData = [{
        'Compliance & Risk Summary': complianceRiskData.summary
    }];

    exportDataAsXLSX([
        { sheetName: 'Compliance Issues', data: complianceData },
        { sheetName: 'Operational Risks', data: riskData },
        { sheetName: 'Summary', data: summaryData },
    ], `${projectName}_Compliance_And_Risk_Analysis`);
};