import re


def santise_content(content: str) -> str:
    """
    Sanitizes content by removing HTML tags, normalizing whitespace,
    removing wrapping quotes, and cleaning up formatting.

    Args:
        content: The string content to sanitize

    Returns:
        Cleaned and sanitized string
    """
    if not content or not isinstance(content, str):
        return ""

    # Remove HTML/XML tags (more comprehensive pattern)
    content = re.sub(r"<[^<>]*>", r"", content)

    # Remove HTML entities
    content = re.sub(r"&[a-zA-Z0-9#]+;", r" ", content)

    # Normalize all whitespace characters (spaces, tabs, newlines, etc.)
    content = re.sub(r"\s+", r" ", content)

    # Remove matching quotes only if they wrap the entire content
    content = re.sub(r"^(['\"])(.*?)\1$", r"\2", content)

    # Remove leading/trailing whitespace
    content = content.strip()

    # Handle edge case where content becomes empty after quote removal
    if not content:
        return ""

    return content
