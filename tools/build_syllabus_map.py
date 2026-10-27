#!/usr/bin/env python3
"""Map the official GATE DA syllabus -> notes chapters -> PYQs -> 2024-26 trend.

Reads  modules/gate-da/data/{index.json, chapters/*.json, pyq-bank.json}
Writes modules/gate-da/data/syllabus-map.json

Each syllabus topic carries two regexes: `q` matched against "<area> | <topic>" of every PYQ, and `n`
matched against chapter section titles (strong) and chapter body text (weak). Edit TOPICS to refine.
"""
import json, os, re, glob, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'modules', 'gate-da', 'data')
SEC = {1: 'Probability & Statistics', 2: 'Linear Algebra', 3: 'Calculus & Optimization', 4: 'Programming, Data Structures & Algorithms',
       5: 'Database Management & Warehousing', 6: 'Machine Learning', 7: 'Artificial Intelligence', 8: 'General Aptitude'}
# Topics whose PYQs are filed under a different book chapter than the syllabus section.
CROSS = {'Counting: permutations and combinations': {4}, 'Data transformation: normalisation, discretisation, sampling, compression': {6}}
# (section, syllabus topic, pyq regex, notes regex)
TOPICS = [
 (1, 'Counting: permutations and combinations', r'combinatorial|permutation|divisibility and perm|involution', r'permutation|combination'),
 (1, 'Probability axioms, sample space, events', r'basic probability \| (?!bayes|hyper)', r'sample space|axiom'),
 (1, 'Independent and mutually exclusive events', r'independen', r'mutually exclusive|independent events'),
 (1, 'Marginal, conditional, joint probability; Bayes theorem', r'bayes|conditional probab', r'bayes'),
 (1, 'Conditional expectation and variance', r'total expectation|conditional expect|conditional distribution|expectation and variance', r'conditional expectation|law of total'),
 (1, 'Mean, median, mode, standard deviation', r'descriptive|sample mean|sample variance', r'\bmedian\b|\bmode\b'),
 (1, 'Correlation and covariance', r'covariance|correlation', r'covariance|correlation'),
 (1, 'Discrete RVs, PMF: uniform, Bernoulli, binomial', r'bernoulli|binomial|geometric|pmf', r'binomial|bernoulli'),
 (1, 'Continuous RVs, PDF, CDF, conditional PDF', r'cdf|cumulative|pdf|continuous|median', r'cumulative distribution|probability density'),
 (1, 'Exponential distribution', r'exponential', r'exponential distribution'),
 (1, 'Poisson distribution', r'poisson', r'poisson'),
 (1, 'Normal and standard normal', r'normal', r'normal distribution|standard normal'),
 (1, 't-distribution and chi-squared distribution', r'student|chi\s?square|chi-square|t1', r't-distribution|chi-squared|chi-square'),
 (1, 'Central limit theorem', r'central limit', r'central limit'),
 (1, 'Confidence intervals', r'confidence', r'confidence interval'),
 (1, 'z-test, t-test, chi-squared test', r'z-test|t-test|hypothesis|chi-squared test', r'hypothesis|z-test|t-test'),
 (2, 'Vector spaces and subspaces', r'subspace|vector space|convex sets', r'subspace|vector space'),
 (2, 'Linear dependence, independence, bases', r'linear independ|orthonormal bases|basis', r'linear independence|linearly independent|\bbasis\b'),
 (2, 'Matrix properties, partitioned matrices', r'centering|gram|matrix power|determinants and matrices|rotation matrix powers|matrices and linear', r'partitioned matri|block matri|special matrices'),
 (2, 'Projection and idempotent matrices', r'projection|idempotent', r'projection|idempotent'),
 (2, 'Orthogonal matrices', r'orthogonal matri|isometr', r'orthogonal matri'),
 (2, 'Quadratic forms', r'quadratic form', r'quadratic form'),
 (2, 'Systems of linear equations, Gaussian elimination', r'gaussian|linear system', r'gaussian elimination|system of linear|systems of linear'),
 (2, 'Eigenvalues and eigenvectors', r'eigen', r'eigenvalue'),
 (2, 'Determinant', r'determinant', r'determinant'),
 (2, 'Rank and nullity', r'\brank\b|nullity', r'\brank\b|nullity'),
 (2, 'LU decomposition', r'\blu\b', r'lu decomposition|lu factor'),
 (2, 'Singular value decomposition', r'singular value|svd', r'singular value|svd'),
 (3, 'Functions of a single variable', r'strictly convex|single variable', r'^\s*function|functions'),
 (3, 'Limits', r'limit|hopital|l hopital|infinite geometric', r'\blimit'),
 (3, 'Continuity and differentiability', r'continuity|differentiab|lipschitz|hyperbolic|sigmoid', r'continuity|differentiab'),
 (3, 'Taylor series', r'taylor', r'taylor'),
 (3, 'Maxima and minima; single-variable optimisation', r'maxima|minima|critical|extrema|second derivative', r'maxima|minima|critical point'),
 (4, 'Programming in Python', r'python|pseudocode|bubble-sort recursion', r'python'),
 (4, 'Basic data structures (general)', r'matching data structures', r'data structure'),
 (4, 'Stacks', r'stack', r'\bstack'),
 (4, 'Queues', r'queue|deque', r'\bqueue'),
 (4, 'Linked lists', r'linked list', r'linked list'),
 (4, 'Trees (incl. heaps)', r'tree|heap', r'\btree|heap'),
 (4, 'Hash tables', r'hash', r'hash table|hashing'),
 (4, 'Linear and binary search', r'binary search|linear search', r'binary search|linear search'),
 (4, 'Selection, bubble, insertion sort', r'insertion|bubble|selection sort|inversions', r'insertion sort|bubble sort|selection sort'),
 (4, 'Divide and conquer: mergesort, quicksort', r'quicksort|mergesort|merge sort', r'quicksort|merge ?sort|divide and conquer'),
 (4, 'Graph theory basics', r'graph', r'graph'),
 (4, 'Graph traversals (BFS, DFS)', r'dfs|bfs|depth-first|traversal', r'depth.first|breadth.first|traversal'),
 (4, 'Shortest paths', r'shortest', r'shortest path|dijkstra'),
 (5, 'ER model', r'er diagram|entity', r'er model|entity'),
 (5, 'Relational model and integrity constraints', r'foreign key|integrity|candidate keys', r'integrity constraint|foreign key|candidate key'),
 (5, 'Relational algebra', r'relational algebra|relational division|relational set|natural join', r'relational algebra'),
 (5, 'Tuple relational calculus', r'trc|tuple relational', r'tuple (relational )?calculus'),
 (5, 'SQL', r'\bsql\b', r'\bsql\b'),
 (5, 'Normal forms and dependencies', r'normal form|bcnf|functional dep|decomposition|3nf', r'normal form|bcnf|functional dependenc'),
 (5, 'File organisation and indexing', r'b\+|index', r'b\+|indexing|file organi'),
 (5, 'Data transformation: normalisation, discretisation, sampling, compression', r'z-score|normalization|discretiz|compression', r'discretiz|normalization|compression|sampling'),
 (5, 'Warehouse schemas, concept hierarchies, measures, OLAP', r'warehous|olap|concept hierarch|roll-up|cube', r'star schema|snowflake|concept hierarch|olap|measure'),
 (6, 'Simple, multiple and ridge regression', r'least squares|regression', r'linear regression|ridge'),
 (6, 'Logistic regression', r'logistic', r'logistic regression'),
 (6, 'k-nearest neighbour', r'nearest|knn', r'nearest neighbo'),
 (6, 'Naive Bayes classifier', r'naive bayes', r'naive bayes'),
 (6, 'Linear discriminant analysis', r'fisher|discriminant|linear separab', r'discriminant'),
 (6, 'Support vector machine', r'svm|margin', r'support vector|\bsvm\b'),
 (6, 'Decision trees', r'decision tree|information gain', r'decision tree'),
 (6, 'Bias-variance trade-off', r'bias', r'bias.variance'),
 (6, 'Cross-validation (LOO, k-fold)', r'cross-valid|loocv|leave-one', r'cross.validation|leave.one'),
 (6, 'MLP and feed-forward networks', r'neural|perceptron|relu|backprop|gradient descent|sgd', r'perceptron|neural network|feed.forward|backprop'),
 (6, 'k-means / k-medoid clustering', r'k-means|clustering convergence', r'k-means|k-medoid'),
 (6, 'Hierarchical clustering (single/multiple linkage)', r'hierarchical|linkage', r'hierarchical|linkage'),
 (6, 'Principal component analysis', r'pca|principal component|dimensionality', r'principal component|\bpca\b'),
 (7, 'Uninformed and informed search (A*)', r'search algorithms \| (a\*|uninformed|state space)|heuristic|a\* search', r'a\* search|informed search|uniform.cost|iterative deepening'),
 (7, 'Adversarial search (minimax, alpha-beta)', r'minimax|alpha-beta|game tree', r'minimax|alpha.beta'),
 (7, 'Propositional logic', r'propositional', r'propositional'),
 (7, 'Predicate (first-order) logic', r'first-order|quantifier|predicate', r'first.order|predicate logic|quantifier'),
 (7, 'Conditional independence, Bayesian networks', r'bayesian network|d-separation', r'bayesian network|d.separation|conditional independence'),
 (7, 'Exact inference (variable elimination)', r'inference algorithms|variable elimination|network inference', r'variable elimination'),
 (7, 'Approximate inference (sampling)', r'sampling|approximate inference', r'forward sampling|rejection sampling|gibbs|approximate inference'),
 (8, 'Verbal aptitude', r'^general aptitude \| (grammar|logical inf|phrasal|prepos|reading|vocab)|verbal', r'$^'),
 (8, 'Quantitative aptitude', r'quantitative', r'$^'),
 (8, 'Analytical aptitude', r'analytical', r'$^'),
 (8, 'Spatial aptitude', r'spatial', r'$^'),
]

idx = json.load(open(os.path.join(D, 'index.json')))
chs = idx['chapters']
body = {}
for f in glob.glob(os.path.join(D, 'chapters', '*.json')):
    c = json.load(open(f)); body[c['slug']] = json.dumps(c, ensure_ascii=False).lower()
qs = json.load(open(os.path.join(D, 'pyq-bank.json')))['questions']
for q in qs:
    q['hay'] = f"{q['area']} | {q['topic']}".lower() if q['subject'] != 'General Aptitude' else f"general aptitude | {q['area']} {q['topic']}".lower()
    q['sec'] = next(k for k, v in SEC.items() if v == q['subject'] or q['subject'].startswith(v[:10]))

out, matched = [], set()
for i, (sec, name, qre, nre) in enumerate(TOPICS):
    mq = [q for q in qs if (q['sec'] == sec or q['sec'] in CROSS.get(name, ())) and re.search(qre, q['hay'])]
    for q in mq: matched.add(q['id'])
    cands = []
    for c in chs:
        tit = sum(len(re.findall(nre, s['title'].lower())) for s in c['sections']) + len(re.findall(nre, c['title'].lower()))
        txt = len(re.findall(nre, body[c['slug']]))
        if tit or txt >= 3: cands.append((tit, txt, c))
    cands.sort(key=lambda t: (-t[0], -t[1]))
    top = [t for t in cands if t[0]][:3] or cands[:2]  # section-title matches win over body-text hits
    strong = sum(t[0] for t in top); weak = sum(t[1] for t in top)
    status = 'covered' if strong else ('partial' if weak >= 3 else 'missing')
    yrs = {y: sum(q['marks'] for q in mq if q['year'] == y) for y in (2024, 2025, 2026)}
    asked = sum(1 for y in yrs.values() if y)
    m24, m26 = yrs[2024], yrs[2026]
    trend = ('never asked' if not mq else 'steady' if asked == 3 and abs(m26 - m24) <= 1 else 'rising' if m26 > m24 else 'fading' if m26 < m24 else 'steady')
    if mq and asked == 1: trend = 'sporadic'
    out.append({'id': f't{i+1}', 'section': SEC[sec], 'topic': name, 'status': status,
                'chapters': [{'num': c['num'], 'slug': c['slug'], 'title': c['title'], 'min': c['readingTimeMin']} for _, _, c in top],
                'marks': {str(y): v for y, v in yrs.items()}, 'totalMarks': sum(yrs.values()), 'questions': len(mq), 'yearsAsked': asked,
                'trend': trend, 'pyq': [q['id'] for q in mq]})

extra = [q for q in qs if q['id'] not in matched]
chapters = []
for c in chs:
    mapped = [t for t in out if any(x['num'] == c['num'] for x in t['chapters'])]
    chapters.append({'num': c['num'], 'title': c['title'], 'tag': c['tag'], 'min': c['readingTimeMin'], 'words': c['wordCount'],
                     'topics': len(mapped), 'pyqMarks': sum(t['totalMarks'] for t in mapped)})
json.dump({'syllabus': 'GATE 2027 DA (IIT Madras); content identical to GATE 2026 DA (IIT Guwahati)', 'topics': out, 'chapters': chapters,
           'unmapped': [{'id': q['id'], 'year': q['year'], 'subject': q['subject'], 'area': q['area'], 'topic': q['topic'], 'marks': q['marks']} for q in extra]},
          open(os.path.join(D, 'syllabus-map.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
st = collections.Counter(t['status'] for t in out)
print(len(out), 'topics', dict(st), '| unmapped PYQs:', len(extra))
for t in out:
    if t['status'] != 'covered' or (t['questions'] and t['status']=='partial'): print(f"{t['status']:8} {t['section'][:10]:10} {t['topic'][:50]:50} q={t['questions']} m={t['totalMarks']} {t['trend']}")
for q in extra: print('UNMAPPED', q['id'], q['area'], '|', q['topic'])
