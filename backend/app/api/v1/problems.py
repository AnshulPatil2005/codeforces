from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from app.data import get_all_problems, filter_problems, get_problem_by_id

router = APIRouter(prefix="/problems", tags=["problems"])


@router.get("")
async def get_problems(
    tags: Optional[str] = Query(None, description="Comma-separated list of tags"),
    min_rating: Optional[int] = Query(None, ge=800, le=3500, description="Minimum problem rating"),
    max_rating: Optional[int] = Query(None, ge=800, le=3500, description="Maximum problem rating"),
    search: Optional[str] = Query(None, description="Search by problem name"),
    sort_by: Optional[str] = Query("rating", description="Sort by: rating, solved_count"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of problems to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
) -> Dict[str, Any]:
    """
    Get problemset problems with filtering and sorting.

    Args:
        tags: Filter by tags (comma-separated)
        min_rating: Minimum problem rating
        max_rating: Maximum problem rating
        search: Search query for problem name
        sort_by: Sort field (rating or solved_count)
        limit: Maximum number of results
        offset: Pagination offset

    Returns:
        Dictionary with problems and statistics
    """
    # Parse tags
    tag_list = [t.strip() for t in tags.split(",")] if tags else None

    # Filter problems
    problems = filter_problems(
        min_rating=min_rating,
        max_rating=max_rating,
        tags=tag_list,
        search=search
    )

    # Sort
    if sort_by == "solved_count":
        problems.sort(key=lambda x: x["solved_count"], reverse=True)
    elif sort_by == "rating":
        problems.sort(key=lambda x: x["rating"], reverse=False)

    # Paginate
    total = len(problems)
    problems = problems[offset:offset + limit]

    return {
        "problems": problems,
        "total": total,
        "limit": limit,
        "offset": offset
    }


@router.get("/{problem_id}")
async def get_problem(problem_id: str):
    """
    Get a specific problem by ID.

    Args:
        problem_id: Problem ID

    Returns:
        Problem object
    """
    problem = get_problem_by_id(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail=f"Problem '{problem_id}' not found")
    return problem
