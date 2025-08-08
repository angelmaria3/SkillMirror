// File parsing utilities for resume text extraction

export interface ParsedFile {
  fileName: string;
  content: string;
  fileType: string;
}

export class FileParser {
  static async parseFile(file: File): Promise<ParsedFile> {
    const fileName = file.name;
    const fileType = file.type;

    try {
      let content: string;

      if (fileType === 'application/pdf') {
        content = await this.parsePDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await this.parseDOCX(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }

      return {
        fileName,
        content: content.trim(),
        fileType
      };
    } catch (error) {
      console.error('File parsing error:', error);
      throw new Error('Failed to parse file. Please ensure it\'s a valid PDF or DOCX document.');
    }
  }

  private static async parsePDF(file: File): Promise<string> {
    // For now, return mock content since PDF parsing requires additional libraries
    // In production, you would use libraries like pdf-parse or PDF.js
    return this.getMockResumeContent(file.name);
  }

  private static async parseDOCX(file: File): Promise<string> {
    // For now, return mock content since DOCX parsing requires additional libraries
    // In production, you would use libraries like mammoth.js
    return this.getMockResumeContent(file.name);
  }

  private static getMockResumeContent(fileName: string): string {
    return `
JOHN SMITH
Software Engineer
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years of expertise in full-stack web development. 
Proficient in JavaScript, React, Node.js, and cloud technologies. Strong background in 
agile development methodologies and collaborative team environments.

TECHNICAL SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express.js, REST APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
• Tools: Git, Webpack, Jest, Cypress

PROFESSIONAL EXPERIENCE

Senior Frontend Developer | TechCorp Inc. | 2022 - Present
• Developed and maintained 15+ React applications serving 100K+ users
• Collaborated with cross-functional teams to deliver features 25% faster
• Implemented responsive web designs improving mobile user experience by 40%
• Mentored 3 junior developers and conducted code reviews
• Optimized application performance resulting in 30% faster load times

Full Stack Developer | StartupXYZ | 2020 - 2022
• Built REST APIs using Node.js and Express.js handling 10K+ requests daily
• Designed and implemented PostgreSQL database schemas for 5 major features
• Participated in agile development processes with 2-week sprint cycles
• Integrated third-party APIs and payment processing systems
• Contributed to 50% reduction in bug reports through comprehensive testing

Junior Developer | WebSolutions LLC | 2019 - 2020
• Developed responsive websites using HTML, CSS, and JavaScript
• Assisted in database design and optimization projects
• Participated in daily standups and sprint planning meetings
• Fixed 100+ bugs and implemented 20+ feature requests

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
GPA: 3.7/4.0

PROJECTS
E-Commerce Platform
• Built full-stack e-commerce application using React and Node.js
• Implemented user authentication, payment processing, and inventory management
• Deployed on AWS with automated CI/CD pipeline

Task Management App
• Developed React-based task management application with real-time updates
• Used WebSocket for live collaboration features
• Implemented drag-and-drop functionality and data visualization

CERTIFICATIONS
• AWS Certified Developer Associate (2023)
• Google Cloud Professional Developer (2022)
• Certified Scrum Master (2021)
    `.trim();
  }
}

export const fileParser = new FileParser();