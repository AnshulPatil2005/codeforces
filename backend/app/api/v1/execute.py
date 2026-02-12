from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.executor import CodeExecutor

router = APIRouter(prefix="/execute", tags=["execute"])


class ExecuteRequest(BaseModel):
    language: str
    code: str
    input: Optional[str] = ""


class ExecuteResponse(BaseModel):
    success: bool
    output: str
    error: str
    exit_code: int


@router.post("", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    """Execute code in the specified language"""

    # Validate language
    supported_languages = ["python", "cpp", "java", "javascript"]
    if request.language.lower() not in supported_languages:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language. Supported: {', '.join(supported_languages)}"
        )

    # Execute code
    result = CodeExecutor.execute(
        language=request.language,
        code=request.code,
        input_data=request.input
    )

    return result
