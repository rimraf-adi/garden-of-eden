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
    id: 'machine-learning',
    slug: 'machine-learning',
    title: 'Machine Learning',
    folderTitle: 'Machine Learning',
    folderSubtitle: 'Alpaydın 2nd Ed.',
    folderGraphic: 'coral-brain',
    accentColor: {
      folderBg: '#f6d2cc', // Terracotta blush
      folderBorder: '#e8b5ac',
      folderText: '#6f2d24',
      tagBg: '#feebe7',
      chipBg: '#fad7d1',
    },
    bullets: [
      'Supervised learning & PAC framework',
      'Bayes decision theory & density estimation',
      'Kernel SVMs, MLPs & decision trees',
    ],
    stats: {
      modules: 19,
      lessons: 108,
      interactiveCount: 11,
    },
    href: '/chapter/01-introduction',
    description: 'Complete 19-chapter treatise on statistical learning theory, inductive bias, parametric/nonparametric estimation, dimensionality reduction, and kernel machines.',
    modules: [
      {
        id: 'ml-01',
        num: 1,
        title: 'Introduction & Inductive Bias',
        summary: 'Formulation of machine learning problems, hypothesis space capacity, and the no-free-lunch theorem.',
        keyConcepts: ['Inductive Bias', 'Hypothesis Space H', 'Underfitting vs Overfitting']
      },
      {
        id: 'ml-02',
        num: 2,
        title: 'Supervised Learning & PAC Bounds',
        summary: 'Probably Approximately Correct (PAC) learning bounds, VC dimension, and sample complexity.',
        keyConcepts: ['PAC Learning', 'VC Dimension', 'Sample Complexity Bound']
      },
      {
        id: 'ml-03',
        num: 3,
        title: 'Bayesian Decision Theory',
        summary: 'Prior, likelihood, posterior odds, 0/1 loss, and minimum risk decision surfaces.',
        keyConcepts: ['Bayes Formula', '0/1 Loss', 'Posterior Probability', 'Likelihood Ratio']
      },
      {
        id: 'ml-04',
        num: 4,
        title: 'Parametric Methods & MLE',
        summary: 'Maximum Likelihood and Bayesian parameter estimation for univariate and multivariate Gaussian densities.',
        keyConcepts: ['Maximum Likelihood', 'Gaussian MLE', 'Bias of Variance', 'Bias-Variance Dilemma']
      },
      {
        id: 'ml-05',
        num: 5,
        title: 'Multivariate Methods',
        summary: 'Multivariate normal distributions, Mahalanobis distance, covariance geometry, and classification.',
        keyConcepts: ['Mahalanobis Distance', 'Covariance Matrix', 'Discriminant Functions']
      },
      {
        id: 'ml-06',
        num: 6,
        title: 'Dimensionality Reduction & PCA',
        summary: 'Eigenvectors of sample covariance, Principal Component Analysis, Factor Analysis, and MDS.',
        keyConcepts: ['PCA Eigenvalues', 'Singular Value Decomposition', 'Variance Maximization']
      },
      {
        id: 'ml-07',
        num: 7,
        title: 'Clustering & Mixture Densities',
        summary: 'k-Means vector quantization and Expectation-Maximization (EM) for Gaussian mixture models.',
        keyConcepts: ['k-Means', 'EM Algorithm', 'Gaussian Mixture Models', 'Latent Variables']
      },
      {
        id: 'ml-08',
        num: 8,
        title: 'Nonparametric Methods',
        summary: 'Histogram estimators, Parzen kernel windows, and k-Nearest Neighbor density estimation.',
        keyConcepts: ['Parzen Window', 'k-NN Classifier', 'Kernel Bandwidth']
      },
      {
        id: 'ml-09',
        num: 9,
        title: 'Decision Trees & Information Gain',
        summary: 'Hierarchical axis-aligned partitioning, entropy reduction, ID3/C4.5, and post-pruning.',
        keyConcepts: ['Shannon Entropy', 'Information Gain', 'Impurity Measures', 'Pruning']
      },
      {
        id: 'ml-10',
        num: 10,
        title: 'Linear Discrimination & Logistic Regression',
        summary: 'Hyperplanes, logistic sigmoid, softmax multiclass discriminants, and gradient descent.',
        keyConcepts: ['Logistic Sigmoid', 'Cross-Entropy Loss', 'Gradient Descent', 'Softmax']
      },
      {
        id: 'ml-11',
        num: 11,
        title: 'Multilayer Perceptrons & Backpropagation',
        summary: 'Feedforward neural architectures, chain rule error propagation, and regularization.',
        keyConcepts: ['Backpropagation', 'Hidden Units', 'Weight Decay', 'Vanishing Gradients']
      },
      {
        id: 'ml-13',
        num: 13,
        title: 'Kernel Machines & Dual SVMs',
        summary: 'Maximum-margin hyperplanes, dual Lagrangian formulation, and Mercer kernel trick.',
        keyConcepts: ['Support Vectors', 'Mercer Kernels', 'KKT Conditions', 'Slack Variables']
      },
      {
        id: 'ml-18',
        num: 18,
        title: 'Reinforcement Learning & Q-Learning',
        summary: 'Markov decision processes, Bellman optimality equations, and temporal difference learning.',
        keyConcepts: ['Bellman Equation', 'Q-Learning', 'Policy Iteration', 'Temporal Difference']
      }
    ]
  },
  {
    id: 'deep-learning',
    slug: 'deep-learning',
    title: 'Deep Learning',
    folderTitle: 'Deep Learning',
    folderSubtitle: 'Architectures & Scales',
    folderGraphic: 'coral-brain',
    accentColor: {
      folderBg: '#fce3b8', // Warm Apricot
      folderBorder: '#ecc892',
      folderText: '#6f420e',
      tagBg: '#fff2db',
      chipBg: '#fae3bc',
    },
    bullets: [
      'Self-attention & Transformer mechanics',
      'Modern optimizers (AdamW, Lion) & scaling laws',
      'Diffusion models, VAEs & flow matching',
    ],
    stats: {
      modules: 14,
      lessons: 92,
      interactiveCount: 8,
    },
    href: '/paths/deep-learning',
    description: 'Modern deep representation learning: from convolution and self-attention to transformer scaling laws, residual connections, normalization layers, and diffusion generation.',
    modules: [
      {
        id: 'dl-01',
        num: 1,
        title: 'Modern Neural Foundations & Tensor Operations',
        summary: 'Automatic differentiation graphs, tensor contraction, matrix calculus for neural layers.',
        keyConcepts: ['Reverse-Mode Autodiff', 'Computational Graphs', 'Jacobian-Vector Products']
      },
      {
        id: 'dl-02',
        num: 2,
        title: 'Normalization, Residuals & Initialization',
        summary: 'Batch Normalization, LayerNorm, RMSNorm, He/Xavier initialization, and skip residual pathways.',
        keyConcepts: ['RMSNorm', 'LayerNorm', 'ResNet Skips', 'Vanishing/Exploding Gradients']
      },
      {
        id: 'dl-03',
        num: 3,
        title: 'The Transformer & Scaled Dot-Product Attention',
        summary: 'Query-Key-Value matrices, multi-head attention, rotary positional embeddings (RoPE), and KV caching.',
        keyConcepts: ['Softmax Attention', 'RoPE Embeddings', 'Multi-Head Projection', 'KV Cache']
      },
      {
        id: 'dl-04',
        num: 4,
        title: 'Generative Modeling: Diffusion & Flow Matching',
        summary: 'Forward SDE noise schedules, reverse denoising diffusion probabilistic models (DDPM), and velocity flow matching.',
        keyConcepts: ['Score Matching', 'Denoising Diffusion', 'Langevin Dynamics', 'Flow Matching']
      }
    ]
  },
  {
    id: 'system-design',
    slug: 'system-design',
    title: 'System Design in Depth',
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
      'Distributed consensus: Raft & Paxos',
      'Consistent hashing & partition sharding',
      'LSM-Trees vs B-Trees storage engines',
    ],
    stats: {
      modules: 18,
      lessons: 120,
      interactiveCount: 9,
    },
    href: '/paths/system-design',
    description: 'Architecting scalable, resilient distributed systems: consensus algorithms, replication topologies, database storage engines, cache hierarchies, and high-throughput pipelines.',
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
        title: 'Partitioning & Consistent Hashing',
        summary: 'Virtual nodes, Dynamo-style partition rings, gossip protocols, and replication factors.',
        keyConcepts: ['Consistent Hashing', 'Virtual Nodes', 'Gossip Protocol', 'Vector Clocks']
      },
      {
        id: 'sys-04',
        num: 4,
        title: 'Message Streaming & Event Brokers',
        summary: 'Distributed commit logs, offset management, consumer groups, partition skew, and zero-copy transfer.',
        keyConcepts: ['Kafka Commit Log', 'Consumer Groups', 'Zero-Copy OS', 'Exactly-Once Semantics']
      }
    ]
  },
  {
    id: 'statistics-probability',
    slug: 'statistics-probability',
    title: 'Statistics & Probability',
    folderTitle: 'Statistics & Probability',
    folderSubtitle: 'Foundations & Inference',
    folderGraphic: 'entropy-waves',
    accentColor: {
      folderBg: '#fbe28e', // Ochre Tuscan yellow
      folderBorder: '#ebcd69',
      folderText: '#684d07',
      tagBg: '#fef5d0',
      chipBg: '#fce9a5',
    },
    bullets: [
      'Probability spaces, measure & distributions',
      'Bayesian conjugate priors & posterior inference',
      'Hypothesis testing, p-values & ANOVA',
    ],
    stats: {
      modules: 16,
      lessons: 114,
      interactiveCount: 7,
    },
    href: '/paths/statistics-probability',
    description: 'Rigorous foundation of probability spaces, random variables, expectation, standard distributions, central limit theorem, and frequentist vs. Bayesian inference.',
    modules: [
      {
        id: 'stat-01',
        num: 1,
        title: 'Probability Spaces & Axioms',
        summary: 'Sample spaces, Kolmogorov axioms, conditional probability, and independence.',
        keyConcepts: ['Kolmogorov Axioms', 'Conditional Probability', 'Law of Total Probability']
      },
      {
        id: 'stat-02',
        num: 2,
        title: 'Random Variables & Expectation',
        summary: 'PDFs, CDFs, moments, variance, covariance, and moment-generating functions.',
        keyConcepts: ['Expectation Operator', 'Covariance', 'Jensen Inequality', 'MGFs']
      },
      {
        id: 'stat-03',
        num: 3,
        title: 'Parametric Distributions & Conjugacy',
        summary: 'Gaussian, Beta, Dirichlet, Gamma, Poisson, and exponential family conjugates.',
        keyConcepts: ['Exponential Family', 'Conjugate Priors', 'Dirichlet Distribution', 'Beta-Binomial']
      },
      {
        id: 'stat-04',
        num: 4,
        title: 'Hypothesis Testing & Asymptotics',
        summary: 'Central Limit Theorem, paired t-tests, Neyman-Pearson lemma, and confidence intervals.',
        keyConcepts: ['Central Limit Theorem', 'Student t-Test', 'Type I/II Error', 'p-Values']
      }
    ]
  },
  {
    id: 'information-theory',
    slug: 'information-theory',
    title: 'Information Theory',
    folderTitle: 'Information Theory',
    folderSubtitle: 'Entropy & Coding',
    folderGraphic: 'network-graph',
    accentColor: {
      folderBg: '#b9cfea', // Slate steel blue
      folderBorder: '#99b6d8',
      folderText: '#1c3e66',
      tagBg: '#e6f0fa',
      chipBg: '#c8dcfa',
    },
    bullets: [
      'Shannon entropy & source coding theorem',
      'Kullback-Leibler divergence & mutual information',
      'Channel capacity & noisy coding theorem',
    ],
    stats: {
      modules: 12,
      lessons: 80,
      interactiveCount: 6,
    },
    href: '/paths/information-theory',
    description: 'Claude Shannon’s mathematical theory of communication: entropy, differential entropy, data processing inequality, channel capacity, rate-distortion theory, and compression.',
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
        summary: 'KL divergence D(P || Q), Jensen-Shannon divergence, and mutual information I(X; Y).',
        keyConcepts: ['Kullback-Leibler Divergence', 'Mutual Information', 'Data Processing Inequality']
      },
      {
        id: 'inf-03',
        num: 3,
        title: 'Channel Capacity & Noisy Coding',
        summary: 'Binary Symmetric Channels, Shannon channel capacity theorem, and error-correcting codes.',
        keyConcepts: ['Channel Capacity C', 'BSC Channel', 'Noisy Channel Coding Theorem']
      }
    ]
  },
  {
    id: 'linear-algebra',
    slug: 'linear-algebra',
    title: 'Linear Algebra for Machine Learning',
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
      'Singular Value Decomposition (SVD) & pseudo-inverses',
    ],
    stats: {
      modules: 14,
      lessons: 95,
      interactiveCount: 8,
    },
    href: '/paths/linear-algebra',
    description: 'Geometric and computational linear algebra tailored for machine learning: matrix decompositions, positive semi-definite cones, low-rank approximations, and spectral graph theory.',
    modules: [
      {
        id: 'la-01',
        num: 1,
        title: 'Vector Spaces & Orthogonality',
        summary: 'Linear independence, basis, dimension, Gram-Schmidt orthogonalization, and projection matrices.',
        keyConcepts: ['Orthogonal Projection', 'Gram-Schmidt', 'Four Fundamental Subspaces']
      },
      {
        id: 'la-02',
        num: 2,
        title: 'Eigenvalues & Spectral Theorem',
        summary: 'Characteristic polynomials, symmetric matrices, orthogonal diagonalization, and quadratic forms.',
        keyConcepts: ['Spectral Theorem', 'Positive Definite Matrices', 'Rayleigh Quotient']
      },
      {
        id: 'la-03',
        num: 3,
        title: 'Singular Value Decomposition (SVD)',
        summary: 'Geometric interpretation, compact SVD, Moore-Penrose pseudoinverse, and Eckart-Young-Mirsky low-rank theorem.',
        keyConcepts: ['SVD Decomposition', 'Pseudoinverse', 'Eckart-Young Theorem', 'Condition Number']
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
      folderBg: '#b8e3db', // Mint cyan
      folderBorder: '#9bd1c7',
      folderText: '#135449',
      tagBg: '#e4f7f4',
      chipBg: '#caf0ea',
    },
    bullets: [
      'Gradients, Jacobians & Hessian curvature matrices',
      'Convex optimization & Karush-Kuhn-Tucker (KKT)',
      'Subgradients & stochastic optimization geometry',
    ],
    stats: {
      modules: 12,
      lessons: 84,
      interactiveCount: 7,
    },
    href: '/paths/vector-calculus',
    description: 'Multivariable calculus, differential geometry, and optimization for gradient-based learning: directional derivatives, second-order curvature, Taylor expansions, and Lagrange multipliers.',
    modules: [
      {
        id: 'vc-01',
        num: 1,
        title: 'Directional Derivatives & The Gradient',
        summary: 'Total derivatives, gradient vectors, steepest ascent directions, and tangent hyperplanes.',
        keyConcepts: ['Gradient Operator', 'Directional Derivative', 'Tangent Space']
      },
      {
        id: 'vc-02',
        num: 2,
        title: 'Jacobians & Hessians',
        summary: 'Vector-valued functions, Jacobian matrix of transformations, Hessian curvature, and convexity tests.',
        keyConcepts: ['Jacobian Matrix', 'Hessian Matrix', 'Curvature & Condition Number']
      },
      {
        id: 'vc-03',
        num: 3,
        title: 'Constrained Optimization & KKT Conditions',
        summary: 'Lagrangian duality, primal-dual optimality, active set inequalities, and complementary slackness.',
        keyConcepts: ['Lagrange Multipliers', 'KKT Conditions', 'Duality Gap', 'Slater Condition']
      }
    ]
  }
];

export function getPathBySlug(slug: string): LearningPath | undefined {
  return GARDEN_PATHS.find((p) => p.slug === slug || p.id === slug);
}
