import { useEffect, useRef, useState } from 'react';
import type { Game } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import { enterFullscreen, exitFullscreen, isFullscreenActive } from '../lib/fullscreen';

export interface IframeGameProps {
  game: Game;
  /** The currently-displayed iframe is at /games/{subject}/{gameId}/index.html */
  src: string;
  /** Used to send a 'playlab:requestScore' on unmount / pagehide. */
  onScore?: () => void;
}

export default function IframeGame({ game, src, onScore }: IframeGameProps) {
  const { t } = useLanguage();
  const { submitScore } = useGames();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const iframe = iframeRef.current;
      if (!iframe || event.source !== iframe.contentWindow) return;
      submitScore({
        source: iframe.contentWindow,
        expected: { subject: game.subject, gameId: game.id },
        message: event.data,
      });
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [submitScore, game.subject, game.id]);

  // Live fullscreen state tracking (native API changes state via events).
  useEffect(() => {
    function onFsChange() {
      const w = wrapRef.current;
      if (!w) return;
      setFullscreen(isFullscreenActive(w));
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // On unmount: send requestScore once (pagehide also covers tab close).
  useEffect(() => {
    return () => {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        try {
          iframe.contentWindow.postMessage({ type: 'playlab:requestScore' }, '*');
        } catch {
          // ignore
        }
      }
      onScore?.();
    };
    // We intentionally do not depend on `onScore` here; the parent will
    // re-mount the iframe on navigation anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock the outer page scroll while a touch-safe game is loaded.
  useEffect(() => {
    if (!game.touchSafe) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [game.touchSafe]);

  const toggleFullscreen = async () => {
    const w = wrapRef.current;
    if (!w) return;
    if (fullscreen) await exitFullscreen(w);
    else await enterFullscreen(w);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {loaded ? '' : t('game.loading')}
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="btn-ghost-sm"
          aria-pressed={fullscreen}
        >
          {fullscreen ? t('game.exitFullscreen') : t('game.fullscreen')}
        </button>
      </div>
      <div
        ref={wrapRef}
        className={
          'relative w-full overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-200 ' +
          (game.touchSafe ? 'touch-lock' : '')
        }
        style={{ aspectRatio: '16 / 10' }}
      >
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
              {t('game.loading')}
            </span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title={game.title}
          src={src}
          sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
          allow="fullscreen"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full border-0 bg-white"
        />
      </div>
    </div>
  );
}
