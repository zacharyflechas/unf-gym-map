import { useState } from 'react';

/**
 * Tap-to-load video. Until the button is pressed, nothing is loaded from YouTube (no iframe,
 * no thumbnail image), so opening a machine makes zero requests to YouTube.
 * video = { youtubeId, source: 'zach' | 'external', title?, cues? }
 */
export default function VideoCard({ video, machineName }) {
  const [playing, setPlaying] = useState(false);
  const byZach = video.source === 'zach';
  const title = video.title ?? `${machineName} tutorial`;

  return (
    <section className="card" aria-labelledby="video-title">
      <h3 id="video-title">
        Video {byZach && <span className="coach-badge">Coach Zach</span>}
      </h3>
      <div className="video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button className="video-start" onClick={() => setPlaying(true)}>
            <span className="play-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="video-text">
              <strong>Play video</strong>
              <small>{title}</small>
              <small>Loads from YouTube when you tap.</small>
            </span>
          </button>
        )}
      </div>
      {video.cues?.length > 0 && (
        <>
          <h4>Coaching cues</h4>
          <ul className="cues">
            {video.cues.map((cue, i) => (
              <li key={i}>{cue}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
