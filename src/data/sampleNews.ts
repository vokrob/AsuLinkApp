import { Post } from '../types/Post';

const defaultAvatarImage = require('../../assets/Avatar.jpg');

export const sampleNewsData: Post[] = [
  {
    id: 'news-1',
    author: 'Пресс-служба АлтГУ',
    content: '🎓 В АлтГУ состоялась торжественная церемония вручения дипломов выпускникам 2024 года. Более 2000 молодых специалистов получили дипломы о высшем образовании по различным направлениям подготовки.\n\nПоздравляем наших выпускников и желаем успехов в профессиональной деятельности!',
    avatar: defaultAvatarImage,
    image: 'https://rb.asu.ru/public/design/abit25.jpg',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
    likes: 156,
    comments: 23,
    views: 1240,
  },
  {
    id: 'news-2',
    author: 'Научное управление АлтГУ',
    content: '🔬 Ученые АлтГУ получили грант на исследование биоразнообразия Алтайского края\n\nКоманда исследователей под руководством профессора кафедры ботаники получила федеральный грант в размере 3,5 млн рублей на изучение редких видов растений региона.\n\nИсследования будут проводиться в течение трех лет на территории заповедников и национальных парков Алтая.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/googlescholar1611144.jpg',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
    likes: 89,
    comments: 12,
    views: 756,
  },
  {
    id: 'news-3',
    author: 'Студенческий совет АлтГУ',
    content: '🎉 Приглашаем всех студентов на День первокурсника!\n\n📅 Дата: 15 сентября\n🕐 Время: 14:00\n📍 Место: Актовый зал главного корпуса\n\nВ программе:\n• Знакомство с традициями университета\n• Концертная программа\n• Квест по кампусу\n• Праздничный фуршет\n\nВход свободный! Ждем всех желающих!',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/s001123551.jpg',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделя назад
    likes: 234,
    comments: 45,
    views: 1890,
  },
  {
    id: 'news-4',
    author: 'Международный отдел АлтГУ',
    content: '🌍 АлтГУ расширяет международное сотрудничество\n\nПодписано соглашение о сотрудничестве с Университетом Монголии. Планируется обмен студентами и преподавателями, совместные исследовательские проекты.\n\nТакже открыта программа академической мобильности для студентов старших курсов.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/tischkinb2.jpg',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 дней назад
    likes: 67,
    comments: 8,
    views: 543,
  },
  {
    id: 'news-5',
    author: 'Спортивный клуб АлтГУ',
    content: '🏆 Команда АлтГУ заняла первое место в межвузовских соревнованиях по волейболу!\n\nПоздравляем нашу сборную команду с блестящей победой! В финале была обыграна команда СибГУТИ со счетом 3:1.\n\nСледующие соревнования - по баскетболу, пройдут в октябре.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/kjgvklsdjgopsd.jpg',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 дней назад
    likes: 198,
    comments: 31,
    views: 987,
  },
  {
    id: 'news-6',
    author: 'Библиотека АлтГУ',
    content: '📚 Обновление фонда научной библиотеки\n\nВ библиотеку поступили новые издания по математике, физике, химии и биологии. Всего приобретено более 500 экземпляров современной учебной и научной литературы.\n\nТакже расширена электронная база данных научных журналов.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/googlescholar1611144.jpg',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 дней назад
    likes: 45,
    comments: 6,
    views: 321,
  },
  {
    id: 'news-7',
    author: 'Центр карьеры АлтГУ',
    content: '💼 Ярмарка вакансий в АлтГУ\n\n📅 25-26 октября в главном корпусе пройдет ярмарка вакансий для студентов и выпускников.\n\nУчастники:\n• Более 50 работодателей региона\n• IT-компании\n• Банки и финансовые организации\n• Производственные предприятия\n\nВозможность найти работу и стажировку!',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/maxresdefault_(1)2.jpg',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 дней назад
    likes: 312,
    comments: 67,
    views: 2156,
  },
  {
    id: 'news-8',
    author: 'Институт химии АлтГУ',
    content: '🧪 Неделя химии в АлтГУ\n\nС 13 по 17 мая в институте химии и химико-фармацевтических технологий проходит традиционная Неделя химии.\n\nВ программе:\n• Научные конференции\n• Мастер-классы\n• Экскурсии в лаборатории\n• Химические шоу для школьников',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/scienceindex_logo.jpg',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 дней назад
    likes: 78,
    comments: 14,
    views: 654,
  }
];
