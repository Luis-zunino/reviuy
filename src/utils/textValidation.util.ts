import { Filter } from 'bad-words';
import { TextValidationIssue } from './types';
import type { TextValidationResult } from './types';

/**
 * Valida si el texto contiene malas palabras, números telefónicos o documentos
 */
export class TextValidator {
  private filter: Filter;

  // Regex para detectar números telefónicos uruguayos y formatos internacionales
  private phonePatterns = [
    /\b0?9[0-9]{7,8}\b/g, // Celulares uruguayos: 091234567, 99123456
    /\b0?[2-4][0-9]{6,7}\b/g, // Teléfonos fijos uruguayos: 24001234, 29001234
    /\+?598\s?0?9[0-9]{7,8}\b/g, // Formato internacional Uruguay: +598 91234567
    /\(\d{2,4}\)\s?\d{3,4}[-\s]?\d{4}/g, // Formato con paréntesis: (091) 234-5678
    /\d{3}[-\s]?\d{3}[-\s]?\d{3,4}/g, // Formato con guiones: 091-234-567
  ];

  // Regex para detectar documentos uruguayos (cédula, pasaporte)
  private documentPatterns = [
    /\b[0-9]{1}\.[0-9]{3}\.[0-9]{3}[-][0-9]{1}\b/g, // Cédula uruguaya: 1.234.567-8
    /\b[0-9]{7,8}\b/g, // Cédula sin formato: 1234567 o 12345678
    /\b[A-Z]{2}[0-9]{6,7}\b/g, // Pasaporte: AA123456
  ];

  constructor() {
    this.filter = new Filter();

    // Agregar palabras personalizadas en español si es necesario
    this.filter.addWords(
      'puta',
      'mierda',
      'carajo',
      'boludo',
      'pelotudo',
      'concha',
      'verga',
      'choto',
      'pija',
      'sorete'
      // Agregar más según necesites
    );
  }

  /**
   * Valida el texto completo
   */
  validate(text: string): TextValidationResult {
    const issues: TextValidationIssue[] = [];
    const messages: string[] = [];

    // Verificar malas palabras
    if (this.hasProfanity(text)) {
      issues.push(TextValidationIssue.PROFANITY);
      messages.push('El texto contiene lenguaje inapropiado');
    }

    // Verificar números telefónicos
    if (this.hasPhoneNumber(text)) {
      issues.push(TextValidationIssue.PHONE_NUMBER);
      messages.push('El texto contiene números telefónicos');
    }

    // Verificar documentos
    if (this.hasDocumentNumber(text)) {
      issues.push(TextValidationIssue.DOCUMENT_NUMBER);
      messages.push('El texto contiene números de documento');
    }

    return {
      isValid: issues.length === 0,
      issues,
      message: messages.length > 0 ? messages.join(', ') : undefined,
    };
  }

  /**
   * Verifica si contiene malas palabras
   */
  hasProfanity(text: string): boolean {
    return this.filter.isProfane(text);
  }

  /**
   * Verifica si contiene números telefónicos
   */
  hasPhoneNumber(text: string): boolean {
    return this.phonePatterns.some((pattern) => pattern.test(text));
  }

  /**
   * Verifica si contiene números de documento
   */
  hasDocumentNumber(text: string): boolean {
    return this.documentPatterns.some((pattern) => pattern.test(text));
  }

  /**
   * Limpia el texto censurando las malas palabras
   */
  clean(text: string): string {
    return this.filter.clean(text);
  }

  /**
   * Agrega palabras personalizadas al filtro
   */
  addWords(...words: string[]): void {
    this.filter.addWords(...words);
  }

  /**
   * Remueve palabras del filtro (por si alguna palabra está mal marcada)
   */
  removeWords(...words: string[]): void {
    this.filter.removeWords(...words);
  }
}

// Instancia singleton para usar en toda la app
export const textValidator = new TextValidator();

/**
 * Función helper para validar texto rápidamente
 */
export const validateText = (text: string): TextValidationResult => {
  return textValidator.validate(text);
};

/**
 * Función helper para limpiar texto
 */
export const cleanText = (text: string): string => {
  return textValidator.clean(text);
};
