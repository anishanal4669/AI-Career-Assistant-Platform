from sqlalchemy.orm import Session

from models.chat_history import ChatHistory
from services.llm_service import get_chat_response


async def chat_with_assistant(db: Session, user_id: int, message: str) -> ChatHistory:
    """Process a user message and return the assistant's response."""
    # Save user message
    user_msg = ChatHistory(user_id=user_id, role="user", message=message)
    db.add(user_msg)
    db.commit()

    # Get conversation history for context
    history = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.desc())
        .limit(20)
        .all()
    )
    history.reverse()
    history_dicts = [{"role": h.role, "message": h.message} for h in history]

    # Get LLM response
    response_text = await get_chat_response(message, history_dicts)

    # Save assistant response
    assistant_msg = ChatHistory(user_id=user_id, role="assistant", message=response_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg


def get_chat_history(db: Session, user_id: int, limit: int = 50) -> list[ChatHistory]:
    return (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.asc())
        .limit(limit)
        .all()
    )
