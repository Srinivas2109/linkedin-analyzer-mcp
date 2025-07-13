# LinkedIn Profile Analyzer MCP Server

A Model Context Protocol (MCP) server that provides comprehensive LinkedIn profile analysis and enhancement suggestions for Claude Desktop.

## Features

- **Profile Analysis**: Complete analysis of LinkedIn profiles including sections, keywords, and completeness scoring
- **Enhancement Suggestions**: Tailored recommendations for improving profile visibility and impact
- **Resume Comparison**: Compare LinkedIn profiles with resumes to identify gaps and inconsistencies
- **Keyword Optimization**: Generate industry-specific keyword suggestions for better searchability

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd linkedin-analyzer-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

Add the following to your Claude Desktop configuration file:

### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "linkedin-analyzer": {
      "command": "node",
      "args": ["/path/to/linkedin-analyzer-mcp/build/index.js"]
    }
  }
}
```

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "linkedin-analyzer": {
      "command": "node",
      "args": ["C:\\path\\to\\linkedin-analyzer-mcp\\build\\index.js"]
    }
  }
}
```

## Usage

Once configured, you can use the following tools in Claude Desktop:

### 1. Analyze LinkedIn Profile
```
Please analyze this LinkedIn profile: [paste profile text]
```

### 2. Get Enhancement Suggestions
```
Suggest improvements for this LinkedIn profile for a Senior Software Engineer role: [paste profile text]
```

### 3. Compare Profile with Resume
```
Compare this LinkedIn profile with my resume and suggest improvements: 
Profile: [paste profile text]
Resume: [paste resume text]
```

### 4. Generate Keyword Optimization
```
Generate keyword suggestions for this profile in the technology industry for a Full Stack Developer role: [paste profile text]
```

## API Reference

### Tools Available

- `analyze_linkedin_profile`: Comprehensive profile analysis
- `suggest_profile_enhancements`: Tailored improvement suggestions
- `compare_profile_resume`: Profile-resume alignment analysis
- `generate_keyword_optimization`: Industry-specific keyword suggestions

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Testing
Run the server directly to test:
```bash
npm start
```

## Project Structure

```
linkedin-analyzer-mcp/
├── src/
│   ├── index.ts                    # Main server entry point
│   ├── analyzers/
│   │   ├── profileAnalyzer.ts      # Core profile analysis logic
│   │   ├── enhancementSuggester.ts # Enhancement suggestions
│   │   └── resumeComparer.ts       # Resume comparison logic
│   └── utils/
│       ├── textProcessor.ts        # Text processing utilities
│       └── keywordExtractor.ts     # Keyword extraction and analysis
├── build/                          # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test
5. Submit a pull request
