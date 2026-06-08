const pdfParse = require('pdf-parse');

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF in pdfParser:', error);
    throw new Error('Failed to parse PDF document structure');
  }
}
