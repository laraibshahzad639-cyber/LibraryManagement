import { db } from '../prisma/db.ts';

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. SEED 10 CATEGORIES (Reuse existing ones if already created)
  const categoryData = [
    {
      name: 'Fiction',
      description: 'Novels, short stories, and literary fiction',
    },
    {
      name: 'Science Fiction',
      description: 'Futuristic, space, and speculative fiction',
    },
    {
      name: 'Computer Science',
      description: 'Programming, algorithms, and software engineering',
    },
    {
      name: 'History',
      description: 'World history, biographies, and historical events',
    },
    {
      name: 'Self-Help',
      description: 'Personal development, habits, and productivity',
    },
    {
      name: 'Mystery & Thriller',
      description: 'Crime, detective, and suspense novels',
    },
    {
      name: 'Business & Finance',
      description: 'Economics, startups, and investing',
    },
    {
      name: 'Philosophy',
      description: 'Classical and modern philosophical works',
    },
    {
      name: 'Psychology',
      description: 'Human behavior, cognition, and mental health',
    },
    {
      name: 'Fantasy',
      description: 'Mythology, magic, and epic world-building',
    },
  ];

  let categories = await db.orm.public.Category.all();
  if (categories.length === 0) {
    for (const cat of categoryData) {
      const created = await db.orm.public.Category.create(cat);
      categories.push(created);
    }
  }
  console.log(`✅ Ready with ${categories.length} categories`);

  // 2. SEED 20 USERS (Reuse existing ones if already created)
  const defaultPasswordHash =
    '$2b$10$abcdefghijklmnopqrstuv1234567890hashedpassword';

  const userNames = [
    'Ali Raza',
    'Sara Khan',
    'Usman Tariq',
    'Ayesha Malik',
    'Bilal Ahmed',
    'Zainab Noor',
    'Hamza Sheikh',
    'Fatima Zahra',
    'Omar Farooq',
    'Hira Yousaf',
    'Kamran Akmal',
    'Sana Javed',
    'Tariq Mahmood',
    'Nadia Hussain',
    'Faisal Qureshi',
    'Mahnoor Baloch',
    'Asad Ullah',
    'Kiran Shah',
    'Zeeshan Haider',
    'Amna Ilyas',
  ];

  let users = await db.orm.public.User.all();
  if (users.length === 0) {
    for (let i = 0; i < userNames.length; i++) {
      const name = userNames[i];
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}${i + 1}@example.com`;
      const created = await db.orm.public.User.create({
        name,
        email,
        password: defaultPasswordHash,
        role: i < 2 ? 'ADMIN' : 'USER',
        isActive: i !== 19,
      });
      users.push(created);
    }
  }
  console.log(`✅ Ready with ${users.length} users`);

  // 3. SEED 50 BOOKS (Reuse existing ones if already created)
  const sampleTitles = [
    'Clean Code',
    'The Pragmatic Programmer',
    'Dune',
    '1984',
    'Atomic Habits',
    'Sapiens',
    'The Hobbit',
    'Deep Work',
    'Thinking, Fast and Slow',
    'The Alchemist',
    'Designing Data-Intensive Applications',
    'Neuromancer',
    'The Silent Patient',
    'Zero to One',
    'Meditations',
    'Introduction to Algorithms',
    'Foundation',
    'Gone Girl',
    'Rich Dad Poor Dad',
    "Man's Search for Meaning",
    "You Don't Know JS",
    'Snow Crash',
    'The Da Vinci Code',
    'The Psychology of Money',
    'Beyond Good and Evil',
    'Refactoring',
    'Hyperion',
    'Sherlock Holmes',
    'The Lean Startup',
    'Influence',
    'Structure and Interpretation of Computer Programs',
    "Ender's Game",
    'The Girl with the Dragon Tattoo',
    'Good to Great',
    'The Republic',
    'System Design Interview',
    'The Left Hand of Darkness',
    'And Then There Were None',
    'Shoe Dog',
    'Quiet',
    'Eloquent JavaScript',
    'Project Hail Mary',
    'The Name of the Wind',
    'Principles',
    'The Power of Habit',
    'Cracking the Coding Interview',
    'Brave New World',
    'Mistborn',
    'Start With Why',
    'Grit',
  ];

  const sampleAuthors = [
    'Robert C. Martin',
    'Andrew Hunt',
    'Frank Herbert',
    'George Orwell',
    'James Clear',
    'Yuval Noah Harari',
    'J.R.R. Tolkien',
    'Cal Newport',
    'Daniel Kahneman',
    'Paulo Coelho',
    'Martin Kleppmann',
    'William Gibson',
    'Alex Michaelides',
    'Peter Thiel',
    'Marcus Aurelius',
    'Thomas H. Cormen',
    'Isaac Asimov',
    'Gillian Flynn',
    'Robert Kiyosaki',
    'Viktor E. Frankl',
  ];

  let books = await db.orm.public.Book.all();
  if (books.length === 0) {
    for (let i = 0; i < 50; i++) {
      const totalCopies = (i % 5) + 3;
      const category = categories[i % categories.length];
      const author = sampleAuthors[i % sampleAuthors.length];
      const isbn = `978-0-${String(100000 + i).slice(0, 5)}-${String(100 + i).slice(0, 2)}-${i % 10}`;

      const created = await db.orm.public.Book.create({
        title: sampleTitles[i],
        author,
        isbn,
        description: `A comprehensive edition of ${sampleTitles[i]} written by ${author}.`,
        totalCopies,
        availableCopies: totalCopies,
        categoryId: category.id,
      });
      books.push(created);
    }
  }
  console.log(`✅ Ready with ${books.length} books`);

  // 4. SEED 80 BORROW RECORDS (45 Returned, 35 Currently Borrowed)
  const borrowRecords = [];
  const now = new Date();
  const regularUsers = users.length > 2 ? users.slice(2) : users;

  for (let i = 0; i < 80; i++) {
    const user = regularUsers[i % regularUsers.length];
    const book = books[i % books.length];

    const borrowedAt = new Date(
      now.getTime() - (60 - (i % 55)) * 24 * 60 * 60 * 1000
    );
    const dueDate = new Date(borrowedAt.getTime() + 14 * 24 * 60 * 60 * 1000);

    const isReturned = i < 45;
    const returnedAt = isReturned
      ? new Date(borrowedAt.getTime() + ((i % 12) + 1) * 24 * 60 * 60 * 1000)
      : null;

    if (!isReturned && book.availableCopies <= 0) {
      continue;
    }

    const record = await db.orm.public.BorrowRecord.create({
      userId: user.id,
      bookId: book.id,
      borrowedAt,
      dueDate,
      returnedAt,
      status: isReturned ? 'RETURNED' : 'BORROWED',
    });

    borrowRecords.push(record);

    if (!isReturned) {
      book.availableCopies -= 1;
      await db.orm.public.Book.where((b) => b.id.eq(book.id)).update({
        availableCopies: book.availableCopies,
      });
    }
  }

  console.log(`✅ Created ${borrowRecords.length} borrow records`);
  console.log(
    `🎉 Total records in DB: ${categories.length + users.length + books.length + borrowRecords.length}`
  );
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
