import React, { useEffect, useMemo, useState } from 'react';
import { artistSlug } from '../utils/artistSlug';
import './ArtistProfile.css';

const notes = ['\u266a', '\u266b', '\u266c', '\u2669'];

function getSocialLinks(links = {}) {
  if (Array.isArray(links)) return links.filter(link => link?.u && link.u !== '#');
  return Object.entries(links)
    .filter(([, url]) => typeof url === 'string' && url.startsWith('http'))
    .map(([name, url]) => ({ name: name[0].toUpperCase() + name.slice(1), url }));
}

export default function PublicArtistPage({ artist }) {
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapNotes, setTapNotes] = useState([]);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const slug = artistSlug(artist);
  const name = artist.stageName || artist.name;
  const url = `${window.location.origin}/${slug}`;
  const tracks = artist.audioTracks || [];
  const skills = artist.specialisations || (artist.skills || []).map(skill => skill.name);
  const training = artist.musicalTraining;
  const socialLinks = getSocialLinks(artist.socialLinks);
  const journey = artist.journey || (artist.experiences || []).map(item => ({
    title: item.role || item.title,
    detail: [item.organization, item.description].filter(Boolean).join(' · '),
    year: item.year
  }));
  const portfolio = artist.portfolio || [
    ...tracks.map(track => ({ title: track.title, subtitle: [track.genre, track.duration].filter(Boolean).join(' · '), href: track.url || track.audioUrl })),
    ...(artist.videos || []).map(video => ({ title: video.title || video.name || 'Performance', subtitle: video.platform || video.description || 'Video', href: video.url }))
  ];
  const statement = artist.artistStatement || artist.musicalIdentity || artist.headline;
  const bio = Array.isArray(artist.bio) ? artist.bio : artist.bio ? [artist.bio] : [];
  const availability = artist.availability || (artist.openToGigs ? `Open to ${artist.gigTypes?.join(', ') || 'concerts and collaborations'}.` : '');
  const floatingNotes = useMemo(() => Array.from({ length: window.innerWidth < 700 ? 14 : 26 }, (_, index) => ({
    id: index, glyph: notes[index % notes.length], x: `${Math.random() * 96}%`, size: `${20 + Math.random() * 44}px`,
    duration: `${16 + Math.random() * 18}s`, delay: `${-Math.random() * 20}s`, sway: `${20 + Math.random() * 80}px`,
    opacity: `${(0.16 + Math.random() * 0.22).toFixed(2)}`, color: ['var(--gold)', 'var(--terra)', 'var(--caramel)'][index % 3]
  })), []);

  useEffect(() => {
    document.title = `${name} | ${artist.primaryRole} — Suraag`;

    const bannerAbsoluteUrl = `${window.location.origin}/suraag-banner.jpg`;
    const setMeta = (attr, key, val) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    setMeta('property', 'og:title', `${name} — ${artist.primaryRole} on Suraag`);
    setMeta('property', 'og:description', statement || `Discover ${name}'s classical recordings, lineage, and artistry on Suraag.`);
    setMeta('property', 'og:image', bannerAbsoluteUrl);
    setMeta('property', 'og:image:secure_url', bannerAbsoluteUrl);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:width', '1024');
    setMeta('property', 'og:image:height', '682');
    setMeta('property', 'og:image:alt', `${name} on Suraag`);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', `${name} — ${artist.primaryRole} on Suraag`);
    setMeta('name', 'twitter:description', statement || `Discover ${name}'s artistry on Suraag.`);
    setMeta('name', 'twitter:image', bannerAbsoluteUrl);
  }, [name, artist.primaryRole, statement, url]);

  useEffect(() => {
    const qr = document.getElementById('qr');
    if (!qr || !window.QRCode) return;
    qr.replaceChildren();
    new window.QRCode(qr, { text: url, width: 140, height: 140, colorDark: '#2a1a12', colorLight: '#ffffff' });
  }, [url]);

  const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 1800); };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); notify('Link copied'); }
    catch { notify('Copy the address from your browser bar'); }
  };
  const downloadBanner = () => {
    const link = document.createElement('a');
    link.href = '/suraag-banner.jpg';
    link.download = `${slug}-suraag-banner.jpg`;
    link.click();
    notify('Banner image downloaded');
  };
  const share = async () => {
    if (navigator.share) {
      try {
        const shareData = {
          title: `${name} | ${artist.primaryRole} — Suraag`,
          text: statement ? `${name} (${artist.primaryRole}) on Suraag: "${statement}"` : `${name} on Suraag`,
          url
        };
        try {
          const res = await fetch('/suraag-banner.jpg');
          const blob = await res.blob();
          const file = new File([blob], 'suraag-banner.jpg', { type: 'image/jpeg' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch {
          /* Fall back to sharing URL and text */
        }
        await navigator.share(shareData);
      } catch {
        /* The visitor closed the share sheet. */
      }
    } else setSharing(true);
  };
  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext('2d');
    if (!context) return notify('Unable to create the artist card');
    context.fillStyle = '#f3ead9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#a8832f';
    context.lineWidth = 2;
    context.strokeRect(40, 40, 1000, 1270);
    const save = () => canvas.toBlob(blob => {
      if (!blob) return notify('Unable to download the artist card');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${slug}-suraag-card.png`;
      link.click();
      URL.revokeObjectURL(link.href);
      notify('Card downloaded');
    });
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try { context.drawImage(image, 100, 100, 880, 650); } catch { /* Some image hosts block canvas access. */ }
      save();
    };
    image.onerror = save;
    const qrCanvas = document.querySelector('#qr canvas');
    if (qrCanvas) { context.fillStyle = '#fff'; context.fillRect(820, 1060, 160, 160); context.drawImage(qrCanvas, 830, 1070, 140, 140); }
    context.fillStyle = '#2a1a12';
    context.font = '600 38px Georgia,serif';
    context.fillText('SURAAG PROFILE CARD', 100, 830);
    context.font = '600 80px Georgia,serif';
    context.fillText(name.slice(0, 22), 100, 960);
    context.fillStyle = '#a9502f';
    context.font = 'italic 46px Georgia,serif';
    context.fillText(artist.primaryRole || '', 100, 1030);
    context.fillStyle = '#6b5444';
    context.font = '28px Arial,sans-serif';
    context.fillText([artist.location, (artist.genres || []).slice(0, 3).join(', ')].filter(Boolean).join(' | ').slice(0, 48), 100, 1090);
    context.font = '22px Arial,sans-serif';
    context.fillText(url, 100, 1250, 700);
    if (artist.avatar) image.src = artist.avatar;
    else save();
  };
  const reveal = (index) => ({ className: 'rise', style: { '--i': index } });
  const releaseNotes = event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const burstId = Date.now() + Math.random();
    const colors = ['var(--gold)', 'var(--terra)', 'var(--caramel)'];
    const burst = Array.from({ length: 7 }, (_, index) => ({
      id: `${burstId}-${index}`,
      x: event.clientX,
      y: event.clientY,
      size: `${22 + Math.random() * 26}px`,
      color: colors[index % colors.length],
      dx: `${(Math.random() - 0.5) * 170}px`,
      dy: `${-(80 + Math.random() * 130)}px`,
      rotate: `${(Math.random() - 0.5) * 50}deg`,
      delay: `${index * 40}ms`,
      glyph: notes[index % notes.length]
    }));
    setTapNotes(current => [...current, ...burst]);
  };
  const featuredTrack = tracks[0];
  const toggleTrack = () => {
    if (!featuredTrack?.url && !featuredTrack?.audioUrl) return notify('Recording link coming soon');
    const player = document.getElementById('artist-audio');
    if (isPlaying) { player?.pause(); setIsPlaying(false); }
    else if (player) { player.src = featuredTrack.url || featuredTrack.audioUrl; player.play().then(() => setIsPlaying(true)).catch(() => notify('Unable to play this recording')); }
  };

  return <div className="artist-profile-page" onPointerDown={releaseNotes}>
    <div className="notes" aria-hidden="true">{floatingNotes.map(note => <span key={note.id} style={{ '--x': note.x, '--s': note.size, '--dur': note.duration, '--delay': note.delay, '--sw': note.sway, '--o': note.opacity, '--c': note.color }}>{note.glyph}</span>)}</div>
    <div className="wrap">
      <header className="top">
        <div className="brand" aria-label="Suraag Artiste Profile">
          <span className="brand-title">SURAAG ARTISTE PROFILE</span>
        </div>
        <span className="demo">Pehchaan</span>
      </header>
      <main className="artist-card" id="app">
        <section className="cover" aria-label="Artist card">
          <div><div className="frame"><div className="photo">{artist.avatar ? <img src={artist.avatar} alt={`Portrait of ${name}`} /> : <div className="photo-fallback">{name?.[0]}</div>}</div>{artist.artistNumber && <span className="num">Artist no. {artist.artistNumber}</span>}</div></div>
          <div>
              <p className="cap rise" style={{ '--i': -1 }}><span lang="hi">&#2346;&#2361;&#2330;&#2366;&#2344;</span><small>Pehchaan</small></p>
            <h1 {...reveal(0)}>{name}</h1>
            {artist.primaryRole && <p {...reveal(1)} className="role">{artist.primaryRole}</p>}
            {artist.location && <p {...reveal(2)} className="loc">{artist.location}</p>}
            {statement && <p {...reveal(3)} className="stmt">{statement}</p>}
            {!!(skills.length || artist.instruments?.length) && <div {...reveal(4)}><p className="h">Hunaar</p><ul className="chips">{[...skills, ...(artist.instruments || [])].map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul></div>}
            {featuredTrack && <div {...reveal(5)}><p className="h">Peshkash</p><div className={`player ${isPlaying ? 'playing' : ''}`}>
              <button className="play" aria-label={isPlaying ? 'Pause featured recording' : 'Play featured recording'} onClick={toggleTrack}><svg viewBox="0 0 24 24"><path d={isPlaying ? 'M6 4h4v16H6zM14 4h4v16h-4z' : 'M7 4v16l13-8z'} /></svg></button>
              <div className="pmeta"><b>{featuredTrack.title}</b><small>{[featuredTrack.genre, featuredTrack.duration].filter(Boolean).join(' · ')}</small><div className="wave" aria-hidden="true">{Array.from({ length: 44 }, (_, i) => <i key={i} style={{ '--d': (i * 53) % 420 }} />)}</div></div>
            </div><audio id="artist-audio" hidden onEnded={() => setIsPlaying(false)} /></div>}
            <div className="share rise" style={{ '--i': 6 }}>
              <button className="btn solid" onClick={share}>Share card</button>
              <button
                type="button"
                className={`btn ${showFullProfile ? 'solid' : ''}`}
                onClick={() => {
                  const next = !showFullProfile;
                  setShowFullProfile(next);
                  if (next) {
                    setTimeout(() => {
                      document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  }
                }}
              >
                {showFullProfile ? 'Hide full profile ↑' : 'Full profile details ↓'}
              </button>
            </div>
            <div className="qrbox rise" style={{ '--i': 7 }}><div id="qr" className="qr-placeholder" aria-label="QR code linking to this profile">&#9835;</div><span>Scan to open this<br />artist's Suraag profile</span></div>
          </div>
        </section>

        {showFullProfile && (
          <section className="profile" id="profile" aria-label="Full profile">
            {!!bio.length && <div className="sec"><h2>Artist's story<small>Safar</small></h2><div>{bio.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></div>}
            {(training || artist.parampara?.length) && <div className="sec"><h2>Guru Parampara<small className="hi" lang="hi">गुरु परंपरा</small></h2><div>
              {training?.gurus?.[0] && <><div className="gname">{training.gurus[0].name}</div><p className="gmeta">{[training.gurus[0].style, training.style, training.institutions?.join(', ')].filter(Boolean).join(' · ')}</p></>}
              {training?.yearsOfPractice && <p>Learning and performing for {training.yearsOfPractice} years.</p>}
              {!!training?.gurus?.length && <><p className="h" style={{ marginTop: 22 }}>Lineage</p><ol className="tl">{training.gurus.map((guru, i) => <li key={`${guru.name}-${i}`}><b>{guru.name}</b><span>{guru.style || 'Guru'}</span></li>)}</ol></>}
              {!!artist.parampara?.length && <ol className="tl">{artist.parampara.map(item => <li key={item.n}><b>{item.n}</b><span>{item.r}</span></li>)}</ol>}
            </div></div>}
            {!!journey.length && <div className="sec"><h2>Musical journey<small>Safar</small></h2><ol className="tl">{journey.map((item, i) => <li key={`${item.title}-${i}`}><b>{[item.year, item.title].filter(Boolean).join(': ')}</b><span>{item.detail || item.description}</span></li>)}</ol></div>}
            {!!portfolio.length && <div className="sec"><h2>Performances and recordings<small>Peshkash</small></h2><div className="work">{portfolio.map((item, i) => <a href={item.href || '#'} key={`${item.title}-${i}`} onClick={item.href ? undefined : event => event.preventDefault()}><b>{item.title}</b><span>{item.subtitle}</span></a>)}</div></div>}
            {!!artist.genres?.length && <div className="sec"><h2>Genres</h2><ul className="chips">{artist.genres.map(genre => <li key={genre}>{genre}</li>)}</ul></div>}
            {!!artist.achievements?.length && <div className="sec"><h2>Achievements</h2><div>{artist.achievements.map(item => <p key={item}>{item}</p>)}</div></div>}
            {(availability || socialLinks.length > 0) && <div className="sec"><h2>Collaborate</h2><div>{availability && <p>{availability}</p>}<div className="share social-links">{socialLinks.map(link => <a className="btn" href={link.url || link.u} key={link.name || link.n} target="_blank" rel="noreferrer">{link.name || link.n}</a>)}</div></div></div>}
          </section>
        )}
      </main>
      <footer><span>© Suraag</span></footer>
    </div>
    <button className="fab" aria-label="Share this card" onClick={() => setSharing(true)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.3" /><circle cx="18" cy="6" r="2.3" /><circle cx="18" cy="18" r="2.3" /><path d="M8 11l8-4M8 13l8 4" /></svg></button>
    <div className={`scrim ${sharing ? 'visible' : ''}`} onClick={() => setSharing(false)} />
    <div className={`sheet ${sharing ? 'visible' : ''}`} role="dialog" aria-modal="true" aria-label="Share this artist card" aria-hidden={!sharing}>
      <div className="shh"><b>Share this card</b><button onClick={() => setSharing(false)} aria-label="Close">×</button></div>
      
      {/* Share Link Preview Banner */}
      <div className="banner-preview-box">
        <img src="/suraag-banner.jpg" alt="Suraag Link Preview Banner" className="banner-preview-img" />
        <div className="banner-preview-overlay">
          <span className="banner-preview-pill">Link preview banner</span>
          <span className="banner-preview-name">{name} • {artist.primaryRole}</span>
        </div>
      </div>

      <div className="linkrow"><input readOnly aria-label="Card link" value={url} onFocus={event => event.target.select()} /><button className="btn solid" onClick={copyLink}>Copy</button></div>
      <div className="opts">
        <a className="opt" href={`https://wa.me/?text=${encodeURIComponent(`${name}, ${artist.primaryRole} on Suraag: ${url}`)}`} target="_blank" rel="noreferrer"><span>↗</span>WhatsApp</a>
        <button className="opt" onClick={downloadCard}><span>↓</span>Save card</button>
        <button className="opt" onClick={downloadBanner}><span>🖼</span>Save banner</button>
        {navigator.share && <button className="opt" onClick={share}><span>→</span>More apps</button>}
      </div>
    </div>
    <div className={`toast ${toast ? 'on' : ''}`} role="status">{toast}</div>
    {tapNotes.map(note => <span key={note.id} className="tapnote" aria-hidden="true" style={{ left: note.x, top: note.y, '--s': note.size, '--c': note.color, '--dx': note.dx, '--dy': note.dy, '--r': note.rotate, '--dl': note.delay }} onAnimationEnd={() => setTapNotes(current => current.filter(item => item.id !== note.id))}>{note.glyph}</span>)}
  </div>;
}
