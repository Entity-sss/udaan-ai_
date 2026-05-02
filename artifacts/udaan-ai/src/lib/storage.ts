export const Storage = {
  saveRoadmap: (data: any) => {
    localStorage.setItem('udaan_roadmap',
      JSON.stringify(data))
  },
  getRoadmap: () => {
    const d = localStorage.getItem('udaan_roadmap')
    return d ? JSON.parse(d) : null
  },
  savePhaseComplete: (skillId: string,
    level: string, phase: number,
    score: number = 100) => {
    const key = `udaan_progress_${skillId}_${level}`
    const existing = JSON.parse(
      localStorage.getItem(key) || '{}')
    existing[phase] = {
      completed: true,
      score,
      completedAt: Date.now()
    }
    existing[phase + 1] = { unlocked: true }
    localStorage.setItem(key, JSON.stringify(existing))
  },
  getPhaseStatus: (skillId: string,
    level: string, phase: number) => {
    const key = `udaan_progress_${skillId}_${level}`
    const data = JSON.parse(
      localStorage.getItem(key) || '{}')
    if (phase === 1) return 'unlocked'
    if (data[phase]?.completed) return 'completed'
    if (data[phase]?.unlocked) return 'unlocked'
    if (data[phase - 1]?.completed) return 'unlocked'
    return 'locked'
  },
  getProgress: (skillId: string, level: string) => {
    const key = `udaan_progress_${skillId}_${level}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : {}
  },
  saveProgress: (skillId: string, level: string,
    phaseNumber: number, data: any) => {
    const key = `udaan_progress_${skillId}_${level}`
    const existing = JSON.parse(
      localStorage.getItem(key) || '{}')
    existing[phaseNumber] = data
    localStorage.setItem(key, JSON.stringify(existing))
  },
  saveTestResult: (skillId: string,
    level: string, phase: number,
    score: number, passed: boolean) => {
    const key = `udaan_test_${skillId}_${level}_${phase}`
    localStorage.setItem(key, JSON.stringify({
      score, passed, takenAt: Date.now()
    }))
    if (passed) {
      Storage.savePhaseComplete(
        skillId, level, phase, score)
    }
  },
  getOverallProgress: () => {
    const roadmap = Storage.getRoadmap()
    if (!roadmap) return {
      phasesCompleted: 0,
      totalPoints: 0,
      skillsCompleted: 0
    }
    let phasesCompleted = 0
    let totalPoints = 0
    roadmap.skills?.forEach((skill: string) => {
      const skillId = skill.toLowerCase()
        .replace(/\s+/g, '-')
      ;['beginner','intermediate','advanced']
        .forEach(level => {
          const key = `udaan_progress_${skillId}_${level}`
          const data = JSON.parse(
            localStorage.getItem(key) || '{}')
          Object.values(data).forEach((p: any) => {
            if (p.completed) {
              phasesCompleted++
              totalPoints += p.score || 100
            }
          })
        })
    })
    return { phasesCompleted, totalPoints }
  },
  saveAssessmentAnswers: (answers: any) => {
    localStorage.setItem('udaan_assessment',
      JSON.stringify(answers))
  },
  getAssessmentAnswers: () => {
    const d = localStorage.getItem('udaan_assessment')
    return d ? JSON.parse(d) : null
  }
}
