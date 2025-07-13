// Entry point for linkedin-analyzer-mcp
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

import { ProfileAnalyzer } from "./analyzers/profileAnalyzer.js";
import { EnhancementSuggester } from "./analyzers/enhancementSuggester.js";
import { ResumeComparer } from "./analyzers/resumeComparer.js";

const TOOLS: Tool[] = [
  {
    name: "analyze_linkedin_profile",
    description: "Analyze a LinkedIn profile comprehensively including sections, keywords, and completeness",
    inputSchema: {
      type: "object",
      properties: {
        profile_text: {
          type: "string",
          description: "The LinkedIn profile text to analyze"
        }
      },
      required: ["profile_text"]
    }
  },
  {
    name: "suggest_profile_enhancements",
    description: "Provide specific suggestions to enhance a LinkedIn profile for better visibility and impact",
    inputSchema: {
      type: "object",
      properties: {
        profile_text: {
          type: "string",
          description: "The LinkedIn profile text to enhance"
        },
        target_role: {
          type: "string",
          description: "Target role or industry for tailored suggestions"
        },
        experience_level: {
          type: "string",
          description: "Experience level: entry, mid, senior, executive"
        }
      },
      required: ["profile_text"]
    }
  },
  {
    name: "compare_profile_resume",
    description: "Compare LinkedIn profile with resume and suggest improvements for better alignment",
    inputSchema: {
      type: "object",
      properties: {
        profile_text: {
          type: "string",
          description: "The LinkedIn profile text"
        },
        resume_text: {
          type: "string",
          description: "The resume text"
        }
      },
      required: ["profile_text", "resume_text"]
    }
  },
  {
    name: "generate_keyword_optimization",
    description: "Generate keyword suggestions for better LinkedIn SEO and visibility",
    inputSchema: {
      type: "object",
      properties: {
        profile_text: {
          type: "string",
          description: "The LinkedIn profile text"
        },
        industry: {
          type: "string",
          description: "Target industry"
        },
        target_role: {
          type: "string",
          description: "Target role or position"
        }
      },
      required: ["profile_text", "industry"]
    }
  }
];

class LinkedInAnalyzerServer {
  private server: Server;
  private profileAnalyzer: ProfileAnalyzer;
  private enhancementSuggester: EnhancementSuggester;
  private resumeComparer: ResumeComparer;

  constructor() {
    this.server = new Server({
      name: "linkedin-analyzer-mcp",
      version: "1.0.0",
      capabilities: {
        tools: {},
      },
    });

    this.profileAnalyzer = new ProfileAnalyzer();
    this.enhancementSuggester = new EnhancementSuggester();
    this.resumeComparer = new ResumeComparer();

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "analyze_linkedin_profile":
            return {
              content: [
                {
                  type: "text",
                  text: this.profileAnalyzer.analyze(args.profile_text),
                },
              ],
            };

          case "suggest_profile_enhancements":
            return {
              content: [
                {
                  type: "text",
                  text: this.enhancementSuggester.suggest(
                    args.profile_text,
                    args.target_role,
                    args.experience_level
                  ),
                },
              ],
            };

          case "compare_profile_resume":
            return {
              content: [
                {
                  type: "text",
                  text: this.resumeComparer.compare(
                    args.profile_text,
                    args.resume_text
                  ),
                },
              ],
            };

          case "generate_keyword_optimization":
            return {
              content: [
                {
                  type: "text",
                  text: this.enhancementSuggester.generateKeywords(
                    args.profile_text,
                    args.industry,
                    args.target_role
                  ),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("LinkedIn Analyzer MCP Server running on stdio");
  }
}

const server = new LinkedInAnalyzerServer();
server.run().catch(console.error);

// TODO: Install @modelcontextprotocol/sdk or update import paths if needed.