import type { MenuItem } from '../types';

// These libraries are loaded from a CDN in index.html.
// We declare them here to satisfy TypeScript's type checker.
declare const jspdf: any;
declare const html2canvas: any;

type NoteData = { note: string; originalText: string; };
type Notes = Record<string, NoteData>;

/**
 * Traverses the menu structure and the notes object to build a structured HTML string.
 * @param notes The object containing all user annotations.
 * @param menu The hierarchical menu structure of the report.
 * @returns An HTML string ready to be rendered for PDF conversion.
 */
const buildHtmlForNotes = (notes: Notes, menu: MenuItem[]): string => {
    let html = `
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 25px; color: #333333; }
            h1 { font-size: 26px; color: #111; border-bottom: 2px solid #0d9488; padding-bottom: 10px; margin-bottom: 25px; }
            h2 { font-size: 22px; color: #111; margin-top: 35px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; page-break-before: auto; page-break-after: avoid; }
            h3 { font-size: 18px; color: #444; margin-top: 30px; page-break-after: avoid; }
            .note-item { page-break-inside: avoid; margin-bottom: 25px; border-left: 3px solid #dddddd; padding-left: 15px; }
            .original-text { color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 10px; white-space: pre-wrap; }
            .user-note { background-color: #fefce8; border-left: 4px solid #facc15; padding: 12px; font-style: italic; color: #422006; font-size: 15px; line-height: 1.6; border-radius: 0 8px 8px 0; white-space: pre-wrap; }
        </style>
        <h1>Personal Annotations on the Performance Audit Report</h1>
    `;
    
    // Recursive function to traverse the menu and add notes in the correct order.
    const processMenuItems = (items: MenuItem[], level: number) => {
        items.forEach(item => {
            // Find notes that belong directly to this menu item.
            const sectionNotes = Object.entries(notes).filter(([contentId]) => {
                // Heuristic to find the parent section ID from a contentId like 'ch1-1-p-0'
                const idParts = contentId.split('-');
                const parentId = idParts.slice(0, idParts.length - 2).join('-');
                return parentId === item.id;
            });
            
            if (sectionNotes.length > 0) {
                // Use appropriate heading level based on menu depth.
                const HeaderTag = `h${Math.min(level + 2, 6)}`;
                html += `<${HeaderTag}>${item.label}</${HeaderTag}>`;

                sectionNotes.forEach(([, noteData]) => {
                    html += `
                        <div class="note-item">
                            <div class="original-text">${noteData.originalText}</div>
                            <div class="user-note">${noteData.note}</div>
                        </div>
                    `;
                });
            }

            // Recurse into children to maintain the report structure.
            if (item.children) {
                processMenuItems(item.children, level + 1);
            }
        });
    };

    processMenuItems(menu, 0);
    return html;
};

/**
 * Generates and triggers the download of a PDF containing the user's notes.
 * @param notes The object containing all user annotations.
 * @param menu The hierarchical menu structure of the report, used for organization.
 */
export const exportNotesToPdf = async (notes: Notes, menu: MenuItem[]): Promise<void> => {
    if (Object.keys(notes).length === 0) {
        alert("You have no notes to export.");
        return;
    }

    const htmlContent = buildHtmlForNotes(notes, menu);

    // Create a hidden container to render the HTML content off-screen.
    // This allows html2canvas to accurately capture its layout.
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px'; // A standard document width for rendering.
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - jspdf is loaded from CDN
        const { jsPDF } = jspdf;
        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / pdfWidth;
        const imgHeight = canvasHeight / ratio;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add the first page of the image to the PDF.
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
        
        // If the content is taller than one page, add new pages and position the image accordingly.
        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save('Annotated_Report_Notes.pdf');
    } catch (error) {
        console.error("Error generating notes PDF:", error);
        alert("An error occurred while exporting your notes. Please check the console for details.");
    } finally {
        // Clean up by removing the hidden container from the DOM.
        document.body.removeChild(container);
    }
};
