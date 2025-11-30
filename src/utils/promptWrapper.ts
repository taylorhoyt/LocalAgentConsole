/**
 * Applies a custom prompt wrapper template to user input.
 * Replaces {user prompt} or {user_prompt} placeholders with the actual user input.
 * 
 * @param userInput - The original user input text
 * @param template - The wrapper template (e.g., "<user_prompt> {user prompt} </user_prompt>")
 * @returns The wrapped prompt, or original input if template is empty/undefined
 */
export function applyPromptWrapper(userInput: string, template?: string): string {
  if (!template || !template.trim()) {
    return userInput;
  }

  // Replace both {user prompt} and {user_prompt} placeholders
  return template
    .replace(/\{user prompt\}/gi, userInput)
    .replace(/\{user_prompt\}/gi, userInput);
}

