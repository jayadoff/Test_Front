import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
interface CustomDocDefinition {
  content: any[];
  styles?: { [key: string]: any };
  [key: string]: any; // Allow additional properties
}
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() {
    this.loadCustomFonts();
  }

  async loadCustomFonts() {
    const fontPath = 'assets/fonts/Kalpurush.ttf';
    const fontBase64 = await this.loadFont(fontPath);

    const robotoFontPath = 'assets/fonts/Roboto.ttf';
    const robotoFontBase64 = await this.loadFont(robotoFontPath);
    // Add the font to pdfMake virtual file system (vfs)
    pdfMake.vfs['Kalpurush.ttf'] = fontBase64;
    pdfMake.vfs['Roboto.ttf'] = robotoFontBase64;

    // Define the font in pdfMake fonts
    (pdfMake as any).fonts = {
      ...pdfMake.fonts,
      Kalpurush: {
        normal: 'Kalpurush.ttf',
        bold: 'Kalpurush.ttf',
        italics: 'Kalpurush.ttf',
        bolditalics: 'Kalpurush.ttf'
      },
      Roboto:{
        normal: 'Roboto.ttf',
        bold: 'Roboto.ttf',
        italics: 'Roboto.ttf',
        bolditalics: 'Roboto.ttf'
      }
    };

    // Example: You can now generate a report or perform other actions after fonts are loaded
    // this.generateSampleReport();
  }

  private loadFont(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const binary = new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
        return btoa(binary);
      });
  }

  generateSampleReport() {
    const documentDefinition: CustomDocDefinition = {
      content: [
        {
          text: 'বাংলা(১০১)',
          style: 'header'
        },
        {
          text: 'This is a sample report generated using pdfMake in Angular with custom font.',
          style: 'subheader'
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 10],
          font: 'Kalpurush' // Use Kalpurush font for header
        },
        subheader: {
          fontSize: 16,
          margin: [0, 10, 0, 5],
          font: 'Roboto',
          bold: true, 
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }
}
