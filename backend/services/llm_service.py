"""
LLM Service — Abstraction layer for AI/LLM integration.

Supports plugging in:
  - OpenAI API
  - OpenRouter API
  - Local models (Ollama, llama.cpp)
  - RAG pipeline (future)

Currently uses a built-in rule-based fallback so the app works
without any API key configured.
"""

from config import OPENAI_API_KEY

# Provider can be: "openai", "openrouter", "local", "fallback"
_PROVIDER = "openai" if OPENAI_API_KEY else "fallback"

SYSTEM_PROMPT = """You are an AI Career Assistant specializing in helping students 
become industry-ready in AI, VLSI, and software engineering. You provide:
- Personalized career guidance
- Resume feedback and improvement suggestions
- Interview preparation tips
- Learning path recommendations
- Industry insights and trends
- Internship and job search strategies

Be concise, actionable, and encouraging. Tailor advice to the student's 
background and goals."""


async def get_chat_response(user_message: str, chat_history: list[dict] | None = None) -> str:
    """
    Get a response from the configured LLM provider.

    Args:
        user_message: The user's message
        chat_history: Previous messages [{"role": "user"|"assistant", "message": "..."}]

    Returns:
        The assistant's response string
    """
    if _PROVIDER == "openai" and OPENAI_API_KEY:
        return await _openai_chat(user_message, chat_history)
    return _fallback_chat(user_message)


async def _openai_chat(user_message: str, chat_history: list[dict] | None = None) -> str:
    """Call OpenAI-compatible API (works with OpenRouter too)."""
    try:
        import httpx

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if chat_history:
            for msg in chat_history[-10:]:  # Last 10 messages for context
                messages.append({"role": msg["role"], "content": msg["message"]})

        messages.append({"role": "user", "content": user_message})

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except Exception:
        return _fallback_chat(user_message)


def _fallback_chat(user_message: str) -> str:
    """Rule-based fallback when no LLM API is configured."""
    msg = user_message.lower()

    if any(w in msg for w in ["resume", "cv"]):
        return (
            "Here are some resume tips:\n\n"
            "1. **Quantify achievements** — use numbers to show impact\n"
            "2. **Tailor for each role** — match keywords from the job description\n"
            "3. **Keep it concise** — 1 page for students, 2 max for experienced\n"
            "4. **Add projects** — showcase personal/academic projects with tech stack\n"
            "5. **Use action verbs** — Built, Designed, Implemented, Optimized\n\n"
            "Would you like me to review specific sections of your resume?"
        )

    if any(w in msg for w in ["interview", "prepare"]):
        return (
            "Interview preparation strategy:\n\n"
            "1. **Data Structures & Algorithms** — practice on LeetCode/HackerRank\n"
            "2. **System Design** — learn distributed systems basics\n"
            "3. **Behavioral questions** — prepare STAR method stories\n"
            "4. **Domain knowledge** — review fundamentals of your target role\n"
            "5. **Mock interviews** — practice with peers or AI tools\n\n"
            "What role are you preparing for?"
        )

    if any(w in msg for w in ["vlsi", "semiconductor", "chip", "verilog"]):
        return (
            "VLSI Career Guidance:\n\n"
            "1. **Core skills**: Verilog/VHDL, SystemVerilog, FPGA\n"
            "2. **Key domains**: RTL Design, Verification (UVM), Physical Design, DFT\n"
            "3. **Tools**: Cadence, Synopsys, Mentor Graphics\n"
            "4. **Top companies**: Intel, AMD, NVIDIA, Qualcomm, Texas Instruments\n"
            "5. **Learning**: Start with digital design fundamentals, then specialize\n\n"
            "Which area of VLSI interests you most?"
        )

    if any(w in msg for w in ["ai", "machine learning", "ml", "deep learning"]):
        return (
            "AI/ML Career Path:\n\n"
            "1. **Foundation**: Python, Linear Algebra, Probability & Statistics\n"
            "2. **Core ML**: Scikit-learn, supervised/unsupervised learning\n"
            "3. **Deep Learning**: TensorFlow or PyTorch, CNNs, RNNs, Transformers\n"
            "4. **Specialization**: NLP, Computer Vision, or Reinforcement Learning\n"
            "5. **Production**: MLOps, model deployment, monitoring\n\n"
            "What's your current level of experience with ML?"
        )

    if any(w in msg for w in ["job", "career", "internship", "opportunity"]):
        return (
            "Job Search Strategy:\n\n"
            "1. **Build a portfolio** — GitHub projects, blog posts, contributions\n"
            "2. **Network actively** — LinkedIn, tech meetups, conferences\n"
            "3. **Target companies** — research culture, tech stack, and growth\n"
            "4. **Apply strategically** — quality over quantity, tailor applications\n"
            "5. **Upskill continuously** — certifications, courses, side projects\n\n"
            "What type of role are you looking for?"
        )

    return (
        "I'm your AI Career Assistant! I can help with:\n\n"
        "- **Resume review** and improvement tips\n"
        "- **Career guidance** for AI, VLSI, and software engineering\n"
        "- **Interview preparation** strategies\n"
        "- **Job search** advice and strategies\n"
        "- **Learning path** recommendations\n"
        "- **Skill development** planning\n\n"
        "What would you like help with today?"
    )
