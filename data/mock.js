// Full-duration TCF Canada practice simulation with official section counts and
// timings. Content and raw results remain practice, not an official score proxy.
window.MOCK_TEST = {
  title: 'Full-Duration TCF Canada Practice Simulation',
  subtitle: 'Approx. 2h47 · 4 skills · 39 listening + 39 reading questions',
  sections: [
    {
      id: 'listen',
      title: 'Compréhension orale (CO)',
      icon: '🎧',
      duration: 2100, // 35 min — official TCF Canada listening duration
      desc: '39 progressive listening questions: every recording plays once, with no transcript or replay.',
      // 5 dialogue questions + 8×4 full segment questions + 2 from the final
      // segment = 39 total.
      dialogueIds: ['d1'],
      tcfSegmentIds: ['ltcf_03', 'ltcf_06', 'ltcf_09', 'ltcf_12', 'ltcf_15', 'ltcf_18', 'ltcf_21', 'ltcf_25', 'ltcf_29'],
      questionLimitById: { ltcf_29: 2 },
      tcfMode: true,
      replayLimit: 1,
    },
    {
      id: 'read',
      title: 'Compréhension écrite (CE)',
      icon: '📖',
      duration: 3600, // 60 min — official TCF Canada reading duration
      desc: '39 progressive reading questions across ten texts with four-option answers.',
      // 9×4 full text questions + 3 from the final text = 39 total.
      textIds: ['rtcf_02', 'rtcf_05', 'rtcf_08', 'rtcf_11', 'rtcf_14', 'rtcf_17', 'rtcf_20', 'rtcf_23', 'rtcf_26', 'rtcf_29'],
      questionLimitById: { rtcf_29: 3 },
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
      duration: 720, // 12 min — official TCF Canada speaking-section duration
      desc: 'Three speaking tasks: (1) self-intro + describe a routine, (2) ask the examiner questions about a scenario, (3) argue your opinion on a topic.',
      speakTasks: [
        { type: 'qa', taskId: 'qa1', label: 'Task 1: Self-intro + daily routine' },
        { type: 'task2', taskId: 'st2_french_class', label: 'Task 2: Ask questions to gather info' },
        { type: 'task3', taskId: 'st3_mock_clb6', label: 'Task 3: Argue your opinion' },
      ],
    },
  ],
};
