import { GlobalWorkerOptions, getDocument } from '/pdfjs/pdf.min.mjs';

GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
const baseUrl = 'SveinbjornGeirsson.pdf';

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

    const ctx = canvas.getContext('2d', { alpha: false });
    const viewport = page.getViewport({ scale: currentScale });
    
    // Get the device pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Calculate dimensions to fit container width
    const containerWidth = container.clientWidth;
    const scale = (containerWidth / viewport.width) * currentScale;
    const scaledViewport = page.getViewport({ scale });
    
    // Set display size
    const displayWidth = scaledViewport.width;
    const displayHeight = scaledViewport.height;
    
    // Set canvas dimensions
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.width = Math.floor(displayWidth * pixelRatio);
    canvas.height = Math.floor(displayHeight * pixelRatio);

    // // Calculate scale to fit container width
    // const scale = (displayWidth / viewport.width) * currentScale;
    
    // // Create viewport with base scale (without pixel ratio)
    // const scaledViewport = page.getViewport({ scale });

    // Configure canvas context for better rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Reset transform and scale for device pixel ratio
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);

    return page.render({
        canvasContext: ctx,
        viewport: scaledViewport,
        enableWebGL: true,
        renderInteractiveForms: true
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
                ].map(coord => coord / pixelRatio); // Adjust coordinates for pixel ratio
                
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

// Initialize PDF viewer with the appropriate version
const initViewer = async () => {
    loading.style.display = 'block';
    const url = baseUrl;
    
    document.getElementById('print').addEventListener('click', () => {
        window.open(url);
    });

    document.getElementById('download').addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        link.click();
    });

    // Load PDF with enhanced options
    getDocument({
        url: url,
        cMapUrl: '/pdfjs/cmaps/',
        cMapPacked: true,
        enableXfa: true        
    }).promise.then((pdfDoc_) => {
        pdfDoc = pdfDoc_;
        loading.style.display = 'none';
        renderAllPages();
    });
};

// Start the viewer
initViewer();

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(renderAllPages, 200);
});