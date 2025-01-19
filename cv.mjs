import { GlobalWorkerOptions, getDocument } from '/pdf.min.mjs';
export const cvRootUrl = "https://sveinbjorn.dev"; 
export const cvUrl = cvRootUrl + '/SveinbjornGeirsson.pdf';
export const cvTitle = 'Sveinbjörn Geirsson - Developer';


GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';


let pdfDoc = null;
let currentScale = 1.5;
const viewer = document.getElementById('viewer');
const loading = document.getElementById('loading');

const renderPage = (page, num) => {
    const canvas = document.createElement('canvas');
    const container = document.createElement('div');
    container.className = 'pdf-container';
    canvas.className = 'pdf-page';
    
    const linkLayer = document.createElement('div');
    linkLayer.className = 'link-layer';

    container.appendChild(canvas);
    container.appendChild(linkLayer);
    viewer.appendChild(container);

    const ctx = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: currentScale });
    
    // Set canvas size based on viewport
    const ratio = viewport.width / viewport.height;
    const containerWidth = container.clientWidth;
    canvas.width = containerWidth;
    canvas.height = containerWidth / ratio;

    // Scale viewport to match canvas size
    const scaledViewport = page.getViewport({ scale: currentScale * (containerWidth / viewport.width) });

    return page.render({
        canvasContext: ctx,
        viewport: scaledViewport
    }).promise.then(() => {
        return page.getAnnotations();
    }).then((annotations) => {
        annotations.forEach((annotation) => {
            if (annotation.subtype === 'Link' && annotation.url) {
                const link = document.createElement('a');
                link.href = annotation.url;
                link.target = '_blank';
                
                const rect = annotation.rect;
                const transform = scaledViewport.transform;
                
                const [x1, y1, x2, y2] = [
                    rect[0] * transform[0] + transform[4],
                    rect[1] * transform[3] + transform[5],
                    rect[2] * transform[0] + transform[4],
                    rect[3] * transform[3] + transform[5],
                ];
                
                link.style.left = `${Math.min(x1, x2)}px`;
                link.style.top = `${Math.min(y1, y2)}px`;
                link.style.width = `${Math.abs(x2 - x1)}px`;
                link.style.height = `${Math.abs(y2 - y1)}px`;
                
                linkLayer.appendChild(link);
            }
        });
    });
};

const renderAllPages = () => {
    viewer.innerHTML = '';
    for (let num = 1; num <= pdfDoc.numPages; num++) {
        pdfDoc.getPage(num).then(page => renderPage(page, num));
    }
};

// Print functionality
document.getElementById('print').addEventListener('click', async () => {
    try {
        window.print();
    } catch (error) {
        console.error('Print failed:', error);
    }
});

// Download functionality
document.getElementById('download').addEventListener('click', async () => {
    try {
        const response = await fetch(cvUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'SveinbjornGeirsson.pdf'; // Set desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
    }
});

// Create a function to initialize all event listeners
const initializeEventListeners = () => {
    document.getElementById('print').addEventListener('click', handlePrint);
    document.getElementById('download').addEventListener('click', handleDownload);
    // Add any other event listeners here
    
    // Handle window resize
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(renderAllPages, 200);
    });
};


// Load PDF
loading.style.display = 'block';
getDocument(cvUrl).promise.then((pdfDoc_) => {
pdfDoc = pdfDoc_;
loading.style.display = 'none';
renderAllPages();
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(renderAllPages, 200);
});