export interface Cat {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  color: string;
  personality: string[];
  neutered: boolean;
  vaccinated: boolean;
  imageUrl: string;
  location: { x: number; y: number };
  zone: string;
}

export interface CheckInRecord {
  id: string;
  catId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  photoUrl: string;
  comment: string;
  timestamp: string;
}

export const mockCats: Cat[] = [
  {
    id: 'c1',
    name: '大橘 (Big Orange)',
    gender: 'Male',
    color: 'Orange Tabby',
    personality: ['亲人 (Friendly)', '贪吃 (Greedy)', '粘人 (Clingy)'],
    neutered: true,
    vaccinated: true,
    imageUrl: 'https://images.unsplash.com/photo-1593483316242-efb5420596ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXR8ZW58MXx8fHwxNzc2NzcyNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 30, y: 45 },
    zone: '图书馆区 (Library Zone)',
  },
  {
    id: 'c2',
    name: '煤球 (Briq)',
    gender: 'Female',
    color: 'Black',
    personality: ['高冷 (Aloof)', '机警 (Alert)'],
    neutered: true,
    vaccinated: true,
    imageUrl: 'https://images.unsplash.com/photo-1503431128871-cd250803fa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGNhdHxlbnwxfHx8fDE3NzY3NzI3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 60, y: 20 },
    zone: '理科楼区 (Science Building Zone)',
  },
  {
    id: 'c3',
    name: '三花 (Calico)',
    gender: 'Female',
    color: 'Calico',
    personality: ['温柔 (Gentle)', '慢热 (Slow to warm up)'],
    neutered: false,
    vaccinated: false,
    imageUrl: 'https://images.unsplash.com/photo-1503777119540-ce54b422baff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpY28lMjBjYXR8ZW58MXx8fHwxNzc2NzcyNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 80, y: 70 },
    zone: '宿舍区 (Dormitory Zone)',
  },
  {
    id: 'c4',
    name: '小白 (Snowy)',
    gender: 'Male',
    color: 'White',
    personality: ['活泼 (Active)', '爱玩 (Playful)'],
    neutered: true,
    vaccinated: true,
    imageUrl: 'https://images.unsplash.com/photo-1606208427954-aa8319c4815e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdHxlbnwxfHx8fDE3NzY3NzI3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 45, y: 80 },
    zone: '食堂区 (Cafeteria Zone)',
  }
];

export const mockCheckIns: CheckInRecord[] = [
  {
    id: 'chk1',
    catId: 'c1',
    userId: 'u1',
    userName: '小李同学',
    userAvatar: 'https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwb3V0ZG9vcnN8ZW58MXx8fHwxNzc2NzcyNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    photoUrl: 'https://images.unsplash.com/photo-1593483316242-efb5420596ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXR8ZW58MXx8fHwxNzc2NzcyNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    comment: '今天在图书馆门口又碰到大橘啦，赏了根猫条！',
    timestamp: '2023-10-25T14:30:00Z'
  },
  {
    id: 'chk2',
    catId: 'c1',
    userId: 'u2',
    userName: '猫咪观察员',
    userAvatar: 'https://ui-avatars.com/api/?name=猫&background=random',
    photoUrl: 'https://images.unsplash.com/photo-1593483316242-efb5420596ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXR8ZW58MXx8fHwxNzc2NzcyNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    comment: '睡得好香ZZz...',
    timestamp: '2023-10-24T09:15:00Z'
  }
];
