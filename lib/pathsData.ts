import { BOOK_INDEX } from '@/lib/books';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  folderTitle: string;
  folderSubtitle?: string;
  folderGraphic: 'coral-brain' | 'system-lines' | 'math-torus' | 'network-graph' | 'matrix-lattice' | 'entropy-waves' | 'calculus-surface';
  accentColor: {
    folderBg: string;
    folderBorder: string;
    folderText: string;
    tagBg: string;
    chipBg: string;
  };
  bullets: string[];
  stats: {
    modules: number;
    lessons: number;
    interactiveCount: number;
  };
  href: string;
  description: string;
  /** Incomplete syllabi stay in the data but are not listed or routable. */
  hidden?: boolean;
  modules: {
    id: string;
    num: number;
    title: string;
    summary: string;
    keyConcepts: string[];
  }[];
}

function bookModules(id: string) {
  return BOOK_INDEX[id].chapters.map((c) => ({
    id: `${id}-${c.slug}`,
    num: c.num,
    title: c.title,
    summary: c.summary,
    keyConcepts: c.sections.slice(0, 4).map((x) => x.title),
  }));
}

const ALL_PATHS: LearningPath[] = [
  {
    id: 'gate-da',
    slug: 'gate-da',
    title: 'GATE DA',
    folderTitle: 'GATE DA',
    folderSubtitle: 'GATE_DA',
    folderGraphic: 'network-graph',
    accentColor: {
      folderBg: '#f1d9b8',
      folderBorder: '#e2bf8d',
      folderText: '#6b3f12',
      tagBg: '#fbf1e2',
      chipBg: '#f5e2c6',
    },
    bullets: [
      'Probability, linear algebra, calculus and optimization',
      'Python, data structures, algorithms and databases',
      'Data warehousing, supervised and unsupervised machine learning',
    ],
    stats: { modules: BOOK_INDEX['gate-da'].chapters.length, lessons: BOOK_INDEX['gate-da'].chapters.reduce((a, c) => a + c.sectionCount, 0), interactiveCount: 0 },
    href: '/paths/gate-da',
    description: 'Complete notes for the GATE Data Science and Artificial Intelligence paper: every subject in the official syllabus, with worked examples and diagrams, from the GateXAIML notes.',
    modules: bookModules('gate-da'),
  },
  {
    id: 'inferential-statistics',
    slug: 'inferential-statistics',
    title: 'Inferential Statistics',
    folderTitle: 'Inferential Statistics',
    folderSubtitle: 'INFERENTIAL_STATISTICS',
    folderGraphic: 'entropy-waves',
    accentColor: {
      folderBg: '#d7c7e9',
      folderBorder: '#bca8d6',
      folderText: '#46276b',
      tagBg: '#f2ecfa',
      chipBg: '#e3d7f4',
    },
    bullets: [
      'Point estimation, confidence, prediction & tolerance intervals',
      'Hypothesis tests, two-sample inference, regression & ANOVA',
      'Experimental design, nonparametrics & quality control',
    ],
    stats: { modules: BOOK_INDEX['inferential-statistics'].chapters.length, lessons: BOOK_INDEX['inferential-statistics'].chapters.reduce((a, c) => a + c.sectionCount, 0), interactiveCount: 0 },
    href: '/paths/inferential-statistics',
    description: 'A course in statistical inference that follows the standard engineering-statistics textbook chapter by chapter (estimation, intervals, tests, regression, experiments, nonparametrics, quality control), with supplementary chapters on estimation theory, resampling, A/B testing and generalised linear models.',
    modules: bookModules('inferential-statistics'),
  },
  {
    id: 'linear-algebra',
    slug: 'linear-algebra',
    title: 'Linear Algebra',
    folderTitle: 'Linear Algebra',
    folderSubtitle: 'LINEAR_ALGEBRA',
    folderGraphic: 'matrix-lattice',
    accentColor: {
      folderBg: '#b8cde4',
      folderBorder: '#99b6d8',
      folderText: '#1c3e66',
      tagBg: '#e6f0fa',
      chipBg: '#c8dcfa',
    },
    bullets: [
      'Elimination, LU, determinants & vector spaces',
      'Linear maps, change of basis, eigenvalues & Jordan form',
      'Spectral theorem, SVD, least squares & PCA',
    ],
    stats: { modules: BOOK_INDEX['linear-algebra'].chapters.length, lessons: BOOK_INDEX['linear-algebra'].chapters.reduce((a, c) => a + c.sectionCount, 0), interactiveCount: 0 },
    href: '/paths/linear-algebra',
    description: 'A complete course from linear systems to the singular value decomposition: every theorem proved, with worked examples, diagrams, interview boxes and exercises.',
    modules: bookModules('linear-algebra'),
  },
  {
    id: 'vector-calculus',
    slug: 'vector-calculus',
    title: 'Vector Calculus',
    folderTitle: 'Vector Calculus',
    folderSubtitle: 'VECTOR_CALCULUS',
    folderGraphic: 'math-torus',
    accentColor: {
      folderBg: '#f8df8e',
      folderBorder: '#e8c96c',
      folderText: '#684d07',
      tagBg: '#fef5d0',
      chipBg: '#fce9a5',
    },
    bullets: [
      'Gradients, Jacobians, Hessians & fields',
      'Line, surface & volume integrals with full proofs',
      'Green, Stokes, divergence & differential forms',
    ],
    stats: { modules: BOOK_INDEX['vector-calculus'].chapters.length, lessons: BOOK_INDEX['vector-calculus'].chapters.reduce((a, c) => a + c.sectionCount, 0), interactiveCount: 0 },
    href: '/paths/vector-calculus',
    description: 'An interview-level guide to multivariable and vector calculus, from curves and derivatives to the generalised Stokes theorem, with every theorem proved and every idea drawn.',
    modules: bookModules('vector-calculus'),
  },
  {
    id: 'probability',
    slug: 'probability',
    title: 'Probability',
    folderTitle: 'Probability',
    folderSubtitle: 'PROBABILITY',
    folderGraphic: 'network-graph',
    accentColor: {
      folderBg: '#f6d2cc',
      folderBorder: '#e8b5ac',
      folderText: '#6f2d24',
      tagBg: '#feebe7',
      chipBg: '#fad7d1',
    },
    bullets: [
      'Counting, axioms, conditioning & independence',
      'Random variables, moments, transforms & limit theorems',
      'Markov chains, martingales & measure theory',
    ],
    stats: { modules: BOOK_INDEX.probability.chapters.length, lessons: BOOK_INDEX.probability.chapters.reduce((a, c) => a + c.sectionCount, 0), interactiveCount: 0 },
    href: '/paths/probability',
    description: 'A self-contained probability course from coin tosses to the measure-theoretic definition of a random variable, written for exams and technical interviews alike.',
    modules: bookModules('probability'),
  },
  {
    id: 'differential-equations',
    slug: 'differential-equations',
    title: 'Differential Equations',
    folderTitle: 'Differential Equations',
    folderSubtitle: 'DIFFERENTIAL_EQUATIONS',
    folderGraphic: 'system-lines',
    accentColor: {
      folderBg: '#b8e3db',
      folderBorder: '#9bd1c7',
      folderText: '#135449',
      tagBg: '#e4f7f4',
      chipBg: '#caf0ea',
    },
    bullets: [
      'First- and higher-order ODEs, systems & Laplace transforms',
      'Boundary value problems, Fourier series & transforms',
      'Wave, heat & Laplace equations, series solutions, stability',
    ],
    stats: { modules: BOOK_INDEX['differential-equations'].chapters.length, lessons: BOOK_INDEX['differential-equations'].chapters.reduce((a, c) => a + c.sectionCount, 0), interactiveCount: 0 },
    href: '/paths/differential-equations',
    description: 'A complete engineering course in ordinary and partial differential equations: methods, worked examples, derivations and practice with answers.',
    modules: bookModules('differential-equations'),
  },
  // 2. INFORMATION THEORY & PROBABILITY
  {
    id: 'information-theory',
    slug: 'information-theory',
    hidden: true,
    title: 'Information Theory & Probability',
    folderTitle: 'Information Theory',
    folderSubtitle: 'Entropy & Uncertainty',
    folderGraphic: 'entropy-waves',
    accentColor: {
      folderBg: '#d7c7e9', // Lavender lilac
      folderBorder: '#bca8d6',
      folderText: '#46276b',
      tagBg: '#f2ecfa',
      chipBg: '#e3d7f4',
    },
    bullets: [
      'Shannon entropy & source coding limits',
      'Kullback-Leibler divergence & mutual information',
      'Probability spaces, measure & conjugate priors',
    ],
    stats: {
      modules: 14,
      lessons: 88,
      interactiveCount: 6,
    },
    href: '/paths/information-theory',
    description: 'Claude Shannon’s mathematical theory of communication: entropy, differential entropy, data processing inequality, channel capacity, and Bayesian conjugate inference.',
    modules: [
      {
        id: 'inf-01',
        num: 1,
        title: 'Entropy & Surprisal',
        summary: 'Surprisal, Shannon entropy H(X), joint entropy, and conditional uncertainty.',
        keyConcepts: ['Shannon Entropy', 'Joint Entropy', 'Axiomatic Uniqueness']
      },
      {
        id: 'inf-02',
        num: 2,
        title: 'Relative Entropy & Mutual Information',
        summary: 'KL divergence D(P || Q), Jensen-Shannon divergence, and data processing inequality.',
        keyConcepts: ['Kullback-Leibler Divergence', 'Mutual Information', 'Data Processing Inequality']
      },
      {
        id: 'inf-03',
        num: 3,
        title: 'Channel Capacity & Noisy Coding',
        summary: 'Shannon channel capacity theorem, continuous Gaussian channels, and rate distortion.',
        keyConcepts: ['Channel Capacity C', 'Shannon Noisy Coding', 'Rate Distortion']
      }
    ]
  },

  // 3. STATISTICAL LEARNING THEORY
  {
    id: 'introduction-to-ml',
    slug: 'introduction-to-ml',
    title: 'Introduction to ML',
    folderTitle: 'Introduction to ML',
    folderSubtitle: 'INTRO_TO_ML',
    folderGraphic: 'matrix-lattice',
    accentColor: {
      folderBg: '#d0e5cf', // Sage green
      folderBorder: '#b3d1b1',
      folderText: '#1f481c',
      tagBg: '#ebf6ea',
      chipBg: '#d8edd7',
    },
    bullets: [
      'Inductive bias, PAC bounds & sample complexity',
      'Bayesian decision surfaces & Gaussian estimation',
      'Dual kernel SVMs, MLPs & decision trees',
    ],
    stats: {
      modules: 19,
      lessons: 108,
      interactiveCount: 11,
    },
    href: '/paths/introduction-to-ml',
    description: 'Foundational statistical learning theory: inductive bias, parametric/nonparametric estimation, dimensionality reduction, cross-entropy loss, and maximum-margin kernel machines.',
    modules: [
      {
        id: 'sl-01',
        num: 1,
        title: 'Inductive Bias & Hypothesis Spaces',
        summary: 'Hypothesis capacity, PAC bounds, and the no-free-lunch theorem.',
        keyConcepts: ['Inductive Bias', 'Hypothesis Space H', 'VC Dimension']
      },
      {
        id: 'sl-03',
        num: 3,
        title: 'Bayesian Decision Theory & Risk',
        summary: 'Prior, likelihood, posterior odds, 0/1 loss, and minimum risk decision surfaces.',
        keyConcepts: ['Bayes Formula', '0/1 Loss', 'Posterior Probability']
      },
      {
        id: 'sl-13',
        num: 13,
        title: 'Kernel Machines & Dual SVMs',
        summary: 'Maximum-margin hyperplanes, dual Lagrangian formulation, and Mercer kernel trick.',
        keyConcepts: ['Support Vectors', 'Mercer Kernels', 'KKT Conditions']
      }
    ]
  },

  // 5. INFERENCE ENGINEERING
  {
    id: 'inference-engineering',
    slug: 'inference-engineering',
    hidden: true,
    title: 'Inference Engineering',
    folderTitle: 'Inference engineering',
    folderSubtitle: 'Latency & Cost Budgets',
    folderGraphic: 'network-graph',
    accentColor: {
      folderBg: '#b8cde4', // Slate steel blue (Fanout book 4)
      folderBorder: '#99b6d8',
      folderText: '#1c3e66',
      tagBg: '#e6f0fa',
      chipBg: '#c8dcfa',
    },
    bullets: [
      'Latency and cost budgets & roofline models',
      'KV cache and batching math & PagedAttention',
      'Quantization tradeoffs: FP8, AWQ, and GPTQ',
    ],
    stats: {
      modules: 16,
      lessons: 112,
      interactiveCount: 8,
    },
    href: '/paths/inference-engineering',
    description: 'Hardware-aware AI systems engineering: GPU memory bandwidth saturation, batching strategies, speculative decoding, kernel fusion, and token economics.',
    modules: [
      {
        id: 'inf-eng-01',
        num: 1,
        title: 'GPU Memory Hierarchy & Roofline Models',
        summary: 'Arithmetic intensity, HBM vs SRAM transfer speeds, tensor core throughput, and memory bandwidth bottlenecks.',
        keyConcepts: ['Roofline Analysis', 'Arithmetic Intensity', 'HBM vs SRAM Bandwidth', 'Tensor Cores']
      },
      {
        id: 'inf-eng-02',
        num: 2,
        title: 'KV Cache Sizing & PagedAttention',
        summary: 'Mathematical formulation of token state memory growth, context length scaling, vLLM virtual paging, and prefix caching.',
        keyConcepts: ['KV Cache Formula', 'PagedAttention', 'Radix Prefix Tree', 'Memory Fragmentation']
      },
      {
        id: 'inf-eng-03',
        num: 3,
        title: 'FlashAttention & Tiling Algorithms',
        summary: 'IO-aware exact attention computation, online softmax normalization, and SRAM block tiling.',
        keyConcepts: ['Online Softmax', 'SRAM Tiling', 'IO Complexity O(N^2/M)', 'Kernel Fusion']
      },
      {
        id: 'inf-eng-04',
        num: 4,
        title: 'Post-Training Quantization (PTQ)',
        summary: 'Weight-only vs weight-activation quantization, outlier channel protection, FP8 formats, and AWQ/GPTQ error metrics.',
        keyConcepts: ['FP8 Formats (E4M3/E5M2)', 'AWQ Activation Awareness', 'GPTQ Second-Order Hessian', 'Per-Tensor vs Per-Channel']
      }
    ]
  },

  // 6. SYSTEM DESIGN IN DEPTH
  {
    id: 'system-design',
    slug: 'system-design',
    hidden: true,
    title: 'System Design in Depth',
    folderTitle: 'SYSTEM design',
    folderSubtitle: 'Scale & Reliability',
    folderGraphic: 'system-lines',
    accentColor: {
      folderBg: '#c7d7c3', // Sage / Olive green (Fanout book 2)
      folderBorder: '#a8bea3',
      folderText: '#234921',
      tagBg: '#eaf4e9',
      chipBg: '#d0e5cf',
    },
    bullets: [
      'Notes and architectural case studies',
      'From-scratch distributed consensus implementations',
      'Built for senior systems & AI infrastructure roles',
    ],
    stats: {
      modules: 18,
      lessons: 120,
      interactiveCount: 9,
    },
    href: '/paths/system-design',
    description: 'Distributed infrastructure engineering: cluster consensus, partition sharding, storage engines, distributed training backbones, and resilient low-latency systems.',
    modules: [
      {
        id: 'sys-01',
        num: 1,
        title: 'Storage Engines: LSM-Trees & B+Trees',
        summary: 'Write amplification, SSTables, Bloom filters, compaction strategies, and WAL logs.',
        keyConcepts: ['LSM-Trees', 'WAL Log', 'Bloom Filter', 'Compaction']
      },
      {
        id: 'sys-02',
        num: 2,
        title: 'Distributed Consensus: Raft & Paxos',
        summary: 'Leader election, log replication, safety invariants, split-brain resolution, and quorum logic.',
        keyConcepts: ['Raft Term', 'Log Matching', 'Quorum Consensus', 'Two-Phase Commit']
      },
      {
        id: 'sys-03',
        num: 3,
        title: 'Distributed Training Topologies',
        summary: 'Data parallelism (DDP), ZeRO memory stages (FSDP), tensor model parallelism, and pipeline parallel bubbles.',
        keyConcepts: ['ZeRO-1/2/3 Stages', 'Ring AllReduce', 'Tensor Parallelism', 'Pipeline Bubbles']
      },
      {
        id: 'sys-04',
        num: 4,
        title: 'Partitioning & Consistent Hashing',
        summary: 'Virtual nodes, Dynamo-style partition rings, gossip protocols, and replication factors.',
        keyConcepts: ['Consistent Hashing', 'Virtual Nodes', 'Gossip Protocol', 'Vector Clocks']
      }
    ]
  },

];

export const GARDEN_PATHS: LearningPath[] = ALL_PATHS.filter((p) => !p.hidden);

export function getPathBySlug(slug: string): LearningPath | undefined {
  return GARDEN_PATHS.find((p) => p.slug === slug || p.id === slug);
}
