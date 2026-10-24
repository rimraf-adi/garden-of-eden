'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import illustration components so they don't block initial SSR
const Chapter1Illustration = dynamic(() => import('./Chapter1Illustration'), { ssr: false });
const Chapter2Illustration = dynamic(() => import('./Chapter2Illustration'), { ssr: false });
const Chapter3Illustration = dynamic(() => import('./Chapter3Illustration'), { ssr: false });
const Chapter4Illustration = dynamic(() => import('./Chapter4Illustration'), { ssr: false });
const Chapter6Illustration = dynamic(() => import('./Chapter6Illustration'), { ssr: false });
const Chapter7Illustration = dynamic(() => import('./Chapter7Illustration'), { ssr: false });
const Chapter9Illustration = dynamic(() => import('./Chapter9Illustration'), { ssr: false });
const Chapter10Illustration = dynamic(() => import('./Chapter10Illustration'), { ssr: false });
const Chapter11Illustration = dynamic(() => import('./Chapter11Illustration'), { ssr: false });
const Chapter13Illustration = dynamic(() => import('./Chapter13Illustration'), { ssr: false });
const Chapter18Illustration = dynamic(() => import('./Chapter18Illustration'), { ssr: false });

export default function IllustrationDispatcher({ chapterNum }: { chapterNum: number }) {
  switch (chapterNum) {
    case 1:
      return <Chapter1Illustration />;
    case 2:
      return <Chapter2Illustration />;
    case 3:
      return <Chapter3Illustration />;
    case 4:
      return <Chapter4Illustration />;
    case 6:
      return <Chapter6Illustration />;
    case 7:
      return <Chapter7Illustration />;
    case 9:
      return <Chapter9Illustration />;
    case 10:
      return <Chapter10Illustration />;
    case 11:
      return <Chapter11Illustration />;
    case 13:
      return <Chapter13Illustration />;
    case 18:
      return <Chapter18Illustration />;
    default:
      return null;
  }
}
