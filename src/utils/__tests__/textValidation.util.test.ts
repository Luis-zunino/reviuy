import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TextValidationIssue } from '../types';

const mockIsProfane = vi.hoisted(() => vi.fn());
const mockClean = vi.hoisted(() => vi.fn());
const mockAddWords = vi.hoisted(() => vi.fn());
const mockRemoveWords = vi.hoisted(() => vi.fn());

vi.mock('bad-words', () => ({
  Filter: function FilterMock() {
    return {
      isProfane: mockIsProfane,
      clean: mockClean,
      addWords: mockAddWords,
      removeWords: mockRemoveWords,
    };
  },
}));

import { TextValidator, textValidator, validateText, cleanText } from '../textValidation.util';

describe('TextValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsProfane.mockReturnValue(false);
    mockClean.mockImplementation((text: string) => text);
  });

  describe('validate', () => {
    it('returns valid for clean text', () => {
      const result = textValidator.validate('Hello, this is a test');

      expect(result.isValid).toBe(true);
      expect(result.issues).toEqual([]);
      expect(result.message).toBeUndefined();
    });

    it('detects profanity', () => {
      mockIsProfane.mockReturnValue(true);

      const result = textValidator.validate('some bad text');

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain(TextValidationIssue.PROFANITY);
      expect(result.message).toContain('lenguaje inapropiado');
    });

    it('detects phone numbers', () => {
      const result = textValidator.validate('Call me at 091234567');

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain(TextValidationIssue.PHONE_NUMBER);
    });

    it('detects document numbers', () => {
      const result = textValidator.validate('My ID is 1.234.567-8');

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain(TextValidationIssue.DOCUMENT_NUMBER);
    });

    it('detects multiple issues', () => {
      mockIsProfane.mockReturnValue(true);

      const result = textValidator.validate('bad 091234567');

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('hasProfanity', () => {
    it('delegates to filter.isProfane', () => {
      mockIsProfane.mockReturnValue(true);

      expect(textValidator.hasProfanity('bad word')).toBe(true);
      expect(mockIsProfane).toHaveBeenCalledWith('bad word');
    });
  });

  describe('hasPhoneNumber', () => {
    it('detects uruguayan mobile numbers', () => {
      expect(textValidator.hasPhoneNumber('091234567')).toBe(true);
      expect(textValidator.hasPhoneNumber('099123456')).toBe(true);
    });

    it('detects international format', () => {
      expect(textValidator.hasPhoneNumber('+598 91234567')).toBe(true);
    });

    it('returns false for clean text', () => {
      expect(textValidator.hasPhoneNumber('Hello world')).toBe(false);
    });
  });

  describe('hasDocumentNumber', () => {
    it('detects uruguayan ID format', () => {
      expect(textValidator.hasDocumentNumber('1.234.567-8')).toBe(true);
    });

    it('detects plain number IDs', () => {
      expect(textValidator.hasDocumentNumber('12345678')).toBe(true);
    });

    it('detects passport format', () => {
      expect(textValidator.hasDocumentNumber('AA123456')).toBe(true);
    });

    it('returns false for short numbers', () => {
      expect(textValidator.hasDocumentNumber('123')).toBe(false);
    });
  });

  describe('clean', () => {
    it('delegates to filter.clean', () => {
      mockClean.mockReturnValue('****');

      expect(textValidator.clean('bad word')).toBe('****');
      expect(mockClean).toHaveBeenCalledWith('bad word');
    });
  });

  describe('addWords', () => {
    it('delegates to filter.addWords', () => {
      textValidator.addWords('custom1', 'custom2');

      expect(mockAddWords).toHaveBeenCalledWith('custom1', 'custom2');
    });
  });

  describe('removeWords', () => {
    it('delegates to filter.removeWords', () => {
      textValidator.removeWords('badword1');

      expect(mockRemoveWords).toHaveBeenCalledWith('badword1');
    });
  });
});

describe('validateText helper', () => {
  it('delegates to textValidator.validate', () => {
    const result = validateText('test');

    expect(result).toBeDefined();
    expect(result.isValid).toBeDefined();
  });
});

describe('cleanText helper', () => {
  it('delegates to textValidator.clean', () => {
    mockClean.mockReturnValue('****');

    expect(cleanText('bad')).toBe('****');
  });
});
