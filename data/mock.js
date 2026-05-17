// CLB 6 Mock Test — orchestrates listening, reading, writing, speaking in one session.
// Time-boxed, simulates TEF Canada exam structure.
window.MOCK_TEST = {
  title: 'CLB 6 Mock Test',
  subtitle: 'Approx. 90 minutes · 4 skills · CLB band estimate at the end',
  sections: [
    {
      id: 'listen',
      title: 'Listening',
      icon: '🎧',
      duration: 1500, // 25 min
      desc: 'You will hear 3 dialogues. Answer 5 questions about each. You may play each dialogue at most twice.',
      dialogueIds: ['d2', 'd4', 'd8'],
      replayLimit: 2,
    },
    {
      id: 'read',
      title: 'Reading',
      icon: '📖',
      duration: 1500, // 25 min
      desc: 'You will read 3 texts and answer comprehension questions.',
      textIds: ['r2', 'r11', 'r12'],
    },
    {
      id: 'write',
      title: 'Writing',
      icon: '✍️',
      duration: 1500, // 25 min
      desc: 'Write a formal email to a school asking about French courses. 80-120 words. Include greeting, reason, 2 specific questions, polite closing.',
      promptId: 'w8',
    },
    {
      id: 'speak',
      title: 'Speaking',
      icon: '🎙️',
      duration: 900, // 15 min
      desc: 'You will do 2 speaking tasks: describe a scene + a role-play.',
      taskIds: ['picture2', 'role2'],
    },
  ],
};
