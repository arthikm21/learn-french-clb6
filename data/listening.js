// Listening exercises — TTS reads, user types. CLB-aligned.
window.LISTENING = {
  numbers: {
    title: 'Numbers Dictation',
    level: 'CLB 3-4',
    items: [
      { audio: 'sept', accept: ['sept', '7'] },
      { audio: 'quinze', accept: ['quinze', '15'] },
      { audio: 'dix-neuf', accept: ['dix-neuf', '19', 'dix neuf'] },
      { audio: 'douze', accept: ['douze', '12'] },
      { audio: 'vingt', accept: ['vingt', '20'] },
    ],
  },
  cafe: {
    title: 'Au café',
    level: 'CLB 5',
    items: [
      { audio: "Bonjour, je voudrais un café s'il vous plaît.", accept: ["bonjour, je voudrais un café s'il vous plaît.", "bonjour je voudrais un cafe s'il vous plait", "bonjour je voudrais un café s'il vous plaît"] },
      { audio: 'Combien ça coûte ?', accept: ['combien ça coûte', 'combien ca coute', 'combien ça coûte ?'] },
      { audio: "Je n'aime pas le sucre.", accept: ["je n'aime pas le sucre", 'je naime pas le sucre'] },
      { audio: "L'addition, s'il vous plaît.", accept: ["l'addition, s'il vous plaît", "laddition sil vous plait"] },
    ],
  },
  mock: {
    title: 'CLB 6 Mock Listening',
    level: 'CLB 6',
    items: [
      { audio: 'Demain, je vais aller au marché pour acheter des légumes.', accept: ['demain je vais aller au marché pour acheter des légumes', "demain je vais aller au marche pour acheter des legumes"] },
      { audio: "Quand j'étais petite, ma grand-mère me racontait des histoires.", accept: ["quand j'étais petite ma grand-mère me racontait des histoires", "quand jetais petite ma grand mere me racontait des histoires"] },
      { audio: 'Si vous avez des questions, vous pouvez nous appeler entre neuf heures et dix-sept heures.', accept: ['si vous avez des questions vous pouvez nous appeler entre neuf heures et dix-sept heures', "si vous avez des questions, vous pouvez nous appeler entre neuf heures et dix-sept heures."] },
      { audio: "Le train pour Québec part à dix-huit heures trente du quai numéro cinq.", accept: ['le train pour québec part à dix-huit heures trente du quai numéro cinq', 'le train pour quebec part a dix-huit heures trente du quai numero cinq'] },
    ],
  },
};
