"use client"
import React, { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

const App: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>("PLG2_S6yzON5cJTG6_AlOErW-oR_E-uxsk"); // Example Playlist ID
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`);
        const html = await response.text();

        // Parse the response HTML to extract video data
        const videoList: Video[] = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const videoElements = doc.querySelectorAll("a.pl-video-title-link");

        videoElements.forEach((element) => {
          const title = element.textContent?.trim() || "Unknown Title";
          const id = element.getAttribute("href")?.split("v=")[1]?.split("&")[0] || "";
          const url = `https://www.youtube.com/watch?v=${id}`;
          const thumbnail = `https://img.youtube.com/vi/${id}/0.jpg`;

          videoList.push({ id, title, thumbnail, url });
        });

        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Playlist Viewer</h1>
      <input
        type="text"
        placeholder="Enter Playlist ID"
        value={playlistId}
        onChange={(e) => setPlaylistId(e.target.value.trim())}
        className="border p-2 mb-4 w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border p-2 rounded shadow">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover"
            />
            <h3 className="mt-2 text-sm font-semibold">{video.title}</h3>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
