/**
 * Tipos de problemas detectados en el texto
 */
export enum TextValidationIssue {
  PROFANITY = 'PROFANITY',
  PHONE_NUMBER = 'PHONE_NUMBER',
  DOCUMENT_NUMBER = 'DOCUMENT_NUMBER',
}

/**
 * Resultado de la validación de texto
 */
export interface TextValidationResult {
  isValid: boolean;
  issues: TextValidationIssue[];
  message?: string;
}
