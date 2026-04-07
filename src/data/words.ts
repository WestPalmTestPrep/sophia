export interface WordEntry {
  id: string;
  text: string;
  size: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  weight: 'light' | 'normal' | 'bold';
  style: 'serif' | 'sans';
}

export const wordEntries: WordEntry[] = [
  { id: '1',  text: 'Naturally Unexpected',              size: 'xl', weight: 'bold',   style: 'serif' },
  { id: '2',  text: 'most photography is a luxury',      size: 'lg', weight: 'light',  style: 'serif' },
  { id: '3',  text: 'mine is an investment',             size: 'lg', weight: 'bold',   style: 'serif' },
  { id: '4',  text: 'Creator of Content',                size: 'md', weight: 'normal', style: 'sans' },
  { id: '5',  text: 'Memory Maker',                      size: 'md', weight: 'bold',   style: 'serif' },
  { id: '6',  text: 'strategic visual storytelling',     size: 'sm', weight: 'light',  style: 'sans' },
  { id: '7',  text: 'photographer',                      size: 'lg', weight: 'light',  style: 'serif' },
  { id: '8',  text: 'creative director',                 size: 'md', weight: 'normal', style: 'sans' },
  { id: '9',  text: 'fine artist',                       size: 'md', weight: 'bold',   style: 'serif' },
  { id: '10', text: 'MIA',                               size: 'sm', weight: 'bold',   style: 'sans' },
  { id: '11', text: 'NY',                                size: 'sm', weight: 'bold',   style: 'sans' },
  { id: '12', text: '+ beyond',                          size: 'xs', weight: 'light',  style: 'sans' },
  { id: '13', text: 'the queen',                         size: 'lg', weight: 'bold',   style: 'serif' },
  { id: '14', text: 'authentically raw',                  size: 'sm', weight: 'light',  style: 'serif' },
  { id: '15', text: 'emotionally resonant',              size: 'sm', weight: 'normal', style: 'sans' },
  { id: '16', text: 'whimsical',                         size: 'md', weight: 'light',  style: 'serif' },
  { id: '17', text: 'editorial',                         size: 'md', weight: 'normal', style: 'sans' },
  { id: '18', text: '♛',                                 size: 'xl', weight: 'normal', style: 'serif' },
];
