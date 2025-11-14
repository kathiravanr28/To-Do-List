import bg1 from "../assets/backgrounds/anime-night-sky-illustration.jpg";
import bg2 from "../assets/backgrounds/digital-art-isolated-house.jpg";
import bg3 from "../assets/backgrounds/digital-art-volcano-illustration.jpg";
import bg4 from "../assets/backgrounds/fantasy-endless-hole-landscape.jpg";
import bg5 from "../assets/backgrounds/full-shot-ninja-wearing-equipment.jpg";
import bg6 from "../assets/backgrounds/illustration-anime-city.jpg";
import bg7 from "../assets/backgrounds/miami-bayside-landscape.jpg";
import bg8 from "../assets/backgrounds/minimal-grainy-gradient-background.jpg";
import bg9 from "../assets/backgrounds/3d-render-surreal-landscape-with-fictional-planet-island-sea.jpg";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9];

/**
 * PRELOAD ALL BACKGROUND IMAGES ONCE
 * Prevents gray flash when switching backgrounds
 */
export function preloadBackgrounds() {
  backgrounds.forEach((src) => {
    const img = new Image();
    img.src = src; // browser caches it
  });
}

export function getBackgrounds() {
  return backgrounds;
}

export function getNextBackgroundIndex(currentIndex) {
  return (currentIndex + 1) % backgrounds.length;
}
