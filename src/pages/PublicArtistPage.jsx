import React, { useEffect, useMemo, useRef, useState } from 'react';
import { artistSlug } from '../utils/artistSlug';
import './ArtistProfile.css';

const notes = ['\u266a', '\u266b', '\u266c', '\u2669'];

function formatPracticeDuration(duration) {
  const value = String(duration).trim();
  return /\b(?:years?|months?|weeks?|days?)\b/i.test(value) ? value : `${value} years`;
}

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
  const [cardBlobReady, setCardBlobReady] = useState(false);
  const cardBlobRef = useRef(null);
  const slug = artistSlug(artist);
  const name = artist.stageName || artist.name;
  const url = `${window.location.origin}/${slug}`;
  const tracks = artist.audioTracks || [];
  const skills = artist.specialisations || (artist.skills || []).map(skill => skill.name);
  const training = artist.musicalTraining;
  const publicEmail = artist.contact?.publicDetails?.includes('email') ? artist.contact.email : null;
  const publicWhatsApp = artist.contact?.publicDetails?.includes('whatsapp')
    ? String(artist.contact.whatsapp || '').replace(/\D/g, '')
    : '';
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
  const loadCardImage = (src) => new Promise(resolve => {
    if (!src) return resolve(null);
    const image = new Image();
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const timeoutId = window.setTimeout(() => finish(null), 8000);
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      window.clearTimeout(timeoutId);
      finish(image);
    };
    image.onerror = () => {
      window.clearTimeout(timeoutId);
      finish(null);
    };
    image.src = src;
  });

  const createCardBlob = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const roundedRect = (x, y, width, height, radius) => {
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arcTo(x + width, y, x + width, y + height, radius);
      context.arcTo(x + width, y + height, x, y + height, radius);
      context.arcTo(x, y + height, x, y, radius);
      context.arcTo(x, y, x + width, y, radius);
      context.closePath();
    };
    const wrapText = (value, font, maxWidth) => {
      context.font = font;
      const lines = [];
      let line = '';
      for (const word of String(value || '').split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > maxWidth) {
          lines.push(line);
          line = word;
        } else line = candidate;
      }
      if (line) lines.push(line);
      return lines;
    };

    const rightX = 680;
    const rightWidth = 850;
    const pad = 58;
    const qrSize = 138;
    const qrGap = 22;
    const nameFont = '600 82px Georgia, serif';
    const roleFont = 'italic 42px Georgia, serif';
    const statementFont = '600 27px Georgia, serif';
    const nameLines = wrapText(name || 'Suraag Artiste', nameFont, rightWidth);
    const roleLines = wrapText(artist.primaryRole || 'Suraag Artiste', roleFont, rightWidth);
    const locationLines = artist.location ? wrapText(artist.location, '23px Arial, sans-serif', rightWidth) : [];
    const statementLines = statement ? wrapText(statement, statementFont, rightWidth - 30) : [];
    const specialisations = [...(skills || [])].filter(Boolean).slice(0, 5);
    context.font = '600 18px Arial, sans-serif';
    const chipRows = [];
    for (const label of specialisations) {
      const width = Math.min(context.measureText(label).width + 34, rightWidth);
      let row = chipRows[chipRows.length - 1];
      if (!row || row.width + (row.items.length ? 12 : 0) + width > rightWidth) {
        row = { items: [], width: 0 };
        chipRows.push(row);
      }
      row.items.push({ label, width });
      row.width += (row.items.length > 1 ? 12 : 0) + width;
    }

    let contentBottom = 250 + nameLines.length * 88 + roleLines.length * 52 + locationLines.length * 32 + 26;
    contentBottom += statementLines.length * 38 + 26;
    contentBottom += specialisations.length ? 30 + chipRows.length * 48 : 20;
    canvas.height = Math.max(760, contentBottom + qrSize + pad * 2 + 30, 110 + qrSize + 100);

    context.fillStyle = '#24150f';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#39251b';
    context.lineWidth = 3;
    roundedRect(32, 32, canvas.width - 64, canvas.height - 64, 18);
    context.stroke();

    const portraitX = 88;
    const portraitY = pad + 70;
    const portraitWidth = 520;
    const portraitHeight = Math.min(canvas.height - 2 * portraitY, Math.max(390, contentBottom - pad));
    context.save();
    roundedRect(portraitX, portraitY, portraitWidth, portraitHeight, 8);
    context.clip();
    context.fillStyle = '#c98f55';
    context.fillRect(portraitX, portraitY, portraitWidth, portraitHeight);
    const portrait = await loadCardImage(artist.avatar);
    if (portrait) {
      const scale = Math.max(portraitWidth / portrait.width, portraitHeight / portrait.height);
      const drawWidth = portrait.width * scale;
      const drawHeight = portrait.height * scale;
      context.drawImage(portrait, portraitX + (portraitWidth - drawWidth) / 2, portraitY + (portraitHeight - drawHeight) / 2, drawWidth, drawHeight);
    } else {
      context.fillStyle = '#f3ead9';
      context.textAlign = 'center';
      context.font = '600 160px Georgia, serif';
      context.fillText((name?.[0] || 'S').toUpperCase(), portraitX + portraitWidth / 2, portraitY + portraitHeight / 2);
    }
    context.restore();
    context.strokeStyle = '#a8832f';
    context.lineWidth = 3;
    roundedRect(portraitX - 9, portraitY - 9, portraitWidth + 18, portraitHeight + 18, 9);
    context.stroke();

    context.textAlign = 'left';
    context.fillStyle = '#df7650';
    context.font = '600 46px Arial, sans-serif';
    context.fillText('\u092a\u0939\u091a\u093e\u0928', rightX, 158);
    context.fillStyle = '#c39a46';
    context.font = '600 18px Arial, sans-serif';
    context.fillText('Pehchaan', rightX + 180, 158);

    let y = 250;
    context.fillStyle = '#f3ead9';
    context.font = nameFont;
    nameLines.forEach(line => { context.fillText(line, rightX, y); y += 88; });
    context.fillStyle = '#df7650';
    context.font = roleFont;
    roleLines.forEach(line => { context.fillText(line, rightX, y + 4); y += 52; });
    context.fillStyle = '#c6ad98';
    context.font = '23px Arial, sans-serif';
    locationLines.forEach(line => { context.fillText(line, rightX, y + 1); y += 32; });
    y += 26;

    if (statementLines.length) {
      context.fillStyle = '#df7650';
      context.fillRect(rightX, y - 4, 2, statementLines.length * 38 + 6);
      context.fillStyle = '#eadccd';
      context.font = statementFont;
      statementLines.forEach(line => { context.fillText(line, rightX + 22, y + 18); y += 38; });
      y += 26;
    }
    if (specialisations.length) {
      context.fillStyle = '#b89a7e';
      context.font = '600 18px Arial, sans-serif';
      context.fillText('Genre', rightX, y + 18);
      context.fillText('हुनर', rightX, y + 42);
      y += 54;
      chipRows.forEach(row => {
        let x = rightX;
        row.items.forEach(chip => {
          context.strokeStyle = '#654a39';
          context.lineWidth = 2;
          roundedRect(x, y, chip.width, 40, 20);
          context.stroke();
          context.fillStyle = '#eadccd';
          context.textAlign = 'center';
          context.font = '600 18px Arial, sans-serif';
          context.fillText(chip.label, x + chip.width / 2, y + 26, chip.width - 20);
          x += chip.width + 12;
        });
        y += 48;
      });
    }

    const qrCanvas = document.querySelector('#qr canvas');
    const qrX = rightX;
    const qrY = canvas.height - pad - qrSize;
    context.fillStyle = '#f3ead9';
    roundedRect(qrX, qrY, qrSize, qrSize, 12);
    context.fill();
    if (qrCanvas) context.drawImage(qrCanvas, qrX + 10, qrY + 10, qrSize - 20, qrSize - 20);
    context.textAlign = 'left';
    context.fillStyle = '#c6ad98';
    context.font = '18px Arial, sans-serif';
    context.fillText("Scan to open this artist's Suraag profile", qrX + qrSize + qrGap, qrY + 56, rightWidth - qrSize - qrGap);
    context.fillStyle = '#df7650';
    context.font = '600 21px Arial, sans-serif';
    context.fillText('Suraag', qrX + qrSize + qrGap, qrY + 88);
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  };

  useEffect(() => {
    let active = true;
    cardBlobRef.current = null;
    setCardBlobReady(false);
    createCardBlob()
      .then(blob => {
        if (!active) return;
        cardBlobRef.current = blob;
        setCardBlobReady(Boolean(blob));
      })
      .catch(() => {
        if (active) setCardBlobReady(false);
      });
    return () => { active = false; };
  }, [artist, name, slug, statement, url]);

  const downloadCard = async () => {
    const blob = cardBlobRef.current || await createCardBlob();
    if (!blob) return notify('Unable to create the artist card');
    cardBlobRef.current = blob;
    setCardBlobReady(true);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${slug}-suraag-card.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    notify('Card downloaded');
  };

  const share = async () => {
    if (!navigator.share) {
      setSharing(true);
      return;
    }
    const blob = cardBlobRef.current;
    if (!blob) {
      setSharing(true);
      notify('The artist card is still loading. Try sharing again in a moment.');
      return;
    }

    const file = new File([blob], `${slug}-suraag-card.png`, { type: 'image/png' });
    const fileShareData = {
      title: `${name} | ${artist.primaryRole} — Suraag`,
      text: `${name} (${artist.primaryRole}) on Suraag: ${url}`,
      files: [file]
    };
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      setSharing(true);
      notify('This device cannot share image files. Save the card to share it.');
      return;
    }
    try {
      await navigator.share(fileShareData);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        notify('Share unavailable. Link copied');
      } catch {
        setSharing(true);
        notify('Could not share or copy the link. Use the share options below.');
      }
    }
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
            {!!(skills.length || artist.instruments?.length) && <div {...reveal(4)}><p className="h">Genre<small className="hi" lang="hi">हुनर</small></p><ul className="chips">{[...skills, ...(artist.instruments || [])].map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul></div>}
            {featuredTrack && <div {...reveal(5)}><p className="h"><small className="hi" lang="hi">पेशकश</small></p><div className={`player ${isPlaying ? 'playing' : ''}`}>
              <button className="play" aria-label={isPlaying ? 'Pause featured recording' : 'Play featured recording'} onClick={toggleTrack}><svg viewBox="0 0 24 24"><path d={isPlaying ? 'M6 4h4v16H6zM14 4h4v16h-4z' : 'M7 4v16l13-8z'} /></svg></button>
              <div className="pmeta"><b>{featuredTrack.title}</b><small>{[featuredTrack.genre, featuredTrack.duration].filter(Boolean).join(' · ')}</small><div className="wave" aria-hidden="true">{Array.from({ length: 44 }, (_, i) => <i key={i} style={{ '--d': (i * 53) % 420 }} />)}</div></div>
            </div><audio id="artist-audio" hidden onEnded={() => setIsPlaying(false)} /></div>}
            <div className="share rise" style={{ '--i': 6 }}>
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
            {!!bio.length && <div className="sec"><h2>Artist's story<small className="hi" lang="hi">परिचय</small></h2><div>{bio.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></div>}
            {(training || artist.parampara?.length) && <div className="sec"><h2>Guru Parampara<small className="hi" lang="hi">{'गुरु परंपरा'}</small></h2><div>
              {training?.gurus?.[0] && <><div className="gname">{training.gurus[0].name}</div><p className="gmeta">{[training.gurus[0].style, training.style, training.institutions?.join(', ')].filter(Boolean).join(' · ')}</p></>}
              {training?.yearsOfPractice && <p>Learning and performing for {formatPracticeDuration(training.yearsOfPractice)}.</p>}
              {!!training?.gurus?.length && <><p className="h" style={{ marginTop: 22 }}>Lineage</p><ol className="tl">{training.gurus.map((guru, i) => <li key={`${guru.name}-${i}`}><b>{guru.name}</b><span>{guru.style || 'Guru'}</span></li>)}</ol></>}
              {!!artist.parampara?.length && <ol className="tl">{artist.parampara.map(item => <li key={item.n}><b>{item.n}</b><span>{item.r}</span></li>)}</ol>}
            </div></div>}
            {!!journey.length && <div className="sec"><h2>Musical journey<small className="hi" lang="hi">सफ़र</small></h2><ol className="tl">{journey.map((item, i) => <li key={`${item.title}-${i}`}><b>{[item.year, item.title].filter(Boolean).join(': ')}</b><span>{item.detail || item.description}</span></li>)}</ol></div>}
            {!!portfolio.length && <div className="sec"><h2>Performances and recordings<small className="hi" lang="hi">पेशकश</small></h2><div className="work">{portfolio.map((item, i) => <a href={item.href || '#'} key={`${item.title}-${i}`} onClick={item.href ? undefined : event => event.preventDefault()}><b>{item.title}</b><span>{item.subtitle}</span></a>)}</div></div>}
            {!!artist.genres?.length && <div className="sec"><h2>Genres<small className="hi" lang="hi">हुनर</small></h2><ul className="chips">{artist.genres.map(genre => <li key={genre}>{genre}</li>)}</ul></div>}
            {!!artist.achievements?.length && <div className="sec"><h2>Achievements<small className="hi" lang="hi">पुरस्कार</small></h2><div>{artist.achievements.map(item => <p key={item}>{item}</p>)}</div></div>}
            {(availability || publicEmail || publicWhatsApp || socialLinks.length > 0) && <div className="sec"><h2>Collaborate<small className="hi" lang="hi">संगति</small></h2><div className="flex flex-col justify-center">{availability && <p>{availability}</p>}<div className="share social-links">{publicEmail && <a className="btn" href={`mailto:${publicEmail}`}>Email {publicEmail}</a>}{publicWhatsApp && <a className="btn" href={`https://wa.me/${publicWhatsApp}`} target="_blank" rel="noopener noreferrer">WhatsApp DM</a>}{socialLinks.map(link => <a className="btn" href={link.url || link.u} key={link.name || link.n} target="_blank" rel="noreferrer">{link.name || link.n}</a>)}</div></div></div>}
          </section>
        )}
      </main>
      <footer><span>© Suraag</span></footer>
    </div>
    <button className="fab" aria-label="Share this card" onClick={() => setSharing(true)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.3" /><circle cx="18" cy="6" r="2.3" /><circle cx="18" cy="18" r="2.3" /><path d="M8 11l8-4M8 13l8 4" /></svg></button>
    <div className={`scrim ${sharing ? 'visible' : ''}`} onClick={() => setSharing(false)} />
    <div className={`sheet ${sharing ? 'visible' : ''}`} role="dialog" aria-modal="true" aria-label="Share this artist card" aria-hidden={!sharing}>
      <div className="shh"><b>Share this card</b><button onClick={() => setSharing(false)} aria-label="Close">×</button></div>
      
      <div className="linkrow"><input readOnly aria-label="Card link" value={url} onFocus={event => event.target.select()} /><button className="btn solid" onClick={copyLink}>Copy</button></div>
      {navigator.share && !cardBlobReady && <p className="share-status" role="status">Preparing the card image and share options…</p>}
      <div className="opts">
        <a className="opt" href={`https://wa.me/?text=${encodeURIComponent(`${name}, ${artist.primaryRole} on Suraag: ${url}`)}`} target="_blank" rel="noreferrer"><span>↗</span>WhatsApp</a>
        <button className="opt" onClick={downloadCard}><span>↓</span>Save card</button>
        {navigator.share && <button className="opt" onClick={share} disabled={!cardBlobReady}><span>→</span>More apps</button>}
      </div>
    </div>
    <div className={`toast ${toast ? 'on' : ''}`} role="status">{toast}</div>
    {tapNotes.map(note => <span key={note.id} className="tapnote" aria-hidden="true" style={{ left: note.x, top: note.y, '--s': note.size, '--c': note.color, '--dx': note.dx, '--dy': note.dy, '--r': note.rotate, '--dl': note.delay }} onAnimationEnd={() => setTapNotes(current => current.filter(item => item.id !== note.id))}>{note.glyph}</span>)}
  </div>;
}
