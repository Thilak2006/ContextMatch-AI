/**
 * Structured Skill Taxonomy for Resume-Job Matching
 * Organized by category with aliases for flexible matching
 */

export interface SkillEntry {
  name: string;
  aliases: string[];
  category: string;
  related: string[];
}

export const SKILL_TAXONOMY: SkillEntry[] = [
  // Programming Languages
  { name: "JavaScript", aliases: ["JS", "ECMAScript", "ES6", "ES2015"], category: "Programming Languages", related: ["TypeScript", "Node.js", "React"] },
  { name: "TypeScript", aliases: ["TS"], category: "Programming Languages", related: ["JavaScript", "Angular", "React"] },
  { name: "Python", aliases: ["Python3", "py"], category: "Programming Languages", related: ["Django", "Flask", "Machine Learning"] },
  { name: "Java", aliases: ["JDK", "J2EE", "Java EE"], category: "Programming Languages", related: ["Spring", "Maven", "Kotlin"] },
  { name: "C++", aliases: ["CPP", "C Plus Plus"], category: "Programming Languages", related: ["C", "OpenGL", "Systems Programming"] },
  { name: "C#", aliases: ["CSharp", "C Sharp", ".NET"], category: "Programming Languages", related: [".NET", "ASP.NET", "Unity"] },
  { name: "Go", aliases: ["Golang"], category: "Programming Languages", related: ["Docker", "Kubernetes", "Microservices"] },
  { name: "Rust", aliases: [], category: "Programming Languages", related: ["Systems Programming", "WebAssembly"] },
  { name: "PHP", aliases: [], category: "Programming Languages", related: ["Laravel", "WordPress", "MySQL"] },
  { name: "Ruby", aliases: [], category: "Programming Languages", related: ["Rails", "Sinatra"] },
  { name: "Swift", aliases: [], category: "Programming Languages", related: ["iOS", "Xcode", "Objective-C"] },
  { name: "Kotlin", aliases: [], category: "Programming Languages", related: ["Android", "Java", "Spring"] },
  { name: "Scala", aliases: [], category: "Programming Languages", related: ["Apache Spark", "Big Data"] },
  { name: "R", aliases: ["R Programming"], category: "Programming Languages", related: ["Statistics", "Data Science", "ggplot2"] },
  { name: "SQL", aliases: ["Structured Query Language"], category: "Programming Languages", related: ["MySQL", "PostgreSQL", "Database"] },
  { name: "HTML", aliases: ["HTML5"], category: "Programming Languages", related: ["CSS", "JavaScript", "Web Development"] },
  { name: "CSS", aliases: ["CSS3", "Stylesheets"], category: "Programming Languages", related: ["HTML", "Sass", "Tailwind"] },

  // Frontend Frameworks
  { name: "React", aliases: ["ReactJS", "React.js"], category: "Frontend Frameworks", related: ["Redux", "Next.js", "JavaScript"] },
  { name: "Angular", aliases: ["AngularJS", "Angular.js"], category: "Frontend Frameworks", related: ["TypeScript", "RxJS", "Material"] },
  { name: "Vue.js", aliases: ["Vue", "VueJS", "Vue 3"], category: "Frontend Frameworks", related: ["Vuex", "Nuxt.js", "JavaScript"] },
  { name: "Next.js", aliases: ["NextJS", "Nextjs"], category: "Frontend Frameworks", related: ["React", "SSR", "Vercel"] },
  { name: "Svelte", aliases: ["SvelteKit"], category: "Frontend Frameworks", related: ["JavaScript", "Vite"] },
  { name: "Tailwind CSS", aliases: ["Tailwind"], category: "Frontend Frameworks", related: ["CSS", "Utility-First"] },
  { name: "Bootstrap", aliases: ["Bootstrap 5"], category: "Frontend Frameworks", related: ["CSS", "Responsive Design"] },
  { name: "Redux", aliases: ["Redux Toolkit", "RTK"], category: "Frontend Frameworks", related: ["React", "State Management"] },

  // Backend Frameworks
  { name: "Node.js", aliases: ["Node", "NodeJS"], category: "Backend Frameworks", related: ["Express", "JavaScript", "NPM"] },
  { name: "Express.js", aliases: ["Express", "ExpressJS"], category: "Backend Frameworks", related: ["Node.js", "REST API", "Middleware"] },
  { name: "Django", aliases: ["Django REST Framework", "DRF"], category: "Backend Frameworks", related: ["Python", "ORM", "PostgreSQL"] },
  { name: "Flask", aliases: [], category: "Backend Frameworks", related: ["Python", "REST API"] },
  { name: "FastAPI", aliases: ["Fast API"], category: "Backend Frameworks", related: ["Python", "Async", "OpenAPI"] },
  { name: "Spring Boot", aliases: ["Spring", "Spring Framework"], category: "Backend Frameworks", related: ["Java", "Microservices", "REST API"] },
  { name: "Rails", aliases: ["Ruby on Rails", "RoR"], category: "Backend Frameworks", related: ["Ruby", "MVC", "PostgreSQL"] },
  { name: "ASP.NET", aliases: ["ASP.NET Core", ".NET Core"], category: "Backend Frameworks", related: ["C#", "Entity Framework"] },
  { name: "NestJS", aliases: ["Nest"], category: "Backend Frameworks", related: ["TypeScript", "Node.js", "Decorators"] },
  { name: "GraphQL", aliases: ["GQL"], category: "Backend Frameworks", related: ["Apollo", "Relay", "REST API"] },
  { name: "REST API", aliases: ["RESTful API", "REST", "RESTful"], category: "Backend Frameworks", related: ["HTTP", "JSON", "CRUD"] },

  // Databases
  { name: "PostgreSQL", aliases: ["Postgres", "PG"], category: "Databases", related: ["SQL", "Relational Database"] },
  { name: "MySQL", aliases: [], category: "Databases", related: ["SQL", "Relational Database"] },
  { name: "MongoDB", aliases: ["Mongo"], category: "Databases", related: ["NoSQL", "Mongoose"] },
  { name: "Redis", aliases: [], category: "Databases", related: ["Caching", "In-Memory"] },
  { name: "Elasticsearch", aliases: ["Elastic", "ES"], category: "Databases", related: ["Search", "Logstash", "Kibana"] },
  { name: "SQLite", aliases: [], category: "Databases", related: ["SQL", "Embedded Database"] },
  { name: "Oracle", aliases: ["Oracle DB", "Oracle Database"], category: "Databases", related: ["SQL", "PL/SQL"] },
  { name: "DynamoDB", aliases: ["Amazon DynamoDB", "AWS DynamoDB"], category: "Databases", related: ["AWS", "NoSQL"] },
  { name: "Cassandra", aliases: ["Apache Cassandra"], category: "Databases", related: ["NoSQL", "Big Data"] },
  { name: "Neo4j", aliases: [], category: "Databases", related: ["Graph Database", "Cypher"] },

  // Cloud & DevOps
  { name: "AWS", aliases: ["Amazon Web Services", "Amazon AWS"], category: "Cloud & DevOps", related: ["EC2", "S3", "Lambda"] },
  { name: "Azure", aliases: ["Microsoft Azure", "Azure Cloud"], category: "Cloud & DevOps", related: ["Microsoft", "Cloud Computing"] },
  { name: "Google Cloud", aliases: ["GCP", "Google Cloud Platform"], category: "Cloud & DevOps", related: ["BigQuery", "Cloud Functions"] },
  { name: "Docker", aliases: ["Containerization"], category: "Cloud & DevOps", related: ["Kubernetes", "CI/CD"] },
  { name: "Kubernetes", aliases: ["K8s"], category: "Cloud & DevOps", related: ["Docker", "Container Orchestration"] },
  { name: "CI/CD", aliases: ["Continuous Integration", "Continuous Deployment", "Jenkins", "GitHub Actions"], category: "Cloud & DevOps", related: ["DevOps", "Automation"] },
  { name: "Terraform", aliases: ["Infrastructure as Code", "IaC"], category: "Cloud & DevOps", related: ["AWS", "CloudFormation"] },
  { name: "Linux", aliases: ["Unix", "Bash", "Shell"], category: "Cloud & DevOps", related: ["DevOps", "System Administration"] },
  { name: "Nginx", aliases: ["NGINX"], category: "Cloud & DevOps", related: ["Web Server", "Reverse Proxy"] },
  { name: "Jenkins", aliases: [], category: "Cloud & DevOps", related: ["CI/CD", "Automation"] },
  { name: "Git", aliases: ["GitHub", "GitLab", "Bitbucket", "Version Control"], category: "Cloud & DevOps", related: ["CI/CD", "Collaboration"] },
  { name: "Ansible", aliases: [], category: "Cloud & DevOps", related: ["DevOps", "Automation"] },

  // Data Science & ML
  { name: "Machine Learning", aliases: ["ML", "Predictive Modeling"], category: "Data Science & ML", related: ["Python", "TensorFlow", "Scikit-learn"] },
  { name: "Deep Learning", aliases: ["DL", "Neural Networks", "NN"], category: "Data Science & ML", related: ["TensorFlow", "PyTorch"] },
  { name: "TensorFlow", aliases: ["TF"], category: "Data Science & ML", related: ["Machine Learning", "Deep Learning"] },
  { name: "PyTorch", aliases: [], category: "Data Science & ML", related: ["Deep Learning", "Machine Learning"] },
  { name: "Natural Language Processing", aliases: ["NLP", "Text Mining"], category: "Data Science & ML", related: ["Transformers", "BERT", "GPT"] },
  { name: "Computer Vision", aliases: ["CV", "Image Processing"], category: "Data Science & ML", related: ["OpenCV", "Deep Learning"] },
  { name: "Data Science", aliases: ["DS"], category: "Data Science & ML", related: ["Statistics", "Python", "R"] },
  { name: "Pandas", aliases: ["Python Pandas"], category: "Data Science & ML", related: ["NumPy", "Data Analysis"] },
  { name: "NumPy", aliases: ["Numpy"], category: "Data Science & ML", related: ["Pandas", "Scientific Computing"] },
  { name: "Scikit-learn", aliases: ["Sklearn", "scikit-learn"], category: "Data Science & ML", related: ["Machine Learning", "Python"] },
  { name: "Tableau", aliases: [], category: "Data Science & ML", related: ["Data Visualization", "Business Intelligence"] },
  { name: "Power BI", aliases: ["PowerBI"], category: "Data Science & ML", related: ["Data Visualization", "Microsoft"] },
  { name: "Apache Spark", aliases: ["Spark"], category: "Data Science & ML", related: ["Big Data", "Scala", "PySpark"] },
  { name: "Hadoop", aliases: ["Apache Hadoop"], category: "Data Science & ML", related: ["Big Data", "MapReduce"] },
  { name: "LLM", aliases: ["Large Language Model", "GPT", "BERT", "Transformers", "Transformer Models"], category: "Data Science & ML", related: ["NLP", "Deep Learning"] },

  // Testing
  { name: "Jest", aliases: [], category: "Testing", related: ["Unit Testing", "JavaScript"] },
  { name: "Cypress", aliases: [], category: "Testing", related: ["E2E Testing", "Frontend"] },
  { name: "Selenium", aliases: [], category: "Testing", related: ["Browser Testing", "Automation"] },
  { name: "Unit Testing", aliases: ["JUnit", "Mocha", "PyTest", "pytest"], category: "Testing", related: ["TDD", "Testing"] },
  { name: "TDD", aliases: ["Test-Driven Development"], category: "Testing", related: ["Unit Testing", "Agile"] },

  // Mobile Development
  { name: "React Native", aliases: ["RN"], category: "Mobile Development", related: ["React", "JavaScript", "Mobile"] },
  { name: "Flutter", aliases: [], category: "Mobile Development", related: ["Dart", "Mobile", "Cross-Platform"] },
  { name: "iOS", aliases: ["iPhone", "iPad", "Swift"], category: "Mobile Development", related: ["Swift", "Objective-C", "Xcode"] },
  { name: "Android", aliases: [], category: "Mobile Development", related: ["Kotlin", "Java", "Android Studio"] },

  // Project Management & Methodologies
  { name: "Agile", aliases: ["Scrum", "Kanban", "Agile Methodology"], category: "Methodologies", related: ["Sprint", "Stand-up"] },
  { name: "DevOps", aliases: [], category: "Methodologies", related: ["CI/CD", "Docker", "Cloud"] },
  { name: "Microservices", aliases: ["Microservice Architecture"], category: "Methodologies", related: ["Docker", "REST API", "Cloud"] },
  { name: "System Design", aliases: ["Architecture Design", "Software Architecture"], category: "Methodologies", related: ["Scalability", "Design Patterns"] },
  { name: "Design Patterns", aliases: ["Gang of Four", "GoF"], category: "Methodologies", related: ["Software Architecture", "OOP"] },

  // Soft Skills
  { name: "Leadership", aliases: ["Team Lead", "Team Leadership"], category: "Soft Skills", related: ["Management", "Communication"] },
  { name: "Communication", aliases: ["Verbal Communication", "Written Communication"], category: "Soft Skills", related: ["Presentation", "Collaboration"] },
  { name: "Problem Solving", aliases: ["Analytical Thinking", "Critical Thinking"], category: "Soft Skills", related: ["Analysis", "Creativity"] },
  { name: "Teamwork", aliases: ["Collaboration", "Team Player", "Collaborative"], category: "Soft Skills", related: ["Communication", "Leadership"] },
  { name: "Project Management", aliases: ["PM"], category: "Soft Skills", related: ["Agile", "Planning"] },
  { name: "Time Management", aliases: [], category: "Soft Skills", related: ["Organization", "Prioritization"] },

  // Other Technologies
  { name: "WordPress", aliases: ["WP", "Wordpress"], category: "Other", related: ["PHP", "CMS", "Web Development"] },
  { name: "Shopify", aliases: [], category: "Other", related: ["E-commerce", "Liquid"] },
  { name: "Firebase", aliases: ["Google Firebase"], category: "Other", related: ["Google Cloud", "Real-time Database"] },
  { name: "Stripe", aliases: ["Stripe API"], category: "Other", related: ["Payment", "E-commerce"] },
  { name: "WebSocket", aliases: ["WebSockets", "WS"], category: "Other", related: ["Real-time", "Socket.io"] },
  { name: "OAuth", aliases: ["OAuth2", "Authentication", "SSO"], category: "Other", related: ["Security", "JWT"] },
  { name: "JWT", aliases: ["JSON Web Token"], category: "Other", related: ["Authentication", "Security"] },
  { name: "Webpack", aliases: [], category: "Other", related: ["Bundling", "JavaScript"] },
  { name: "Vite", aliases: [], category: "Other", related: ["Build Tool", "JavaScript"] },
  { name: "Figma", aliases: [], category: "Other", related: ["UI/UX", "Design"] },
];

// Build lookup maps for efficient matching
export function buildSkillLookup(): Map<string, SkillEntry> {
  const lookup = new Map<string, SkillEntry>();
  for (const skill of SKILL_TAXONOMY) {
    // Add the skill name
    lookup.set(skill.name.toLowerCase(), skill);
    // Add all aliases
    for (const alias of skill.aliases) {
      lookup.set(alias.toLowerCase(), skill);
    }
  }
  return lookup;
}

export function getSkillsByCategory(): Map<string, SkillEntry[]> {
  const byCategory = new Map<string, SkillEntry[]>();
  for (const skill of SKILL_TAXONOMY) {
    const existing = byCategory.get(skill.category) || [];
    existing.push(skill);
    byCategory.set(skill.category, existing);
  }
  return byCategory;
}
