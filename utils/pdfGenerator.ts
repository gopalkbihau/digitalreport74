// This file uses libraries loaded from a CDN in index.html.
// We declare them here to satisfy TypeScript.
declare const jspdf: any;
declare const html2canvas: any;

/**
 * Generates a multi-page PDF from an HTML element with improved page break handling.
 * @param element The HTML element to convert to a PDF.
 * @param fileName The name of the file to be saved.
 */
export const generatePdf = async (element: HTMLElement, fileName: string): Promise<void> => {
    if (!element) {
        console.error("Element for PDF generation not found.");
        return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - jspdf is loaded from CDN
    const { jsPDF } = jspdf;

    // 1. Clone the element to avoid modifying the live DOM.
    const clone = element.cloneNode(true) as HTMLElement;

    // Temporarily append to body to calculate offsets, but keep it invisible.
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0px';
    clone.style.width = element.offsetWidth + 'px'; // Ensure same width for layout calculation.
    document.body.appendChild(clone);

    // 2. Define PDF page height in pixels for layout calculations.
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pageHeightInPixels = clone.offsetWidth * (pdfHeight / pdfWidth);

    // 3. Find elements that should not be split across pages.
    const elementsToKeepTogether = Array.from(clone.querySelectorAll('.pdf-avoid-break'));

    // 4. Insert spacers to prevent awkward breaks.
    elementsToKeepTogether.forEach(el => {
        const htmlEl = el as HTMLElement;
        const cloneTop = clone.getBoundingClientRect().top;
        const top = htmlEl.getBoundingClientRect().top - cloneTop;
        const height = htmlEl.offsetHeight;

        const pageStart = Math.floor(top / pageHeightInPixels);
        const pageEnd = Math.floor((top + height) / pageHeightInPixels);

        // If the element is broken across pages, push it to the next page.
        if (pageStart < pageEnd) {
            const newTop = (pageStart + 1) * pageHeightInPixels;
            const spacerHeight = newTop - top;

            if (spacerHeight > 0) {
                const spacer = document.createElement('div');
                spacer.style.height = `${spacerHeight}px`;
                htmlEl.before(spacer);
            }
        }
    });


    try {
        // Use the modified clone for canvas generation.
        const canvas = await html2canvas(clone, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            // Capture the background color from the element itself or its parent,
            // which respects the theme applied to FullReportRenderer.
            backgroundColor: window.getComputedStyle(clone).backgroundColor,
        });

        const imgData = canvas.toDataURL('image/png');
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / pdfWidth;
        const imgHeight = canvasHeight / ratio;

        let heightLeft = imgHeight;
        let position = 0;

        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;

        // Add subsequent pages if content overflows
        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }

        pdf.save(fileName);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please check the console for details.");
    } finally {
        // 5. Clean up the cloned element from the DOM.
        document.body.removeChild(clone);
    }
};

/**
 * A wrapper function to find an element by ID and generate a PDF for it.
 * @param elementId The ID of the element to capture.
 * @param fileName The name of the file to be saved.
 */
export const generatePdfForCurrentSection = async (elementId: string, fileName: string): Promise<void> => {
    const element = document.getElementById(elementId);
    if (element) {
        await generatePdf(element, fileName);
    } else {
        console.error(`Element with id "${elementId}" not found for PDF generation.`);
        alert(`Could not find content to generate PDF. Element ID "${elementId}" is missing.`);
    }
};