# Image ChatGPT Analyzer

A modern web application that uses OpenAI's ChatGPT API to analyze and describe uploaded images. Simply upload an image and get detailed AI-powered insights about what the image contains.

## Features

- 🖼️ **Image Upload**: Drag and drop or browse to upload images (JPG, PNG, GIF)
- 🤖 **AI Analysis**: Powered by ChatGPT for detailed image descriptions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Processing**: Fast image analysis with loading indicators
- 🛡️ **Error Handling**: Comprehensive error messages and retry functionality
- 📋 **Image Preview**: See your uploaded image before analysis

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI Integration**: OpenAI GPT-4 Vision API
- **File Handling**: Multer for multipart file uploads
- **Styling**: Custom CSS with modern gradients and animations

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- OpenAI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-chatgpt-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the application**
   
   For development (with auto-restart):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:3000`

## Usage

1. **Upload an Image**: Click the upload area or drag and drop an image file
2. **Preview**: See a preview of your uploaded image
3. **Analyze**: Click the "Analyze Image" button
4. **View Results**: Get detailed AI analysis of your image
5. **Try Another**: Use the reset button to analyze another image

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- Maximum file size: 10MB

## API Endpoints

### `GET /api/health`
Returns the server health status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### `POST /api/analyze`
Analyzes an uploaded image using ChatGPT.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'image' field containing the image file

**Response:**
```json
{
  "success": true,
  "analysis": "Detailed description of the image...",
  "metadata": {
    "filename": "example.jpg",
    "size": 123456,
    "type": "image/jpeg"
  }
}
```

## Project Structure

```
image-chatgpt-website/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styling
│   └── script.js          # Frontend JavaScript
├── src/                   # Backend source code
│   └── server.js          # Express server
├── .env.example          # Environment variables template
├── package.json          # Project dependencies
└── README.md             # This file
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

### OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## Error Handling

The application handles various error scenarios:

- **Invalid file type**: Only image files are accepted
- **File too large**: 10MB maximum file size
- **Missing API key**: Clear error message if OpenAI key not configured
- **Rate limiting**: Handles OpenAI API rate limits
- **Network errors**: Comprehensive error reporting

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restarts when files change.

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with auto-restart
- `npm test`: Run tests (placeholder)

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Make sure you've created a `.env` file
   - Verify your API key is correct and active

2. **"File too large" error**
   - Ensure your image is under 10MB
   - Try compressing the image

3. **Network connection errors**
   - Check your internet connection
   - Verify OpenAI API status

4. **Server won't start**
   - Make sure port 3000 is available
   - Check that all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the package.json file for details.

## Acknowledgments

- OpenAI for providing the ChatGPT API
- Express.js community for the excellent web framework
- Multer for handling multipart file uploads

---

**Note**: This application requires an active OpenAI API key to function. API usage will incur costs based on OpenAI's pricing structure.