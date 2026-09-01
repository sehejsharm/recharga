/**
 * Photo gallery for /about-sehej-sharma.
 *
 * Founder-supplied set, hosted on Wikimedia Commons. One typed list drives
 * both the rendered <img> tags and the ImageGallery JSON-LD, so a caption or
 * alt string can never drift between the markup and the structured data.
 *
 * `alt` doubles as ImageObject.name and `caption` as ImageObject.caption,
 * which is how the supplied source paired them.
 */

export type GalleryImage = {
  /** Commons Special:FilePath URL — resolves to the current file revision. */
  src: string;
  /** Alt text; also emitted as ImageObject.name. */
  alt: string;
  /** Visible figcaption; also emitted as ImageObject.caption. */
  caption: string;
  width: number;
  height: number;
};

export type GallerySection = {
  heading: string;
  images: GalleryImage[];
};

export const gallerySections: GallerySection[] = [
  {
    heading: "Speaking & Entrepreneurship",
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20Sharma.png",
        alt: "Sehej Sharma, Founder and CEO of Recharga Chargine, professional portrait",
        caption: "Sehej Sharma, Founder & CEO",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20pitching%20Recharga%20Chargine.jpg",
        alt: "Sehej Sharma pitching Recharga Chargine at a startup event",
        caption: "Pitching Recharga Chargine",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20pitching%20Recharga.jpg",
        alt: "Sehej Sharma presenting Recharga Chargine at a pitch event",
        caption: "Presenting Recharga Chargine",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20pitching.jpg",
        alt: "Sehej Sharma pitching to an audience",
        caption: "Pitching on stage",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20presenting%20awards%20at%20the%20Indian%20Institue%20of%20Technology%20Delhi.jpg",
        alt: "Sehej Sharma presenting at the Indian Institute of Technology (IIT) Delhi",
        caption: "At IIT Delhi",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20lecturing%20%40%20Indian%20Institute%20of%20Technology%20Delhi.jpg",
        alt: "Sehej Sharma lecturing at the Indian Institute of Technology (IIT) Delhi",
        caption: "Lecturing at IIT Delhi",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20lecturing%20at%20a%20business%20college.jpg",
        alt: "Sehej Sharma lecturing at a business college",
        caption: "Lecturing at a business college",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20speaking%20at%20a%20business%20school.jpg",
        alt: "Sehej Sharma speaking at a business school",
        caption: "Speaking at a business school",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20%40%20Master%27s%20Union%20for%20the%20CEO%20Challenger%202023.jpg",
        alt: "Sehej Sharma at Master's Union for the CEO Challenger 2023",
        caption: "Master's Union CEO Challenger 2023",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20Sharma%20addressing%20his%20team.jpg",
        alt: "Sehej Sharma addressing his team",
        caption: "Addressing his team",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20Sharma%20sitting%20for%20an%20interview.jpg",
        alt: "Sehej Sharma sitting for an interview",
        caption: "In an interview",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20addressing%20his%20school%20batch%20at%20high%20school%20graduation.jpg",
        alt: "Sehej Sharma addressing his batch at high school graduation",
        caption: "High school graduation address",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20being%20sehej.jpg",
        alt: "Sehej Sharma presenting in a boardroom",
        caption: "In the boardroom",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20working.jpg",
        alt: "Sehej Sharma working",
        caption: "At work",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20in%20his%20element.jpg",
        alt: "Sehej Sharma at work, in his element",
        caption: "In his element",
        width: 400,
        height: 400,
      },
    ],
  },
  {
    heading: "Equestrian & Personal",
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20playing%20Polo.png",
        alt: "Sehej Sharma playing polo on horseback",
        caption: "Playing polo",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20practicing%20polo.jpg",
        alt: "Sehej Sharma practicing polo",
        caption: "Practicing polo",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20dominating%20arena%20polo%20games.jpg",
        alt: "Sehej Sharma playing arena polo",
        caption: "Arena polo",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20Show%20jumping.jpg",
        alt: "Sehej Sharma show jumping on horseback",
        caption: "Show jumping",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20jumping%20horses%20early%20morning.png",
        alt: "Sehej Sharma show jumping early in the morning",
        caption: "Morning show jumping",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20performing%20dressage%20activities.jpg",
        alt: "Sehej Sharma performing dressage",
        caption: "Dressage",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20riding%20horses.jpg",
        alt: "Sehej Sharma riding horses",
        caption: "Horse riding",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20riding.jpg",
        alt: "Sehej Sharma horse riding",
        caption: "Riding",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20training%20a%20green%20horse.jpg",
        alt: "Sehej Sharma training a young horse",
        caption: "Training a green horse",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20with%20his%20friend%20Raghav%20playing%20golf.jpg",
        alt: "Sehej Sharma playing golf",
        caption: "Playing golf",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20in%20London.png",
        alt: "Sehej Sharma in London",
        caption: "In London",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20in%20Scotland.jpg",
        alt: "Sehej Sharma in Scotland",
        caption: "In Scotland",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20in%20Interlaken.jpg",
        alt: "Sehej Sharma in Interlaken",
        caption: "In Interlaken",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20in%20Gstaad.jpg",
        alt: "Sehej Sharma in Gstaad",
        caption: "In Gstaad",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20on%20holiday.jpg",
        alt: "Sehej Sharma on holiday",
        caption: "On holiday",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%27s%20work%20doesn%27t%20stop%20even%20while%20vacationing.jpg",
        alt: "Sehej Sharma working while on holiday",
        caption: "Working on holiday",
        width: 400,
        height: 400,
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20Sharma.jpg",
        alt: "Sehej Sharma",
        caption: "Sehej Sharma",
        width: 400,
        height: 400,
      },
    ],
  },
];

/** Flat list, in source order — the order the JSON-LD image array uses. */
export const galleryImages: GalleryImage[] = gallerySections.flatMap(
  (section) => section.images,
);
