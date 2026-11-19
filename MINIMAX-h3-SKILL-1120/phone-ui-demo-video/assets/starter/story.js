// Fictional demonstration. Replace facts, copy, scenes and timings for each project.
window.STORY = {
  title: '轻学 · 让问题成为进步', width: 1920, height: 1080, fps: 30,
  brand: '轻学', tagline: '让每次提问，都有收获。',
  shots: [
    {duration: 6, title: '一个问题，开启学习', scene: 'lock', color: '#6578ef', left: ['好问题', '值得被看见'], right: ['从一条通知', '开始新的理解'], effect: 'rise'},
    {duration: 6, title: '打开你的学习空间', scene: 'app', color: '#27bbb4', left: ['轻轻一点', '进入学习空间'], right: ['把复杂', '变得有条理'], effect: 'wave'},
    {duration: 6, title: '追问，比答案更进一步', scene: 'chat', color: '#8b78de', left: ['不止是答案', '更是理解'], right: ['一步步追问', '让思路清晰'], effect: 'flip'},
    {duration: 6, title: '看见每一步成长', scene: 'data', color: '#36a5d5', left: ['知识有联系', '进步有迹可循'], right: ['回顾每一步', '找到下一步'], effect: 'zoom'},
    {duration: 6, title: '让每次提问，都有收获', scene: 'close', color: '#6578ef', left: ['带着好奇', '继续向前'], right: ['今天的提问', '明天的底气'], effect: 'glow'}
  ]
};
let cursor = 0;
window.STORY.shots.forEach(s => {s.start = cursor; cursor += s.duration;});
window.PHONE_FILM = {
  ...window.STORY, duration: cursor,
  audioEvents: window.STORY.shots.flatMap((s, i) => [
    {time: s.start + .2*s.duration, type: i === 0 ? 'ding' : 'pop', gain: .22},
    {time: s.start + .5*s.duration, type: i === 2 ? 'type' : 'whoosh', gain: .14},
    {time: s.start + .68*s.duration, type: 'ding', gain: .16}
  ])
};
