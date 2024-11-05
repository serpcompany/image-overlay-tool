import React, { useState, useEffect } from 'react';
import { Play, Copy, Check } from 'lucide-react';
import { UrlInput } from './components/UrlInput';
import { extractVideoId, getBestThumbnail } from './utils/youtube';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [inputType, setInputType] = useState<'image' | 'youtube'>('image');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imgParam = params.get('img');
    const ytParam = params.get('yt');

    if (imgParam) {
      setImageUrl(decodeURIComponent(imgParam));
      setInputType('image');
    }
    if (ytParam) {
      setYoutubeUrl(decodeURIComponent(ytParam));
      setInputType('youtube');
      handleYoutubeUrlChange(decodeURIComponent(ytParam));
    }
  }, []);

  const handleYoutubeUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    if (!url) {
      setImageUrl('');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL. Please check the URL and try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const thumbnailUrl = await getBestThumbnail(videoId);
      setImageUrl(thumbnailUrl);
      setError('');
    } catch (err) {
      setError('Failed to fetch thumbnail. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setCopied(false);
  };

  const handleImageError = () => {
    setError('Unable to load image. Please check the URL and try again.');
    setImageUrl('');
  };

  const generateEmbedCode = () => {
    const videoUrl = youtubeUrl || `https://youtube.com/watch?v=${extractVideoId(imageUrl) || ''}`;
    return `<a href="${videoUrl}" target="_blank">
  <img src="${imageUrl}" alt="YouTube thumbnail with play button overlay" width="700px">
</a>`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">YouTube Thumbnail Play Button Overlay</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleUrlSubmit} className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-4">
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value as 'image' | 'youtube')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="image">Enter image URL</option>
                <option value="youtube">Enter YouTube video</option>
              </select>

              {inputType === 'image' && (
                <UrlInput 
                  type="image"
                  value={imageUrl}
                  defaultValue={imageUrl}
                  onChange={setImageUrl}
                />
              )}
              
              {inputType === 'youtube' && (
                <UrlInput 
                  type="youtube"
                  value={youtubeUrl}
                  defaultValue={youtubeUrl}
                  onChange={handleYoutubeUrlChange}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Loading...' : 'Preview'}
            </button>
          </div>
        </form>

        {imageUrl && !error && (
          <div className="space-y-4">
            <div className="relative inline-block group">
              <img
                src={imageUrl}
                alt="Thumbnail preview"
                onError={handleImageError}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 rounded-full p-4">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Embed Code</h3>
                <button
                  onClick={() => copyToClipboard(generateEmbedCode())}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-white p-4 rounded-md overflow-x-auto text-sm">
                <code>{generateEmbedCode()}</code>
              </pre>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">How to use:</h2>
              <p className="text-gray-600 mb-4">
                1. Enter a YouTube URL or image URL above<br />
                2. Copy the embed code<br />
                3. Paste the code into your website or blog
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;