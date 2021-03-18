const contacts = [
  {
    _id: '6043ba3ebcd1859d642fc605',
    category: 'other',
    name: 'contact03',
    email: 'email03@friends.com',
    phone: 123456789,
    owner: '604a7a0b42b389409451038f',
    createdAt: '2021-03-06T17:22:06.315Z',
    updatedAt: '2021-03-06T17:22:06.315Z',
  },
  {
    _id: '6043ba6bed3c94405c05b960',
    category: 'friend',
    name: 'contact04',
    email: 'email04@friends.com',
    phone: 123456789,
    owner: '604a7a0b42b389409451038f',
    createdAt: '2021-03-06T17:22:51.977Z',
    updatedAt: '2021-03-06T17:22:51.977Z',
  },
];

const newContact = {
  name: 'New',
  email: 'newmail@friends.com',
  phone: 123456789,
};

const User = {
  _id: '604a7a0b42b389409451038f',
  subscription: 'free',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGE3YTBiNDJiMzg5NDA5NDUxMDM4ZiIsImlhdCI6MTYxNTQ5MzY3NywiZXhwIjoxNjE1NTAwODc3fQ.wUjDU_6Tdw5PSQJwYO5IDHzcbTL_AiXQwTMI_kx_vDM',
  email: 'user2@friends.com',
  password: '$2a$10$jggyhNaDE5fQp2eK8H5SweM119YYd8Zq8uTL10wmDu3VlYWqBhOX6',
  avatarURL: '604a7a0b42b389409451038f\\1615493706858-avatar.png',
  createdAt: '2021-03-11T20:14:03.746Z',
  updatedAt: '2021-03-11T20:15:07.047Z',
  verificationToken: null,
  verified: true,
};

const users = [];
users[0] = User;

const newUser = {
  email: 'test@test.com',
  password: '123456',
};

module.exports = { contacts, newContact, User, users, newUser };
