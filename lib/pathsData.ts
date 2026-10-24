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
  {
    id: 'inference-engineering',
    slug: 'inference-engineering',
    title: 'Inference Engineering',
    folderTitle: 'Inference engineering',
    folderSubtitle: 'GPU & Latency Budgets',
    folderGraphic: 'network-graph',
    accentColor: {
      folderBg: '#b8cde4', // Slate steel blue
      folderBorder: '#99b6d8',
      folderText: '#1c3e66',
      tagBg: '#e6f0fa',
      chipBg: '#c8dcfa',
    },
    bullets: [
      'KV cache memory sizing & paged attention',
      'FlashAttention & GPU memory hierarchy math',
      'Quantization tradeoffs: FP8, AWQ, and GPTQ',
    ],
    stats: {
      modules: 16,
      lessons: 112,
      interactiveCount: 8,
    },
    href: '/paths/inference-engineering',
    description: 'Hardware-aware AI engineering: GPU memory bandwidth saturation, batching strategies, speculative decoding, kernel fusion, and production token economics.',
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
  {
    id: 'deep-learning',
    slug: 'deep-learning',
    title: 'Deep Learning & Foundation Models',
    folderTitle: 'AI Research',
    folderSubtitle: 'Architectures & Scales',
    folderGraphic: 'coral-brain',
    accentColor: {
      folderBg: '#f6d2cc', // Terracotta blush
      folderBorder: '#e8b5ac',
      folderText: '#6f2d24',
      tagBg: '#feebe7',
      chipBg: '#fad7d1',
    },
    bullets: [
      'Transformer mechanics & rotary embeddings',
      'Scaling laws, compute budgets & data regimes',
      'Diffusion models, VAEs & flow matching',
    ],
    stats: {
      modules: 18,
      lessons: 130,
      interactiveCount: 12,
    },
    href: '/paths/deep-learning',
    description: 'Frontier AI research and representation architectures: from scaled self-attention and mixture-of-experts (MoE) to diffusion SDEs and multimodal embeddings.',
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
  {
    id: 'system-design',
    slug: 'system-design',
    title: 'System Design & Distributed Infrastructure',
    folderTitle: 'SYSTEM design',
    folderSubtitle: 'Scale & Reliability',
    folderGraphic: 'system-lines',
    accentColor: {
      folderBg: '#c9dbc8', // Sage green
      folderBorder: '#a9c4a7',
      folderText: '#234921',
      tagBg: '#eaf4e9',
      chipBg: '#d0e5cf',
    },
    bullets: [
      'Distributed consensus: Raft & Paxos invariants',
      'Consistent hashing & partition sharding',
      'High-throughput message brokers & LSM storage',
    ],
    stats: {
      modules: 20,
      lessons: 140,
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
      'ReAct loops, planner-executor architectures',
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
  },
  {
    id: 'linear-algebra',
    slug: 'linear-algebra',
    title: 'Linear Algebra for AI',
    folderTitle: 'Linear Algebra',
    folderSubtitle: 'Spaces & Decompositions',
    folderGraphic: 'matrix-lattice',
    accentColor: {
      folderBg: '#d7c7e9', // Lavender lilac
      folderBorder: '#bca8d6',
      folderText: '#46276b',
      tagBg: '#f2ecfa',
      chipBg: '#e3d7f4',
    },
    bullets: [
      'Vector spaces, null spaces & orthogonal projections',
      'Eigenvalues, spectral theorem & Rayleigh quotients',
      'Singular Value Decomposition (SVD) & low-rank tensors',
    ],
    stats: {
      modules: 14,
      lessons: 95,
      interactiveCount: 8,
    },
    href: '/paths/linear-algebra',
    description: 'Geometric and computational linear algebra for intelligence: matrix factorizations, positive semi-definite geometry, low-rank approximations, and high-dimensional spaces.',
    modules: [
      {
        id: 'la-01',
        num: 1,
        title: 'Vector Spaces & Orthogonal Projections',
        summary: 'Subspaces, null spaces, Gram-Schmidt orthogonalization, and projection matrices.',
        keyConcepts: ['Orthogonal Projection', 'Four Fundamental Subspaces', 'Gram-Schmidt']
      },
      {
        id: 'la-02',
        num: 2,
        title: 'Eigenvalues & Spectral Decomposition',
        summary: 'Symmetric matrices, orthogonal diagonalization, Rayleigh quotients, and quadratic forms.',
        keyConcepts: ['Spectral Theorem', 'Positive Semi-Definite Cones', 'Rayleigh Quotient']
      },
      {
        id: 'la-03',
        num: 3,
        title: 'Singular Value Decomposition (SVD)',
        summary: 'Compact SVD, pseudoinverses, condition numbers, and low-rank Eckart-Young theorem.',
        keyConcepts: ['SVD Decomposition', 'Pseudoinverse', 'Eckart-Young Theorem']
      }
    ]
  },
  {
    id: 'vector-calculus',
    slug: 'vector-calculus',
    title: 'Vector Calculus & Optimization',
    folderTitle: 'Vector Calculus',
    folderSubtitle: 'Gradients & Manifolds',
    folderGraphic: 'calculus-surface',
    accentColor: {
      folderBg: '#fce3b8', // Warm Apricot
      folderBorder: '#ecc892',
      folderText: '#6f420e',
      tagBg: '#fff2db',
      chipBg: '#fae3bc',
    },
    bullets: [
      'Directional derivatives, Jacobians & Hessian curvature',
      'Convex optimization & Karush-Kuhn-Tucker (KKT) duality',
      'Stochastic gradient geometry & momentum dynamics',
    ],
    stats: {
      modules: 12,
      lessons: 84,
      interactiveCount: 7,
    },
    href: '/paths/vector-calculus',
    description: 'Multivariable calculus and optimization theory: directional derivatives, second-order curvature, Taylor expansions, Lagrangian duality, and stochastic dynamics.',
    modules: [
      {
        id: 'vc-01',
        num: 1,
        title: 'Gradients & Directional Derivatives',
        summary: 'Gradient vector fields, steepest ascent paths, and tangent hyperplanes.',
        keyConcepts: ['Gradient Operator', 'Directional Derivatives', 'Tangent Hyperplanes']
      },
      {
        id: 'vc-02',
        num: 2,
        title: 'Jacobians & Hessians',
        summary: 'Vector-valued functions, Jacobian matrix of layers, Hessian curvature, and condition numbers.',
        keyConcepts: ['Jacobian Matrix', 'Hessian Curvature', 'Conditioning']
      },
      {
        id: 'vc-03',
        num: 3,
        title: 'Constrained Optimization & KKT Duality',
        summary: 'Lagrangian multipliers, primal-dual optimality, and complementary slackness.',
        keyConcepts: ['Lagrangian Multipliers', 'KKT Conditions', 'Duality Gap']
      }
    ]
  },
  {
    id: 'information-theory',
    slug: 'information-theory',
    title: 'Information Theory & Probability',
    folderTitle: 'Information Theory',
    folderSubtitle: 'Entropy & Uncertainty',
    folderGraphic: 'entropy-waves',
    accentColor: {
      folderBg: '#fbe28e', // Ochre Tuscan yellow
      folderBorder: '#ebcd69',
      folderText: '#684d07',
      tagBg: '#fef5d0',
      chipBg: '#fce9a5',
    },
    bullets: [
      'Shannon entropy & source coding limits',
      'Kullback-Leibler divergence & mutual information',
      'Probability spaces, measure & conjugate inference',
    ],
    stats: {
      modules: 16,
      lessons: 110,
      interactiveCount: 8,
    },
    href: '/paths/information-theory',
    description: 'The mathematical foundation of communication, uncertainty, and learning: entropy, relative entropy, mutual information, channel capacity, and Bayesian inference.',
    modules: [
      {
        id: 'inf-01',
        num: 1,
        title: 'Entropy & Information Content',
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
        summary: 'Shannon channel capacity theorem, continuous Gaussian channels, and rate-distortion theory.',
        keyConcepts: ['Channel Capacity C', 'Shannon Noisy Coding', 'Rate Distortion']
      }
    ]
  },
  {
    id: 'statistical-learning',
    slug: 'statistical-learning',
    title: 'Statistical Learning Theory',
    folderTitle: 'Learning Theory',
    folderSubtitle: '19 Foundational Modules',
    folderGraphic: 'math-torus',
    accentColor: {
      folderBg: '#d0e5cf', // Minty sage
      folderBorder: '#b3d1b1',
      folderText: '#1f481c',
      tagBg: '#ebf6ea',
      chipBg: '#d8edd7',
    },
    bullets: [
      'PAC bounds, VC dimension & sample complexity',
      'Bayesian decision surfaces & Gaussian estimation',
      'Dual kernel SVMs, MLPs & reinforcement MDPs',
    ],
    stats: {
      modules: 19,
      lessons: 108,
      interactiveCount: 11,
    },
    href: '/chapter/01-introduction',
    description: 'Complete 19-chapter foundational treatise on statistical learning theory, inductive bias, parametric/nonparametric estimation, dimensionality reduction, and kernel machines.',
    modules: [
      {
        id: 'sl-01',
        num: 1,
        title: 'Introduction & Inductive Bias',
        summary: 'Hypothesis capacity, PAC bounds, and the no-free-lunch theorem.',
        keyConcepts: ['Inductive Bias', 'Hypothesis Space H', 'VC Dimension']
      },
      {
        id: 'sl-03',
        num: 3,
        title: 'Bayesian Decision Theory',
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
  }
];

export function getPathBySlug(slug: string): LearningPath | undefined {
  return GARDEN_PATHS.find((p) => p.slug === slug || p.id === slug);
}
