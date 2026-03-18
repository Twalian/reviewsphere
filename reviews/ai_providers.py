"""
AI Providers Abstraction Layer for ReviewSphere.

This module provides a unified interface for AI providers
(Gemini, OpenRouter) to perform sentiment analysis and review synthesis.

Supported Providers:
- gemini: Google Gemini (requires GEMINI_API_KEY)
- openrouter: OpenRouter (requires OPENROUTER_API_KEY)

Usage:
    from reviews.ai_providers import get_ai_provider
    
    provider = get_ai_provider()  # Uses AI_PROVIDER env var, default: gemini
    sentiment = provider.analyze_sentiment("Great product!")
    summary = provider.synthesize_reviews(reviews_list)
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import os
import logging

logger = logging.getLogger(__name__)


# Data classes for AI responses
@dataclass
class SentimentResult:
    """Result of sentiment analysis."""
    sentiment: str  # 'positive', 'negative', 'neutral'
    confidence: float  # 0.0 to 1.0
    emotions: Optional[List[str]] = None  # e.g., ['joy', 'satisfaction']


@dataclass
class SynthesisResult:
    """Result of review synthesis/summary."""
    summary: str
    key_themes: List[str]
    pros: List[str]
    cons: List[str]
    overall_sentiment: str


class AIProviderError(Exception):
    """Exception raised when AI provider is not available or not implemented."""
    pass


class AIProvider(ABC):
    """
    Abstract base class for AI providers.
    
    All AI providers must implement:
    - analyze_sentiment(text: str) -> SentimentResult
    - synthesize_reviews(reviews: List[Dict]) -> SynthesisResult
    """
    
    @abstractmethod
    def analyze_sentiment(self, text: str) -> SentimentResult:
        """
        Analyze the sentiment of a given text.
        
        Args:
            text: The text to analyze
            
        Returns:
            SentimentResult with sentiment, confidence, and optional emotions
        """
        pass
    
    @abstractmethod
    def synthesize_reviews(self, reviews: List[Dict[str, Any]]) -> SynthesisResult:
        """
        Synthesize multiple reviews into a summary.
        
        Args:
            reviews: List of review dictionaries with 'title', 'description', 'vote'
            
        Returns:
            SynthesisResult with summary, themes, pros, cons, and sentiment
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the provider is available and configured.
        
        Returns:
            True if provider can be used, False otherwise
        """
        pass


class GeminiProvider(AIProvider):
    """
    Google Gemini AI provider.
    
    Requires GEMINI_API_KEY environment variable.
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get('GEMINI_API_KEY')
        self.model = os.environ.get('GEMINI_MODEL', 'gemini-1.5-flash')
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    def analyze_sentiment(self, text: str) -> SentimentResult:
        """
        Analyze sentiment using Gemini API.
        
        Raises:
            AIProviderError: When API integration is not implemented
        """
        raise AIProviderError(
            "GeminiProvider.analyze_sentiment is not implemented yet. "
            "Integrate the Gemini API to enable this feature."
        )
    
    def synthesize_reviews(self, reviews: List[Dict[str, Any]]) -> SynthesisResult:
        """
        Synthesize reviews using Gemini API.
        
        Raises:
            AIProviderError: When API integration is not implemented
        """
        raise AIProviderError(
            "GeminiProvider.synthesize_reviews is not implemented yet. "
            "Integrate the Gemini API to enable this feature."
        )


class OpenRouterProvider(AIProvider):
    """
    OpenRouter AI provider.
    
    OpenRouter provides access to open-source models (Llama 3, Mistral, etc.).
    Requires OPENROUTER_API_KEY environment variable.
    
    Website: https://openrouter.ai
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get('OPENROUTER_API_KEY')
        self.model = os.environ.get('OPENROUTER_MODEL', 'meta-llama/llama-3-8b-instruct')
        self.base_url = 'https://openrouter.ai/api/v1'
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    def analyze_sentiment(self, text: str) -> SentimentResult:
        """
        Analyze sentiment using OpenRouter API.
        
        Raises:
            AIProviderError: When API integration is not implemented
        """
        raise AIProviderError(
            "OpenRouterProvider.analyze_sentiment is not implemented yet. "
            "Integrate the OpenRouter API to enable this feature."
        )
    
    def synthesize_reviews(self, reviews: List[Dict[str, Any]]) -> SynthesisResult:
        """
        Synthesize reviews using OpenRouter API.
        
        Raises:
            AIProviderError: When API integration is not implemented
        """
        raise AIProviderError(
            "OpenRouterProvider.synthesize_reviews is not implemented yet. "
            "Integrate the OpenRouter API to enable this feature."
        )


def get_ai_provider(provider_name: str = None) -> AIProvider:
    """
    Factory function to get the configured AI provider.
    
    Args:
        provider_name: Force a specific provider ('gemini', 'openrouter')
                      If None, uses AI_PROVIDER env var (default: 'gemini')
    
    Returns:
        An instance of AIProvider
    
    Raises:
        AIProviderError: If the provider is not available (no API key configured)
                       or if the provider name is unknown
    
    Examples:
        # Auto-detect provider from environment
        provider = get_ai_provider()
        
        # Force specific provider
        provider = get_ai_provider('openrouter')
    """
    if provider_name is None:
        provider_name = os.environ.get('AI_PROVIDER', 'gemini').lower()
    
    providers = {
        'gemini': GeminiProvider,
        'google': GeminiProvider,
        'openrouter': OpenRouterProvider,
    }
    
    if provider_name not in providers:
        raise AIProviderError(
            f"AI service unavailable: unknown provider '{provider_name}'. "
            f"Available providers: gemini, openrouter"
        )
    
    provider_class = providers[provider_name]
    provider = provider_class()
    
    if not provider.is_available():
        env_var = 'GEMINI_API_KEY' if provider_name in ('gemini', 'google') else 'OPENROUTER_API_KEY'
        raise AIProviderError(
            f"AI service unavailable: {provider_name} API key is not configured. "
            f"Please set the {env_var} environment variable."
        )
    
    logger.info(f"Using AI provider: {provider_name}")
    return provider


def get_available_providers() -> Dict[str, bool]:
    """
    Get a dictionary of available providers.
    
    Returns:
        Dict mapping provider names to availability status
    """
    return {
        'gemini': GeminiProvider().is_available(),
        'openrouter': OpenRouterProvider().is_available(),
    }


def check_ai_available() -> bool:
    """
    Check if any AI provider is available.
    
    Returns:
        True if at least one provider is configured, False otherwise
    """
    return any(get_available_providers().values())
