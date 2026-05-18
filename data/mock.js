// TCF Canada Mock Test — full exam simulation with single-play listening.
window.MOCK_TEST = {
  title: 'TCF Canada Mock Test',
  subtitle: 'Approx. 2h45 · 4 skills · TCF score (0-699) + CLB band at the end',
  sections: [
    {
      id: 'listen',
      title: 'Compréhension orale (CO)',
      icon: '🎧',
      duration: 2100, // 35 min — matches real TCF CO
      desc: 'You will hear 4 dialogues, each played ONCE. No replay, no transcript. Answer comprehension questions after each. This is real TCF conditions.',
      dialogueIds: ['d1', 'd2', 'd4', 'd8'],
      tcfMode: true,
      replayLimit: 1,
    },
    {
      id: 'read',
      title: 'Compréhension écrite (CE)',
      icon: '📖',
      duration: 3600, // 60 min — matches real TCF CE
      desc: 'You will read 4 texts of varying difficulty and answer comprehension questions. Manage your time — 15 minutes per text on average.',
      textIds: ['r2', 'r3', 'r11', 'r12'],
    },
    {
      id: 'write',
      title: 'Expression écrite (EE) · 3 tasks',
      icon: '✍️',
      duration: 3600, // 60 min — matches real TCF EE
      desc: 'Three writing tasks: (1) short formal email, (2) descriptive letter or article, (3) compare two opinions and give your own view. Manage time carefully across all three.',
      writeTasks: [
        { type: 'standard', promptId: 'w6', label: 'Task 1: Short email asking for info (~80 words)' },
        { type: 'standard', promptId: 'w4', label: 'Task 2: Describe a place (~120 words)' },
        { type: 'task3', promptId: 'wt3_telework', label: 'Task 3: Compare two opinions (~150 words)' },
      ],
    },
    {
      id: 'speak',
      title: 'Expression orale (EO) · 3 tasks',
      icon: '🎙️',
      duration: 1200, // 20 min — matches real TCF EO
      desc: 'Three speaking tasks: (1) self-intro + describe a routine, (2) ask the examiner questions about a scenario, (3) argue your opinion on a topic.',
      speakTasks: [
        { type: 'qa', taskId: 'qa1', label: 'Task 1: Self-intro + daily routine' },
        { type: 'task2', taskId: 'st2_french_class', label: 'Task 2: Ask questions to gather info' },
        { type: 'task3', taskId: 'st3_mock_clb6', label: 'Task 3: Argue your opinion' },
      ],
    },
  ],
};
