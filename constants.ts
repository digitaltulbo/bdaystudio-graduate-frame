import { SchoolLevel, GownColor, BackgroundStyle, ConfettiType } from './types';

export const SCHOOL_LEVELS = [
  { value: SchoolLevel.KINDERGARTEN, label: '유치원', emoji: '🐥' },
  { value: SchoolLevel.ELEMENTARY, label: '초등학교', emoji: '🎒' },
  { value: SchoolLevel.MIDDLE, label: '중학교', emoji: '🏫' },
  { value: SchoolLevel.HIGH, label: '고등학교', emoji: '🎓' },
  { value: SchoolLevel.UNIVERSITY, label: '대학교', emoji: '🏛️' },
];

export const GOWN_COLORS = [
  { value: GownColor.BLACK, color: '#1a1a1a', label: '블랙' },
  { value: GownColor.NAVY, color: '#1e293b', label: '네이비' },
  { value: GownColor.BURGUNDY, color: '#7f1d1d', label: '버건디' },
  { value: GownColor.WHITE_GOLD, color: '#fef3c7', label: '화이트' },
  { value: GownColor.SKY_BLUE, color: '#bae6fd', label: '스카이' },
  { value: GownColor.PINK, color: '#fbcfe8', label: '핑크' },
];

export const BACKGROUNDS = [
  { value: BackgroundStyle.WHITE, color: '#ffffff', label: '화이트' },
  { value: BackgroundStyle.LIGHT_GRAY, color: '#f3f4f6', label: '그레이' },
  { value: BackgroundStyle.CLASSIC_BLUE, color: '#1e3a8a', label: '블루' },
  { value: BackgroundStyle.BEIGE, color: '#f5f5dc', label: '베이지' },
  { value: BackgroundStyle.GRADIENT_GRAY, color: 'linear-gradient(to bottom, #f3f4f6, #d1d5db)', label: '그라데이션' },
  { value: BackgroundStyle.BOKEH, color: '#fbbf24', label: '보케' },
  { value: BackgroundStyle.VELVET, color: '#4c0519', label: '벨벳' },
  { value: BackgroundStyle.CHERRY_BLOSSOM, color: '#fce7f3', label: '벚꽃' },
  { value: BackgroundStyle.BALLOONS, color: '#f0f9ff', label: '풍선' },
  { value: BackgroundStyle.FLOWERS, color: '#dcfce7', label: '꽃다발' },
  { value: BackgroundStyle.LAVENDER, color: '#e9d5ff', label: '라벤더' },
  { value: BackgroundStyle.SAGE, color: '#dcfce7', label: '세이지' },
  { value: BackgroundStyle.PEACH, color: '#ffedd5', label: '피치' },
  { value: BackgroundStyle.PINK_MILLENNIAL, color: '#fce7f3', label: '밀레니얼' },
];

export const CONFETTI_OPTIONS = [
  { value: ConfettiType.NONE, label: '없음', emoji: '🚫' },
  { value: ConfettiType.GOLD, label: '골드', emoji: '✨' },
  { value: ConfettiType.SILVER, label: '실버', emoji: '🌫️' },
  { value: ConfettiType.PASTEL, label: '파스텔', emoji: '🎉' },
  { value: ConfettiType.HOLOGRAM, label: '홀로그램', emoji: '🌈' },
];