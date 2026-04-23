// src/pages/WatchLivePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WatchLivePage = () => {
  const navigate = useNavigate();
  
  const [isLive, setIsLive] = useState(false);
  const [latestVideo, setLatestVideo] = useState(null);
  const [liveVideoId, setLiveVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [channelInfo, setChannelInfo] = useState(null);
  
  // YouTube Channel ID for Sound of Revival
  const CHANNEL_ID = 'UCpmZmnDshp0o48IZvhB5AbQ';
  const CHANNEL_HANDLE = 'soundofrmsons';
  const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`; // Remove 'UC' and prepend 'UU'
  
  // API Key – optional, only for fetching live status and channel info
  const API_KEY = 'AIzaSyBdh9IkFnoGeCb7VvzLyG2U09QzPE-EWh4';
  
  const revealRefs = useRef([]);
  const videoPollingInterval = useRef(null);

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Fetch channel info (optional)
  const fetchChannelInfo = async () => {
    if (!API_KEY) return;
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.items?.[0]) setChannelInfo(data.items[0]);
    } catch (err) {
      console.error('Error fetching channel info:', err);
    }
  };

  // Check for live stream (only if API key works)
  const checkLiveStream = async () => {
    if (!API_KEY) return false;
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.items?.[0]) {
        const videoId = data.items[0].id.videoId;
        setLiveVideoId(videoId);
        setIsLive(true);
        return true;
      }
      setIsLive(false);
      setLiveVideoId(null);
      return false;
    } catch (err) {
      console.error('Live check error:', err);
      return false;
    }
  };

  // Fetch latest video info (for display only)
  const fetchLatestVideo = async () => {
    if (!API_KEY) {
      setIsLoading(false);
      return;
    }
    try {
      const hasLive = await checkLiveStream();
      if (!hasLive) {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${API_KEY}`
        );
        const data = await res.json();
        if (data.items?.[0]) setLatestVideo(data.items[0]);
      }
    } catch (err) {
      console.error('Error fetching latest video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for live status every 30s
  const startPolling = () => {
    if (videoPollingInterval.current) clearInterval(videoPollingInterval.current);
    videoPollingInterval.current = setInterval(async () => {
      if (API_KEY) {
        const isLiveNow = await checkLiveStream();
        if (isLiveNow !== isLive) {
          setIsLive(isLiveNow);
        }
      }
    }, 30000);
  };

  useEffect(() => {
    fetchChannelInfo();
    fetchLatestVideo();
    startPolling();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealRefs.current.forEach(el => el && observer.observe(el));

    return () => {
      observer.disconnect();
      if (videoPollingInterval.current) clearInterval(videoPollingInterval.current);
    };
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatSubscribers = (count) => {
    if (!count) return '';
    if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
    if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K`;
    return count.toString();
  };

  // CRITICAL: Get embed URL that always works
  const getYouTubeEmbedUrl = () => {
    if (isLive && liveVideoId) {
      // Live stream embed (if we detected one)
      return `https://www.youtube.com/embed/${liveVideoId}?autoplay=1&live=1&rel=0`;
    }
    // Fallback: Channel uploads playlist (reliable)
    return `https://www.youtube.com/embed/videoseries?list=${UPLOADS_PLAYLIST_ID}&rel=0`;
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e]">
      <div className="wl-sub min-h-screen bg-[#0c0c0e]">
        {/* Header */}
        <div className="wl-sub-header py-20 text-center border-b border-[rgba(255,255,255,0.07)]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to="/" 
              onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
              className="wl-sub-back inline-flex items-center gap-1.5 text-sm text-[#a1a1a6] mb-5 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
            <h2 className="wl-sub-title font-['DM_Serif_Display'] text-2xl md:text-3xl text-white mb-1">
              Watch Live
            </h2>
            <p className="wl-sub-desc text-sm text-[#6e6e73]">
              Watch the Sound of Revival broadcast worship, teachings, and prayer.
            </p>
          </div>
        </div>

        {/* YouTube Embed */}
        <div className="wl-embed-wrap max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {isLive && (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-semibold text-red-400">LIVE NOW</span>
              </div>
            </div>
          )}
          
          <div ref={addToRefs} className="wl-embed relative w-full pb-[56.25%] rounded-2xl overflow-hidden bg-black border border-[rgba(255,255,255,0.07)] shadow-2xl reveal">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a0a3d] to-[#2d1065]">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-white/20 border-t-[#7c3aed] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/60 text-sm">Loading broadcast...</p>
                </div>
              </div>
            ) : (
              <iframe
                key={isLive ? liveVideoId : UPLOADS_PLAYLIST_ID} // Force refresh on change
                src={getYouTubeEmbedUrl()}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Sound of Revival - Latest Videos"
              ></iframe>
            )}
          </div>

          {/* Latest video info (if available) */}
          {!isLoading && latestVideo && !isLive && (
            <div className="mt-4 p-4 bg-[#161618] rounded-xl border border-[rgba(255,255,255,0.07)]">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm mb-1">
                    Latest: {latestVideo.snippet?.title}
                  </h3>
                  <p className="text-[#6e6e73] text-xs">
                    {formatDate(latestVideo.snippet?.publishedAt)}
                  </p>
                </div>
                <a 
                  href={`https://www.youtube.com/watch?v=${latestVideo.id?.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-xs font-medium hover:bg-[#6d28d9] transition-all whitespace-nowrap"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          )}

          {/* Channel info */}
          {channelInfo && (
            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {channelInfo.snippet?.thumbnails?.default?.url && (
                  <img src={channelInfo.snippet.thumbnails.default.url} alt={channelInfo.snippet.title} className="w-12 h-12 rounded-full" />
                )}
                <div>
                  <h3 className="text-white font-medium text-sm">{channelInfo.snippet?.title}</h3>
                  <p className="text-[#6e6e73] text-xs">
                    {formatSubscribers(channelInfo.statistics?.subscriberCount)} subscribers
                  </p>
                </div>
              </div>
              <a 
                href={`https://www.youtube.com/@${CHANNEL_HANDLE}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-all"
              >
                Subscribe
              </a>
            </div>
          )}
        </div>

        {/* Info Cards (unchanged) */}
        <div className="wl-info max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-5">
          <div ref={addToRefs} className="wl-info-card flex-1 min-w-[200px] bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 reveal">
            <h4 className="font-['DM_Serif_Display'] text-base text-[#f5f5f7] mb-2">Schedule</h4>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              Global Bible Study & Prayer Watch<br/>
              Nigeria Time: 11PM- 12AM WAT<br/>
              UK: 11PM–12AM<br/>
              US (EST): 6PM–7PM
            </p>
          </div>
          <div ref={addToRefs} className="wl-info-card flex-1 min-w-[200px] bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 reveal">
            <h4 className="font-['DM_Serif_Display'] text-base text-[#f5f5f7] mb-2">Can't Watch Live?</h4>
            <p className="text-xs text-[#6e6e73] leading-relaxed mb-3">
              All sessions are recorded and available on our{' '}
              <a href={`https://www.youtube.com/@${CHANNEL_HANDLE}`} target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:underline">
                YouTube channel
              </a>{' '}
              as replays.
            </p>
            {!isLive && latestVideo && (
              <p className="text-xs text-[#6e6e73] pt-2 border-t border-[rgba(255,255,255,0.07)]">
                Latest: {latestVideo.snippet?.title?.substring(0, 50)}...
              </p>
            )}
          </div>
          <div ref={addToRefs} className="wl-info-card flex-1 min-w-[200px] bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 reveal">
            <h4 className="font-['DM_Serif_Display'] text-base text-[#f5f5f7] mb-2">Subscribe</h4>
            <p className="text-xs text-[#6e6e73] leading-relaxed mb-4">
              Hit the subscribe button and turn on notifications so you never miss a live session.
            </p>
            <a href={`https://www.youtube.com/@${CHANNEL_HANDLE}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
              Subscribe on YouTube
              <span>→</span>
            </a>
          </div>
        </div>

        {/* <div className="text-center pb-20">
          <Link to="/events" onClick={(e) => { e.preventDefault(); handleNavigation('/events'); }} className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white rounded-full text-sm font-semibold hover:bg-[#6d28d9] transition-all">
            View All Events
            <span className="opacity-70">→</span>
          </Link>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .wl-info-card:nth-child(1) { transition-delay: 0.2s; }
        .wl-info-card:nth-child(2) { transition-delay: 0.4s; }
        .wl-info-card:nth-child(3) { transition-delay: 0.6s; }
        @media (max-width: 1024px) { .wl-embed-wrap { padding: 2rem 1.5rem; } }
        @media (max-width: 600px) {
          .wl-sub-header { padding: 4rem 1rem 1.5rem; }
          .wl-embed-wrap { padding: 1.5rem 1rem; }
          .wl-info { flex-direction: column; padding: 0 1rem 2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default WatchLivePage;