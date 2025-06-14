import { Building, Room, RoomDetail, RoomReview, RoomReviewAuthor } from '../types/Campus';

const sampleReviewAuthors: RoomReviewAuthor[] = [
  {
    id: 1,
    username: 'student_ivan',
    full_name: 'Иван Петров'
  },
  {
    id: 2,
    username: 'maria_s',
    full_name: 'Мария Сидорова'
  },
  {
    id: 3,
    username: 'alex_teacher',
    full_name: 'Александр Николаевич'
  },
  {
    id: 4,
    username: 'anna_k',
    full_name: 'Анна Козлова'
  }
];

export const sampleBuildings: Building[] = [
  {
    id: 'building-l',
    name: 'Корпус Л',
    address: 'пр. Ленина, 61, корпус Л',
    description: 'Учебный корпус Института математики и информационных технологий. Современные аудитории, компьютерные классы, лаборатории.',
    image: 'https://www.asu.ru/files/images/editor/campus/corpusl10.jpg',
    floors: 4,
    latitude: 53.3498,
    longitude: 83.7798,
    average_rating: 4.3,
    total_rooms: 45
  },
  {
    id: 'building-s',
    name: 'Корпус С',
    address: 'пр. Ленина, 61, корпус С',
    description: 'Главный учебный корпус университета. Административные службы, актовый зал, библиотека.',
    image: 'https://www.asu.ru/files/images/editor/campus/Campusc11.jpg',
    floors: 5,
    latitude: 53.3495,
    longitude: 83.7795,
    average_rating: 4.1,
    total_rooms: 78
  },
  {
    id: 'building-d',
    name: 'Корпус Д',
    address: 'пр. Ленина, 61, корпус Д',
    description: 'Корпус естественных наук. Лаборатории физики, химии, биологии. Современное научное оборудование.',
    image: 'https://www.asu.ru/files/images/editor/campus/corpusd15.jpg',
    floors: 4,
    latitude: 53.3492,
    longitude: 83.7802,
    average_rating: 4.2,
    total_rooms: 52
  },
  {
    id: 'building-m',
    name: 'Корпус М',
    address: 'пр. Ленина, 61, корпус М',
    description: 'Медицинский корпус. Аудитории для изучения медицинских дисциплин, анатомический театр.',
    image: 'https://www.asu.ru/files/images/editor/40/40-32.jpg',
    floors: 3,
    latitude: 53.3500,
    longitude: 83.7790,
    average_rating: 4.0,
    total_rooms: 35
  }
];

export const sampleRoomsCorpusL: Room[] = [
  {
    id: 'room-l-101',
    number: '101',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 1,
    room_type: 'lecture',
    room_type_display: 'Лекционная аудитория',
    capacity: 120,
    description: 'Большая лекционная аудитория с современным мультимедийным оборудованием',
    equipment: ['Проектор', 'Экран', 'Микрофон', 'Доска маркерная', 'Кондиционер'],
    is_accessible: true,
    average_rating: 4.5,
    reviews_count: 23
  },
  {
    id: 'room-l-105',
    number: '105',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 1,
    room_type: 'computer',
    room_type_display: 'Компьютерный класс',
    capacity: 25,
    description: 'Компьютерный класс для практических занятий по программированию',
    equipment: ['25 компьютеров', 'Проектор', 'Интерактивная доска', 'Принтер', 'Сканер'],
    is_accessible: true,
    average_rating: 4.2,
    reviews_count: 18
  },
  {
    id: 'room-l-201',
    number: '201',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 2,
    room_type: 'classroom',
    room_type_display: 'Учебная аудитория',
    capacity: 40,
    description: 'Стандартная учебная аудитория для семинарских занятий',
    equipment: ['Проектор', 'Экран', 'Доска меловая', 'Парты'],
    is_accessible: true,
    average_rating: 3.8,
    reviews_count: 15
  },
  {
    id: 'room-l-205',
    number: '205',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 2,
    room_type: 'laboratory',
    room_type_display: 'Лаборатория',
    capacity: 20,
    description: 'Лаборатория физики с современным оборудованием',
    equipment: ['Лабораторные столы', 'Измерительные приборы', 'Микроскопы', 'Вытяжка'],
    is_accessible: false,
    average_rating: 4.1,
    reviews_count: 12
  },
  {
    id: 'room-l-301',
    number: '301',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 3,
    room_type: 'conference',
    room_type_display: 'Конференц-зал',
    capacity: 60,
    description: 'Конференц-зал для проведения защит и научных мероприятий',
    equipment: ['Проектор', 'Экран', 'Микрофоны', 'Видеокамера', 'Звуковая система'],
    is_accessible: true,
    average_rating: 4.7,
    reviews_count: 31
  },
  {
    id: 'room-l-310',
    number: '310',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 3,
    room_type: 'computer',
    room_type_display: 'Компьютерный класс',
    capacity: 30,
    description: 'Современный компьютерный класс с мощными рабочими станциями',
    equipment: ['30 компьютеров', 'Проектор', 'Интерактивная доска', 'Сетевое оборудование'],
    is_accessible: true,
    average_rating: 4.6,
    reviews_count: 27
  },
  {
    id: 'room-l-401',
    number: '401',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 4,
    room_type: 'lecture',
    room_type_display: 'Лекционная аудитория',
    capacity: 80,
    description: 'Большая лекционная аудитория с амфитеатром',
    equipment: ['Проектор', 'Экран', 'Микрофон', 'Доска маркерная', 'Кондиционер', 'Звуковая система'],
    is_accessible: true,
    average_rating: 4.4,
    reviews_count: 19
  },
  {
    id: 'room-l-405',
    number: '405',
    building: sampleBuildings[0],
    building_name: 'Корпус Л',
    floor: 4,
    room_type: 'laboratory',
    room_type_display: 'Лаборатория',
    capacity: 15,
    description: 'Лаборатория программирования и разработки ПО',
    equipment: ['15 рабочих станций', 'Сервер', 'Сетевое оборудование', 'Принтер 3D'],
    is_accessible: false,
    average_rating: 4.8,
    reviews_count: 22
  }
];

// Аудитории корпуса С
export const sampleRoomsCorpusS: Room[] = [
  {
    id: 'room-s-101',
    number: '101',
    building: sampleBuildings[1],
    building_name: 'Корпус С',
    floor: 1,
    room_type: 'lecture',
    room_type_display: 'Актовый зал',
    capacity: 300,
    description: 'Главный актовый зал университета для торжественных мероприятий',
    equipment: ['Сцена', 'Световое оборудование', 'Звуковая система', 'Проекторы', 'Микрофоны'],
    is_accessible: true,
    average_rating: 4.7,
    reviews_count: 45
  },
  {
    id: 'room-s-201',
    number: '201',
    building: sampleBuildings[1],
    building_name: 'Корпус С',
    floor: 2,
    room_type: 'classroom',
    room_type_display: 'Учебная аудитория',
    capacity: 50,
    description: 'Просторная аудитория для лекций и семинаров',
    equipment: ['Проектор', 'Экран', 'Доска маркерная', 'Парты', 'Кондиционер'],
    is_accessible: true,
    average_rating: 4.1,
    reviews_count: 28
  },
  {
    id: 'room-s-301',
    number: '301',
    building: sampleBuildings[1],
    building_name: 'Корпус С',
    floor: 3,
    room_type: 'conference',
    room_type_display: 'Конференц-зал',
    capacity: 40,
    description: 'Зал для проведения конференций и деловых встреч',
    equipment: ['Круглый стол', 'Проектор', 'Экран', 'Микрофоны', 'Видеосвязь'],
    is_accessible: true,
    average_rating: 4.5,
    reviews_count: 16
  }
];

export const sampleRoomReviews: RoomReview[] = [
  {
    id: 'review-1',
    author: sampleReviewAuthors[0],
    rating: 5,
    category: 'general',
    comment: 'Отличная аудитория! Современное оборудование, хорошая акустика. Удобные места.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-2',
    author: sampleReviewAuthors[1],
    rating: 4,
    category: 'equipment',
    comment: 'Хорошее техническое оснащение, но иногда проблемы с проектором.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-3',
    author: sampleReviewAuthors[2],
    rating: 4,
    category: 'comfort',
    comment: 'Удобная аудитория для проведения лекций. Хорошая вентиляция.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-4',
    author: sampleReviewAuthors[3],
    rating: 5,
    category: 'general',
    comment: 'Превосходная аудитория! Все работает отлично, очень удобно проводить занятия.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-5',
    author: sampleReviewAuthors[0],
    rating: 3,
    category: 'comfort',
    comment: 'Аудитория неплохая, но стулья не очень удобные для длительных занятий.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-6',
    author: sampleReviewAuthors[1],
    rating: 5,
    category: 'equipment',
    comment: 'Отличное оборудование! Компьютеры быстрые, все программы установлены.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];
