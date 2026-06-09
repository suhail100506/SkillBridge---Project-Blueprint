import 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';

export async function parsePDF(buffer: Buffer): Promise<string> {
  let parser: any = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || '';
  } catch (error) {
    console.error('Error parsing PDF in pdfParser:', error);
    throw new Error('Failed to parse PDF document structure');
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (e) {
        console.error('Error destroying pdf-parse instance:', e);
      }
    }
  }
}

