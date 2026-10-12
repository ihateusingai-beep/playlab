import type { Subject } from '../types';

/**
 * 17 subjects, in fixed display order.
 * Names / descriptions are bilingual. Keep ids stable; the home page
 * uses index order, so never reorder this list without intent.
 */
export const SUBJECTS: readonly Subject[] = [
  {
    id: 'chinese',
    name: 'Chinese',
    nameZh: '中文',
    description: 'Learn Chinese language and culture through interactive games',
    descriptionZh: '通過互動遊戲學習中文語言和文化',
  },
  {
    id: 'english',
    name: 'English',
    nameZh: '英文',
    description: 'Master English language skills with fun educational games',
    descriptionZh: '通過趣味教育遊戲掌握英語技能',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    nameZh: '數學',
    description: 'Practice math concepts through engaging problem-solving games',
    descriptionZh: '通過解題遊戲實踐數學概念',
  },
  {
    id: 'physics',
    name: 'Physics',
    nameZh: '物理',
    description: 'Explore physics principles with interactive simulations',
    descriptionZh: '通過互動模擬探索物理原理',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    nameZh: '化學',
    description: 'Discover chemistry through virtual experiments and games',
    descriptionZh: '通過虛擬實驗和遊戲發現化學之美',
  },
  {
    id: 'biology',
    name: 'Biology',
    nameZh: '生物',
    description: 'Learn about life sciences through interactive experiences',
    descriptionZh: '通過互動體驗學習生命科學',
  },
  {
    id: 'science',
    name: 'Science',
    nameZh: '科學',
    description:
      'Explore science ideas through hands-on experiments and design challenges',
    descriptionZh: '透過動手實驗和設計挑戰探索科學概念',
  },
  {
    id: 'geography',
    name: 'Geography',
    nameZh: '地理',
    description: 'Explore world geography with maps and location games',
    descriptionZh: '通過地圖和地點遊戲探索世界地理',
  },
  {
    id: 'history',
    name: 'History',
    nameZh: '歷史',
    description: 'Journey through history with timeline and event games',
    descriptionZh: '通過時間線和事件遊戲穿越歷史',
  },
  {
    id: 'chinese-history',
    name: 'Chinese History',
    nameZh: '中國歷史',
    description: 'Discover Chinese historical events and cultural heritage',
    descriptionZh: '發現中國歷史事件和文化遺產',
  },
  {
    id: 'economics',
    name: 'Economics',
    nameZh: '經濟',
    description: 'Learn economic principles through simulation games',
    descriptionZh: '通過模擬遊戲學習經濟原理',
  },
  {
    id: 'bafs',
    name: 'BAFs',
    nameZh: '企會財',
    description: 'Business, Accounting and Financial Studies games',
    descriptionZh: '企業、會計與財務概論遊戲',
  },
  {
    id: 'music',
    name: 'Music',
    nameZh: '音樂',
    description:
      'Learn music and subject knowledge through rhythm games and educational songs',
    descriptionZh: '透過節奏遊戲和教育歌曲學習音樂及學科知識',
  },
  {
    id: 'physical-education',
    name: 'Physical Education',
    nameZh: '體育',
    description: 'Learn about health and fitness through active games',
    descriptionZh: '通過活動遊戲學習健康和體適能',
  },
  {
    id: 'tools',
    name: 'Tools',
    nameZh: '工具',
    description: 'Interactive tools that can be used in classrooms',
    descriptionZh: '可在課堂中使用的互動工具',
  },
  {
    id: 'aiot',
    name: 'AIoT',
    nameZh: 'AIoT',
    description: 'Explore artificial intelligence and Internet of Things concepts',
    descriptionZh: '探索人工智能和物聯網概念',
  },
  {
    id: 'others',
    name: 'Others',
    nameZh: '其他',
    description: 'Explore games created by students',
    descriptionZh: '探索由學生創作的遊戲',
  },
];

/** Lookup helper. Returns undefined for unknown subjects — never null. */
export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}
