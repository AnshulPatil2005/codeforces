"""Mock problems data for the application"""

MOCK_PROBLEMS = [
    {"id": "1A", "name": "Two Sum", "rating": 800, "tags": ["math", "implementation"], "solved_count": 15234},
    {"id": "1B", "name": "Array Rotation", "rating": 900, "tags": ["arrays", "implementation"], "solved_count": 12456},
    {"id": "2A", "name": "Binary Search Tree", "rating": 1200, "tags": ["data structures", "trees"], "solved_count": 8934},
    {"id": "2B", "name": "Dynamic Programming Basics", "rating": 1400, "tags": ["dp", "algorithms"], "solved_count": 7123},
    {"id": "3A", "name": "Graph Traversal", "rating": 1600, "tags": ["graphs", "dfs", "bfs"], "solved_count": 5678},
    {"id": "3B", "name": "String Matching", "rating": 1500, "tags": ["strings", "algorithms"], "solved_count": 6234},
    {"id": "4A", "name": "Greedy Algorithm", "rating": 1700, "tags": ["greedy", "sortings"], "solved_count": 4567},
    {"id": "4B", "name": "Number Theory", "rating": 1800, "tags": ["math", "number theory"], "solved_count": 3890},
    {"id": "5A", "name": "Segment Tree", "rating": 2000, "tags": ["data structures", "trees"], "solved_count": 2345},
    {"id": "5B", "name": "Advanced DP", "rating": 2100, "tags": ["dp", "optimization"], "solved_count": 1987},
    {"id": "6A", "name": "Network Flow", "rating": 2300, "tags": ["graphs", "flows"], "solved_count": 1456},
    {"id": "6B", "name": "Suffix Array", "rating": 2400, "tags": ["strings", "data structures"], "solved_count": 1234},
    {"id": "7A", "name": "Geometry Problem", "rating": 1900, "tags": ["geometry", "math"], "solved_count": 2789},
    {"id": "7B", "name": "Combinatorics", "rating": 2200, "tags": ["math", "combinatorics"], "solved_count": 1678},
    {"id": "8A", "name": "Bitwise Operations", "rating": 1300, "tags": ["bitmasks", "implementation"], "solved_count": 7890},
    {"id": "8B", "name": "Two Pointers", "rating": 1100, "tags": ["two pointers", "sortings"], "solved_count": 9234},
    {"id": "9A", "name": "Trie Structure", "rating": 1850, "tags": ["data structures", "strings"], "solved_count": 3456},
    {"id": "9B", "name": "Dijkstra's Algorithm", "rating": 1750, "tags": ["graphs", "shortest paths"], "solved_count": 4123},
    {"id": "10A", "name": "Binary Indexed Tree", "rating": 1950, "tags": ["data structures", "trees"], "solved_count": 2678},
    {"id": "10B", "name": "Matrix Exponentiation", "rating": 2150, "tags": ["math", "matrices"], "solved_count": 1890},
    {"id": "11A", "name": "Sliding Window", "rating": 1250, "tags": ["two pointers", "implementation"], "solved_count": 8456},
    {"id": "11B", "name": "Monotonic Stack", "rating": 1650, "tags": ["data structures", "stacks"], "solved_count": 5234},
    {"id": "12A", "name": "Knapsack Problem", "rating": 1550, "tags": ["dp", "classical"], "solved_count": 6789},
    {"id": "12B", "name": "LCA in Tree", "rating": 1900, "tags": ["trees", "binary lifting"], "solved_count": 3123},
    {"id": "13A", "name": "Modular Arithmetic", "rating": 1450, "tags": ["math", "number theory"], "solved_count": 7234},
    {"id": "13B", "name": "Strongly Connected Components", "rating": 2050, "tags": ["graphs", "dfs"], "solved_count": 2456},
    {"id": "14A", "name": "Heap Operations", "rating": 1350, "tags": ["data structures", "heaps"], "solved_count": 7567},
    {"id": "14B", "name": "FFT Application", "rating": 2500, "tags": ["math", "fft"], "solved_count": 987},
    {"id": "15A", "name": "Union Find", "rating": 1400, "tags": ["data structures", "dsu"], "solved_count": 7012},
    {"id": "15B", "name": "Centroid Decomposition", "rating": 2600, "tags": ["trees", "divide and conquer"], "solved_count": 678},
]


def get_all_problems():
    """Get all problems"""
    return MOCK_PROBLEMS


def filter_problems(min_rating=None, max_rating=None, tags=None, search=None):
    """Filter problems by criteria"""
    filtered = MOCK_PROBLEMS.copy()

    if min_rating is not None:
        filtered = [p for p in filtered if p["rating"] >= min_rating]

    if max_rating is not None:
        filtered = [p for p in filtered if p["rating"] <= max_rating]

    if tags:
        tag_list = tags if isinstance(tags, list) else [tags]
        filtered = [p for p in filtered if any(tag in p["tags"] for tag in tag_list)]

    if search:
        search_lower = search.lower()
        filtered = [p for p in filtered if search_lower in p["name"].lower() or search_lower in p["id"].lower()]

    return filtered


def get_problem_by_id(problem_id: str):
    """Get a specific problem by ID"""
    for problem in MOCK_PROBLEMS:
        if problem["id"] == problem_id:
            return problem
    return None
