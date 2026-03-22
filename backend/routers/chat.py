from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models.user import User
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import chat_with_assistant, get_chat_history

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def send_message(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    response = await chat_with_assistant(db, current_user.id, payload.message)
    return response


@router.get("/history", response_model=list[ChatResponse])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_chat_history(db, current_user.id)
