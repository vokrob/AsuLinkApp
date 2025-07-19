import { Building, Room, RoomDetail, RoomReview, RoomReviewAuthor } from '../types/Campus';

const sampleReviewAuthors: RoomReviewAuthor[] = [
  {
    id: 1,
    username: 'student_ivan',
    full_name: 'Ivan Petrov'
  },
  {
    id: 2,
    username: 'maria_s',
    full_name: 'Maria Sidorova'
  },
  {
    id: 3,
    username: 'alex_teacher',
    full_name: 'Alexander Nikolaevich'
  },
  {
    id: 4,
    username: 'anna_k',
    full_name: 'Anna Kozlova'
  }
];

export const sampleBuildings: Building[] = [
  {
    id: 'building-l',
    name: 'Building L',
    address: 'Lenin Ave., 61, Building L',
    description: 'Academic building of the Institute of Mathematics and Information Technology. Modern classrooms, computer labs, laboratories.',
    image: 'https://www.asu.ru/files/images/editor/campus/corpusl10.jpg',
    floors: 4,
    latitude: 53.3498,
    longitude: 83.7798,
    average_rating: 4.3,
    total_rooms: 45
  },
  {
    id: 'building-s',
    name: 'Building S',
    address: 'Lenin Ave., 61, Building S',
    description: 'Main academic building of the university. Administrative services, assembly hall, library.',
    image: 'https://www.asu.ru/files/images/editor/campus/Campusc11.jpg',
    floors: 5,
    latitude: 53.3495,
    longitude: 83.7795,
    average_rating: 4.1,
    total_rooms: 78
  },
  {
    id: 'building-d',
    name: 'Building D',
    address: 'Lenin Ave., 61, Building D',
    description: 'Natural sciences building. Physics, chemistry, biology laboratories. Modern scientific equipment.',
    image: 'https://www.asu.ru/files/images/editor/campus/corpusd15.jpg',
    floors: 4,
    latitude: 53.3492,
    longitude: 83.7802,
    average_rating: 4.2,
    total_rooms: 52
  },
  {
    id: 'building-m',
    name: 'Building M',
    address: 'Lenin Ave., 61, Building M',
    description: 'Medical building. Classrooms for medical disciplines, anatomy theater.',
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
    building_name: 'Building L',
    floor: 1,
    room_type: 'lecture',
    room_type_display: 'Lecture Hall',
    capacity: 120,
    description: 'Large lecture hall with modern multimedia equipment',
    equipment: ['Projector', 'Screen', 'Microphone', 'Whiteboard', 'Air Conditioning'],
    is_accessible: true,
    average_rating: 4.5,
    reviews_count: 23
  },
  {
    id: 'room-l-105',
    number: '105',
    building: sampleBuildings[0],
    building_name: 'Building L',
    floor: 1,
    room_type: 'computer',
    room_type_display: 'Computer Lab',
    capacity: 25,
    description: 'Computer lab for practical programming classes',
    equipment: ['25 computers', 'Projector', 'Interactive board', 'Printer', 'Scanner'],
    is_accessible: true,
    average_rating: 4.2,
    reviews_count: 18
  },
  {
    id: 'room-l-201',
    number: '201',
    building: sampleBuildings[0],
    building_name: 'Building L',
    floor: 2,
    room_type: 'classroom',
    room_type_display: 'Classroom',
    capacity: 40,
    description: 'Standard classroom for seminars',
    equipment: ['Projector', 'Screen', 'Chalkboard', 'Desks'],
    is_accessible: true,
    average_rating: 3.8,
    reviews_count: 15
  },
  {
    id: 'room-l-205',
    number: '205',
    building: sampleBuildings[0],
    building_name: 'Building L',
    floor: 2,
    room_type: 'laboratory',
    room_type_display: 'Laboratory',
    capacity: 20,
    description: 'Physics laboratory with modern equipment',
    equipment: ['Lab tables', 'Measuring instruments', 'Microscopes', 'Fume hood'],
    is_accessible: false,
    average_rating: 4.1,
    reviews_count: 12
  },
  {
    id: 'room-l-301',
    number: '301',
    building: sampleBuildings[0],
    building_name: 'Building L',
    floor: 3,
    room_type: 'conference',
    room_type_display: 'Conference Room',
    capacity: 60,
    description: 'Conference room for thesis defenses and scientific events',
    equipment: ['Projector', 'Screen', 'Microphones', 'Video camera', 'Sound system'],
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

// Building S rooms
export const sampleRoomsCorpusS: Room[] = [
  {
    id: 'room-s-101',
    number: '101',
    building: sampleBuildings[1],
    building_name: 'Building S',
    floor: 1,
    room_type: 'lecture',
    room_type_display: 'Assembly Hall',
    capacity: 300,
    description: 'Main university assembly hall for ceremonial events',
    equipment: ['Stage', 'Lighting equipment', 'Sound system', 'Projectors', 'Microphones'],
    is_accessible: true,
    average_rating: 4.7,
    reviews_count: 45
  },
  {
    id: 'room-s-201',
    number: '201',
    building: sampleBuildings[1],
    building_name: 'Building S',
    floor: 2,
    room_type: 'classroom',
    room_type_display: 'Classroom',
    capacity: 50,
    description: 'Spacious classroom for lectures and seminars',
    equipment: ['Projector', 'Screen', 'Whiteboard', 'Desks', 'Air Conditioning'],
    is_accessible: true,
    average_rating: 4.1,
    reviews_count: 28
  },
  {
    id: 'room-s-301',
    number: '301',
    building: sampleBuildings[1],
    building_name: 'Building S',
    floor: 3,
    room_type: 'conference',
    room_type_display: 'Conference Room',
    capacity: 40,
    description: 'Room for conferences and business meetings',
    equipment: ['Round table', 'Projector', 'Screen', 'Microphones', 'Video conferencing'],
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
    comment: 'Excellent classroom! Modern equipment, good acoustics. Comfortable seating.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-2',
    author: sampleReviewAuthors[1],
    rating: 4,
    category: 'equipment',
    comment: 'Good technical equipment, but sometimes issues with the projector.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-3',
    author: sampleReviewAuthors[2],
    rating: 4,
    category: 'comfort',
    comment: 'Comfortable classroom for lectures. Good ventilation.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-4',
    author: sampleReviewAuthors[3],
    rating: 5,
    category: 'general',
    comment: 'Excellent classroom! Everything works perfectly, very convenient for conducting classes.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-5',
    author: sampleReviewAuthors[0],
    rating: 3,
    category: 'comfort',
    comment: 'The classroom is decent, but chairs are not very comfortable for long sessions.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'review-6',
    author: sampleReviewAuthors[1],
    rating: 5,
    category: 'equipment',
    comment: 'Excellent equipment! Computers are fast, all software is installed.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];
