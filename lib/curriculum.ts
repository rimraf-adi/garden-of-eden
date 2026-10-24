export interface CurriculumPhase {
  id: string;
  code: string;
  name: string;
  description: string;
  order: number;
  color: string;
  modules: CurriculumModule[];
}

export interface CurriculumModule {
  id: string;
  num: number;
  slug: string;
  title: string;
  tagline: string;
  phaseId: string;
  phaseName: string;
  order: number;
  level: 'Foundational' | 'Core' | 'Advanced' | 'Mastery';
  estimatedHours: number;
  prerequisites: string[]; // ids of prerequisite modules
  coreEquations: string[];
  keyConcepts: string[];
  href: string;
}

export const CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    id: 'phase-01-math',
    code: 'PHASE-01',
    name: 'Mathematics for Intelligence',
    description: 'First-principles linear algebra, vector calculus, continuous probability, and Shannon information theory.',
    order: 1,
    color: '#8b5cf6', // Violet
    modules: [
      {
        id: 'mod-la',
        num: 1,
        slug: 'linear-algebra',
        title: 'Linear Algebra & High-Dimensional Geometry',
        tagline: 'Vector spaces, orthogonal projections, spectral decompositions, and Singular Value Decomposition (SVD).',
        phaseId: 'phase-01-math',
        phaseName: 'Mathematics for Intelligence',
        order: 1,
        level: 'Foundational',
        estimatedHours: 4.0,
        prerequisites: [],
        coreEquations: ['A = U \\Sigma V^T', 'A v = \\lambda v', 'P = A(A^T A)^{-1} A^T'],
        keyConcepts: ['Vector Spaces', 'Spectral Theorem', 'Singular Value Decomposition (SVD)', 'Rayleigh Quotient'],
        href: '/paths/linear-algebra'
      },
      {
        id: 'mod-vc',
        num: 2,
        slug: 'vector-calculus',
        title: 'Vector Calculus & Multivariable Optimization',
        tagline: 'Total derivatives, Jacobians, Hessian curvature, Taylor series, and constrained Lagrangian duality.',
        phaseId: 'phase-01-math',
        phaseName: 'Mathematics for Intelligence',
        order: 2,
        level: 'Foundational',
        estimatedHours: 4.0,
        prerequisites: ['mod-la'],
        coreEquations: ['\\nabla f(x)', 'J_{ij} = \\frac{\\partial f_i}{\\partial x_j}', 'H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}'],
        keyConcepts: ['Directional Derivatives', 'Jacobian Matrix', 'Hessian Curvature', 'KKT Conditions'],
        href: '/paths/vector-calculus'
      },
      {
        id: 'mod-prob',
        num: 3,
        slug: 'probability-statistics',
        title: 'Probability Theory & Asymptotics',
        tagline: 'Kolmogorov axioms, continuous distributions, expectation operators, and Central Limit asymptotics.',
        phaseId: 'phase-01-math',
        phaseName: 'Mathematics for Intelligence',
        order: 3,
        level: 'Foundational',
        estimatedHours: 3.5,
        prerequisites: ['mod-vc'],
        coreEquations: ['P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B)}', '\\mathbb{E}[X] = \\int x p(x) dx', '\\text{Var}(X) = \\mathbb{E}[(X - \\mu)^2]'],
        keyConcepts: ['Sample Spaces', 'Conjugate Priors', 'Central Limit Theorem', 'Maximum Likelihood'],
        href: '/appendix'
      },
      {
        id: 'mod-it',
        num: 4,
        slug: 'information-theory',
        title: 'Information Theory & Uncertainty',
        tagline: 'Shannon entropy, Kullback-Leibler divergence, mutual information, and channel capacity limits.',
        phaseId: 'phase-01-math',
        phaseName: 'Mathematics for Intelligence',
        order: 4,
        level: 'Core',
        estimatedHours: 3.5,
        prerequisites: ['mod-prob'],
        coreEquations: ['H(X) = -\\sum p(x) \\log_2 p(x)', 'D_{KL}(P \\parallel Q) = \\sum p(x) \\log \\frac{p(x)}{q(x)}', 'I(X; Y) = H(X) - H(X \\mid Y)'],
        keyConcepts: ['Shannon Entropy', 'Relative Entropy (KL)', 'Mutual Information', 'Channel Capacity C'],
        href: '/paths/information-theory'
      }
    ]
  },
  {
    id: 'phase-02-ml',
    code: 'PHASE-02',
    name: 'Statistical Learning Theory',
    description: 'Mathematical formulation of inductive bias, PAC learning bounds, density estimation, and maximum-margin kernel methods.',
    order: 2,
    color: '#06b6d4', // Cyan
    modules: [
      {
        id: 'mod-01-intro',
        num: 5,
        slug: '01-introduction',
        title: 'Inductive Bias & Learning Paradigms',
        tagline: 'Formulation of machine learning problems, hypothesis capacity, and the necessity of inductive bias.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 5,
        level: 'Foundational',
        estimatedHours: 2.5,
        prerequisites: ['mod-prob'],
        coreEquations: ['\\mathcal{H} \\subset \\mathcal{U}', 'y = f(x; \\theta)'],
        keyConcepts: ['Inductive Bias', 'Generalization', 'Underfitting vs Overfitting'],
        href: '/chapter/01-introduction'
      },
      {
        id: 'mod-02-pac',
        num: 6,
        slug: '02-supervised-learning',
        title: 'Supervised Learning & PAC Bounds',
        tagline: 'Probably Approximately Correct (PAC) sample complexity bounds, VC dimension, and version spaces.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 6,
        level: 'Core',
        estimatedHours: 3.0,
        prerequisites: ['mod-01-intro'],
        coreEquations: ['N \\ge \\frac{1}{\\epsilon} \\left( \\ln |\\mathcal{H}| + \\ln \\frac{1}{\\delta} \\right)', '2\\rho = \\min_t d(x^t, h)'],
        keyConcepts: ['PAC Learning', 'VC Dimension', 'Sample Complexity Bound', 'Version Space'],
        href: '/chapter/02-supervised-learning'
      },
      {
        id: 'mod-03-bayes',
        num: 7,
        slug: '03-bayesian-decision-theory',
        title: 'Bayesian Decision Theory & 0/1 Loss',
        tagline: 'Posterior odds, minimum expected risk classification, utility theory, and reject options.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 7,
        level: 'Core',
        estimatedHours: 3.0,
        prerequisites: ['mod-02-pac'],
        coreEquations: ['P(C_i \\mid x) = \\frac{p(x \\mid C_i)P(C_i)}{p(x)}', 'R(\\alpha_i \\mid x) = \\sum_{k=1}^K \\lambda_{ik} P(C_k \\mid x)'],
        keyConcepts: ['Bayes Optimal Rule', '0/1 Risk Formulation', 'Likelihood Ratio Test', 'Doubt / Reject Threshold'],
        href: '/chapter/03-bayesian-decision-theory'
      },
      {
        id: 'mod-04-param',
        num: 8,
        slug: '04-parametric-methods',
        title: 'Parametric Methods & Gaussian MLE',
        tagline: 'Maximum Likelihood and Bayesian estimation, bias of variance estimators, and the bias-variance dilemma.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 8,
        level: 'Core',
        estimatedHours: 3.5,
        prerequisites: ['mod-03-bayes'],
        coreEquations: ['\\hat{\\mu} = \\frac{1}{N}\\sum x^t', '\\mathbb{E}[\\hat{\\sigma}^2] = \\frac{N-1}{N}\\sigma^2', 'E[(r - g(x))^2] = \\text{Bias}^2 + \\text{Variance} + \\sigma^2'],
        keyConcepts: ['Maximum Likelihood', 'Estimator Bias', 'Bias-Variance Decomposition', 'Bayesian Conjugacy'],
        href: '/chapter/04-parametric-methods'
      },
      {
        id: 'mod-06-pca',
        num: 9,
        slug: '06-dimensionality-reduction',
        title: 'Dimensionality Reduction & PCA',
        tagline: 'Sample covariance eigenvectors, variance maximization, Factor Analysis, and linear projections.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 9,
        level: 'Advanced',
        estimatedHours: 3.5,
        prerequisites: ['mod-la', 'mod-04-param'],
        coreEquations: ['\\mathbf{\\Sigma} w_1 = \\alpha w_1', '\\text{Var}(z_1) = w_1^T \\mathbf{\\Sigma} w_1 = \\lambda_1'],
        keyConcepts: ['Principal Component Analysis', 'Covariance Eigenvalues', 'Low-Rank Reconstruction', 'Fisher LDA'],
        href: '/chapter/06-dimensionality-reduction'
      },
      {
        id: 'mod-07-cluster',
        num: 10,
        slug: '07-clustering',
        title: 'Clustering & Expectation-Maximization',
        tagline: 'k-Means vector quantization and Expectation-Maximization (EM) for Gaussian mixture densities.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 10,
        level: 'Core',
        estimatedHours: 3.0,
        prerequisites: ['mod-04-param'],
        coreEquations: ['h_{ik} = \\frac{p(x^k \\mid G_i)P(G_i)}{\\sum_j p(x^k \\mid G_j)P(G_j)}', 'm_i = \\frac{\\sum_t h_{ik} x^t}{\\sum_t h_{ik}}'],
        keyConcepts: ['k-Means', 'Expectation-Maximization (EM)', 'Gaussian Mixture Models', 'Soft Assignment'],
        href: '/chapter/07-clustering'
      },
      {
        id: 'mod-10-linear',
        num: 11,
        slug: '10-linear-discrimination',
        title: 'Linear Discrimination & Logistic Boundaries',
        tagline: 'Separating hyperplanes, logistic sigmoid outputs, cross-entropy loss, and gradient optimization.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 11,
        level: 'Core',
        estimatedHours: 3.0,
        prerequisites: ['mod-vc', 'mod-03-bayes'],
        coreEquations: ['y = \\frac{1}{1 + e^{-w^T x}}', '\\nabla_w E = -\\sum (r^t - y^t) x^t', 'w_{t+1} = w_t + \\eta \\sum (r^t - y^t) x^t'],
        keyConcepts: ['Cross-Entropy Loss', 'Logistic Sigmoid', 'Gradient Descent Updates', 'Softmax Multiclass'],
        href: '/chapter/10-linear-discrimination'
      },
      {
        id: 'mod-13-svm',
        num: 12,
        slug: '13-kernel-machines',
        title: 'Kernel Machines & Dual Support Vectors',
        tagline: 'Maximum-margin hyperplanes, dual Lagrangian formulation, Karush-Kuhn-Tucker conditions, and Mercer kernels.',
        phaseId: 'phase-02-ml',
        phaseName: 'Statistical Learning Theory',
        order: 12,
        level: 'Advanced',
        estimatedHours: 4.0,
        prerequisites: ['mod-vc', 'mod-10-linear'],
        coreEquations: ['\\max_\\alpha \\sum \\alpha^t - \\frac{1}{2}\\sum \\alpha^t \\alpha^s r^t r^s K(x^t, x^s)', 'w = \\sum \\alpha^t r^t x^t', '\\alpha^t [r^t (w^T x^t + w_0) - 1] = 0'],
        keyConcepts: ['Support Vector Machine', 'Margin Corridor 2/||w||', 'KKT Complementary Slackness', 'Mercer Kernel Trick'],
        href: '/chapter/13-kernel-machines'
      }
    ]
  },
  {
    id: 'phase-03-dl',
    code: 'PHASE-03',
    name: 'Deep Learning & Foundation Architectures',
    description: 'Reverse-mode automatic differentiation, transformer self-attention geometry, compute scaling laws, and continuous diffusion.',
    order: 3,
    color: '#f59e0b', // Amber
    modules: [
      {
        id: 'mod-11-mlp',
        num: 13,
        slug: '11-multilayer-perceptrons',
        title: 'Multilayer Perceptrons & Backpropagation',
        tagline: 'Feedforward neural layers, hidden delta sensitivities, reverse-mode autodiff, and weight regularization.',
        phaseId: 'phase-03-dl',
        phaseName: 'Deep Learning & Foundation Architectures',
        order: 13,
        level: 'Core',
        estimatedHours: 3.5,
        prerequisites: ['mod-10-linear'],
        coreEquations: ['\\delta_h = \\left( \\sum_i \\delta_i v_{ih} \\right) z_h (1 - z_h)', '\\Delta w_{hj} = \\eta \\delta_h x_j'],
        keyConcepts: ['Reverse-Mode Autodiff', 'Backpropagation Delta Rule', 'Hidden Representations', 'Vanishing Gradients'],
        href: '/chapter/11-multilayer-perceptrons'
      },
      {
        id: 'mod-dl-attn',
        num: 14,
        slug: 'deep-learning',
        title: 'The Transformer & Self-Attention Geometry',
        tagline: 'Query-Key-Value projection matrices, scaled dot-product attention, Rotary Position Embeddings (RoPE), and GQA.',
        phaseId: 'phase-03-dl',
        phaseName: 'Deep Learning & Foundation Architectures',
        order: 14,
        level: 'Advanced',
        estimatedHours: 4.5,
        prerequisites: ['mod-11-mlp', 'mod-la'],
        coreEquations: ['\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V', 'R_{\\Theta, m}^d = \\text{diag}(R_{\\theta_1, m}, \\dots, R_{\\theta_{d/2}, m})'],
        keyConcepts: ['Scaled Dot-Product Attention', 'Rotary Position Embeddings (RoPE)', 'Grouped-Query Attention (GQA)', 'RMSNorm & ResNet Skips'],
        href: '/paths/deep-learning'
      },
      {
        id: 'mod-dl-scaling',
        num: 15,
        slug: 'compute-scaling',
        title: 'Compute Scaling Laws & Mixture of Experts',
        tagline: 'Chinchilla compute optimality C = 6ND, empirical loss scaling equations, and sparse MoE gating routers.',
        phaseId: 'phase-03-dl',
        phaseName: 'Deep Learning & Foundation Architectures',
        order: 15,
        level: 'Mastery',
        estimatedHours: 4.0,
        prerequisites: ['mod-dl-attn'],
        coreEquations: ['C \\approx 6ND', 'L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta}', 'y = \\sum_{i \\in \\text{TopK}} g_i(x) E_i(x)'],
        keyConcepts: ['Chinchilla Optimal Ratio', 'Power-Law Exponents', 'Sparse Gated MoE', 'Auxiliary Routing Loss'],
        href: '/paths/deep-learning'
      },
      {
        id: 'mod-dl-diffusion',
        num: 16,
        slug: 'diffusion-models',
        title: 'Continuous Diffusion & Flow Matching',
        tagline: 'Score-based continuous SDE noise schedules, reverse denoising diffusion (DDPM), and vector field matching.',
        phaseId: 'phase-03-dl',
        phaseName: 'Deep Learning & Foundation Architectures',
        order: 16,
        level: 'Mastery',
        estimatedHours: 4.5,
        prerequisites: ['mod-prob', 'mod-vc'],
        coreEquations: ['dx = f(x, t)dt + g(t)dw', '\\nabla_x \\log p_t(x)', 'L_{\\text{FM}}(\\theta) = \\mathbb{E}_{t, x_0, x_1}[\\| v_\\theta(x_t, t) - (x_1 - x_0) \\|^2]'],
        keyConcepts: ['Score Matching', 'Probability Flow ODE', 'Denoising Diffusion (DDPM)', 'Flow Matching'],
        href: '/paths/deep-learning'
      }
    ]
  },
  {
    id: 'phase-04-systems',
    code: 'PHASE-04',
    name: 'Hardware-Aware Inference & Systems Engineering',
    description: 'GPU memory hierarchy arithmetic intensity, KV cache virtual paging, FlashAttention tiling, and quantization economics.',
    order: 4,
    color: '#10b981', // Emerald
    modules: [
      {
        id: 'mod-sys-gpu',
        num: 17,
        slug: 'inference-engineering',
        title: 'GPU Memory Hierarchy & Roofline Analysis',
        tagline: 'HBM vs SRAM bandwidth saturation, arithmetic intensity, memory-bound vs compute-bound regimes, and tensor cores.',
        phaseId: 'phase-04-systems',
        phaseName: 'Hardware-Aware Inference & Systems Engineering',
        order: 17,
        level: 'Core',
        estimatedHours: 4.0,
        prerequisites: ['mod-dl-attn'],
        coreEquations: ['\\text{Intensity} = \\frac{\\text{FLOPs}}{\\text{Bytes Transferred}}', 'T = \\max\\left( \\frac{\\text{FLOPs}}{\\text{Peak Compute}}, \\frac{\\text{Bytes}}{\\text{Peak Bandwidth}} \\right)'],
        keyConcepts: ['Roofline Model', 'Memory Bandwidth Saturation', 'HBM3 vs SRAM Registers', 'Kernel Fusion'],
        href: '/paths/inference-engineering'
      },
      {
        id: 'mod-sys-kv',
        num: 18,
        slug: 'kv-cache-paging',
        title: 'KV Cache Sizing & FlashAttention Tiling',
        tagline: 'Token state memory equations, PagedAttention virtual memory mapping, and IO-aware SRAM block tiling.',
        phaseId: 'phase-04-systems',
        phaseName: 'Hardware-Aware Inference & Systems Engineering',
        order: 18,
        level: 'Advanced',
        estimatedHours: 4.5,
        prerequisites: ['mod-sys-gpu'],
        coreEquations: ['\\text{Memory}_{KV} = 2 \\times b \\times s \\times l \\times h \\times d \\times \\text{bytes}', 'IO = O\\left(\\frac{N^2 d}{M}\\right)'],
        keyConcepts: ['KV Cache Formula', 'PagedAttention', 'Online Softmax Normalization', 'SRAM Tiling Blocks'],
        href: '/paths/inference-engineering'
      },
      {
        id: 'mod-sys-quant',
        num: 19,
        slug: 'quantization-ptq',
        title: 'Post-Training Quantization (FP8, AWQ, GPTQ)',
        tagline: 'Weight-only vs weight-activation quantization, outlier channel protection, second-order Hessian error, and latency budgets.',
        phaseId: 'phase-04-systems',
        phaseName: 'Hardware-Aware Inference & Systems Engineering',
        order: 19,
        level: 'Advanced',
        estimatedHours: 3.5,
        prerequisites: ['mod-sys-gpu'],
        coreEquations: ['X_q = \\text{round}\\left(\\frac{X}{S}\\right) + Z', '\\arg\\min_W \\| W X - \\hat{W} X \\|_2^2'],
        keyConcepts: ['FP8 (E4M3 / E5M2)', 'AWQ Activation Awareness', 'GPTQ Second-Order Hessian', 'Channel Outliers'],
        href: '/paths/inference-engineering'
      }
    ]
  },
  {
    id: 'phase-05-infra',
    code: 'PHASE-05',
    name: 'Distributed Infrastructure & Cluster Scale',
    description: 'Consensus invariants, cluster partitioning, database storage engines, and multi-GPU training parallelisms.',
    order: 5,
    color: '#3b82f6', // Blue
    modules: [
      {
        id: 'mod-inf-consensus',
        num: 20,
        slug: 'system-design',
        title: 'Distributed Consensus: Raft & Paxos',
        tagline: 'Leader election, quorum replication, log matching invariants, split-brain protection, and state machine safety.',
        phaseId: 'phase-05-infra',
        phaseName: 'Distributed Infrastructure & Cluster Scale',
        order: 20,
        level: 'Advanced',
        estimatedHours: 4.5,
        prerequisites: [],
        coreEquations: ['Q = \\lfloor N / 2 \\rfloor + 1', '\\text{Term}_{current} > \\text{Term}_{candidate}'],
        keyConcepts: ['Raft Consensus', 'Quorum Majorities', 'Log Replication Safety', 'Split-Brain Invariants'],
        href: '/paths/system-design'
      },
      {
        id: 'mod-inf-storage',
        num: 21,
        slug: 'storage-engines',
        title: 'Storage Engines & Consistent Partitioning',
        tagline: 'LSM-Trees, SSTables, Bloom filters, write amplification, Dynamo virtual nodes, and partition rings.',
        phaseId: 'phase-05-infra',
        phaseName: 'Distributed Infrastructure & Cluster Scale',
        order: 21,
        level: 'Core',
        estimatedHours: 4.0,
        prerequisites: ['mod-inf-consensus'],
        coreEquations: ['\\text{WA} = \\frac{\\text{Bytes Written to Disk}}{\\text{Bytes Written by User}}', 'P(x) \\in [0, 2^{32}-1]'],
        keyConcepts: ['LSM-Trees & WAL', 'Bloom Filter False Positives', 'Consistent Hashing Rings', 'Virtual Nodes'],
        href: '/paths/system-design'
      },
      {
        id: 'mod-inf-parallel',
        num: 22,
        slug: 'distributed-training',
        title: 'Distributed Model Parallelism & FSDP',
        tagline: 'Data Parallelism (DDP), ZeRO memory stages (FSDP), Megatron-LM tensor parallelism, and pipeline bubbles.',
        phaseId: 'phase-05-infra',
        phaseName: 'Distributed Infrastructure & Cluster Scale',
        order: 22,
        level: 'Mastery',
        estimatedHours: 4.5,
        prerequisites: ['mod-dl-attn', 'mod-inf-consensus'],
        coreEquations: ['M_{\\text{ZeRO-3}} = \\frac{2\\Phi}{N_{\\text{data}}} + \\frac{2\\Phi}{N_{\\text{data}}} + \\frac{12\\Phi}{N_{\\text{data}}}', '\\text{Bubble} = \\frac{p - 1}{m + p - 1}'],
        keyConcepts: ['ZeRO-1/2/3 Memory Sharding', 'Megatron Column/Row Parallel', 'Pipeline Bubbles (1F1B)', 'Ring AllReduce'],
        href: '/paths/system-design'
      }
    ]
  },
  {
    id: 'phase-06-agent',
    code: 'PHASE-06',
    name: 'Agentic Systems, RAG & Reinforcement',
    description: 'Grammar-constrained tool calling, ReAct autonomous loops, vector retrieval hierarchies, and Bellman MDPs.',
    order: 6,
    color: '#ec4899', // Pink
    modules: [
      {
        id: 'mod-agt-react',
        num: 23,
        slug: 'agentic-systems',
        title: 'Tool Use & Grammar-Constrained Decoding',
        tagline: 'Context-free grammar parsing (CFG), JSON schema enforcement, ReAct cycles, and multi-agent supervisors.',
        phaseId: 'phase-06-agent',
        phaseName: 'Agentic Systems, RAG & Reinforcement',
        order: 23,
        level: 'Core',
        estimatedHours: 3.5,
        prerequisites: ['mod-dl-attn'],
        coreEquations: ['\\text{Mask}_{valid} = \\{ t \\mid \\text{CFG}(s \\circ t) \\ne \\emptyset \\}', 's_{t+1} = \\text{Env}(s_t, a_t)'],
        keyConcepts: ['Grammar-Constrained Decoding', 'ReAct Autonomous Pattern', 'Tool Dispatch Schemas', 'State Graphs'],
        href: '/paths/agentic-systems'
      },
      {
        id: 'mod-agt-rag',
        num: 24,
        slug: 'production-rag',
        title: 'Hierarchical RAG & Vector Indexing',
        tagline: 'Dense vector representations, HNSW graph search, Reciprocal Rank Fusion (RRF), and cross-encoder rerankers.',
        phaseId: 'phase-06-agent',
        phaseName: 'Agentic Systems, RAG & Reinforcement',
        order: 24,
        level: 'Core',
        estimatedHours: 3.5,
        prerequisites: ['mod-agt-react', 'mod-la'],
        coreEquations: ['\\text{RRF}(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}', '\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}'],
        keyConcepts: ['HNSW Vector Graph', 'Reciprocal Rank Fusion', 'Cross-Encoder Reranking', 'Semantic Chunking'],
        href: '/paths/agentic-systems'
      },
      {
        id: 'mod-18-rl',
        num: 25,
        slug: '18-reinforcement-learning',
        title: 'Reinforcement Learning & Bellman Optimality',
        tagline: 'Markov decision processes, Bellman optimality backup equations, TD error, and Q-learning convergence.',
        phaseId: 'phase-06-agent',
        phaseName: 'Agentic Systems, RAG & Reinforcement',
        order: 25,
        level: 'Advanced',
        estimatedHours: 4.0,
        prerequisites: ['mod-prob', 'mod-11-mlp'],
        coreEquations: ['Q^*(s, a) = \\sum_{s\'} P(s\' \\mid s, a) [R(s, a, s\') + \\gamma \\max_{a\'} Q^*(s\', a\')]', 'Q(s, a) \\leftarrow Q(s, a) + \\eta [r + \\gamma \\max_{a\'} Q(s\', a\') - Q(s, a)]'],
        keyConcepts: ['Bellman Optimality', 'Temporal Difference Error', 'Q-Learning Off-Policy', 'Value Iteration'],
        href: '/chapter/18-reinforcement-learning'
      }
    ]
  }
];

export function getAllCurriculumModules(): CurriculumModule[] {
  return CURRICULUM_PHASES.flatMap((phase) => phase.modules);
}

export function getModuleById(id: string): CurriculumModule | undefined {
  return getAllCurriculumModules().find((m) => m.id === id || m.slug === id);
}

// Backward-compatible types and aliases
export type ConceptNode = CurriculumModule & {
  chapterNum: number;
  workbenchAvailable: boolean;
  trackId: string;
  trackName: string;
  keyAlgorithms: string[];
};
export interface LearningTrack {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  chapterNums: number[];
}

export const LEARNING_TRACKS: LearningTrack[] = CURRICULUM_PHASES.map((phase) => ({
  id: phase.id,
  code: phase.code,
  name: phase.name,
  description: phase.description,
  color: phase.color,
  chapterNums: phase.modules.map((m) => m.num),
}));

export const CONCEPT_NODES: ConceptNode[] = getAllCurriculumModules().map((m) => ({
  ...m,
  chapterNum: m.num,
  trackId: m.phaseId,
  trackName: m.phaseName,
  workbenchAvailable: true,
  keyAlgorithms: m.keyConcepts,
}));

export function getConceptById(id: string): ConceptNode | undefined {
  return CONCEPT_NODES.find((node) => node.id === id || node.slug === id);
}

export function getTrackById(id: string): LearningTrack | undefined {
  return LEARNING_TRACKS.find((track) => track.id === id);
}

