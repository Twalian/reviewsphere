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
import json
import requests
import google.generativeai as genai

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


@dataclass
class ComparisonResult:
    """Result of product comparison."""
    comparison: str
    winner_recommendation: str


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
        """
        raise NotImplementedError
    
    @abstractmethod
    def synthesize_reviews(self, reviews: List[Dict[str, Any]]) -> SynthesisResult:
        """
        Synthesize multiple reviews into a summary.
        """
        raise NotImplementedError
    
    @abstractmethod
    def compare_products(self, products_data: List[Dict[str, Any]]) -> ComparisonResult:
        """
        Compare two or more products based on their data and reviews.
        """
        raise NotImplementedError
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the provider is available and configured.
        """
        raise NotImplementedError


class GeminiProvider(AIProvider):
    """
    Google Gemini AI provider.
    
    Requires GEMINI_API_KEY environment variable.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get('GEMINI_API_KEY')
        self.model_name = os.environ.get('GEMINI_MODEL', 'gemini-flash-latest')
        if self.api_key:
            genai.configure(api_key=self.api_key)
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    def _get_model(self):
        return genai.GenerativeModel(self.model_name)

    def analyze_sentiment(self, text: str) -> SentimentResult:
        """
        Analyze sentiment using Gemini API with JSON mode.
        """
        if not self.is_available():
            raise AIProviderError("Gemini API key not configured")

        prompt = (
            f"Analyze the sentiment of the following product review text. "
            f"Return a JSON object with the following structure:\n"
            f'{{"sentiment": "positive"|"negative"|"neutral", '
            f'"confidence": float (0-1), '
            f'"emotions": ["emozione1", "emozione2"]}}\n'
            f"IMPORTANT: Provide the list of emotions in ITALIAN.\n\n"
            f"Review Text: {text}"
        )

        try:
            model = self._get_model()
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            data = json.loads(response.text)
            return SentimentResult(
                sentiment=data.get('sentiment', 'neutral'),
                confidence=data.get('confidence', 0.5),
                emotions=data.get('emotions', [])
            )
        except Exception as e:
            logger.error(f"Gemini analyze_sentiment error: {str(e)}")
            raise AIProviderError(f"AI Provider error: {str(e)}")
    
    def synthesize_reviews(self, reviews: List[Dict[str, Any]]) -> SynthesisResult:
        """
        Synthesize reviews using Gemini API with JSON mode.
        """
        if not self.is_available():
            raise AIProviderError("Gemini API key not configured")

        reviews_text = "\n---\n".join([
            f"Title: {r.get('title')}\nVote: {r.get('vote')}/5\nText: {r.get('description')}" 
            for r in reviews
        ])

        prompt = (
            f"Synthesize the following product reviews into a coherent summary in ITALIAN. "
            f"Highlight key themes, pros, and cons mentioned by customers. "
            f"Return a JSON object with the following structure:\n"
            f'{{"summary": "Un paragrafo conciso di riassunto", '
            f'"key_themes": ["tema1", "tema2"], '
            f'"pros": ["pro1", "pro2"], '
            f'"cons": ["contro1", "contro2"], '
            f'"overall_sentiment": "positive"|"negative"|"neutral"}}\n'
            f"IMPORTANT: All user-facing text (summary, themes, pros, cons) MUST BE IN ITALIAN.\n\n"
            f"Reviews:\n{reviews_text}"
        )

        try:
            model = self._get_model()
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            data = json.loads(response.text)
            return SynthesisResult(
                summary=data.get('summary', ''),
                key_themes=data.get('key_themes', []),
                pros=data.get('pros', []),
                cons=data.get('cons', []),
                overall_sentiment=data.get('overall_sentiment', 'neutral')
            )
        except Exception as e:
            logger.error(f"Gemini synthesize_reviews error: {str(e)}")
            raise AIProviderError(f"AI Provider error: {str(e)}")

    def compare_products(self, products_data: List[Dict[str, Any]]) -> ComparisonResult:
        """Compare products using Gemini."""
        if not self.is_available():
            raise AIProviderError("Gemini API key not configured")

        try:
            comparison_context = ""
            for p in products_data:
                comparison_context += f"Product: {p['name']}\n"
                comparison_context += f"Avg Rating: {p['avg_rating']}\n"
                comparison_context += f"AI Summary: {p['ai_summary']}\n"
                comparison_context += "---\n"

            prompt = (
                f"Compare the following products based on their aggregated review summaries and ratings in ITALIAN.\n"
                f"Identify key differences, pros and cons of each product, which one is better for which use case, and give a final recommendation.\n"
                f"Include explicitly the pros and cons of each product along with the AI recommendation.\n"
                f"Return ONLY a JSON object with this structure:\n"
                f'{{"comparison": "Testo dettagliato del confronto con pro e contro...", "winner_recommendation": "Nome Prodotto - motivo"}}\n'
                f"IMPORTANT: All text (comparison and winner_recommendation) MUST BE IN ITALIAN.\n\n"
                f"{comparison_context}"
            )

            model = self._get_model()
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return ComparisonResult(
                comparison=data.get("comparison", ""),
                winner_recommendation=data.get("winner_recommendation", "")
            )
        except Exception as e:
            logger.error(f"Gemini compare_products error: {str(e)}")
            raise AIProviderError(f"AI Provider error: {str(e)}")


class OpenRouterProvider(AIProvider):
    """
    OpenRouter AI provider.
    
    OpenRouter provides access to open-source models (Llama 3, Mistral, etc.).
    Requires OPENROUTER_API_KEY environment variable.
    
    Website: https://openrouter.ai
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get('OPENROUTER_API_KEY')
        self.model = os.environ.get('OPENROUTER_MODEL', 'meta-llama/llama-3-8b-instruct')
        self.base_url = 'https://openrouter.ai/api/v1'
    
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    def _call_api(self, prompt: str) -> Dict[str, Any]:
        """Helper to call OpenRouter API."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://reviewsphere.com", # Required by OpenRouter
            "X-Title": "ReviewSphere",
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"} # Some models support this
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            if response.status_code != 200:
                logger.error(f"OpenRouter error {response.status_code}: {response.text}")
            response.raise_for_status()
            result = response.json()
            content = result['choices'][0]['message']['content']
            return json.loads(content)
        except Exception as e:
            logger.error(f"OpenRouter API error: {str(e)}")
            raise AIProviderError(f"OpenRouter Provider error: {str(e)}")

    def compare_products(self, products_data: List[Dict[str, Any]]) -> ComparisonResult:
        """Compare products using OpenRouter."""
        if not self.is_available():
            raise AIProviderError("OpenRouter API key not configured")

        comparison_context = ""
        for p in products_data:
            comparison_context += f"Product: {p['name']}\n"
            comparison_context += f"Avg Rating: {p['avg_rating']}\n"
            comparison_context += f"AI Summary: {p['ai_summary']}\n"
            comparison_context += "---\n"

        prompt = (
            f"Compare the following products based on their aggregated review summaries and ratings in ITALIAN.\n"
            f"Identify key differences, pros and cons of each product, which one is better for which use case, and give a final recommendation.\n"
            f"Include explicitly the pros and cons of each product along with the AI recommendation.\n"
            f"Return ONLY a JSON object with this structure:\n"
            f'{{"comparison": "Testo dettagliato del confronto con pro e contro...", "winner_recommendation": "Nome Prodotto - motivo"}}\n'
            f"IMPORTANT: All text (comparison and winner_recommendation) MUST BE IN ITALIAN.\n\n"
            f"{comparison_context}"
        )

        data = self._call_api(prompt)
        return ComparisonResult(
            comparison=data.get("comparison", ""),
            winner_recommendation=data.get("winner_recommendation", "")
        )

    def analyze_sentiment(self, text: str) -> SentimentResult:
        """
        Analyze sentiment using OpenRouter API.
        """
        if not self.is_available():
            raise AIProviderError("OpenRouter API key not configured")

        prompt = (
            f"Analyze the sentiment of the following product review text. "
            f"Return ONLY a JSON object with this structure:\n"
            f'{{"sentiment": "positive"|"negative"|"neutral", '
            f'"confidence": float (0-1), '
            f'"emotions": ["emozione1", "emozione2"]}}\n'
            f"IMPORTANT: Provide the list of emotions in ITALIAN.\n\n"
            f"Review Text: {text}"
        )

        data = self._call_api(prompt)
        return SentimentResult(
            sentiment=data.get('sentiment', 'neutral'),
            confidence=data.get('confidence', 0.5),
            emotions=data.get('emotions', [])
        )
    
    def synthesize_reviews(self, reviews: List[Dict[str, Any]]) -> SynthesisResult:
        """
        Synthesize reviews using OpenRouter API.
        """
        if not self.is_available():
            raise AIProviderError("OpenRouter API key not configured")

        reviews_text = "\n---\n".join([
            f"Title: {r.get('title')}\nVote: {r.get('vote')}/5\nText: {r.get('description')}" 
            for r in reviews
        ])

        prompt = (
            f"Synthesize these product reviews into a summary in ITALIAN. "
            f"Include themes, pros, and cons. "
            f"Return ONLY a JSON object with this structure:\n"
            f'{{"summary": "riassunto", "key_themes": ["tema"], '
            f'"pros": ["pro"], "cons": ["contro"], "overall_sentiment": "positive"}}\n'
            f"IMPORTANT: All user-facing text (summary, themes, pros, cons) MUST BE IN ITALIAN.\n\n"
            f"Reviews:\n{reviews_text}"
        )

        data = self._call_api(prompt)
        return SynthesisResult(
            summary=data.get('summary', ''),
            key_themes=data.get('key_themes', []),
            pros=data.get('pros', []),
            cons=data.get('cons', []),
            overall_sentiment=data.get('overall_sentiment', 'neutral')
        )


def get_ai_provider(provider_name: Optional[str] = None) -> AIProvider:
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
