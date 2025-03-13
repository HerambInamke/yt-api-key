import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Youtube } from 'lucide-react';

interface DataItem {
  id: number;
  name: string;
  description: string;
  category: string;
  potentialPaths: string[];
  skills: string[];
  roadmap: string[];
}

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DataItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);

  const searchDataset = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setYoutubeVideos([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
      
      // Ensure we have valid data before updating state
      const validResults = Array.isArray(data) ? data : [];
      setSearchResults(validResults);

      // Only fetch YouTube videos if we have search results
      if (validResults.length > 0) {
        const youtubeResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(query)}&key=AIzaSyARzVTQrBtCheZf5NXzkizXOpm6WceymOI`
        );
        setYoutubeVideos(youtubeResponse.data?.items || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
      setYoutubeVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchDataset(searchQuery);
      } else {
        setSearchResults([]);
        setYoutubeVideos([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Career Explorer</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
            <Search className="h-5 w-5 text-gray-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, skills, or roles..."
              className="w-full px-4 py-3 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dataset Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Career Paths</h2>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-xl text-gray-900">{result.name}</h3>
                <p className="text-gray-600 mt-2">{result.description}</p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">Key Skills:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Results */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Youtube className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold">Related Videos</h2>
            </div>
            {youtubeVideos.map((video) => (
              <div
                key={video.id.videoId}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full rounded-lg mb-3"
                />
                <h3 className="font-medium text-lg">{video.snippet.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {video.snippet.description}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-red-600 hover:text-red-700"
                >
                  Watch Video
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;