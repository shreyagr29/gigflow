const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Gig = require('./models/Gig');
const Bid = require('./models/Bid');
const connectDB = require('./config/db');

dotenv.config();

const users = [
  {
    name: 'Alice Client',
    email: 'alice@example.com',
    password: 'password123',
    skills: ['Project Management', 'Product Owner'],
  },
  {
    name: 'Bob Freelancer',
    email: 'bob@example.com',
    password: 'password123',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    name: 'Charlie Designer',
    email: 'charlie@example.com',
    password: 'password123',
    skills: ['UI/UX', 'Figma', 'Adobe XD'],
  },
  {
    name: 'Dave Developer',
    email: 'dave@example.com',
    password: 'password123',
    skills: ['Python', 'Django', 'Data Science'],
  },
  {
    name: 'Eve Expert',
    email: 'eve@example.com',
    password: 'password123',
    skills: ['DevOps', 'AWS', 'Docker'],
  },
];

const gigTitles = [
  'Build a React Dashboard',
  'Fix Node.js API Bugs',
  'Design a Mobile App UI',
  'Python Data Scraping Script',
  'AWS Infrastructure Setup',
  'Full Stack MERN Application',
  'WordPress Theme Customization',
  'SEO Optimization for E-commerce',
  'Flutter Mobile App Development',
  'Go Backend Service',
  'Machine Learning Model Training',
  'Cybersecurity Audit',
  'Blockchain Smart Contract',
  'Unity Game Development',
  'Logo Design for Startup',
  'Video Editing for YouTube Channel',
  'Content Writing for Tech Blog',
  'Virtual Assistant for Data Entry',
  'Translation: English to Spanish',
  'Voice Over for Explainer Video'
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Gig.deleteMany({});
    await Bid.deleteMany({});
    await User.deleteMany({}); 

    console.log('Seeding Users...');
    const createdUsers = [];
    for (const u of users) {
        const user = new User(u);
        const savedUser = await user.save();
        createdUsers.push(savedUser);
    }

    console.log(`Created ${createdUsers.length} users.`);

    const clientUser = createdUsers[0]; 
    const freelancers = createdUsers.slice(1); 

    console.log('Seeding Gigs...');
    const createdGigs = [];
    
    for (let i = 0; i < gigTitles.length; i++) {
        let status = 'open';
        if (i > 15) status = 'completed';
        else if (i > 12) status = 'assigned';

        const owner = i % 2 === 0 ? clientUser : freelancers[3]; 

        const gig = await Gig.create({
            title: gigTitles[i],
            description: `This is a detailed description for the project "${gigTitles[i]}". We need a professional to deliver high-quality work within the deadline.`,
            budget: Math.floor(Math.random() * 5000) + 100,
            ownerId: owner._id,
            status: status,
        });
        createdGigs.push(gig);
    }
    console.log(`Created ${createdGigs.length} gigs.`);

    console.log('Seeding Bids...');
    const openGigs = createdGigs.filter(g => g.status === 'open').slice(0, 3);
    
    for (const gig of openGigs) {
        for (let j = 0; j < 3; j++) {
            const freelancer = freelancers[j % freelancers.length];
            await Bid.create({
                gigId: gig._id,
                freelancerId: freelancer._id,
                message: `I am the best fit for "${gig.title}". I have extensive experience in this field.`,
                amount: gig.budget - (Math.floor(Math.random() * 50) + 10), 
                status: 'pending',
            });
        }
    }
    console.log('Bids seeded successfully.');

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
