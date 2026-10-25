import React from 'react';

export type MascotPose = 'waving' | 'pointing' | 'celebrating' | 'sleeping' | 'worried';

export const MASCOT_IMAGE_PROMPTS: Record<
  MascotPose | 'pixel_key_3d',
  { titleEn: string; titleMl: string; prompt: string }
> = {
  waving: {
    titleEn: '1. Waving (Marketing Hero)',
    titleMl: '1. കൈവീശുന്ന പോസ് (ഹീറോ സ്ക്രീൻ)',
    prompt:
      'Cute 3D clay-style rounded capsule mascot character split into vibrant coral red (#FF4B55) top cap, sunny yellow (#EFC94C) left body, and royal blue (#1E4FD8) right body, wearing a lanyard ID badge with a traditional Kerala Kasavu cream-and-gold border, holding a chunky golden key in one gloved hand and happily waving with the other, white sneakers, soft studio 3D lighting, isolated on coral background.',
  },
  pointing: {
    titleEn: '2. Pointing at Alerts (Dashboard Banner)',
    titleMl: '2. അലേർട്ട് ചൂണ്ടിക്കാണിക്കുന്ന പോസ് (ഡാഷ്‌ബോർഡ്)',
    prompt:
      'Friendly 3D rounded capsule mascot in coral (#FF4B55), yellow (#EFC94C), and blue (#1E4FD8) with a Kerala Kasavu lanyard badge and golden vault key, pointing attentively toward the left to highlight upcoming document expiry alerts, helpful expression, soft studio shadows, clean gray target rings background.',
  },
  celebrating: {
    titleEn: '3. Celebrating (Document Renewed)',
    titleMl: '3. സന്തോഷിക്കുന്ന പോസ് (രേഖ പുതുക്കിയപ്പോൾ)',
    prompt:
      'Joyful 3D rounded capsule mascot in coral (#FF4B55), yellow (#EFC94C), and blue (#1E4FD8) wearing a Kerala Kasavu lanyard badge, jumping in celebration holding a glowing golden key aloft with confetti stars around, celebrating a renewed household document, Pixar-grade toy shader.',
  },
  sleeping: {
    titleEn: '4. Sleeping Calmly (Empty State)',
    titleMl: '4. ശാന്തമായി ഉറങ്ങുന്ന പോസ് (ഒഴിഞ്ഞ അവസ്ഥ)',
    prompt:
      'Peaceful 3D rounded capsule mascot in coral (#FF4B55), yellow (#EFC94C), and blue (#1E4FD8) wearing a Kerala Kasavu lanyard badge, resting with closed happy eyes hugging a golden vault key, floating Zzz bubbles, soft neutral gray studio card surface.',
  },
  worried: {
    titleEn: '5. Worried but Calm (Expired Item)',
    titleMl: '5. ശ്രദ്ധയോടെ ഓർമ്മിപ്പിക്കുന്ന പോസ് (കാലാവധി കഴിഞ്ഞവ)',
    prompt:
      'Attentive, slightly concerned but reassuring 3D rounded capsule mascot in coral (#FF4B55), yellow (#EFC94C), and blue (#1E4FD8) with a Kerala Kasavu lanyard badge, holding a small clock and golden key to gently remind the family about an expired document, soft warm 3D lighting.',
  },
  pixel_key_3d: {
    titleEn: '6. Voxel 3D Golden Key & Lock (Hero Right Accent)',
    titleMl: '6. 3D പിക്സൽ ഗോൾഡൻ താക്കോലും പൂട്ടും',
    prompt:
      'Isometric 3D voxel pixel-art golden key and ornate Kerala brass vault lock floating at a playful angle, warm amber and yellow (#EFC94C) cubes with crisp shadows and pink/coral #1 emblem detail, isolated on coral red background.',
  },
};

interface VaultMascotProps {
  pose?: MascotPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const VaultMascot: React.FC<VaultMascotProps> = ({
  pose = 'waving',
  size = 'lg',
  className = '',
  animated = true,
}) => {
  const dimensions =
    size === 'sm'
      ? 'w-20 h-20'
      : size === 'md'
      ? 'w-28 h-28'
      : size === 'lg'
      ? 'w-40 h-40'
      : 'w-52 h-52';

  const uid = `mascot-${pose}-${size}`;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${dimensions} ${
        animated ? 'mascot-bounce' : ''
      } ${className}`}
      role="img"
      aria-label={`Kudumba Vault 3D mascot (${pose} pose)`}
    >
      <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" fill="none">
        <defs>
          {/* 3D Specular & Shading Gradients */}
          <linearGradient id={`${uid}-coral`} x1="60" y1="35" x2="180" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B74" />
            <stop offset="55%" stopColor="#FF4B55" />
            <stop offset="100%" stopColor="#D62934" />
          </linearGradient>
          <linearGradient id={`${uid}-yellow`} x1="55" y1="85" x2="125" y2="185" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE17D" />
            <stop offset="60%" stopColor="#EFC94C" />
            <stop offset="100%" stopColor="#CFA323" />
          </linearGradient>
          <linearGradient id={`${uid}-blue`} x1="115" y1="85" x2="185" y2="185" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B6FF5" />
            <stop offset="60%" stopColor="#1E4FD8" />
            <stop offset="100%" stopColor="#133499" />
          </linearGradient>
          <clipPath id={`${uid}-capsule`}>
            <rect x="64" y="48" width="112" height="128" rx="52" />
          </clipPath>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="120" cy="222" rx="54" ry="10" fill="rgba(11,11,12,0.18)" />

        {/* Top Antenna / Fuse with Sparks (matching Festie mascot silhouette) */}
        <path
          d="M115 48 C110 30, 128 26, 122 18"
          stroke="#0B0B0C"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {pose === 'celebrating' || pose === 'waving' ? (
          <g>
            <line x1="126" y1="12" x2="132" y2="5" stroke="#EFC94C" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="133" y1="18" x2="142" y2="15" stroke="#1E4FD8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="117" y1="11" x2="112" y2="4" stroke="#FF4B55" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : null}

        {/* Left & Right Legs + White Sneakers */}
        <path
          d={pose === 'celebrating' ? 'M94 168 L82 194' : 'M96 170 L90 202'}
          stroke="#0B0B0C"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={pose === 'celebrating' ? 'M146 168 L158 190' : 'M144 170 L148 198'}
          stroke="#0B0B0C"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Left Sneaker */}
        <g transform={pose === 'celebrating' ? 'translate(64, 186) rotate(-18)' : 'translate(72, 196)'}>
          <rect x="0" y="0" width="32" height="18" rx="9" fill="#FFFFFF" stroke="#E6E8EC" strokeWidth="2" />
          <line x1="10" y1="5" x2="18" y2="5" stroke="#0B0B0C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="9" x2="18" y2="9" stroke="#0B0B0C" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Right Sneaker */}
        <g transform={pose === 'celebrating' ? 'translate(146, 182) rotate(16)' : 'translate(136, 192) rotate(8)'}>
          <rect x="0" y="0" width="32" height="18" rx="9" fill="#FFFFFF" stroke="#E6E8EC" strokeWidth="2" />
          <line x1="12" y1="5" x2="20" y2="5" stroke="#0B0B0C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="9" x2="20" y2="9" stroke="#0B0B0C" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Left Arm (Holding Golden Vault Key) */}
        <path
          d={
            pose === 'pointing'
              ? 'M68 118 C42 108, 30 96, 18 84'
              : pose === 'sleeping'
              ? 'M68 122 C48 132, 54 148, 72 146'
              : 'M68 118 C40 124, 38 146, 56 152'
          }
          stroke="#0B0B0C"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Left White Glove */}
        <circle
          cx={pose === 'pointing' ? 18 : pose === 'sleeping' ? 74 : 58}
          cy={pose === 'pointing' ? 84 : pose === 'sleeping' ? 146 : 152}
          r="12"
          fill="#FFFFFF"
          stroke="#E6E8EC"
          strokeWidth="2"
        />

        {/* 3D Capsule Body (Clipped into Yellow Left, Blue Right, Coral Top Cap) */}
        <g clipPath={`url(#${uid}-capsule)`}>
          {/* Left Half: Sunny Yellow (#EFC94C) */}
          <rect x="64" y="84" width="56" height="96" fill={`url(#${uid}-yellow)`} />
          {/* Right Half: Brand Blue (#1E4FD8) */}
          <rect x="120" y="84" width="56" height="96" fill={`url(#${uid}-blue)`} />
          {/* Top Dome Cap: Brand Coral (#FF4B55) */}
          <path d="M60 48 H180 V96 C150 90, 90 90, 60 96 Z" fill={`url(#${uid}-coral)`} />
          {/* 3D Specular Highlight on Dome */}
          <ellipse cx="96" cy="64" rx="22" ry="7" fill="rgba(255,255,255,0.35)" transform="rotate(-12 96 64)" />
        </g>

        {/* White Rounded Face Visor */}
        <rect
          x="88"
          y="78"
          width="64"
          height="46"
          rx="16"
          fill="#FFFFFF"
          stroke="#0B0B0C"
          strokeWidth="2.5"
        />

        {/* Expressive Eyes & Mouth by Pose */}
        {pose === 'sleeping' ? (
          <g>
            <path d="M101 98 Q107 104 113 98" stroke="#0B0B0C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M127 98 Q133 104 139 98" stroke="#0B0B0C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M115 111 Q120 114 125 111" stroke="#0B0B0C" strokeWidth="3" strokeLinecap="round" fill="none" />
            <text x="162" y="64" fill="#1E4FD8" fontWeight="800" fontSize="18">
              Zzz
            </text>
          </g>
        ) : pose === 'worried' ? (
          <g>
            <line x1="99" y1="88" x2="111" y2="91" stroke="#0B0B0C" strokeWidth="3" strokeLinecap="round" />
            <line x1="141" y1="88" x2="129" y2="91" stroke="#0B0B0C" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="106" cy="99" rx="4" ry="5.5" fill="#0B0B0C" />
            <ellipse cx="134" cy="99" rx="4" ry="5.5" fill="#0B0B0C" />
            <path d="M113 113 Q120 108 127 113" stroke="#0B0B0C" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <g>
            <ellipse cx="106" cy="97" rx="4.2" ry="6" fill="#0B0B0C" />
            <ellipse cx="134" cy="97" rx="4.2" ry="6" fill="#0B0B0C" />
            <circle cx="104.5" cy="94.5" r="1.5" fill="#FFFFFF" />
            <circle cx="132.5" cy="94.5" r="1.5" fill="#FFFFFF" />
            <path
              d={pose === 'celebrating' ? 'M110 107 Q120 119 130 107 Z' : 'M112 108 Q120 116 128 108'}
              stroke="#0B0B0C"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill={pose === 'celebrating' ? '#FF4B55' : 'none'}
            />
          </g>
        )}

        {/* Lanyard Strap + Kerala Kasavu Gold-Bordered ID Badge */}
        <path d="M98 124 L116 146 L124 146 L142 124" stroke="#0B0B0C" strokeWidth="3.5" fill="none" />
        <g transform="translate(106, 142)">
          {/* Kasavu Cream Card with Golden Border */}
          <rect
            x="0"
            y="0"
            width="28"
            height="34"
            rx="6"
            fill="#FFFDF7"
            stroke="#EFC94C"
            strokeWidth="3"
          />
          {/* Traditional Kasavu Gold Stripe at Bottom */}
          <rect x="2" y="25" width="24" height="5" fill="#EFC94C" />
          {/* Badge Emblem */}
          <rect x="6" y="6" width="10" height="7" rx="2" fill="#FF4B55" />
          <rect x="6" y="15" width="16" height="4" rx="1.5" fill="#1E4FD8" />
        </g>

        {/* Right Arm (Waving / Celebrating / Holding Golden Key) */}
        <path
          d={
            pose === 'waving' || pose === 'celebrating'
              ? 'M172 118 C192 104, 204 86, 214 72'
              : 'M172 120 C194 128, 198 144, 184 152'
          }
          stroke="#0B0B0C"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Right White Glove */}
        <circle
          cx={pose === 'waving' || pose === 'celebrating' ? 214 : 182}
          cy={pose === 'waving' || pose === 'celebrating' ? 72 : 152}
          r="12"
          fill="#FFFFFF"
          stroke="#E6E8EC"
          strokeWidth="2"
        />

        {/* Golden Vault Key held by Mascot */}
        <g
          transform={
            pose === 'celebrating'
              ? 'translate(198, 26) rotate(-25)'
              : 'translate(22, 134) rotate(-20)'
          }
        >
          <circle cx="16" cy="16" r="12" fill="#EFC94C" stroke="#0B0B0C" strokeWidth="3" />
          <circle cx="16" cy="16" r="4.5" fill="#FF4B55" />
          <rect x="26" y="13" width="24" height="6" rx="3" fill="#EFC94C" stroke="#0B0B0C" strokeWidth="2.5" />
          <rect x="38" y="19" width="5" height="7" rx="1.5" fill="#EFC94C" stroke="#0B0B0C" strokeWidth="2" />
          <rect x="45" y="19" width="5" height="9" rx="1.5" fill="#EFC94C" stroke="#0B0B0C" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Pixel-style 3D Golden Key & Lock Object (replaces the Festie pixel trophy on the right of the Hero)
 */
export const PixelKey3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none mascot-bounce ${className}`}
      role="img"
      aria-label="3D pixel-style golden vault lock and key"
    >
      <svg viewBox="0 0 220 220" className="w-40 h-40 sm:w-48 sm:h-48 overflow-visible" fill="none">
        {/* Drop shadow */}
        <ellipse cx="112" cy="202" rx="52" ry="10" fill="rgba(11,11,12,0.22)" />

        {/* Pixelated 3D Shackle (Top Arch of Padlock) */}
        <g transform="rotate(8 110 110)">
          {/* Shackle 3D Depth Layer */}
          <rect x="76" y="28" width="68" height="16" fill="#C47D16" />
          <rect x="64" y="44" width="18" height="44" fill="#C47D16" />
          <rect x="138" y="44" width="18" height="44" fill="#C47D16" />

          {/* Shackle Front Pixel Blocks */}
          <rect x="72" y="24" width="68" height="16" fill="#EFC94C" stroke="#B56E0E" strokeWidth="2" />
          <rect x="60" y="40" width="18" height="44" fill="#EFC94C" stroke="#B56E0E" strokeWidth="2" />
          <rect x="134" y="40" width="18" height="44" fill="#EFC94C" stroke="#B56E0E" strokeWidth="2" />

          {/* Main Voxel Lock Body (3D Extruded Depth) */}
          <rect x="48" y="86" width="128" height="92" fill="#B56E0E" />
          <rect x="56" y="178" width="112" height="14" fill="#8F5106" />

          {/* Main Voxel Lock Body (Front Golden Grid) */}
          <rect x="42" y="80" width="128" height="92" fill="#F59E0B" stroke="#B56E0E" strokeWidth="2.5" />
          <rect x="50" y="88" width="112" height="76" fill="#EFC94C" />

          {/* Voxel Grid Lines for Authentic Pixel-3D Look */}
          <line x1="78" y1="80" x2="78" y2="172" stroke="#D97706" strokeWidth="2" strokeOpacity="0.45" />
          <line x1="106" y1="80" x2="106" y2="172" stroke="#D97706" strokeWidth="2" strokeOpacity="0.45" />
          <line x1="134" y1="80" x2="134" y2="172" stroke="#D97706" strokeWidth="2" strokeOpacity="0.45" />
          <line x1="42" y1="108" x2="170" y2="108" stroke="#D97706" strokeWidth="2" strokeOpacity="0.45" />
          <line x1="42" y1="136" x2="170" y2="136" stroke="#D97706" strokeWidth="2" strokeOpacity="0.45" />

          {/* Center Pixel Keyhole Emblem (Pink/Coral accent like the #1 on the reference trophy) */}
          <rect x="94" y="106" width="24" height="22" fill="#FF4B55" stroke="#0B0B0C" strokeWidth="2.5" />
          <rect x="100" y="128" width="12" height="20" fill="#0B0B0C" />
        </g>
      </svg>
    </div>
  );
};
