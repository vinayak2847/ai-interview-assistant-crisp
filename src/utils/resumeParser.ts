import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractedData {
  name?: string;
  email?: string;
  phone?: string;
  text: string;
}

export const parsePDF = async (file: File): Promise<ExtractedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = await pdfParse(arrayBuffer);
        const extracted = extractFields(data.text);
        resolve({ ...extracted, text: data.text });
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const parseDOCX = async (file: File): Promise<ExtractedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const extracted = extractFields(result.value);
        resolve({ ...extracted, text: result.value });
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

const extractFields = (text: string): Partial<ExtractedData> => {
  const extracted: Partial<ExtractedData> = {};

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }

  // Extract phone number
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0];
  }

  // Extract name (look for common patterns)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if first line looks like a name (2-3 words, no special chars)
    if (/^[A-Za-z\s]{2,50}$/.test(firstLine) && firstLine.split(' ').length <= 3) {
      extracted.name = firstLine;
    }
  }

  return extracted;
};
