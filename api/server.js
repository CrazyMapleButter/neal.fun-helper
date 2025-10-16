const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Image analysis endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
            });
        }

        // Convert image buffer to base64
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        console.log(`Analyzing image: ${req.file.originalname} (${req.file.size} bytes)`);

        // Send image to ChatGPT API
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Look at this image and identify all the numbers and mathematical expressions you can see. Calculate the decimal value of each expression. Sort everything from least to greatest and format your response exactly like this:\n\nSorted from least to greatest:\n1. 2/6 = 0.333\n2. π/6 = 0.524\n3. √12 ≈ 3.464\n4. 3! = 6\n5. log₂(25) ≈ 4.644\n6. Σ(i=1)^5 i = 15\n7. ∫₁¹ x dx = 17.5\n8. e^5 ≈ 148.413\n9. ∞ = infinity\n\nIMPORTANT: Use proper mathematical symbols (√, π, ², ³, ≈, ∞, Σ, ∫, etc.) and clean formatting. Do NOT use backslashes, LaTeX code, or any \\commands. Use Unicode symbols only."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 500
        });

        const analysis = response.choices[0].message.content;

        console.log('Analysis completed successfully');

        res.json({
            success: true,
            analysis: analysis,
            metadata: {
                filename: req.file.originalname,
                size: req.file.size,
                type: req.file.mimetype
            }
        });

    } catch (error) {
        console.error('Error analyzing image:', error);

        // Handle specific OpenAI errors
        if (error.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid OpenAI API key. Please check your API key configuration.' 
            });
        }
        
        if (error.status === 429) {
            return res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again later.' 
            });
        }

        if (error.status === 400 && error.message.includes('image')) {
            return res.status(400).json({ 
                error: 'Image format not supported or image too large.' 
            });
        }

        // Generic error response
        res.status(500).json({
            error: 'Failed to analyze image. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ error: 'File upload error: ' + error.message });
    }
    
    if (error.message === 'Only image files are allowed') {
        return res.status(400).json({ error: 'Only image files are allowed' });
    }

    next(error);
});

// Generic error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Catch-all handler: serve index.html for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export for Vercel
module.exports = app;

// Start server for local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Visit http://localhost:${PORT} to use the application`);
        
        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️  WARNING: OPENAI_API_KEY environment variable is not set!');
            console.warn('   Please create a .env file with your OpenAI API key to enable image analysis.');
        }
    });
}
