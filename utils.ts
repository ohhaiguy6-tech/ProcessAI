/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const INITIAL_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_1" name="Process" processRef="Process_1" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
      <bpmndi:BPMNShape id="Participant_1_di" bpmnElement="Participant_1" isHorizontal="true">
        <dc:Bounds x="160" y="80" width="1000" height="400" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;


export const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf': return 'application/pdf';
        case 'doc': return 'application/msword';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'txt': return 'text/plain';
        default: return 'application/octet-stream';
    }
};

/**
 * Parses and cleans the raw string response from the Gemini API.
 * It handles markdown fences, common JSON formatting errors, and simple arithmetic.
 * @param responseText The raw text from the API response.
 * @returns A parsed JSON object.
 * @throws An error if parsing fails even after cleaning.
 */
export const parseAndCleanApiResponse = (responseText: string): any => {
    let content = responseText.trim();
    
    // For schema-enforced responses, the text is already the JSON string.
    // For other calls, it might have markdown fences.
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = content.match(fenceRegex);

    if (match && match[1]) {
        content = match[1].trim();
    }
    
    // The Gemini model may sometimes output simple arithmetic expressions for numeric
    // values (e.g., "y": 230 + 120). This is not valid JSON.
    // This regex replacement safely evaluates these simple expressions before parsing.
    // It targets keys for coordinates and dimensions.
    const arithmeticRegex = /"(x|y|width|height)"\s*:\s*([^,}\]]+)/g;
    let preProcessedContent = content.replace(arithmeticRegex, (match, key, value) => {
        const expression = value.trim();
        // Only evaluate if it contains an operator, to avoid processing simple numbers.
        if (expression.match(/[+\-*\/]/) && /^[0-9\s.+\-*/]+$/.test(expression)) {
            try {
                // Use Function constructor for safer evaluation than eval().
                const result = new Function(`return ${expression}`)();
                if (typeof result === 'number' && isFinite(result)) {
                    // Reconstruct the JSON key-value pair with the calculated result.
                    return `"${key}": ${result}`;
                }
            } catch (err) {
                console.warn(`Could not evaluate expression for key "${key}":`, expression, err);
            }
        }
        // If it's not a valid expression or evaluation fails, return the original string portion.
        return match;
    });
    
    // Basic cleanup for trailing commas, though schema should prevent this.
    const fixedJson = preProcessedContent.replace(/,\s*([}\]])/g, '$1');
    
    try {
        return JSON.parse(fixedJson);
    } catch (e) {
        console.error("Failed to parse cleaned JSON:", e);
        console.error("Original string (after fence removal):", content);
        console.error("String that failed parsing:", fixedJson);
        // Fallback for truncated JSON: try to find the last valid closing brace/bracket
        let lastValidJson = null;
        for (let i = fixedJson.length - 1; i >= 0; i--) {
            if (fixedJson[i] === '}' || fixedJson[i] === ']') {
                const substring = fixedJson.substring(0, i + 1);
                // Ensure brackets are balanced
                 const openBraces = (substring.match(/{/g) || []).length;
                 const closeBraces = (substring.match(/}/g) || []).length;
                 const openBrackets = (substring.match(/\[/g) || []).length;
                 const closeBrackets = (substring.match(/\]/g) || []).length;

                 if (openBraces === closeBraces && openBrackets === closeBrackets) {
                    try {
                        lastValidJson = JSON.parse(substring);
                        console.warn("Successfully parsed a truncated portion of the JSON.");
                        return lastValidJson; // Return the first valid JSON found from the end
                    } catch (ignored) {
                        // continue searching
                    }
                 }
            }
        }
        throw new Error(`JSON parsing failed even after cleaning and fallback attempt. Details: ${e.message}`);
    }
};

export const getApiErrorMessage = (error: any): string => {
    if (error && error.message) {
        try {
            // The Gemini SDK often wraps API errors in a message property
            // which contains a JSON string of the actual error response.
            const errorDetails = JSON.parse(error.message);
            if (errorDetails.error && errorDetails.error.message) {
                 // Return the specific, user-friendly message from the API response.
                return errorDetails.error.message;
            }
        } catch (e) {
            // If parsing fails, it's not a JSON string; return the original message.
            return error.message;
        }
    }
    return 'An unknown error occurred.';
}

export const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};