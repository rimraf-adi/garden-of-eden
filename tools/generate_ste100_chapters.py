#!/usr/bin/env python3
"""
Generate ASD-STE100 JSON files for Chapters 8 through 13 of
Ethem Alpaydin's 'Introduction to Machine Learning' (2nd Edition).

ASD-STE100 Requirements:
- Short, direct sentences (maximum 20 words per sentence).
- Active voice.
- One idea per sentence.
- Clear technical language.
"""

import json
import os
import re
import sys

def word_count(text):
    # Count words safely
    tokens = [t for t in re.split(r'[\s/]+', text.strip()) if t]
    return len(tokens)

chapters = [
    # =========================================================================
    # CHAPTER 8: NONPARAMETRIC METHODS
    # =========================================================================
    {
        "chapterNum": 8,
        "slug": "08-nonparametric-methods",
        "title": "Nonparametric Methods",
        "sections": [
            {
                "id": "8.1",
                "title": "Introduction",
                "rules": [
                    "Parametric methods assume a fixed model over the entire input space.",
                    "A linear parametric model assumes one global function for all input values.",
                    "When this global assumption fails, parametric models produce large errors.",
                    "Nonparametric methods divide the input space into local neighborhoods.",
                    "The model fits simple local estimates in each neighborhood.",
                    "Nonparametric methods make few prior assumptions about the underlying distribution.",
                    "We also call these methods instance-based or memory-based learning.",
                    "The system stores training data in memory during learning.",
                    "Memory and computation costs increase with sample size."
                ]
            },
            {
                "id": "8.2",
                "title": "Nonparametric Density Estimation",
                "rules": [
                    "We estimate an unknown probability density function from sample data.",
                    "A small region around point x has volume V.",
                    "We approximate the probability mass by the fraction of points in this region.",
                    "The histogram estimator divides the input range into equal bins of width h.",
                    "The histogram assigns points to discrete bins.",
                    "Histograms are not continuous at bin boundaries.",
                    "The kernel estimator places a smooth kernel function on each sample point.",
                    "The kernel function integrates to one over the input space.",
                    "A common choice is the Gaussian kernel.",
                    "The bandwidth parameter h controls the spread of the kernel function.",
                    "A small bandwidth creates a noisy estimate with high variance.",
                    "A large bandwidth oversmoothes the density and increases bias.",
                    "The k-nearest neighbor estimator fixes the count k and adjusts the volume.",
                    "In low-density areas, the volume grows large to capture k points.",
                    "In high-density areas, the volume becomes small for fine resolution."
                ]
            },
            {
                "id": "8.3",
                "title": "Generalization to Multivariate Data",
                "rules": [
                    "We extend kernel density estimation to multidimensional vectors.",
                    "The multivariate kernel integrates to one over the input vector space.",
                    "The multivariate Gaussian kernel uses a covariance matrix.",
                    "When input dimensions are independent, we use the product of univariate kernels.",
                    "The curse of dimensionality affects nonparametric methods in high dimensions.",
                    "Most of the high-dimensional volume remains empty.",
                    "The model needs exponentially more sample points to fill the space.",
                    "Distance values between points become nearly equal in high dimensions."
                ]
            },
            {
                "id": "8.4",
                "title": "Nonparametric Classification",
                "rules": [
                    "We estimate class-conditional densities using nonparametric estimators.",
                    "We apply Bayes' rule to compute posterior class probabilities.",
                    "In kernel classification, each class has its own kernel density estimate.",
                    "The nearest neighbor rule assigns x to the class of the closest point.",
                    "The k-nearest neighbor rule finds the k closest points and counts votes.",
                    "The classifier selects the class with the most votes among the k neighbors.",
                    "The error of the nearest neighbor rule is bounded asymptotically.",
                    "Cover and Hart proved this error is at most twice the optimal Bayes error.",
                    "Voronoi tessellation partitions the space into convex cells around each training point."
                ]
            },
            {
                "id": "8.5",
                "title": "Condensed Nearest Neighbor",
                "rules": [
                    "Nonparametric methods store all training instances in system memory.",
                    "Nearest neighbor search requires large memory and high query computation time.",
                    "Condensing algorithms find a minimal subset of data that maintains classification accuracy.",
                    "Hart's condensed nearest neighbor algorithm constructs a consistent subset Z.",
                    "We initialize Z with one random instance from each target class.",
                    "We classify remaining training points using subset Z.",
                    "If subset Z misclassifies a point, we add that point to Z.",
                    "We repeat this scanning process until no points move into subset Z.",
                    "The condensed set keeps boundary instances and removes interior points."
                ]
            },
            {
                "id": "8.6",
                "title": "Nonparametric Regression: Smoothing Models",
                "rules": [
                    "In regression, we estimate an unknown continuous function g(x).",
                    "Smoothing models compute outputs as weighted averages of nearby target values.",
                    "The running mean smoother computes the average of target values in a window.",
                    "The kernel smoother weights target values using a smooth kernel function.",
                    "The Nadaraya-Watson kernel estimator divides the weighted target sum by the kernel sum.",
                    "The running line smoother fits a local linear regression line in each neighborhood.",
                    "Locally weighted running lines reduce boundary bias compared to running means."
                ]
            },
            {
                "id": "8.7",
                "title": "How to Choose the Smoothing Parameter",
                "rules": [
                    "The smoothing parameter h or k controls model complexity.",
                    "A small parameter value causes overfitting and high variance.",
                    "A large parameter value causes underfitting and high bias.",
                    "We use cross-validation on a validation dataset to find the best parameter.",
                    "In density estimation, we maximize cross-validated log likelihood.",
                    "In regression, we minimize mean squared error on validation data."
                ]
            },
            {
                "id": "8.8",
                "title": "Notes",
                "rules": [
                    "Fix and Hodges introduced nonparametric density estimation in 1951.",
                    "Cover and Hart proved the asymptotic bounds of the nearest neighbor rule in 1967.",
                    "Nonparametric methods are lazy learners because they defer computation until query time.",
                    "Eager learners build an explicit model before receiving test queries.",
                    "Modern hardware and fast index trees make memory-based methods practical for large datasets."
                ]
            }
        ]
    },

    # =========================================================================
    # CHAPTER 9: DECISION TREES
    # =========================================================================
    {
        "chapterNum": 9,
        "slug": "09-decision-trees",
        "title": "Decision Trees",
        "sections": [
            {
                "id": "9.1",
                "title": "Introduction",
                "rules": [
                    "A decision tree is a hierarchical model for supervised learning.",
                    "The tree uses a divide-and-conquer strategy to split the input space.",
                    "Internal decision nodes test specific input attributes.",
                    "Leaf nodes store the final class label or numeric prediction.",
                    "The system classifies an input by following a path from root to leaf.",
                    "Decision trees are nonparametric and highly interpretable.",
                    "Human experts can understand and validate tree decisions easily."
                ]
            },
            {
                "id": "9.2",
                "title": "Univariate Trees",
                "rules": [
                    "In a univariate tree, each decision node tests only one input dimension.",
                    "For discrete attributes, the node creates a branch for each possible value.",
                    "For continuous attributes, the node compares the value to a numeric threshold.",
                    "The test splits the input space with hyperplanes orthogonal to coordinate axes.",
                    "In classification trees, we measure node impurity using entropy or the Gini index.",
                    "The algorithm selects the split that maximizes information gain.",
                    "Information gain measures the drop in impurity after the split.",
                    "ID3 and C4.5 use entropy to select the best split attribute.",
                    "CART uses the Gini index for binary classification splits.",
                    "In regression trees, each leaf stores the mean target value of local instances.",
                    "The split criterion minimizes the mean squared error in child nodes."
                ]
            },
            {
                "id": "9.3",
                "title": "Pruning",
                "rules": [
                    "Growing a tree until all leaves are pure causes overfitting.",
                    "Prepruning stops tree growth early before nodes become too small.",
                    "Prepruning rules include minimum sample count and minimum impurity decrease.",
                    "Postpruning grows a complete tree and removes subtrees that do not help generalization.",
                    "We use a separate validation dataset to evaluate subtrees during postpruning.",
                    "Reduced error pruning replaces subtrees with leaves when validation accuracy improves.",
                    "Cost-complexity pruning balances tree error against tree size using a penalty parameter.",
                    "Postpruning generally produces better models than prepruning."
                ]
            },
            {
                "id": "9.4",
                "title": "Rule Extraction from Trees",
                "rules": [
                    "Each path from the root node to a leaf forms an IF-THEN rule.",
                    "The antecedent combines node tests with logical AND operations.",
                    "The consequent predicts the target class or regression value.",
                    "The full set of extracted rules is mutually exclusive and exhaustive.",
                    "Rule pruning removes unnecessary conditions from individual rules.",
                    "Pruned rules are often easier to interpret than the complete tree."
                ]
            },
            {
                "id": "9.5",
                "title": "Learning Rules from Data",
                "rules": [
                    "Sequential covering algorithms learn IF-THEN rules directly from training data.",
                    "The algorithm learns one rule that covers a subset of positive instances.",
                    "The algorithm removes covered instances and repeats the search on remaining data.",
                    "We call this strategy separate-and-conquer.",
                    "Rule induction algorithms search from general rules to specific rules.",
                    "We add conditions to increase precision until the rule meets an accuracy threshold.",
                    "RIPPER is an efficient algorithm for learning propositional rule sets."
                ]
            },
            {
                "id": "9.6",
                "title": "Multivariate Trees",
                "rules": [
                    "A multivariate tree uses multiple input attributes at each decision node.",
                    "A linear multivariate node uses a linear combination of input features.",
                    "The decision boundary at each node is an arbitrary oblique hyperplane.",
                    "Multivariate splits create flexible decision boundaries across multiple dimensions.",
                    "Finding optimal multivariate splits requires numerical optimization or linear programming.",
                    "Multivariate trees are smaller than univariate trees but harder to interpret."
                ]
            },
            {
                "id": "9.7",
                "title": "Notes",
                "rules": [
                    "Hunt's Concept Learning System laid the foundation for decision tree induction.",
                    "Quinlan developed the ID3 and C4.5 tree algorithms.",
                    "Breiman and colleagues created the CART algorithm for classification and regression trees.",
                    "Decision trees handle missing values naturally using surrogate splits.",
                    "Trees perform implicit feature selection by choosing only relevant attributes for splits."
                ]
            }
        ]
    },

    # =========================================================================
    # CHAPTER 10: LINEAR DISCRIMINATION
    # =========================================================================
    {
        "chapterNum": 10,
        "slug": "10-linear-discrimination",
        "title": "Linear Discrimination",
        "sections": [
            {
                "id": "10.1",
                "title": "Introduction",
                "rules": [
                    "Linear discrimination models decision boundaries directly without estimating class densities.",
                    "In discriminant-based classification, we define a discriminant function for each class.",
                    "The decision rule assigns an input to the class with the highest discriminant value.",
                    "A linear discriminant function is a linear combination of input features.",
                    "Linear models have low complexity and low variance.",
                    "Linear models resist overfitting when training datasets are small."
                ]
            },
            {
                "id": "10.2",
                "title": "Generalizing the Linear Model",
                "rules": [
                    "When classes are not linearly separable, we generalize the linear model.",
                    "A quadratic discriminant includes quadratic and cross-product terms of input features.",
                    "The parameter count in a quadratic model grows quadratically with input dimension d.",
                    "Alternatively, we map inputs into a higher-dimensional space using nonlinear basis functions.",
                    "The model remains linear with respect to the new basis representations.",
                    "This transformation allows linear models to solve nonlinear classification problems."
                ]
            },
            {
                "id": "10.3",
                "title": "Geometry of the Linear Discriminant",
                "rules": [
                    "For two classes, a single linear discriminant function g(x) separates the classes.",
                    "The decision boundary is the hyperplane where g(x) equals zero.",
                    "The weight vector w is orthogonal to the separating hyperplane.",
                    "The bias term w0 sets the location of the hyperplane relative to the origin.",
                    "The discriminant value g(x) is proportional to the signed distance from x to the hyperplane.",
                    "For K classes, linear functions divide the input space into K convex decision regions."
                ]
            },
            {
                "id": "10.4",
                "title": "Pairwise Separation",
                "rules": [
                    "When K classes are not linearly separable, we can use pairwise separation.",
                    "Pairwise separation trains a linear classifier for every pair of classes.",
                    "The method requires K*(K - 1)/2 binary classifiers.",
                    "During testing, each binary classifier casts one vote for its preferred class.",
                    "The system assigns the input to the class with the most votes.",
                    "Pairwise separation handles smaller, balanced training sets for each classifier."
                ]
            },
            {
                "id": "10.5",
                "title": "Parametric Discrimination Revisited",
                "rules": [
                    "Gaussian class densities with equal covariance matrices yield linear discriminant functions.",
                    "The weight vector depends on the shared covariance matrix and class mean vectors.",
                    "The bias term includes prior class probabilities and class means.",
                    "Logistic discrimination assumes the same linear log-odds form without assuming normal distributions.",
                    "Direct discriminant learning requires fewer parameters than estimating full Gaussian densities."
                ]
            },
            {
                "id": "10.6",
                "title": "Gradient Descent",
                "rules": [
                    "In discriminant learning, we define an error function over training instances.",
                    "We optimize parameters by moving in the direction opposite to the gradient.",
                    "In batch gradient descent, we update weights after scanning the entire dataset.",
                    "In online gradient descent, we update weights after each training instance.",
                    "The learning rate parameter controls the step size of each weight update.",
                    "A large learning rate can cause oscillation or divergence.",
                    "A small learning rate causes slow convergence to the minimum."
                ]
            },
            {
                "id": "10.7",
                "title": "Logistic Discrimination",
                "rules": [
                    "Logistic discrimination models posterior class probabilities using the sigmoid function.",
                    "The sigmoid function maps any real value into the range between zero and one.",
                    "The log-odds of the posterior probability is a linear function of the input.",
                    "We train parameters by maximizing conditional log likelihood under the Bernoulli model.",
                    "The negative log likelihood gives the cross-entropy error function.",
                    "The error surface is convex, so gradient descent finds the global minimum.",
                    "For multiple classes, the softmax function generalizes the sigmoid function."
                ]
            },
            {
                "id": "10.8",
                "title": "Discrimination by Regression",
                "rules": [
                    "We can formulate classification as a regression problem with indicator target variables.",
                    "For two classes, target values are 1 for class 1 and 0 for class 2.",
                    "We minimize the sum of squared differences between linear outputs and target labels.",
                    "Linear regression can predict output values outside the interval [0, 1].",
                    "Minimizing squared error is sensitive to outliers far from the decision boundary.",
                    "Cross-entropy loss in logistic regression provides better probability estimates than squared error."
                ]
            },
            {
                "id": "10.9",
                "title": "Notes",
                "rules": [
                    "Fisher introduced linear discriminant analysis in 1936.",
                    "Cox developed logistic regression for biomedical data analysis in 1958.",
                    "Linear discriminants remain standard baseline classifiers in machine learning.",
                    "Regularized logistic regression prevents overfitting in high-dimensional datasets."
                ]
            }
        ]
    },

    # =========================================================================
    # CHAPTER 11: MULTILAYER PERCEPTRONS
    # =========================================================================
    {
        "chapterNum": 11,
        "slug": "11-multilayer-perceptrons",
        "title": "Multilayer Perceptrons",
        "sections": [
            {
                "id": "11.1",
                "title": "Introduction",
                "rules": [
                    "Artificial neural networks take inspiration from biological neural networks in the brain.",
                    "Biological neurons receive electrical inputs through dendrites and transmit outputs along axons.",
                    "Synaptic connections modulate signal strength between connected neurons.",
                    "Artificial neural networks model complex functions using interconnected computational nodes.",
                    "Neural networks learn internal feature representations directly from raw training data."
                ]
            },
            {
                "id": "11.2",
                "title": "The Perceptron",
                "rules": [
                    "The perceptron is the basic processing unit in artificial neural networks.",
                    "It calculates a weighted sum of its inputs plus a bias parameter.",
                    "The net input passes through an activation function to generate the output.",
                    "Common activation functions include threshold, sigmoid, and hyperbolic tangent functions.",
                    "A perceptron with a threshold activation function forms a linear decision boundary."
                ]
            },
            {
                "id": "11.3",
                "title": "Training a Perceptron",
                "rules": [
                    "The perceptron learning algorithm updates weights when the unit misclassifies an input.",
                    "If the target is 1 and the output is 0, the algorithm adds the input vector to weights.",
                    "If the target is 0 and the output is 1, the algorithm subtracts the input vector from weights.",
                    "Rosenblatt proved the perceptron convergence theorem for linearly separable data.",
                    "If classes are linearly separable, the algorithm finds a separating hyperplane in finite steps.",
                    "If classes are not linearly separable, the algorithm never converges."
                ]
            },
            {
                "id": "11.4",
                "title": "Learning Boolean Functions",
                "rules": [
                    "A single perceptron can learn linearly separable Boolean functions like AND, OR, and NOT.",
                    "Minsky and Papert proved that a single perceptron cannot learn the XOR function.",
                    "XOR inputs (0,0) and (1,1) produce 0, while (0,1) and (1,0) produce 1.",
                    "No single line can separate the true and false points of XOR.",
                    "Learning the XOR function requires an intermediate layer of hidden units."
                ]
            },
            {
                "id": "11.5",
                "title": "Multilayer Perceptrons",
                "rules": [
                    "A multilayer perceptron has an input layer, one or more hidden layers, and an output layer.",
                    "Feedforward networks pass signals strictly forward without feedback connections.",
                    "Hidden units extract nonlinear intermediate features from raw inputs.",
                    "The output layer combines hidden representations to produce final predictions.",
                    "Adding hidden layers allows the network to model complex nonlinear decision boundaries."
                ]
            },
            {
                "id": "11.6",
                "title": "MLP as a Universal Approximator",
                "rules": [
                    "The universal approximation theorem states that an MLP can approximate any continuous function.",
                    "The network needs only one hidden layer with a sufficient count of nonlinear hidden units.",
                    "Each hidden unit creates a localized ridge or step in the feature space.",
                    "Combining multiple hidden units creates arbitrary continuous input-output mappings.",
                    "The theorem guarantees representation capacity, but does not provide an algorithm to find weights."
                ]
            },
            {
                "id": "11.7",
                "title": "Backpropagation Algorithm",
                "rules": [
                    "The backpropagation algorithm trains multilayer perceptrons using gradient descent.",
                    "In the forward pass, inputs propagate forward through layers to compute network outputs.",
                    "The algorithm calculates the error between network predictions and target values.",
                    "In the backward pass, the algorithm computes partial derivatives using the chain rule.",
                    "Error gradients propagate backward from the output layer to hidden layers.",
                    "Connection weights update in proportion to their contribution to total network error."
                ]
            },
            {
                "id": "11.8",
                "title": "Training Procedures",
                "rules": [
                    "Momentum adds a fraction of the previous weight update to the current update.",
                    "Momentum accelerates convergence across flat regions and dampens oscillations in valleys.",
                    "Weight decay adds a penalty on large weights to prevent overfitting.",
                    "Early stopping halts training when validation error begins to rise.",
                    "Data normalization ensures that all input features have comparable numerical ranges.",
                    "Minibatch training updates weights using small groups of examples for stable gradients."
                ]
            },
            {
                "id": "11.9",
                "title": "Tuning the Network Size",
                "rules": [
                    "Network capacity depends on the number of hidden layers and hidden units.",
                    "A small network has high bias and cannot learn complex patterns.",
                    "A large network has high variance and easily overfits training noise.",
                    "Destructive methods start with a large network and prune unnecessary weights or units.",
                    "Constructive methods start with a small network and add hidden units dynamically.",
                    "Cross-validation identifies the architecture that minimizes validation error."
                ]
            },
            {
                "id": "11.10",
                "title": "Bayesian View of Learning",
                "rules": [
                    "The Bayesian approach treats network connection weights as random variables with prior distributions.",
                    "Training computes the posterior probability distribution of weights given the data.",
                    "Predictions average outputs over all possible weights weighted by posterior probability.",
                    "Weight decay corresponds to a zero-mean Gaussian prior distribution over connection weights.",
                    "Bayesian methods provide principled confidence estimates for model predictions."
                ]
            },
            {
                "id": "11.11",
                "title": "Dimensionality Reduction",
                "rules": [
                    "An autoencoder is an MLP trained to reconstruct its own input vector.",
                    "The network compresses inputs into a lower-dimensional bottleneck hidden layer.",
                    "The hidden representation captures the most informative nonlinear features of the data.",
                    "If hidden units use linear activations, the bottleneck spans the principal component subspace.",
                    "Nonlinear hidden activations allow autoencoders to perform nonlinear dimensionality reduction."
                ]
            },
            {
                "id": "11.12",
                "title": "Learning Time",
                "rules": [
                    "Many machine learning applications require processing temporal sequences or time-series data.",
                    "Time-delay neural networks process sliding temporal windows of past inputs.",
                    "Recurrent neural networks contain feedback loops that store internal memory over time.",
                    "Recurrent connections allow the network to maintain an internal state across time steps.",
                    "Backpropagation through time unfolds recurrent networks across temporal steps for training."
                ]
            },
            {
                "id": "11.13",
                "title": "Notes",
                "rules": [
                    "McCulloch and Pitts proposed the first mathematical model of artificial neurons in 1943.",
                    "Rosenblatt invented the perceptron and its learning rule in 1958.",
                    "Rumelhart, Hinton, and Williams popularized the backpropagation algorithm in 1986.",
                    "Deep neural networks extend multilayer perceptrons with modern architectures and regularization."
                ]
            }
        ]
    },

    # =========================================================================
    # CHAPTER 12: LOCAL MODELS
    # =========================================================================
    {
        "chapterNum": 12,
        "slug": "12-local-models",
        "title": "Local Models",
        "sections": [
            {
                "id": "12.1",
                "title": "Introduction",
                "rules": [
                    "Global models fit a single function over the whole input space.",
                    "Local models divide the input space into small regions and fit separate local functions.",
                    "In local models, only units close to the input influence the final output.",
                    "Local representations allow fast adaptation and modular learning.",
                    "Changes in one region of the input space do not disrupt learned fits in other regions."
                ]
            },
            {
                "id": "12.2",
                "title": "Competitive Learning",
                "rules": [
                    "In competitive learning, units compete with each other to represent input instances.",
                    "The unit with the prototype closest to the input becomes the winner.",
                    "The winner-take-all rule updates only the winning prototype toward the input.",
                    "Online k-means updates cluster centers incrementally after each training sample.",
                    "Adaptive Resonance Theory creates new clusters when inputs differ from existing prototypes.",
                    "Kohonen Self-Organizing Maps arrange units on a low-dimensional topological grid.",
                    "In SOM, the winner and its topological neighbors update their prototype vectors together."
                ]
            },
            {
                "id": "12.3",
                "title": "Radial Basis Functions",
                "rules": [
                    "A Radial Basis Function network has one hidden layer of localized receptive fields.",
                    "Each hidden unit calculates the distance between the input and its center vector.",
                    "The activation decreases monotonically as distance from the center increases.",
                    "The Gaussian function is the most common radial basis function.",
                    "The output layer computes a linear combination of hidden unit activations.",
                    "We train RBF networks in two stages: find centers unsupervised, then solve output weights."
                ]
            },
            {
                "id": "12.4",
                "title": "Incorporating Rule-Based Knowledge",
                "rules": [
                    "RBF networks map naturally to IF-THEN fuzzy rule systems.",
                    "Each hidden unit corresponds to the premise of a rule in feature space.",
                    "The center and spread of the basis function define the input membership region.",
                    "The output connection weight specifies the conclusion or action of the rule.",
                    "Domain experts can initialize centers and widths directly from expert knowledge.",
                    "Training then refines parameters using empirical sample data."
                ]
            },
            {
                "id": "12.5",
                "title": "Normalized Basis Functions",
                "rules": [
                    "Standard RBF activations can sum to zero in regions far from all centers.",
                    "Normalized basis functions divide each activation by the sum of all activations.",
                    "Normalized activations sum to one and form a partition of unity.",
                    "Normalized units represent the posterior probability that an input belongs to a local patch.",
                    "Softmax normalization ensures that every input receives a valid prediction."
                ]
            },
            {
                "id": "12.6",
                "title": "Competitive Basis Functions",
                "rules": [
                    "In standard RBF networks, multiple basis functions overlap and cooperate to form outputs.",
                    "Competitive basis functions enforce competition among local units.",
                    "Only the winning unit or a small subset of units contributes to the output.",
                    "Competitive basis functions prevent interference between distant regions.",
                    "Competition produces piecewise local fits across distinct regions of the feature space."
                ]
            },
            {
                "id": "12.7",
                "title": "Learning Vector Quantization",
                "rules": [
                    "Learning Vector Quantization is a supervised competitive learning algorithm for classification.",
                    "Each class possesses a set of labeled codebook vectors or prototypes.",
                    "For each training instance, the algorithm finds the closest codebook vector.",
                    "If the winning vector has the correct class label, it moves closer to the input.",
                    "If the winning vector has an incorrect class label, it moves away from the input.",
                    "LVQ adjusts codebook locations to minimize classification errors near class boundaries."
                ]
            },
            {
                "id": "12.8",
                "title": "Mixture of Experts",
                "rules": [
                    "A mixture of experts combines multiple local models called expert networks.",
                    "Each expert network learns to make predictions in a specific region of the input space.",
                    "A gating network inspects the input and assigns weights to each expert.",
                    "The final output is the weighted sum of expert predictions.",
                    "Cooperative mixtures allow multiple experts to blend their outputs smoothly.",
                    "Competitive mixtures use competitive gating to select a single winning expert.",
                    "We train the gating network and experts simultaneously with the EM algorithm."
                ]
            },
            {
                "id": "12.9",
                "title": "Hierarchical Mixture of Experts",
                "rules": [
                    "A hierarchical mixture of experts extends the architecture into a tree structure.",
                    "Internal nodes contain gating networks that divide the space recursively.",
                    "Leaf nodes contain local expert networks that produce predictions.",
                    "The system corresponds to a soft decision tree with probabilistic routing.",
                    "Smooth probabilistic decisions avoid discontinuous boundaries found in standard decision trees.",
                    "The entire hierarchy trains end-to-end using gradient descent or EM algorithms."
                ]
            },
            {
                "id": "12.10",
                "title": "Notes",
                "rules": [
                    "Local models connect statistical mixture models, neural networks, and fuzzy logic.",
                    "Broomhead and Lowe introduced Radial Basis Functions to neural networks in 1988.",
                    "Jacobs, Jordan, Nowlan, and Hinton proposed the mixture of experts architecture in 1991.",
                    "Local models offer fast training and clear interpretability compared to deep feedforward networks."
                ]
            }
        ]
    },

    # =========================================================================
    # CHAPTER 13: KERNEL MACHINES
    # =========================================================================
    {
        "chapterNum": 13,
        "slug": "13-kernel-machines",
        "title": "Kernel Machines",
        "sections": [
            {
                "id": "13.1",
                "title": "Introduction",
                "rules": [
                    "Kernel machines provide linear algorithms that operate in high-dimensional feature spaces.",
                    "They combine linear model simplicity with nonlinear mapping power.",
                    "Support vector machines find maximum margin hyperplanes for classification.",
                    "Convex optimization guarantees a unique global solution without local minima.",
                    "The solution depends only on a subset of critical training points called support vectors."
                ]
            },
            {
                "id": "13.2",
                "title": "Optimal Separating Hyperplane",
                "rules": [
                    "For linearly separable classes, many valid hyperplanes can separate the data.",
                    "The optimal separating hyperplane maximizes the margin between the two classes.",
                    "The margin is the minimum distance from the hyperplane to the nearest training instances.",
                    "Maximizing the margin minimizes the VC dimension and lowers structural risk.",
                    "We formulate the search as a quadratic programming problem with linear inequality constraints.",
                    "In the dual formulation, parameters express as linear combinations of support vectors.",
                    "Points with positive Lagrange multipliers are the support vectors on the margin boundaries."
                ]
            },
            {
                "id": "13.3",
                "title": "The Nonseparable Case: Soft Margin Hyperplane",
                "rules": [
                    "Real datasets are rarely linearly separable due to noise and overlapping distributions.",
                    "The soft margin hyperplane introduces non-negative slack variables for misclassifications.",
                    "Slack variables measure the distance by which a data point violates the margin.",
                    "A regularization parameter C controls the trade-off between margin size and classification errors.",
                    "A large C penalizes margin violations heavily and creates a narrow margin.",
                    "A small C tolerates more violations to achieve a wider, smoother margin.",
                    "The optimization problem remains a convex quadratic programming task."
                ]
            },
            {
                "id": "13.4",
                "title": "nu-SVM",
                "rules": [
                    "The nu-SVM formulation replaces parameter C with a parameter nu in the range (0, 1].",
                    "Parameter nu sets an upper bound on the fraction of margin errors.",
                    "Parameter nu also sets a lower bound on the fraction of support vectors.",
                    "The parameter nu provides a more intuitive interpretation than the penalty constant C.",
                    "The dual problem adds an equality constraint that balances positive and negative multipliers."
                ]
            },
            {
                "id": "13.5",
                "title": "Kernel Trick",
                "rules": [
                    "Nonlinear classification maps inputs into a high-dimensional feature space using a mapping function.",
                    "Calculating explicit high-dimensional feature vectors requires extreme computational resources.",
                    "The kernel trick replaces the inner product with an equivalent kernel function K(x, y).",
                    "The algorithm evaluates dot products directly in the original input space.",
                    "Mercer's theorem states that any positive semidefinite symmetric function defines a valid kernel.",
                    "The kernel trick allows linear algorithms to learn complex nonlinear decision boundaries."
                ]
            },
            {
                "id": "13.6",
                "title": "Vectorial Kernels",
                "rules": [
                    "Polynomial kernels compute dot products raised to power q with an optional constant offset.",
                    "The polynomial kernel of degree two captures all pairwise feature interactions.",
                    "The Gaussian radial basis function kernel measures similarity using squared Euclidean distance.",
                    "The Gaussian kernel maps inputs into an infinite-dimensional Hilbert space.",
                    "The spread parameter gamma controls the width of the Gaussian receptive field.",
                    "Sigmoid kernels implement hyperbolic tangent functions similar to multilayer perceptrons."
                ]
            },
            {
                "id": "13.7",
                "title": "Defining Kernels",
                "rules": [
                    "Kernels represent generalized similarity measures between pairs of data objects.",
                    "We can define kernels on structured non-vector data such as strings, trees, and graphs.",
                    "String kernels measure similarity by counting matching substrings between text sequences.",
                    "Graph kernels compare substructures like walks, paths, or subtrees between graphs.",
                    "Application-specific kernels enable machine learning on complex biological and linguistic objects."
                ]
            },
            {
                "id": "13.8",
                "title": "Multiple Kernel Learning",
                "rules": [
                    "Different kernels represent different feature spaces or different data sources.",
                    "Multiple kernel learning combines several basic kernels into a composite kernel function.",
                    "A linear combination of valid positive semidefinite kernels produces a valid kernel.",
                    "The algorithm learns kernel combination weights concurrently with classifier parameters.",
                    "Multiple kernel learning performs automated feature and kernel selection."
                ]
            },
            {
                "id": "13.9",
                "title": "Multiclass Kernel Machines",
                "rules": [
                    "Support vector machines are fundamentally binary classifiers.",
                    "One-vs-all trains K separate SVM models, each separating one class from all other classes.",
                    "One-vs-one trains K*(K - 1)/2 classifiers for all class pairs and applies majority voting.",
                    "Error-correcting output codes map multiclass problems to codewords of binary predictions.",
                    "Native multiclass formulations optimize all discriminant hyperplanes simultaneously in one objective function."
                ]
            },
            {
                "id": "13.10",
                "title": "Kernel Machines for Regression",
                "rules": [
                    "Support vector regression uses an epsilon-insensitive loss function.",
                    "The model ignores prediction errors smaller than epsilon within an insensitive tube.",
                    "Errors outside the tube incur a linear penalty measured with slack variables.",
                    "Support vectors are points that lie on or outside the boundary of the epsilon-tube.",
                    "Insensitive loss ensures sparsity in the dual regression solution."
                ]
            },
            {
                "id": "13.11",
                "title": "One-Class Kernel Machines",
                "rules": [
                    "One-class SVMs learn the support of a probability distribution for novelty detection.",
                    "The algorithm fits a minimal bounding hypersphere around the data in feature space.",
                    "Alternatively, the algorithm separates training instances from the origin with maximum margin.",
                    "Normal data points fall inside the boundary, while outliers fall outside.",
                    "One-class machines detect fraud, system anomalies, and rare manufacturing defects."
                ]
            },
            {
                "id": "13.12",
                "title": "Kernel Dimensionality Reduction",
                "rules": [
                    "Kernel Principal Components Analysis computes nonlinear principal components.",
                    "The algorithm constructs the Gram kernel matrix of all pairwise training dot products.",
                    "It centers the kernel matrix in feature space without computing explicit coordinates.",
                    "Eigenvalue decomposition of the centered kernel matrix reveals nonlinear directions of maximum variance.",
                    "Kernel PCA extracts complex manifold structures that linear PCA cannot detect."
                ]
            },
            {
                "id": "13.13",
                "title": "Notes",
                "rules": [
                    "Vapnik and Chervonenkis developed Statistical Learning Theory and the VC dimension.",
                    "Boser, Guyon, and Vapnik introduced support vector machines with the kernel trick in 1992.",
                    "Cortes and Vapnik introduced the soft margin formulation in 1995.",
                    "Kernel machines provide strong theoretical generalization bounds based on margin maximization."
                ]
            }
        ]
    }
]

def main():
    target_dir = "/Users/adityakinjawadekar/Documents/100xcode/garden-of-eden/public/data/ste100"
    os.makedirs(target_dir, exist_ok=True)

    errors = 0
    total_rules = 0

    for ch in chapters:
        ch_num = ch["chapterNum"]
        filename = f"chapter-{ch_num:02d}.json"
        filepath = os.path.join(target_dir, filename)

        print(f"Validating Chapter {ch_num:02d}: {ch['title']}")

        for sec in ch["sections"]:
            sec_id = sec["id"]
            for r_idx, rule in enumerate(sec["rules"]):
                total_rules += 1
                wc = word_count(rule)
                if wc > 20:
                    print(f"  [ERROR] Word count > 20 ({wc} words) in {sec_id} rule {r_idx + 1}:")
                    print(f"    \"{rule}\"")
                    errors += 1

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(ch, f, indent=2)
            f.write("\n")

        print(f"  Saved {filepath}")

    print("\n" + "=" * 50)
    if errors == 0:
        print(f"ALL {total_rules} RULES VALIDATED SUCCESSFULLY! Max words <= 20.")
    else:
        print(f"FOUND {errors} ERRORS. Please fix them.")
        sys.exit(1)

if __name__ == "__main__":
    main()
