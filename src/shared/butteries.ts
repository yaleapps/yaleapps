import { QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const butteryIds = [
  'Benjamin Franklin',
  'Berkeley',
  'Branford',
  'Davenport',
  'Ezra Stiles',
  'Grace Hopper',
  'Jonathan Edwards',
  'Morse',
  'Pauli Murray',
  'Pierson',
  'Saybrook',
  'Silliman',
  'Timothy Dwight',
  'Trumbull',
  'The Acorn',
  'The Beanjamin',
] as const;

const butteryNicknames = [
  "Ben's Butt",
  "Marvin's",
  'The Nuttery',
  'The Dive',
  'Moose Butt',
  'The Trolley Stop',
  'JE Buttery',
  'The Morsel',
  'MY Butt',
  'Pierson Knight Club',
  'The Squiche',
  'Sillicafe',
  'TD Butt',
  'The TrumButt',
  'The Acorn',
  'The Beanjamin',
] as const;

export const defaultButteries: Buttery[] = [
  {
    id: 'Benjamin Franklin',
    calendarID: 'c_qh7c9stu3qr3hh7nj68gvc12nc@group.calendar.google.com',
    nickname: "Ben's Butt",
    recommend: 'Vegan Quesadilla, Fries',
    textTime: '10 PM - 1 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Benjamin Franklin.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=876931505',
  },
  {
    id: 'Berkeley',
    calendarID: 'c_18ghppn0o4coealtrqf4m876jo@group.calendar.google.com',
    nickname: "Marvin's",
    recommend: 'BK Special, Pancakes, Nutellawich',
    textTime: '10 PM - 1 AM | Sun-Fri',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Berkeley.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1122135459',
  },
  {
    id: 'Branford',
    calendarID: 'c_0vl82r4qhr2sshm97s843g9ju8@group.calendar.google.com',
    nickname: 'The Nuttery',
    recommend: 'The Chin, Circle of Life, Mario Melt',
    textTime: '10:30 PM - 12:45 AM | Sun-Fri',
    startTime: '22:30:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Branford.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1283902203',
  },
  {
    id: 'Davenport',
    calendarID: 'c_ljjasqrqmi61clcb7q8grhmh5o@group.calendar.google.com',
    nickname: 'The Dive',
    recommend: 'RJR, BBQQ, Goldilocks Waffles',
    textTime: '10 PM - 12:30 AM | Daily',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Davenport.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=562972820',
  },
  {
    id: 'Ezra Stiles',
    calendarID: 'c_2sd6ipbve5qecpbvjk6n4krm88@group.calendar.google.com',
    nickname: 'Moose Butt',
    recommend: 'The Ezra, Jambler, Monkey Madness',
    textTime: '10 PM - 12:50 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Ezra Stiles.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1488674607',
  },
  {
    id: 'Grace Hopper',
    calendarID: 'c_jpohh0fj3bjf9oa50uqhdsn210@group.calendar.google.com',
    nickname: 'The Trolley Stop',
    recommend: "Flying Pig, Buff Chik Ques, Cup O' Crack",
    textTime: '10 PM - 1 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Grace Hopper.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1236110977',
  },
  {
    id: 'Jonathan Edwards',
    calendarID: 'c_vidd8mkjnfknj5gf2qvsdo35o0@group.calendar.google.com',
    nickname: 'JE Buttery',
    recommend: "Allie's Cookies & Cream, The Fernandilla, Chicken Tenders",
    textTime: '9:30 PM - 12:30 AM | Sun-Th',
    startTime: '21:30:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Jonathan Edwards.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=965474435',
  },
  {
    id: 'Morse',
    calendarID: 'c_t94grhoctefff88he108qrfrks@group.calendar.google.com',
    nickname: 'The Morsel',
    recommend: 'Jim Stanley, The Thing Joe Gets, Bagels, The Austin',
    textTime: '10 PM - 12 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Morse.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=813755270',
  },
  {
    id: 'Pauli Murray',
    calendarID: 'c_v7d6qo6iu5s3dnq2hj852ccvkc@group.calendar.google.com',
    nickname: 'MY Butt',
    recommend: 'Fried Rice w/ Kimchi, Boba, French Toast',
    textTime: '10 PM - 1 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Pauli Murray.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1973151484',
  },
  {
    id: 'Pierson',
    calendarID: 'c_be16luiqg08s5fjbtl48klg0qg@group.calendar.google.com',
    nickname: 'Pierson Knight Club',
    recommend: 'the PCK Ques, CJ Wrap, Mango Smoothie',
    textTime: '10:30 PM - 12:30 AM | Sun-Th',
    startTime: '22:30:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Pierson.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1680147828',
  },
  {
    id: 'Saybrook',
    calendarID: 'c_h4k4tdrsial6if89k2qmuq0sic@group.calendar.google.com',
    nickname: 'The Squiche',
    recommend: 'Manliestwich, Mozzliestwich, Crepe w/ Ice Cream',
    textTime: '10 PM - 12:45 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Saybrook.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=2005943370',
  },
  {
    id: 'Silliman',
    calendarID: 'c_g2hs55m8rdnjo7ulvdm97k6jpk@group.calendar.google.com',
    nickname: 'Sillicafe',
    recommend: 'Curly Fries, Hot Chocolate, Apple Cider',
    textTime: '10 PM - 1 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Silliman.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=795554107',
  },
  {
    id: 'Timothy Dwight',
    calendarID: 'c_5se1ib9s1al5e2vmtn7sgjrfmk@group.calendar.google.com',
    nickname: 'TD Butt',
    recommend:
      'Grilled Cheese w/ Popcorn Chicken, Tortizza, Anything fried (they have a fryer!)',
    textTime: '10 PM - 1 AM | Sun-Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Timothy Dwight.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=299574957',
  },
  {
    id: 'Trumbull',
    calendarID: 'c_fqjk0og8tsg22m9c5hpjochn9k@group.calendar.google.com',
    nickname: 'The TrumButt',
    recommend: 'Dino Grilled Cheese, Cookies, Ice Cream Sandwich',
    textTime: '10 PM - 11:30 PM | Sun, M, W; 10 PM - 1 AM | T, Th',
    startTime: '22:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/Trumbull.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1747027399',
  },
  {
    id: 'The Acorn',
    calendarID: 'c_v18l89ksargnv5mo088c5urc14@group.calendar.google.com',
    nickname: 'The Acorn',
    recommend: 'Basic #1 Toast, Basic #2 Toast, Espresso',
    textTime: '9 AM - 8 PM | Daily',
    startTime: '9:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/The Acorn.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1106717244',
  },
  {
    id: 'The Beanjamin',
    calendarID: 'c_ksuav38sq7npf9g4f054p7680o@group.calendar.google.com',
    nickname: 'The Beanjamin',
    recommend: 'Matcha Latte, Tea Lemonade, Toasts',
    textTime: '2 PM - 5 PM | Daily',
    startTime: '14:00:00',
    menu_photo_url:
      'https://res.cloudinary.com/djwhupcus/image/upload/q_auto/v1673931545/Yale%20Buttery%20Book/buttery-menu-photos/The Beanjamin.jpg',
    menu_link:
      'https://docs.google.com/spreadsheets/d/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/edit#gid=1476967950',
  },
];

export type Buttery = {
  id: typeof butteryIds[number];
  calendarID: string;
  /*** Unique key that we'll use to identify this buttery */
  nickname: typeof butteryNicknames[number];
  recommend: string;
  textTime: string;
  /*** The daily start time represented in 00:00:00 format. This is used to focus the calendar view on the appropriate time of day without scrolling for each buttery. */
  startTime: string;
  menu_photo_url: string;
  isOpen?: boolean;
  opensIn?: string;
  verified?: 'OPEN' | 'CLOSED' | undefined;
  menu_link: string;
};

const butteries = await queryClient.ensureQueryData({
  queryKey: ['butteries'],
  queryFn: loadButteriesFromSheet,
});

export const butteryDropdownOptions = [
  'Errors or Suggestions',
  ...butteries.map((buttery) => `${buttery.nickname} | ${buttery.id}`),
];

export async function loadButteriesFromSheet() {
  const res = await fetch(
    'https://opensheet.elk.sh/1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU/Calendars'
  );
  const json = (await res.json()) as Buttery[];
  return json;
}
