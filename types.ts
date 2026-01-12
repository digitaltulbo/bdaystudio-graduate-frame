export enum SchoolLevel {
  KINDERGARTEN = '어린이집/유치원',
  ELEMENTARY = '초등학교',
  MIDDLE = '중학교',
  HIGH = '고등학교',
  UNIVERSITY = '대학교',
}

export enum GownColor {
  BLACK = '클래식 블랙',
  NAVY = '네이비 블루',
  BURGUNDY = '버건디 레드',
  WHITE_GOLD = '화이트 & 골드',
  SKY_BLUE = '스카이 블루',
  PINK = '핑크 블러썸',
}

export enum BackgroundStyle {
  WHITE = '화이트 (기본)',
  LIGHT_GRAY = '라이트 그레이',
  CLASSIC_BLUE = '클래식 블루',
  BEIGE = '소프트 베이지',
  GRADIENT_GRAY = '그라데이션 그레이',
  BOKEH = '보케 라이트',
  VELVET = '벨벳 다크',
  CHERRY_BLOSSOM = '벚꽃 블러',
  BALLOONS = '풍선 셀레브레이션',
  FLOWERS = '꽃다발 가든',
  LAVENDER = '라벤더',
  SAGE = '세이지 그린',
  PEACH = '피치',
  PINK_MILLENNIAL = '밀레니얼 핑크',
}

export enum ConfettiType {
  NONE = '없음',
  GOLD = '골드',
  SILVER = '실버',
  PASTEL = '파스텔',
  HOLOGRAM = '홀로그램',
}

export interface GraduationOptions {
  schoolLevel: SchoolLevel;
  gownColor: GownColor;
  background: BackgroundStyle;
  confetti: ConfettiType;
  customText: string;
}

export interface GeneratedImage {
  original: string; // Base64
  generated: string; // Base64
}
