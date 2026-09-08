// Local color icons keep celebration marks crisp even on systems without emoji fonts.
const paths={
 '🎉':'<path d="m3 21 5-14 9 9Z" fill="#d8a447"/><path d="m4 17 3 2m-1-7 7 5" stroke="#b85742" stroke-width="2"/><path d="m12 4 1-2m5 7 4-1M16 4c3-3 5 0 3 2m-8 2c-3-3 0-4-2-6" fill="none" stroke="#507f9c" stroke-width="1.7" stroke-linecap="round"/><path d="m19 13 2 2-2 1-1-2ZM15 6l2 1-1 2-2-1Z" fill="#b65a45"/><circle cx="21" cy="3" r="1.2" fill="#b99b3d"/>',
 '🔥':'<path d="M13 2c2 6-2 6 0 9 2-1 3-3 3-5 7 7 5 16-4 16C3 22 1 13 7 7c0 4 2 5 2 5-1-5 2-6 4-10Z" fill="#cc7147"/><path d="M12 11c-1 3-5 5-3 8 2 3 7 1 6-3 0 0-1 2-2 1Z" fill="#e7ba58"/>',
 '📝':'<rect x="4" y="3" width="14" height="19" rx="2" fill="#d9e5e9"/><path d="M8 8h6m-6 4h6m-6 4h3" stroke="#658393" stroke-width="1.4" stroke-linecap="round"/><path d="m13 17 2-5 6-7 3 3-7 7Z" fill="#c9a04a"/><path d="m13 17 1-3 2 2Z" fill="#405f70"/>',
 '💻':'<rect x="4" y="4" width="16" height="12" rx="1.5" fill="#6e8c9b"/><path d="M6 6h12v8H6Z" fill="#d9e9e7"/><path d="m4 17-2 3h20l-2-3Z" fill="#849d9f"/>',
 '🏆':'<path d="M7 3h10v6a5 5 0 0 1-10 0Z" fill="#d2aa52"/><path d="M7 5H3v3c0 3 3 4 5 4m9-7h4v3c0 3-3 4-5 4" fill="none" stroke="#b38e3e" stroke-width="2"/><path d="M11 14h2v5h-2Z" fill="#b38e3e"/><rect x="7" y="19" width="10" height="3" rx="1" fill="#627c78"/>',
 '📖':'<path d="M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z" fill="#77929d"/><path d="M5 5c3 0 5 1 6 2v11c-2-1-4-2-6-1Zm8 2c1-1 3-2 6-2v12c-2-1-4 0-6 1Z" fill="#e8e1c7"/>',
 '🌍':'<circle cx="12" cy="12" r="10" fill="#85a6b4"/><path d="m5 5 4-1 3 3-2 3-4 1-2-4m7 8 3-3 4 3-1 5-4 1-2-3m4-11 4-2 3 4-1 3-4-2Z" fill="#c1d1b3"/>',
 '🥈':'<path d="m6 2 5 1 3 8-5 2Zm12 0-5 1-3 8 5 2Z" fill="#5f849d"/><circle cx="12" cy="15" r="7" fill="#b5c2c6"/><circle cx="12" cy="15" r="5" fill="none" stroke="#e9eeee"/><path d="M10 13c0-3 5-2 4 0-1 2-3 2-4 4h4" fill="none" stroke="#5f727c" stroke-width="1.2" stroke-linecap="round"/>'
};
export const symbol=key=>`<svg class="color-symbol" viewBox="0 0 24 24" aria-hidden="true">${paths[key]||paths['🎉']}</svg>`;
