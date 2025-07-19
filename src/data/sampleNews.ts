import { Post } from '../types/Post';

const defaultAvatarImage = require('../../assets/Avatar.jpg');

export const sampleNewsData: Post[] = [
  {
    id: 'news-1',
    author: 'ASU Press Service',
    content: 'Altai State University held a solemn graduation ceremony for 2024 graduates. More than 2000 young specialists received higher education diplomas in various fields of study.\n\nCongratulations to our graduates and we wish them success in their professional activities!',
    avatar: defaultAvatarImage,
    image: 'https://rb.asu.ru/public/design/abit25.jpg',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    likes: 156,
    comments: 23,
    views: 1240,
  },
  {
    id: 'news-2',
    author: 'ASU Research Department',
    content: 'ASU scientists received a grant to study the biodiversity of Altai Krai\n\nA team of researchers led by a professor from the botany department received a federal grant of 3.5 million rubles to study rare plant species in the region.\n\nResearch will be conducted over three years in the reserves and national parks of Altai.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/googlescholar1611144.jpg',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    likes: 89,
    comments: 12,
    views: 756,
  },
  {
    id: 'news-3',
    author: 'ASU Student Council',
    content: 'We invite all students to Freshman Day!\n\nDate: September 15\nTime: 2:00 PM\nLocation: Assembly hall of the main building\n\nProgram:\n• Introduction to university traditions\n• Concert program\n• Campus quest\n• Festive reception\n\nFree admission! We are waiting for everyone!',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/s001123551.jpg',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // week ago
    likes: 234,
    comments: 45,
    views: 1890,
  },
  {
    id: 'news-4',
    author: 'ASU International Department',
    content: 'ASU expands international cooperation\n\nA cooperation agreement with the University of Mongolia has been signed. Student and faculty exchanges, joint research projects are planned.\n\nAn academic mobility program for senior students has also been opened.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/tischkinb2.jpg',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    likes: 67,
    comments: 8,
    views: 543,
  },
  {
    id: 'news-5',
    author: 'ASU Sports Club',
    content: 'ASU team took first place in inter-university volleyball competitions!\n\nCongratulations to our national team for a brilliant victory! In the final, the SibGUTI team was defeated with a score of 3:1.\n\nThe next competitions - in basketball, will be held in October.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/kjgvklsdjgopsd.jpg',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    likes: 198,
    comments: 31,
    views: 987,
  },
  {
    id: 'news-6',
    author: 'ASU Library',
    content: 'Scientific library collection update\n\nNew publications in mathematics, physics, chemistry and biology have arrived at the library. More than 500 copies of modern educational and scientific literature have been acquired.\n\nThe electronic database of scientific journals has also been expanded.',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/googlescholar1611144.jpg',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    likes: 45,
    comments: 6,
    views: 321,
  },
  {
    id: 'news-7',
    author: 'ASU Career Center',
    content: 'Job fair at ASU\n\nOctober 25-26, a job fair for students and graduates will be held in the main building.\n\nParticipants:\n• More than 50 regional employers\n• IT companies\n• Banks and financial organizations\n• Manufacturing enterprises\n\nOpportunity to find work and internships!',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/maxresdefault_(1)2.jpg',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    likes: 312,
    comments: 67,
    views: 2156,
  },
  {
    id: 'news-8',
    author: 'ASU Institute of Chemistry',
    content: 'Chemistry Week at ASU\n\nFrom May 13 to 17, the traditional Chemistry Week is held at the Institute of Chemistry and Chemical-Pharmaceutical Technologies.\n\nProgram:\n• Scientific conferences\n• Master classes\n• Laboratory tours\n• Chemistry shows for schoolchildren',
    avatar: defaultAvatarImage,
    image: 'https://journal.asu.ru/public/site/images/ksetishkina_90/scienceindex_logo.jpg',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    likes: 78,
    comments: 14,
    views: 654,
  }
];
