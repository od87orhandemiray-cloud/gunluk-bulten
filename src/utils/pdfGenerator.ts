import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates and triggers direct download of the A4 bulletin as a high-resolution PNG image.
 */
export async function downloadA4Png(
  elementId: string = 'a4-bulletin-print-area',
  filename: string = 'Gunluk_Finans_Bulteni.png'
): Promise<boolean> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Bülten alanı (#${elementId}) bulunamadı.`);
  }

  // Ensure fonts are loaded
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading error
    }
  }

  let dataUrl: string;

  try {
    // Primary method: html-to-image (fast, native DOM serialization, high fidelity)
    dataUrl = await htmlToImage.toPng(node, {
      quality: 1,
      pixelRatio: 2.5, // 2.5x retina resolution for crisp text & tables
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        margin: '0',
        boxShadow: 'none',
      },
    });
  } catch (primaryError) {
    console.warn('htmlToImage failed, attempting fallback to html2canvas:', primaryError);
    
    // Fallback method: html2canvas
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (_clonedDoc, clonedElement) => {
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        clonedElement.style.boxShadow = 'none';
      },
    });
    dataUrl = canvas.toDataURL('image/png', 1.0);
  }

  // Trigger download
  const link = document.createElement('a');
  const safeFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.download = safeFilename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 200);

  return true;
}

/**
 * Generates and triggers direct download of the A4 bulletin as a high-resolution PDF file.
 */
export async function downloadA4Pdf(
  elementId: string = 'a4-bulletin-print-area',
  filename: string = 'Gunluk_Finans_Bulteni.pdf'
): Promise<boolean> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Bülten alanı (#${elementId}) bulunamadı.`);
  }

  // Ensure fonts are loaded
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading error
    }
  }

  let imgData: string;

  try {
    // Primary method: html-to-image to JPEG
    imgData = await htmlToImage.toJpeg(node, {
      quality: 0.98,
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        margin: '0',
        boxShadow: 'none',
      },
    });
  } catch (primaryError) {
    console.warn('htmlToImage toJpeg failed, attempting fallback to html2canvas:', primaryError);

    // Fallback method: html2canvas
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (_clonedDoc, clonedElement) => {
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        clonedElement.style.boxShadow = 'none';
      },
    });
    imgData = canvas.toDataURL('image/jpeg', 0.98);
  }

  // Create A4 PDF in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(safeFilename);
  return true;
}

/**
 * Fallback / Alternative: Opens the printable bulletin in a clean window for native browser printing.
 */
export function openPrintWindow(elementId: string = 'a4-bulletin-print-area'): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return true;
  }

  // Trigger browser print with CSS media print
  window.print();
  return true;
}
