import { Event, EventOrganizer, EventReview } from '../types/Event';

const sampleOrganizers: EventOrganizer[] = [
  {
    id: 1,
    username: 'rector_office',
    full_name: 'Ректорат АлтГУ',
    avatar_url: 'https://via.placeholder.com/100x100/2E5BBA/FFFFFF?text=Р',
    role: 'admin'
  },
  {
    id: 2,
    username: 'student_union',
    full_name: 'Объединенный совет обучающихся',
    avatar_url: 'https://via.placeholder.com/100x100/28A745/FFFFFF?text=ОСО',
    role: 'student'
  },
  {
    id: 3,
    username: 'science_council',
    full_name: 'Ученый совет АлтГУ',
    avatar_url: 'https://via.placeholder.com/100x100/DC3545/FFFFFF?text=УС',
    role: 'teacher'
  },
  {
    id: 4,
    username: 'sports_center',
    full_name: 'Центр физической культуры и спорта',
    avatar_url: 'https://via.placeholder.com/100x100/FD7E14/FFFFFF?text=ЦФК',
    role: 'admin'
  },
  {
    id: 5,
    username: 'career_center',
    full_name: 'Центр карьеры АлтГУ',
    avatar_url: 'https://via.placeholder.com/100x100/6F42C1/FFFFFF?text=ЦК',
    role: 'admin'
  },
  {
    id: 6,
    username: 'cultural_center',
    full_name: 'Центр культуры и досуга',
    avatar_url: 'https://via.placeholder.com/100x100/E83E8C/FFFFFF?text=ЦКД',
    role: 'admin'
  }
];

export const sampleEventsData: Event[] = [
  {
    id: 'event-1',
    title: 'День открытых дверей АлтГУ 2025',
    description: 'Приглашаем абитуриентов и их родителей познакомиться с Алтайским государственным университетом. В программе: презентации всех институтов и факультетов, экскурсии по учебным корпусам и лабораториям, встречи с деканами и преподавателями, консультации по поступлению.',
    category: 'university',
    start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // через неделю
    end_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // +6 часов
    location: 'Главный корпус АлтГУ, пр. Ленина, 61',
    organizer: sampleOrganizers[0],
    participants_count: 287,
    average_rating: 4.8,
    is_public: true,
    requires_registration: true,
    max_participants: 500,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-2',
    title: 'XXVI Международная конференция "Молодая наука Алтая"',
    description: 'Ежегодная научная конференция студентов, аспирантов и молодых ученых. Секции: математика и информатика, физика и техника, химия и биология, гуманитарные науки, экономика и управление. Лучшие работы будут рекомендованы к публикации в научных журналах.',
    category: 'conference',
    start_datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // через 2 недели
    end_datetime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // +2 дня
    location: 'Корпус "Л", ул. Димитрова, 66',
    organizer: sampleOrganizers[2],
    participants_count: 156,
    average_rating: 4.6,
    is_public: true,
    requires_registration: true,
    max_participants: 300,
    is_past: false,
    is_today: false,
    user_is_participant: true,
    user_participation_status: 'confirmed',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-3',
    title: 'Спартакиада АлтГУ среди первокурсников',
    description: 'Традиционные спортивные соревнования для студентов первого курса всех институтов и факультетов. Виды спорта: волейбол, баскетбол, мини-футбол, настольный теннис, легкая атлетика, плавание. Команды-победители получат кубки и дипломы.',
    category: 'sports',
    start_datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // через 3 недели
    end_datetime: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // +2 дня
    location: 'Спортивный комплекс АлтГУ, ул. Красноармейский пр., 90',
    organizer: sampleOrganizers[3],
    participants_count: 342,
    average_rating: 4.9,
    is_public: true,
    requires_registration: true,
    max_participants: 500,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-4',
    title: 'Мастер-класс "Основы веб-разработки"',
    description: 'Практический мастер-класс от IT-компании "Сибирикс" для студентов технических специальностей. Изучаем HTML, CSS, JavaScript и создаем первый сайт. Участникам предоставляются ноутбуки. По итогам - сертификаты и возможность стажировки.',
    category: 'workshop',
    start_datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // через 3 дня
    end_datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // +4 часа
    location: 'Корпус "Л", компьютерный класс 105',
    organizer: sampleOrganizers[4],
    participants_count: 28,
    average_rating: 4.7,
    is_public: true,
    requires_registration: true,
    max_participants: 30,
    is_past: false,
    is_today: false,
    user_is_participant: true,
    user_participation_status: 'confirmed',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-5',
    title: 'Фестиваль "Студенческая весна АлтГУ"',
    description: 'Ежегодный фестиваль творчества студентов АлтГУ. Конкурсы: вокал, хореография, театральное искусство, КВН, литературное творчество. Гала-концерт с участием лучших номеров. Призы и дипломы победителям.',
    category: 'cultural',
    start_datetime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // через 4 недели
    end_datetime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // +3 часа
    location: 'Актовый зал главного корпуса, пр. Ленина, 61',
    organizer: sampleOrganizers[5],
    participants_count: 245,
    average_rating: 4.9,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-6',
    title: 'Защита выпускных квалификационных работ - ИМИТ',
    description: 'Государственная итоговая аттестация выпускников Института математики и информационных технологий. Защита бакалаврских и магистерских диссертаций по направлениям: прикладная математика, информатика, программная инженерия.',
    category: 'exam',
    start_datetime: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // через 5 недель
    end_datetime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // +10 дней
    location: 'Корпус "Л", аудитории 301-305, 401-405',
    organizer: sampleOrganizers[0],
    participants_count: 89,
    average_rating: 0,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-7',
    title: 'IT-хакатон "Цифровые решения для Алтайского края"',
    description: 'Региональный хакатон для студентов и молодых IT-специалистов. Задача: создать цифровые решения для развития туризма, сельского хозяйства и экологии региона. Партнеры: Правительство Алтайского края, IT-компании. Призовой фонд: 1 млн рублей.',
    category: 'workshop',
    start_datetime: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(), // через 6 недель
    end_datetime: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000).toISOString(), // +2 дня
    location: 'Корпус "Л", компьютерные классы 101-110',
    organizer: sampleOrganizers[4],
    participants_count: 124,
    average_rating: 4.8,
    is_public: true,
    requires_registration: true,
    max_participants: 150,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-8',
    title: 'Лекция "Квантовые технологии: настоящее и будущее"',
    description: 'Открытая лекция доктора физико-математических наук, профессора МГУ о современном состоянии квантовых технологий, квантовых компьютерах и их применении. Лекция будет интересна студентам физико-технических специальностей.',
    category: 'academic',
    start_datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // через 5 дней
    end_datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // +2 часа
    location: 'Корпус "Д", большая физическая аудитория 201',
    organizer: sampleOrganizers[2],
    participants_count: 156,
    average_rating: 4.6,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: true,
    user_participation_status: 'confirmed',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-9',
    title: 'Посвящение в студенты АлтГУ',
    description: 'Торжественная церемония посвящения первокурсников в студенты Алтайского государственного университета. В программе: торжественная часть с участием ректора, концертная программа, вручение студенческих билетов, фотосессия.',
    category: 'university',
    start_datetime: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString(), // через 7 недель
    end_datetime: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // +3 часа
    location: 'Актовый зал главного корпуса, пр. Ленина, 61',
    organizer: sampleOrganizers[0],
    participants_count: 1250,
    average_rating: 4.9,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-10',
    title: 'Ярмарка вакансий "Карьера в АлтГУ"',
    description: 'Встреча студентов и выпускников с работодателями Алтайского края и других регионов. Участвуют более 50 компаний различных сфер деятельности. Презентации компаний, собеседования, мастер-классы по составлению резюме.',
    category: 'university',
    start_datetime: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString(), // через 8 недель
    end_datetime: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // +6 часов
    location: 'Спортивный комплекс АлтГУ, ул. Красноармейский пр., 90',
    organizer: sampleOrganizers[4],
    participants_count: 456,
    average_rating: 4.5,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-11',
    title: 'Турнир по киберспорту АлтГУ',
    description: 'Университетский турнир по киберспорту среди студентов. Дисциплины: CS:GO, Dota 2, League of Legends. Командные и индивидуальные соревнования. Призовой фонд, дипломы победителям, трансляция финалов.',
    category: 'sports',
    start_datetime: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString(), // через 9 недель
    end_datetime: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString(), // +2 дня
    location: 'Корпус "Л", компьютерные классы 201-205',
    organizer: sampleOrganizers[1],
    participants_count: 89,
    average_rating: 4.7,
    is_public: true,
    requires_registration: true,
    max_participants: 120,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-12',
    title: 'Выставка "Научные достижения АлтГУ"',
    description: 'Выставка научных разработок и инновационных проектов преподавателей и студентов университета. Представлены работы по биотехнологиям, информационным технологиям, материаловедению, экологии. Демонстрация действующих прототипов.',
    category: 'academic',
    start_datetime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // через 10 дней
    end_datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // +4 дня
    location: 'Музей АлтГУ, главный корпус, 1 этаж',
    organizer: sampleOrganizers[2],
    participants_count: 234,
    average_rating: 4.4,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-13',
    title: 'Встреча студенческого актива',
    description: 'Ежемесячная встреча представителей студенческих организаций для обсуждения текущих вопросов и планирования мероприятий. Обсуждение бюджета, новых инициатив и предложений от студентов.',
    category: 'meeting',
    start_datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // через 2 дня
    end_datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // +2 часа
    location: 'Корпус "Л", аудитория 205',
    organizer: sampleOrganizers[1],
    participants_count: 25,
    average_rating: 4.2,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: true,
    user_participation_status: 'confirmed',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-14',
    title: 'Дедлайн подачи заявок на стипендию',
    description: 'Последний день подачи документов на получение повышенной академической стипендии за достижения в учебной, научной, общественной, культурной и спортивной деятельности.',
    category: 'deadline',
    start_datetime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // через 12 дней
    location: 'Деканаты факультетов',
    organizer: sampleOrganizers[0],
    participants_count: 0,
    average_rating: 0,
    is_public: true,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-15',
    title: 'Личная консультация с куратором',
    description: 'Индивидуальная встреча с куратором группы для обсуждения академических вопросов, планирования учебного процесса и решения личных вопросов, связанных с обучением.',
    category: 'personal',
    start_datetime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // через 4 дня
    end_datetime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(), // +1 час
    location: 'Корпус "Л", кабинет 312',
    organizer: sampleOrganizers[2],
    participants_count: 1,
    average_rating: 0,
    is_public: false,
    requires_registration: true,
    max_participants: 1,
    is_past: false,
    is_today: false,
    user_is_participant: true,
    user_participation_status: 'confirmed',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-16',
    title: 'Дедлайн сдачи курсовых работ',
    description: 'Последний день сдачи курсовых работ по дисциплинам "Базы данных" и "Программная инженерия" для студентов 3 курса ИМИТ. Работы принимаются только в печатном виде с подписью научного руководителя.',
    category: 'deadline',
    start_datetime: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // через 18 дней
    location: 'Корпус "Л", кафедра информационных технологий',
    organizer: sampleOrganizers[2],
    participants_count: 0,
    average_rating: 0,
    is_public: false,
    requires_registration: false,
    is_past: false,
    is_today: false,
    user_is_participant: false,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const sampleEventReviews: EventReview[] = [
  // Примеры отзывов очищены - теперь отзывы будут браться только из API
];
