class ImageAnalyzer {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.selectedFile = null;
    }

    initializeElements() {
        this.imageForm = document.getElementById('imageForm');
        this.imageInput = document.getElementById('imageInput');
        this.uploadArea = document.getElementById('uploadArea');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.previewSection = document.getElementById('previewSection');
        this.imagePreview = document.getElementById('imagePreview');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultSection = document.getElementById('resultSection');
        this.resultContent = document.getElementById('resultContent');
        this.errorSection = document.getElementById('errorSection');
        this.errorMessage = document.getElementById('errorMessage');
        this.resetBtn = document.getElementById('resetBtn');
        this.retryBtn = document.getElementById('retryBtn');
    }

    setupEventListeners() {
        // File input change
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadArea.addEventListener('click', () => this.imageInput.click());

        // Form submission
        this.imageForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Reset button
        this.resetBtn.addEventListener('click', () => this.resetForm());
        this.retryBtn.addEventListener('click', () => this.hideError());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB.');
            return;
        }

        this.selectedFile = file;
        this.showPreview(file);
        this.analyzeBtn.disabled = false;
    }

    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.src = e.target.result;
            this.previewSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.selectedFile) {
            this.showError('Please select an image first.');
            return;
        }

        this.showLoading();
        
        try {
            const formData = new FormData();
            formData.append('image', this.selectedFile);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.showResult(result.analysis);
            } else {
                throw new Error(result.error || 'Failed to analyze image');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        this.loadingSection.style.display = 'block';
        this.analyzeBtn.disabled = true;
        this.hideError();
    }

    hideLoading() {
        this.loadingSection.style.display = 'none';
        this.analyzeBtn.disabled = false;
    }

    showResult(analysis) {
        this.resultContent.textContent = analysis;
        this.resultSection.style.display = 'block';
        this.hideError();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorSection.style.display = 'block';
        this.hideLoading();
    }

    hideError() {
        this.errorSection.style.display = 'none';
    }

    resetForm() {
        this.selectedFile = null;
        this.imageForm.reset();
        this.analyzeBtn.disabled = true;
        this.previewSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.hideError();
        this.hideLoading();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageAnalyzer();
});