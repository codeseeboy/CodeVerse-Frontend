export const suggestBugFixes = async (code: string, error: string, language: string): Promise<string[]> => {
  try {
    const prompt = `
      This ${language} code has an error:
      ${error}
      
      Code:
      ${code}
      
      Suggest specific fixes for this error. Format the response as a JSON array of strings, each containing a fix suggestion.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const suggestions = JSON.parse(text) as string[];
      return suggestions;
    } catch (error) {
      // If JSON parsing fails, return the raw text as a single suggestion
      return [text];
    }
  } catch (error) {
    console.error('Error getting bug fix suggestions:', error);
    throw new Error('Failed to get bug fix suggestions');
  }
};

export const generateCodeTemplate = async (
  description: string,
  language: string,
  complexity: 'beginner' | 'intermediate' | 'advanced'
): Promise<string> => {
  try {
    const prompt = `
      Generate a ${complexity} level ${language} code template for:
      ${description}
      
      Include:
      1. Clear comments explaining the code
      2. Best practices for ${language}
      3. Error handling where appropriate
      
      Return only the code, no explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating code template:', error);
    throw new Error('Failed to generate code template');
  }
}; 