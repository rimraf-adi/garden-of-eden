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
  modules: {
    id: string;
    num: number;
    title: string;
    summary: string;
    keyConcepts: string[];
  }[];
}

export const GARDEN_PATHS: LearningPath[] = [
  // 1. MATHEMATICS FOR AI (FIRST)
  {
    id: 'mathematics',
    slug: 'linear-algebra',
    title: 'Mathematics for Machine Learning',
    folderTitle: 'Mathematics for Machine learning',
    folderSubtitle: 'Spaces, Gradients & Manifolds',
    folderGraphic: 'math-torus',
    accentColor: {
      folderBg: '#f8df8e', // Warm Ochre Tuscan yellow (Fanout book 3)
      folderBorder: '#e8c96c',
      folderText: '#684d07',
      tagBg: '#fef5d0',
      chipBg: '#fce9a5',
    },
    bullets: [
      'Sets and logic to high-dimensional inference',
      'Linear algebra, SVD & spectral theorems',
      'Multivariable calculus, Hessians & KKT duality',
    ],
    stats: {
      modules: 12,
      lessons: 95,
      interactiveCount: 8,
    },
    href: '/paths/linear-algebra',
    description: 'First-principles mathematical foundations: vector spaces, singular value decomposition (SVD), multivariable gradients, Hessians, and constrained optimization.',
    modules: [
      {
        id: 'math-01',
        num: 1,
        title: 'Vector Spaces & Orthogonal Projections',
        summary: 'Subspaces, null spaces, Gram-Schmidt orthogonalization, and projection matrices.',
        keyConcepts: ['Orthogonal Projection', 'Four Fundamental Subspaces', 'Gram-Schmidt']
      },
      {
        id: 'math-02',
        num: 2,
        title: 'Eigenvalues & Spectral Decomposition',
        summary: 'Symmetric matrices, orthogonal diagonalization, Rayleigh quotients, and quadratic forms.',
        keyConcepts: ['Spectral Theorem', 'Positive Semi-Definite Cones', 'Rayleigh Quotient']
      },
      {
        id: 'math-03',
        num: 3,
        title: 'Singular Value Decomposition (SVD)',
        summary: 'Compact SVD, pseudoinverses, condition numbers, and low-rank Eckart-Young theorem.',
        keyConcepts: ['SVD Decomposition', 'Pseudoinverse', 'Eckart-Young Theorem']
      },
      {
        id: 'math-04',
        num: 4,
        title: 'Gradients, Jacobians & Hessian Curvature',
        summary: 'Multivariable chain rule, second-order Taylor series, and constrained Lagrangian duality.',
        keyConcepts: ['Jacobian Matrix', 'Hessian Matrix', 'KKT Conditions']
      }
    ]
  },

  // 2. INFORMATION THEORY & PROBABILITY
  {
    id: 'information-theory',
    slug: 'information-theory',
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
    id: 'statistical-learning',
    slug: 'statistical-learning',
    title: 'Statistical Learning Theory',
    folderTitle: 'Learning Theory',
    folderSubtitle: 'Foundations & Bias',
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
    href: '/chapter/01-introduction',
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

  // 4. DEEP LEARNING & FOUNDATION MODELS
  {
    id: 'deep-learning',
    slug: 'deep-learning',
    title: 'AI Research & Deep Architectures',
    folderTitle: 'AI research',
    folderSubtitle: 'Architectures & Scales',
    folderGraphic: 'coral-brain',
    accentColor: {
      folderBg: '#f6d2cc', // Terracotta blush (Fanout book 1)
      folderBorder: '#e8b5ac',
      folderText: '#6f2d24',
      tagBg: '#feebe7',
      chipBg: '#fad7d1',
    },
    bullets: [
      'Math foundations to LLMs & attention mechanics',
      'Landmark papers, sequenced and derived',
      'Modern optimizers, scaling laws & diffusion',
    ],
    stats: {
      modules: 14,
      lessons: 108,
      interactiveCount: 12,
    },
    href: '/paths/deep-learning',
    description: 'Modern deep representation learning: from scaled self-attention and rotary embeddings to mixture-of-experts (MoE), compute-optimal scaling, and diffusion models.',
    modules: [
      {
        id: 'dl-01',
        num: 1,
        title: 'Modern Attention & Positional Embeddings',
        summary: 'Multi-Head, Multi-Query, and Grouped-Query Attention (GQA), Rotary Position Embeddings (RoPE), and context scaling.',
        keyConcepts: ['GQA / MQA', 'RoPE Geometry', 'Multi-Head Projections', 'Attention Masking']
      },
      {
        id: 'dl-02',
        num: 2,
        title: 'Mixture of Experts (MoE) Routing',
        summary: 'Sparse gated routing, top-k expert selection, auxiliary load balancing losses, and communication overhead.',
        keyConcepts: ['Sparse Gating', 'Expert Capacity Factor', 'Auxiliary Loss', 'All-to-All Dispatch']
      },
      {
        id: 'dl-03',
        num: 3,
        title: 'Compute-Optimal Scaling Laws',
        summary: 'Kaplan vs Chinchilla empirical scaling equations, loss forecasting, and parameter-to-token compute optimality.',
        keyConcepts: ['Chinchilla Optimal Ratio', 'Compute Budget C = 6ND', 'Power-Law Exponents']
      },
      {
        id: 'dl-04',
        num: 4,
        title: 'Generative Diffusion & Flow Matching',
        summary: 'Score-based continuous generative modeling, reverse stochastic differential equations, and continuous normalizing flows.',
        keyConcepts: ['Denoising Score Matching', 'Probability Flow ODE', 'Vector Field Matching']
      }
    ]
  },

  // 5. INFERENCE ENGINEERING
  {
    id: 'inference-engineering',
    slug: 'inference-engineering',
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

  // 7. AGENTIC SYSTEMS
  {
    id: 'agentic-systems',
    slug: 'agentic-systems',
    title: 'Agentic Systems & Production RAG',
    folderTitle: 'Agentic Systems',
    folderSubtitle: 'Orchestration & Tools',
    folderGraphic: 'network-graph',
    accentColor: {
      folderBg: '#b8e3db', // Mint cyan
      folderBorder: '#9bd1c7',
      folderText: '#135449',
      tagBg: '#e4f7f4',
      chipBg: '#caf0ea',
    },
    bullets: [
      'Tool-calling schemas & structured output decoding',
      'ReAct loops, supervisor-worker topologies',
      'Hierarchical retrieval & vector indexing',
    ],
    stats: {
      modules: 14,
      lessons: 96,
      interactiveCount: 8,
    },
    href: '/paths/agentic-systems',
    description: 'Production AI engineering for autonomous agents: planning loops, tool use schemas, stateful memory graphs, hierarchical RAG, and evaluation harnesses.',
    modules: [
      {
        id: 'agt-01',
        num: 1,
        title: 'Tool Use & Grammar-Constrained Decoding',
        summary: 'JSON schema enforcement, context-free grammar parsing (CFG), and reliable tool-calling contracts.',
        keyConcepts: ['Grammar-Constrained Decoding', 'JSON Schema Enforcement', 'Function Calling Protocol']
      },
      {
        id: 'agt-02',
        num: 2,
        title: 'ReAct, Reflexion & Multi-Agent Topologies',
        summary: 'Self-correction cycles, dynamic tool dispatch, hierarchical supervisor-worker architectures, and conversation memory state.',
        keyConcepts: ['ReAct Pattern', 'Reflexion Loop', 'Supervisor Topologies', 'State Graphs']
      },
      {
        id: 'agt-03',
        num: 3,
        title: 'Advanced Retrieval-Augmented Generation',
        summary: 'Dense vector search, hybrid BM25 fusion, reranking models, chunking strategies, and hypothetical document embeddings (HyDE).',
        keyConcepts: ['Reciprocal Rank Fusion', 'Cross-Encoder Rerankers', 'Chunking Heuristics', 'Vector Indexes (HNSW)']
      }
    ]
  }
];

export function getPathBySlug(slug: string): LearningPath | undefined {
  return GARDEN_PATHS.find((p) => p.slug === slug || p.id === slug);
}
