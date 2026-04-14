import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type Screen = "setup" | "interview" | "results";

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack", "ML Engineer", "Data Scientist"];
const LEVELS = ["Junior", "Mid-level", "Senior"];

interface IQuestion {
  id: string;
  question: string;
  hint: string;
  sampleAnswer: string;
  category: string;
}

const questionBank: Record<string, Record<string, IQuestion[]>> = {
  "Frontend Developer": {
    Junior: [
      { id: "fe-j-1", question: "What is the difference between margin and padding in CSS?", hint: "Think about inside vs outside the element box", sampleAnswer: "Margin is space outside the element's border creating distance from other elements. Padding is space inside the border between the border and the content. Margin doesn't affect the element's background; padding does.", category: "CSS" },
      { id: "fe-j-2", question: "Explain the concept of the DOM.", hint: "Document Object Model — how browsers represent HTML", sampleAnswer: "The DOM is a tree-like representation of an HTML document that browsers create. JavaScript can access and manipulate it to dynamically change content, structure, and styles. Each HTML element becomes a node in this tree.", category: "HTML/JS" },
      { id: "fe-j-3", question: "What is React and why would you use it?", hint: "Component-based library, virtual DOM, state management", sampleAnswer: "React is a JavaScript library for building user interfaces using reusable components. It uses a virtual DOM for efficient updates, has a rich ecosystem, and enables predictable state management. I'd use it for complex UIs with frequent state changes.", category: "React" },
      { id: "fe-j-4", question: "What is the difference between == and === in JavaScript?", hint: "Type coercion vs strict comparison", sampleAnswer: "== compares values with type coercion (1 == '1' is true). === compares both value and type strictly (1 === '1' is false). You should almost always use === to avoid unexpected bugs from coercion.", category: "JavaScript" },
      { id: "fe-j-5", question: "What is a flexbox?", hint: "CSS layout model for 1D alignment", sampleAnswer: "Flexbox is a CSS layout model that makes it easy to align and distribute items in a container along a single axis (row or column). Key properties: display:flex, justify-content, align-items, flex-direction, flex-wrap.", category: "CSS" },
    ],
    "Mid-level": [
      { id: "fe-m-1", question: "Explain React's useEffect hook and when you would use it.", hint: "Side effects, cleanup, dependency array", sampleAnswer: "useEffect runs side effects after render. The dependency array controls when it re-runs. Empty array = runs once on mount. With dependencies = runs when they change. Return a cleanup function to prevent memory leaks. Use for data fetching, subscriptions, DOM manipulation.", category: "React" },
      { id: "fe-m-2", question: "How would you optimize a React application's performance?", hint: "Memoization, code splitting, lazy loading, bundle size", sampleAnswer: "I'd use React.memo and useMemo to prevent unnecessary re-renders, useCallback for stable function references, React.lazy + Suspense for code splitting, virtualization for long lists (react-window), image optimization, and bundle analysis to remove unused code.", category: "Performance" },
      { id: "fe-m-3", question: "What is the CSS specificity and how does it work?", hint: "Inline > ID > class > element, calculate the weight", sampleAnswer: "Specificity determines which CSS rule applies when multiple rules target the same element. Calculated as (inline styles, IDs, classes/attributes, elements). Inline=1000, ID=100, class=10, element=1. Higher specificity wins; same specificity uses last declared rule.", category: "CSS" },
      { id: "fe-m-4", question: "Explain how async/await works with error handling.", hint: "try/catch, Promise rejection, async functions", sampleAnswer: "Async functions return Promises. Await pauses execution until the Promise resolves. Wrap in try/catch to handle rejections. You can also catch at the call site with .catch(). Always handle errors to prevent unhandled promise rejections.", category: "JavaScript" },
      { id: "fe-m-5", question: "What are Web Vitals and why do they matter?", hint: "LCP, FID/INP, CLS — Core Web Vitals", sampleAnswer: "Web Vitals are metrics measuring user experience: LCP (Largest Contentful Paint) for loading, FID/INP for interactivity, CLS for visual stability. They matter because Google uses them for SEO ranking and they directly correlate with user satisfaction and conversion rates.", category: "Performance" },
    ],
    Senior: [
      { id: "fe-s-1", question: "How would you architect a large-scale React application?", hint: "State management, code splitting, module federation, team conventions", sampleAnswer: "I'd define a clear folder structure (features/modules), use a predictable state manager (Redux Toolkit or Zustand), set up code splitting per route, establish strict TypeScript types, create a shared component library, configure CI/CD with testing, and document architectural decisions.", category: "Architecture" },
      { id: "fe-s-2", question: "Explain micro-frontends and when you'd use them.", hint: "Independent deployment, team autonomy, composition strategies", sampleAnswer: "Micro-frontends split a frontend into independently deployable units owned by different teams. Useful when scaling large orgs where multiple teams need to deploy independently. Implemented via Module Federation, iframes, or web components. Tradeoffs: complexity, shared dependencies, consistent UX.", category: "Architecture" },
      { id: "fe-s-3", question: "How do you approach accessibility (a11y) in frontend development?", hint: "WCAG, ARIA, semantic HTML, keyboard navigation, screen readers", sampleAnswer: "Start with semantic HTML (proper headings, landmark regions, form labels). Add ARIA attributes only when semantics aren't enough. Ensure keyboard navigation with focus management. Test with screen readers (NVDA, VoiceOver). Target WCAG 2.1 AA. Integrate axe or Lighthouse in CI.", category: "Accessibility" },
    ],
  },
  "Backend Developer": {
    Junior: [
      { id: "be-j-1", question: "What is a REST API and what are its main HTTP methods?", hint: "GET, POST, PUT, DELETE, PATCH and their purposes", sampleAnswer: "REST is an architectural style for APIs using HTTP. Main methods: GET (retrieve), POST (create), PUT/PATCH (update), DELETE (delete). Resources are identified by URLs. Responses use HTTP status codes. Data is typically JSON.", category: "APIs" },
      { id: "be-j-2", question: "What is the difference between SQL and NoSQL databases?", hint: "Structured vs flexible schema, ACID vs BASE", sampleAnswer: "SQL databases use structured schemas and tables with relationships, support ACID transactions, and are great for complex queries (PostgreSQL, MySQL). NoSQL offers flexible schemas, horizontal scaling, and trades some consistency for availability — good for documents, time-series, or graphs (MongoDB, Redis, Cassandra).", category: "Databases" },
      { id: "be-j-3", question: "What is middleware in Express.js?", hint: "Functions that have access to req, res, next", sampleAnswer: "Middleware are functions that execute between the request and response cycle. They have access to req, res, and next(). Used for logging, authentication, parsing request bodies, error handling. Called via app.use() or on specific routes.", category: "Node.js" },
      { id: "be-j-4", question: "What is a JWT and how is it used for authentication?", hint: "Header.Payload.Signature, stateless auth", sampleAnswer: "JWT (JSON Web Token) is a signed token with header, payload, and signature. The server creates a JWT on login, the client stores it (localStorage/httpOnly cookie). On subsequent requests, the client sends the JWT; the server verifies the signature without a database lookup. Good for stateless auth.", category: "Auth" },
      { id: "be-j-5", question: "What is an ORM and why would you use one?", hint: "Object-Relational Mapping, abstracts SQL", sampleAnswer: "An ORM maps database tables to objects in code, letting you query using your language instead of raw SQL. Benefits: type safety, easier queries, migration management, portability. Tradeoffs: can generate inefficient queries, abstraction overhead. Examples: Drizzle, Prisma, Sequelize.", category: "Databases" },
    ],
    "Mid-level": [
      { id: "be-m-1", question: "How would you design a rate limiting system?", hint: "Token bucket, sliding window, Redis, distributed systems", sampleAnswer: "I'd use a sliding window counter with Redis. Each request increments a key with a TTL. When count exceeds the limit, return 429. For distributed systems, Redis ensures consistency across instances. Libraries like express-rate-limit handle this, but at scale use dedicated API gateway rate limiting.", category: "System Design" },
      { id: "be-m-2", question: "Explain database indexing and when to use it.", hint: "B-tree, read vs write tradeoff, cardinality", sampleAnswer: "Indexes are data structures that speed up lookups at the cost of write performance and storage. Use B-tree indexes on columns used in WHERE, JOIN, ORDER BY with high cardinality. Composite indexes for multi-column queries. Avoid over-indexing — analyze query plans with EXPLAIN.", category: "Databases" },
      { id: "be-m-3", question: "What are the SOLID principles?", hint: "Five OOP design principles", sampleAnswer: "S: Single Responsibility — one reason to change. O: Open/Closed — open for extension, closed for modification. L: Liskov Substitution — subtypes must be substitutable. I: Interface Segregation — specific interfaces. D: Dependency Inversion — depend on abstractions. These guide maintainable, extensible code.", category: "Design Patterns" },
      { id: "be-m-4", question: "How would you handle database migrations in a production system?", hint: "Zero-downtime, backwards compatibility, rollback", sampleAnswer: "Use a migration tool (like Drizzle, Flyway). Apply migrations in a CI/CD pipeline before deploying code. Ensure backwards compatibility — avoid dropping/renaming columns in the same deploy as the code change. Use feature flags. Always test rollback. Monitor after deployment.", category: "Databases" },
      { id: "be-m-5", question: "Explain the N+1 query problem and how to solve it.", hint: "Lazy loading ORM, data loader, batch queries", sampleAnswer: "N+1 occurs when fetching a list (1 query) then fetching related data for each item (N queries). Solve with eager loading (JOIN in a single query), DataLoader for batching in GraphQL, or manually batching IDs with WHERE id IN (...). Always analyze query counts in development.", category: "Databases" },
    ],
    Senior: [
      { id: "be-s-1", question: "How would you design a scalable notification system?", hint: "Message queues, pub/sub, push/email/SMS, fan-out", sampleAnswer: "I'd use a message queue (Kafka/RabbitMQ) with a pub/sub pattern. Producers emit events; notification service consumers handle different channels (push, email, SMS). Use worker pools for fan-out. Store preferences in DB. Implement retry logic with exponential backoff. Add a delivery status tracker.", category: "System Design" },
      { id: "be-s-2", question: "Explain eventual consistency and when to accept it.", hint: "CAP theorem, BASE, distributed databases", sampleAnswer: "Eventual consistency means replicas converge to the same state given no new updates — but reads may be stale temporarily. Acceptable for: social media likes, product recommendations, analytics. Not acceptable for: banking transactions, inventory counts. Trade off availability vs. consistency based on business requirements.", category: "Distributed Systems" },
      { id: "be-s-3", question: "How do you approach API versioning?", hint: "URL versioning, headers, backwards compatibility", sampleAnswer: "Options: URL versioning (/v1/, /v2/) — simple but URL pollution. Header versioning (Accept: application/vnd.api+json;version=2) — cleaner URLs. I prefer URL versioning for external APIs (discoverability). Maintain at least one previous version. Deprecate with clear timelines and headers.", category: "APIs" },
    ],
  },
  "ML Engineer": {
    Junior: [
      { id: "mle-j-1", question: "What is the difference between supervised and unsupervised learning?", hint: "Labels, training signal, use cases", sampleAnswer: "Supervised learning trains on labeled examples (input→output pairs) for classification/regression. Unsupervised learning finds structure in unlabeled data — clustering, dimensionality reduction, anomaly detection. Semi-supervised uses a mix, and reinforcement learning uses reward signals.", category: "ML Fundamentals" },
      { id: "mle-j-2", question: "How would you handle missing data in a dataset?", hint: "Drop, impute, model-based imputation, flag", sampleAnswer: "Options: Drop rows/columns if small fraction. Impute with mean/median/mode for numerical/categorical. Use model-based imputation (KNN, MICE). Add a 'missing' indicator column. For time series, forward/backward fill. Choice depends on missingness mechanism (MCAR/MAR/MNAR) and downstream model.", category: "Data Preprocessing" },
      { id: "mle-j-3", question: "What is regularization and why is it important?", hint: "L1, L2, preventing overfitting, penalty term", sampleAnswer: "Regularization adds a penalty to the loss function to discourage complex models. L1 (Lasso) adds |weights| — drives some to zero (feature selection). L2 (Ridge) adds weights² — shrinks all weights. Both prevent overfitting by reducing model complexity. Controlled by the regularization strength hyperparameter λ.", category: "ML Fundamentals" },
      { id: "mle-j-4", question: "What is feature engineering?", hint: "Creating/transforming features to improve model performance", sampleAnswer: "Feature engineering is creating, transforming, or selecting features to improve model performance. Includes: encoding categoricals, scaling numerics, creating interaction features, extracting datetime components, binning, polynomial features, domain-specific transformations. Good features often matter more than model choice.", category: "Feature Engineering" },
      { id: "mle-j-5", question: "Explain the confusion matrix and its derived metrics.", hint: "TP, FP, TN, FN, precision, recall, F1", sampleAnswer: "A confusion matrix shows actual vs. predicted classes. From it: Precision=TP/(TP+FP) (of predicted positives, how many are correct), Recall=TP/(TP+FN) (of actual positives, how many found), F1=harmonic mean of both, Accuracy=(TP+TN)/total. Use F1 for imbalanced classes.", category: "Evaluation" },
    ],
    "Mid-level": [
      { id: "mle-m-1", question: "How do you deploy a machine learning model to production?", hint: "Serialization, API, containerization, monitoring", sampleAnswer: "Serialize model (pickle, ONNX, TorchScript). Build a serving API (FastAPI). Containerize with Docker. Deploy to Kubernetes or serverless. Monitor predictions, latency, data drift, model drift. Set up retraining pipelines. Use feature stores for consistency. Consider A/B testing for model versions.", category: "MLOps" },
      { id: "mle-m-2", question: "What is data leakage and how do you prevent it?", hint: "Future data in training, target leakage, temporal splits", sampleAnswer: "Data leakage occurs when information from outside training data contaminates the model. Types: target leakage (features derived from target), temporal leakage (future data used for past). Prevent with: strict train/validation/test splits, applying transforms fit only on training data, temporal splits for time series, careful feature review.", category: "ML Fundamentals" },
      { id: "mle-m-3", question: "Explain gradient boosting and how it differs from random forest.", hint: "Sequential vs parallel trees, boosting vs bagging", sampleAnswer: "Random Forest: parallel ensemble of deep trees via bagging — averages predictions for low variance. Gradient Boosting: sequential ensemble where each tree corrects the previous one's errors using gradients. GBM (XGBoost, LightGBM) typically outperforms RF on tabular data but is more prone to overfitting.", category: "Algorithms" },
      { id: "mle-m-4", question: "What is model drift and how do you detect it?", hint: "Data drift, concept drift, monitoring strategy", sampleAnswer: "Model drift: model performance degrades over time. Data drift: input distribution changes. Concept drift: relationship between features and target changes. Detect with: monitoring prediction distributions, tracking metrics on labeled samples, statistical tests (KS test, PSI). Set up alerts and retrain triggers.", category: "MLOps" },
      { id: "mle-m-5", question: "How would you approach an imbalanced classification problem?", hint: "Resampling, class weights, threshold tuning, metrics", sampleAnswer: "Options: resample (oversample minority with SMOTE, undersample majority), class weights in loss function, threshold tuning (optimize for F1 or precision-recall), use appropriate metrics (F1, AUC-PR over accuracy), generate synthetic samples, collect more minority data. Choice depends on dataset and business cost of errors.", category: "ML Fundamentals" },
    ],
    Senior: [
      { id: "mle-s-1", question: "How would you design an end-to-end ML platform?", hint: "Feature store, training pipeline, model registry, serving, monitoring", sampleAnswer: "Components: Data pipeline (ingestion, validation, transformation), Feature Store (consistent features train/serve), Training Pipeline (orchestrated with Airflow/Kubeflow), Experiment Tracking (MLflow), Model Registry with versioning, Serving infrastructure (online/batch), Monitoring (drift, performance). Emphasize reproducibility and governance.", category: "MLOps" },
      { id: "mle-s-2", question: "Explain the transformer architecture.", hint: "Attention mechanism, encoder-decoder, positional encoding", sampleAnswer: "Transformers use self-attention to model all token relationships in parallel. Key components: Multi-head self-attention (computes query, key, value matrices), positional encoding (adds position info), feed-forward layers, layer normalization. Encoder processes input; decoder generates output. Foundation for BERT, GPT, T5.", category: "Deep Learning" },
      { id: "mle-s-3", question: "How do you handle latency requirements for ML inference?", hint: "Model optimization, caching, async processing, hardware", sampleAnswer: "Optimize model: quantization (INT8), pruning, ONNX export, TensorRT. Use model caching. Async processing with queues for non-realtime. Hardware: GPU inference, dedicated chips. Feature caching in Redis. Precompute predictions for common inputs. Profile to find bottleneck: preprocessing, model, postprocessing.", category: "MLOps" },
    ],
  },
  "Full Stack": {
    Junior: [
      { id: "fs-j-1", question: "What is the difference between client-side and server-side rendering?", hint: "Where HTML is generated, SEO, TTFB, interactivity", sampleAnswer: "CSR: Browser downloads JS, React/Vue renders the page in the browser. Fast after initial load, poor initial SEO. SSR: Server generates HTML and sends it — better SEO, faster first paint, but more server load. Next.js combines both. SSG generates HTML at build time for static content.", category: "Architecture" },
      { id: "fs-j-2", question: "How does HTTP request-response cycle work?", hint: "DNS, TCP, TLS, HTTP, response codes", sampleAnswer: "Browser resolves domain via DNS → establishes TCP connection → TLS handshake for HTTPS → sends HTTP request (method, headers, body) → server processes and returns response (status code, headers, body) → browser parses and renders. Connection may be kept alive for reuse.", category: "Networking" },
      { id: "fs-j-3", question: "What is the purpose of environment variables?", hint: "Config separation, secrets, .env files, security", sampleAnswer: "Environment variables separate configuration from code — different values for development, staging, production. Store secrets (API keys, DB passwords) outside version control. Use .env files locally, injection in CI/CD or orchestrators in production. Never commit secrets to git.", category: "DevOps" },
      { id: "fs-j-4", question: "Explain the concept of CRUD operations.", hint: "Create, Read, Update, Delete — database operations", sampleAnswer: "CRUD represents the four basic database operations: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). In REST APIs: POST=Create, GET=Read, PUT/PATCH=Update, DELETE=Delete. Every data-driven application revolves around these operations.", category: "Backend" },
      { id: "fs-j-5", question: "What is authentication vs authorization?", hint: "Who you are vs what you can do", sampleAnswer: "Authentication verifies identity (who are you?) — login with credentials, OAuth, biometrics. Authorization verifies permissions (what can you do?) — role-based access, resource ownership checks. Authentication comes first; authorization uses the authenticated identity to control access.", category: "Security" },
    ],
    "Mid-level": [
      { id: "fs-m-1", question: "How would you implement caching in a full-stack application?", hint: "Redis, CDN, HTTP cache headers, browser cache, query cache", sampleAnswer: "Layers: Browser caching (Cache-Control headers), CDN for static assets, application-level cache (Redis for session, frequently-queried data, computed results), database query cache. Strategy: cache-aside (check cache, miss → fetch DB → write cache). Set appropriate TTLs. Handle invalidation.", category: "Performance" },
      { id: "fs-m-2", question: "What is CI/CD and how would you set it up?", hint: "Continuous Integration, Continuous Deployment, pipelines, automation", sampleAnswer: "CI: automatically test every commit (lint, unit tests, integration tests) — prevents broken code reaching main. CD: automatically deploy passing builds to staging/production. Setup: GitHub Actions/GitLab CI pipeline with stages: install → build → test → deploy. Add environment-specific configs and rollback strategy.", category: "DevOps" },
      { id: "fs-m-3", question: "Explain WebSockets and when to use them vs polling.", hint: "Real-time, persistent connection, HTTP overhead", sampleAnswer: "WebSockets provide persistent bidirectional connection between client and server — efficient for real-time features (chat, live updates, collaborative editing, gaming). Polling: client repeatedly requests data on interval — simple but wasteful. Long polling: server holds request until data available. Use WebSockets when low latency and high frequency updates are needed.", category: "Networking" },
      { id: "fs-m-4", question: "How do you prevent SQL injection?", hint: "Parameterized queries, prepared statements, ORMs", sampleAnswer: "Never concatenate user input into SQL strings. Use parameterized queries or prepared statements — the DB driver escapes input. ORMs (Drizzle, Prisma) handle this automatically. Validate and sanitize inputs. Use least-privilege database accounts. Regularly audit queries.", category: "Security" },
      { id: "fs-m-5", question: "What is Docker and how does it help development?", hint: "Containers, isolation, reproducible environments", sampleAnswer: "Docker packages an application and its dependencies into a container — an isolated, reproducible environment. Benefits: 'works on my machine' problem eliminated, consistent dev/prod environments, easy scaling, fast deployment. Dockerfile defines the image; docker-compose orchestrates multiple services.", category: "DevOps" },
    ],
    Senior: [
      { id: "fs-s-1", question: "How would you design a scalable file upload system?", hint: "Presigned URLs, chunked uploads, CDN, virus scanning, metadata", sampleAnswer: "Generate presigned S3 URLs for direct upload from client (avoids routing through server). For large files, use multipart upload with chunking and resume support. After upload: validate file type/size, virus scan asynchronously, generate thumbnails, store metadata in DB, serve via CDN. Handle failures with cleanup jobs.", category: "System Design" },
      { id: "fs-s-2", question: "How would you approach technical debt in a large codebase?", hint: "Assessment, prioritization, incremental refactoring, strangler pattern", sampleAnswer: "Audit debt: identify critical areas by frequency of bugs and change. Prioritize by business impact and developer pain. Dedicate regular capacity (20% sprint time). Use the Strangler Fig pattern for large refactors — incrementally replace components. Set coding standards, add tests before refactoring. Track debt in a dedicated backlog.", category: "Engineering" },
      { id: "fs-s-3", question: "Explain how you'd implement multi-tenancy in a SaaS application.", hint: "Shared schema, separate schema, separate DB, row-level security", sampleAnswer: "Three approaches: Shared database with tenant_id column and row-level security (cost-efficient, careful isolation), separate schema per tenant (moderate isolation, one DB), separate database per tenant (strongest isolation, expensive). Shared schema with RLS works for most SaaS at scale. Always scope every query by tenant_id.", category: "Architecture" },
    ],
  },
  "Data Scientist": {
    Junior: [
      { id: "ds-j-1", question: "What is the difference between correlation and causation?", hint: "Statistical association vs causal relationship, confounders", sampleAnswer: "Correlation means two variables move together statistically. Causation means one directly causes the other. Correlation doesn't imply causation — confounding variables may explain the relationship. Establishing causation requires randomized controlled trials or causal inference methods.", category: "Statistics" },
      { id: "ds-j-2", question: "What is exploratory data analysis (EDA) and what does it involve?", hint: "Distribution, outliers, missing values, correlations, visualization", sampleAnswer: "EDA involves examining data before modeling: checking shape and types, descriptive statistics (mean, std, quartiles), distribution visualizations (histograms, boxplots), correlation analysis, missing value patterns, outlier detection, and domain-specific exploration. Goal: understand the data and generate hypotheses.", category: "EDA" },
      { id: "ds-j-3", question: "What is p-value and what does it mean?", hint: "Probability under null hypothesis, significance threshold", sampleAnswer: "P-value is the probability of observing results at least as extreme as those obtained, assuming the null hypothesis is true. A small p-value (typically < 0.05) suggests rejecting H0. It doesn't measure effect size or practical significance. Multiple testing requires correction (Bonferroni, FDR).", category: "Statistics" },
      { id: "ds-j-4", question: "How do you deal with outliers in data?", hint: "Detection methods, domain knowledge, treatment options", sampleAnswer: "Detect with IQR, Z-score, isolation forest, or visualization. Then decide: remove (if data error), cap/winsorize (keep but limit influence), transform (log/sqrt to reduce skew), or keep (if genuine extreme values). Domain knowledge is crucial — outliers may be the most important data points.", category: "Data Preprocessing" },
      { id: "ds-j-5", question: "What is A/B testing and how would you design one?", hint: "Hypothesis, sample size, randomization, significance", sampleAnswer: "A/B testing compares two versions to measure the effect of a change. Design: define clear hypothesis and metric, calculate required sample size (power analysis), randomly assign users, run for sufficient duration, check for novelty effects, analyze with statistical test (t-test, chi-square), decide with confidence.", category: "Experimentation" },
    ],
    "Mid-level": [
      { id: "ds-m-1", question: "What is the curse of dimensionality?", hint: "High dimensions, data sparsity, distance metrics break down", sampleAnswer: "As dimensions increase, data becomes exponentially sparser, distances become less meaningful, and more data is needed to maintain statistical significance. Models overfit more easily. Solutions: dimensionality reduction (PCA, t-SNE, UMAP), feature selection, regularization.", category: "ML Fundamentals" },
      { id: "ds-m-2", question: "How would you approach a time series forecasting problem?", hint: "Stationarity, seasonality, ARIMA, prophet, LSTM", sampleAnswer: "Check stationarity (ADF test), decompose trend/seasonality/residual, check autocorrelation. Classical: ARIMA, SARIMA for stationary series. Prophet for seasonality with holidays. ML: lag features, rolling stats, gradient boosting. Deep learning: LSTM, Temporal Fusion Transformer. Evaluate with RMSE, MAPE, on held-out future data.", category: "Time Series" },
      { id: "ds-m-3", question: "Explain the difference between parametric and non-parametric tests.", hint: "Assumptions about distribution, sample size considerations", sampleAnswer: "Parametric tests assume data follows a distribution (usually normal): t-test, ANOVA, Pearson correlation. Non-parametric tests make no distribution assumptions: Mann-Whitney U, Kruskal-Wallis, Spearman. Use non-parametric when sample is small, data is ordinal, or assumptions are violated.", category: "Statistics" },
      { id: "ds-m-4", question: "What is model interpretability and why does it matter?", hint: "SHAP, LIME, feature importance, business trust", sampleAnswer: "Interpretability helps understand why a model makes predictions. Matters for: regulatory compliance (GDPR, finance), building stakeholder trust, debugging models, identifying bias. Tools: SHAP (global + local explanations), LIME, feature importance, partial dependence plots. Trade-off with model complexity.", category: "Model Interpretability" },
      { id: "ds-m-5", question: "How do you ensure reproducibility in data science experiments?", hint: "Random seeds, versioning data/code/environment, logging", sampleAnswer: "Set random seeds everywhere (numpy, sklearn, torch). Version control: code (git), data (DVC, LakeFS), models (MLflow). Track experiments (MLflow, W&B) logging parameters, metrics, artifacts. Use virtual environments or containers for dependencies. Document data preprocessing steps.", category: "MLOps" },
    ],
    Senior: [
      { id: "ds-s-1", question: "How would you set up a recommendation system?", hint: "Collaborative filtering, content-based, hybrid, cold start", sampleAnswer: "Start with business goals: what to recommend, what feedback signal (clicks, purchases, ratings). Data: user-item interactions, content features. Approaches: collaborative filtering (matrix factorization, ALS), content-based (item embeddings), hybrid. Address cold start with popularity or content-based. Evaluate offline (NDCG, MAP) and online (A/B). Build feedback loop for retraining.", category: "System Design" },
      { id: "ds-s-2", question: "How do you communicate data science results to non-technical stakeholders?", hint: "Business impact, visualizations, uncertainty, actionability", sampleAnswer: "Lead with business impact and recommendations, not methodology. Use clear visualizations (avoid jargon in chart labels). Quantify uncertainty honestly. Answer 'so what?' — what action should they take? Tell a story: problem → approach → finding → recommendation. Prepare for follow-up questions. Align metrics to KPIs they care about.", category: "Communication" },
      { id: "ds-s-3", question: "How would you detect and address bias in an ML model?", hint: "Disparate impact, fairness metrics, mitigation techniques", sampleAnswer: "Audit data for historical bias and underrepresentation. Measure fairness metrics: demographic parity, equalized odds, individual fairness. Use tools: Fairlearn, IBM AIF360. Mitigation: pre-processing (reweighting, resampling), in-processing (fairness constraints), post-processing (threshold adjustment per group). Document and communicate limitations.", category: "Ethics & Fairness" },
    ],
  },
};

function getInterviewQuestions(role: string, level: string): IQuestion[] {
  const pool = questionBank[role]?.[level] || [];
  return [...pool].sort(() => Math.random() - 0.5);
}

const QUESTION_TIME = 120;

export default function MockInterview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [screen, setScreen] = useState<Screen>("setup");
  const [role, setRole] = useState("Full Stack");
  const [level, setLevel] = useState("Junior");
  const [evaluations, setEvaluations] = useState<Record<string, {feedback: string, score: number}>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState<Record<string, boolean>>({});
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const proceedToNextRef = useRef<() => Promise<void>>(async () => {});

  const proceedToNext = useCallback(async () => {
    if (questions.length === 0) return;
    const idx = currentIdx;
    const qs = questions;
    const q = qs[idx];
    if (!q) return;
    const ans = currentAnswer;
    const newAnswers = { ...answers, [q.id]: ans };
    setAnswers(newAnswers);

    if (ans.trim()) {
      fetch("/api/mock-interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.question, answer: ans }),
      })
        .then(res => res.json())
        .then(data => {
          setEvaluations(prev => ({ ...prev, [q.id]: data }));
        })
        .catch(console.error);
    }

    setCurrentAnswer("");
    setShowHint(false);
    if (idx < qs.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setScreen("results");
    }
  }, [answers, currentAnswer, currentIdx, questions]);

  proceedToNextRef.current = proceedToNext;

  useEffect(() => {
    if (screen !== "interview") return;
    setTimeLeft(QUESTION_TIME);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({ title: "Time's up for this question! Moving on." });
          queueMicrotask(() => void proceedToNextRef.current());
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, currentIdx, questions.length, toast]);

  async function startInterview() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/mock-interview/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level }),
      });
      if (!res.ok) throw new Error("Failed");
      const qs = (await res.json()) as IQuestion[];
      setQuestions(Array.isArray(qs) && qs.length > 0 ? qs : getInterviewQuestions(role, level));
      setCurrentIdx(0);
      setAnswers({});
      setEvaluations({});
      setCurrentAnswer("");
      setShowHint(false);
      setScreen("interview");
    } catch {
      setQuestions(getInterviewQuestions(role, level));
      setCurrentIdx(0);
      setAnswers({});
      setEvaluations({});
      setCurrentAnswer("");
      setShowHint(false);
      setScreen("interview");
      toast({ title: "Using offline question bank", description: "API unavailable — practice mode." });
    } finally {
      setIsLoading(false);
    }
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const progress = questions.length ? ((currentIdx) / questions.length) * 100 : 0;
  const isWarning = timeLeft <= 30;

  const categoryColors: Record<string, string> = {
    "CSS": "#06b6d4", "HTML/JS": "#f59e0b", "React": "#61dafb", "JavaScript": "#f59e0b",
    "Performance": "#10b981", "Accessibility": "#8b5cf6", "Architecture": "#7c3aed",
    "APIs": "#ec4899", "Databases": "#f97316", "Node.js": "#6ee7b7", "Auth": "#a78bfa",
    "Security": "#ef4444", "Design Patterns": "#c084fc", "DevOps": "#38bdf8",
    "System Design": "#7c3aed", "Distributed Systems": "#f59e0b", "Networking": "#06b6d4",
    "MLOps": "#10b981", "ML Fundamentals": "#a78bfa", "Algorithms": "#f97316",
    "Deep Learning": "#ec4899", "Feature Engineering": "#fbbf24",
    "Data Preprocessing": "#34d399", "Evaluation": "#c084fc",
    "Statistics": "#38bdf8", "EDA": "#f59e0b", "Experimentation": "#10b981",
    "Time Series": "#7c3aed", "Model Interpretability": "#ec4899",
    "Ethics & Fairness": "#ef4444", "Communication": "#a78bfa", "Engineering": "#f97316",
  };

  const btnBase: React.CSSProperties = {
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
    border: "none",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.85)",
    border: "1px solid rgba(124,58,237,0.25)",
    borderRadius: "20px",
    padding: "2rem",
  };

  if (screen === "setup") return (
    <div style={{ padding: "1.5rem", maxWidth: "640px" }}>
      <button
        onClick={() => setLocation("/dashboard")}
        style={{ ...btnBase, background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", marginBottom: "1.5rem", padding: "0.4rem 0.875rem", fontSize: "0.8rem" }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", marginBottom: "0.25rem" }}>Mock Interview</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>Simulate a real technical interview with curated questions</p>

      <div style={cardStyle}>
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Target Role
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ROLES.map(r => (
              <button
                key={r}
                data-testid={`role-${r}`}
                onClick={() => setRole(r)}
                style={{
                  ...btnBase,
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.82rem",
                  background: role === r ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${role === r ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.1)"}`,
                  color: role === r ? "#c084fc" : "rgba(255,255,255,0.6)",
                }}
              >{r}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Experience Level
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {LEVELS.map(l => {
              const col = l === "Junior" ? "#10b981" : l === "Mid-level" ? "#f59e0b" : "#7c3aed";
              return (
                <button
                  key={l}
                  data-testid={`level-${l}`}
                  onClick={() => setLevel(l)}
                  style={{
                    ...btnBase,
                    flex: 1,
                    padding: "0.6rem",
                    background: level === l ? `${col}20` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${level === l ? col : "rgba(255,255,255,0.1)"}`,
                    color: level === l ? col : "rgba(255,255,255,0.5)",
                  }}
                >{l}</button>
              );
            })}
          </div>
        </div>

        <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            You'll get <strong style={{ color: "#a78bfa" }}>5 questions</strong> for <strong style={{ color: "#a78bfa" }}>{role}</strong> at <strong style={{ color: "#a78bfa" }}>{level}</strong> level. Each question has a <strong style={{ color: "#f59e0b" }}>2-minute</strong> timer. Type your answer, use hints if needed, then compare with a model answer.
          </p>
        </div>

        <button
          data-testid="button-start-interview"
          onClick={startInterview} disabled={isLoading}
          style={{ ...btnBase, width: "100%", padding: "1rem", background: isLoading ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white", fontSize: "1rem", boxShadow: "0 0 20px rgba(124,58,237,0.35)", cursor: isLoading ? "wait": "pointer" }}
        >
          {isLoading ? "Generating with AI..." : "Start Interview"}
        </button>
      </div>
    </div>
  );

  if (screen === "interview") {
    const q = questions[currentIdx];
    if (!q || questions.length === 0) {
      return (
        <div style={{ padding: "1.5rem", maxWidth: "720px" }}>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Loading questions…</p>
        </div>
      );
    }
    const catColor = categoryColors[q.category] || "#a78bfa";
    return (
      <div style={{ padding: "1.5rem", maxWidth: "720px" }}>
        <style>{`@keyframes pulse-r { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa", padding: "0.2rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
              {role}
            </span>
            <span style={{ background: `${catColor}20`, border: `1px solid ${catColor}44`, color: catColor, padding: "0.2rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 }}>
              {q.category}
            </span>
          </div>
          <div style={{
            padding: "0.4rem 1rem",
            background: isWarning ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.1)",
            border: `1px solid ${isWarning ? "rgba(239,68,68,0.4)" : "rgba(6,182,212,0.3)"}`,
            borderRadius: "20px",
            animation: isWarning ? "pulse-r 0.7s ease-in-out infinite" : "none",
          }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isWarning ? "#ef4444" : "#67e8f9", letterSpacing: "0.05em" }}>
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>Question {currentIdx + 1} of {questions.length}</span>
          </div>
          <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #9333ea)", transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{
              width: "36px", height: "36px", flexShrink: 0, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: "0.9rem",
            }}>
              {currentIdx + 1}
            </div>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.5, flex: 1 }}>
              {q.question}
            </h3>
          </div>

          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              style={{
                ...btnBase, padding: "0.4rem 0.875rem", fontSize: "0.8rem",
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                color: "#fbbf24", marginBottom: "1rem",
              }}
            >
              💡 Show Hint
            </button>
          ) : (
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
              <span style={{ color: "#f59e0b", fontSize: "0.75rem", fontWeight: 700 }}>HINT  </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{q.hint}</span>
            </div>
          )}

          <textarea
            ref={textAreaRef}
            data-testid="textarea-answer"
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here... Take your time to think before responding."
            rows={6}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              boxSizing: "border-box",
              marginBottom: "1.25rem",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)")}
          />

          <button
            data-testid="button-next-interview"
            onClick={proceedToNext}
            style={{ ...btnBase, width: "100%", padding: "0.875rem", background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white" }}
          >
            {currentIdx === questions.length - 1 ? "Finish Interview" : "Next Question →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "760px" }}>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: "1.5rem", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(13,10,40,0.9))" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: "0.25rem" }}>Interview Complete!</h2>
        <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "1rem" }}>
          You answered {Object.values(answers).filter(a => a.trim().length > 0).length} of {questions.length} questions
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            data-testid="button-new-interview"
            onClick={() => setScreen("setup")}
            style={{ ...btnBase, background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white" }}
          >
            New Interview
          </button>
          <button
            onClick={() => setLocation("/dashboard")}
            style={{ ...btnBase, background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}
          >
            Dashboard
          </button>
        </div>
      </div>

      <h3 style={{ color: "white", fontWeight: 700, marginBottom: "1rem", fontSize: "1.1rem" }}>
        Review & Model Answers
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {questions.map((q, idx) => {
          const catColor = categoryColors[q.category] || "#a78bfa";
          const userAnswer = answers[q.id] || "";
          const hasAnswer = userAnswer.trim().length > 0;
          return (
            <div
              key={q.id}
              data-testid={`result-${q.id}`}
              style={{ ...cardStyle, padding: "1.5rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 600 }}>Q{idx + 1}</span>
                <span style={{ background: `${catColor}20`, border: `1px solid ${catColor}44`, color: catColor, padding: "0.15rem 0.6rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700 }}>
                  {q.category}
                </span>
              </div>

              <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                {q.question}
              </p>

              <div style={{ marginBottom: "0.875rem" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Your Answer
                </p>
                <div style={{
                  padding: "0.75rem",
                  background: hasAnswer ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${hasAnswer ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "10px",
                  color: hasAnswer ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  fontStyle: hasAnswer ? "normal" : "italic",
                }}>
                  {hasAnswer ? userAnswer : "No answer provided"}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowSample(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  style={{
                    ...btnBase, padding: "0.4rem 0.875rem", fontSize: "0.8rem",
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                    color: "#34d399", marginBottom: "0.5rem",
                  }}
                >
                  {showSample[q.id] ? "Hide" : "Show"} Model Answer
                </button>
                {showSample[q.id] && (
                  <div style={{
                    padding: "0.875rem",
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: "10px",
                    borderLeft: "3px solid #10b981",
                  }}>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "0.5rem" }}>
                      <strong>Model Answer: </strong> {q.sampleAnswer}
                    </p>
                    {evaluations[q.id] && (
                      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(16,185,129,0.2)" }}>
                        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem", fontWeight: 700 }}>AI Feedback (Score: {evaluations[q.id].score}/10)</p>
                        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}>{evaluations[q.id].feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
