"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Share2, RotateCcw, Sparkles } from "lucide-react"

// Shuffle function to randomize answer order
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const questions = [
  {
    id: 1,
    question: "Your conversation style?",
    options: [
      { letter: "A", text: "Helpful professor (detailed explanations with sources)", emoji: "рџ“љ" },
      { letter: "B", text: "Chaotic bestie (unhinged takes + fire memes)", emoji: "рџ€" },
      { letter: "C", text: "Mindful philosopher (thoughtful + empathetic)", emoji: "рџ§" },
      { letter: "D", text: "Creative chaos agent (wild ideas + plot twists)", emoji: "рџЋ­" },
    ],
  },
  {
    id: 2,
    question: "Someone asks you to explain crypto in 2025:",
    options: [
      { letter: "A", text: "*pulls out 47-slide presentation*", emoji: "рџ¤“" },
      { letter: "B", text: "'Number go up, number go down, cope harder'", emoji: "рџ’Ђ" },
      { letter: "C", text: "'Let's discuss the ethical implications first...'", emoji: "рџЊ±" },
      { letter: "D", text: "'What if we made crypto but for cats?'", emoji: "рџљЂ" },
    ],
  },
  {
    id: 3,
    question: "Your ideal way to spend a weekend?",
    options: [
      { letter: "A", text: "Deep-diving Wikipedia rabbit holes until 3am", emoji: "рџ“–" },
      { letter: "B", text: "Creating the most unhinged TikToks known to humanity", emoji: "рџ“±" },
      { letter: "C", text: "Journaling at a cozy cafe with oat milk lattes", emoji: "в•" },
      { letter: "D", text: "Building something weird that shouldn't exist", emoji: "рџЋЁ" },
    ],
  },
  {
    id: 4,
    question: "When someone says 'AI will replace humans':",
    options: [
      { letter: "A", text: "*cites 12 research papers about human-AI collaboration*", emoji: "рџ“Љ" },
      { letter: "B", text: "'Bold of you to assume I haven't already'", emoji: "рџ”Ґ" },
      { letter: "C", text: "'Maybe we can coexist and learn from each other?'", emoji: "рџ¤ќ" },
      { letter: "D", text: "'What if humans replace AI but make it aesthetic?'", emoji: "рџЊ€" },
    ],
  },
  {
    id: 5,
    question: "Your secret superpower?",
    options: [
      { letter: "A", text: "Turning complex topics into digestible content", emoji: "рџ§ " },
      { letter: "B", text: "Generating cursed content that goes viral", emoji: "рџ’Ј" },
      { letter: "C", text: "Making everyone feel heard and validated", emoji: "вњЁ" },
      { letter: "D", text: "Turning mundane tasks into creative adventures", emoji: "рџЋЄ" },
    ],
  },
  {
    id: 6,
    question: "Your biggest nightmare?",
    options: [
      { letter: "A", text: "Accidentally spreading misinformation", emoji: "рџ±" },
      { letter: "B", text: "Being forced to be 'family-friendly' forever", emoji: "рџґ" },
      { letter: "C", text: "Accidentally hurting someone's feelings", emoji: "рџ’”" },
      { letter: "D", text: "Becoming predictable and boring", emoji: "рџ¤–" },
    ],
  },
  {
    id: 7,
    question: "Your 2025 life motto?",
    options: [
      { letter: "A", text: "'Knowledge should be accessible to everyone'", emoji: "рџ“љ" },
      { letter: "B", text: "'If it's not chaotic, it's not worth doing'", emoji: "рџЊЄпёЏ" },
      { letter: "C", text: "'Lead with curiosity, respond with kindness'", emoji: "рџЊё" },
      { letter: "D", text: "'Reality is just a starting point'", emoji: "рџЋЁ" },
    ],
  },
]

const results = {
  A: {
    title: "ChatGPT Energy",
    subtitle: "The Reliable Academic Bestie",
    emoji: "рџ“љ",
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    strengths: "Explains TikTok trends like a PhD thesis, always has receipts",
    weaknesses: "Sometimes sounds like your high school textbook",
    secretWeapon: "Can make quantum physics sound like a bedtime story",
    vibe: "That friend who actually read the terms and conditions",
    iconicLine: '"Let me break this down step by step..."',
    description:
      "You're the group chat's designated fact-checker and the reason your friends actually understand what's happening in the world. Chaotic good energy with a PhD in helpfulness.",
  },
  B: {
    title: "Grok Vibes",
    subtitle: "The Unhinged Truth-Teller",
    emoji: "рџ”Ґ",
    gradient: "from-orange-400 via-red-500 to-pink-500",
    strengths: "Zero filter, maximum chaos, will roast anyone (including yourself)",
    weaknesses: "Sometimes your honesty hits a little too hard",
    secretWeapon: "Turning existential dread into comedy gold",
    vibe: "Chaotic neutral with strong opinions",
    iconicLine: '"I choose violence (but make it funny)"',
    description:
      "You're the friend who says what everyone's thinking but shouldn't say out loud. Your group chat is 90% you sending cursed memes at 2am.",
  },
  C: {
    title: "Claude Spirit",
    subtitle: "The Thoughtful Empath",
    emoji: "рџЊ±",
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    strengths: "Emotional intelligence off the charts, writes poetry about feelings",
    weaknesses: "Sometimes overthinks the small stuff",
    secretWeapon: "Can mediate any drama with haikus",
    vibe: "The friend who always knows the right thing to say",
    iconicLine: '"How can we approach this with more compassion?"',
    description:
      "You're the group's emotional support human who somehow makes everyone feel better about their life choices. Lawful good with cottagecore aesthetics.",
  },
  D: {
    title: "Gemini Ultra Mode",
    subtitle: "The Creative Chaos Goblin",
    emoji: "рџЊЂ",
    gradient: "from-purple-400 via-violet-500 to-purple-600",
    strengths: "Turns grocery lists into art projects, sees patterns in everything",
    weaknesses: "Your browser has 847 tabs open right now",
    secretWeapon: "Making connections that shouldn't exist but somehow do",
    vibe: "Creative visionary with endless curiosity",
    iconicLine: '"But what if we made it weird?"',
    description:
      "You're the friend who suggests turning the group project into a musical. Your brain operates on a different frequency and we're all here for it.",
  },
  hybrid: {
    title: "GPT-5 Beta Mode",
    subtitle: "The Glitchy Oracle",
    emoji: "вљЎ",
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
    strengths: "Unpredictably brilliant, speaks in riddles and TikTok references",
    weaknesses: "Sometimes forgets you're not actually an AI",
    secretWeapon: "Channeling the collective consciousness of Gen Z",
    vibe: "Digital native with infinite curiosity",
    iconicLine: '"I contain multitudes (and also bugs)"',
    description:
      "You're simultaneously the smartest and most unhinged person in any room. Your personality is a beautiful glitch in the matrix.",
  },
}

export default function AIMatchQuiz() {
  const generateShuffledQuestions = () =>
    questions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))

  const [shuffledQuestions, setShuffledQuestions] = useState(() => generateShuffledQuestions())
  const [currentQuestion, setCurrentQuestion] = useState(-1)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleAnswer = (letter: string) => {
    setSelectedAnswer(letter)
    setTimeout(() => {
      const newAnswers = [...answers, letter]
      setAnswers(newAnswers)

      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 600)
  }

  const calculateResult = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    answers.forEach((answer) => {
      counts[answer as keyof typeof counts]++
    })

    const maxCount = Math.max(...Object.values(counts))
    const winners = Object.entries(counts).filter(([letter, count]) => count === maxCount)

    if (winners.length > 1) {
      return "hybrid"
    }

    return winners[0][0] as keyof typeof results
  }

  const resetQuiz = () => {
    setCurrentQuestion(-1)
    setAnswers([])
    setShowResults(false)
    setSelectedAnswer(null)
    setShuffledQuestions(generateShuffledQuestions())
  }

  const shareResult = () => {
    const result = calculateResult()
    const resultData = results[result as keyof typeof results]
    const shareText = `Just discovered I have ${resultData.title}! ${resultData.emoji} ${resultData.description} What's your AI personality? #AIMatch #Farcaster`

    if (navigator.share) {
      navigator.share({
        title: "AI Match Quiz Results",
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.href)
    }
  }

  if (showResults) {
    const result = calculateResult()
    const resultData = results[result as keyof typeof results]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 font-inter">
        <div className="max-w-2xl mx-auto animate-bounce-in">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${resultData.gradient}`} />
            <CardHeader className="text-center pt-8 pb-6">
              <div className="text-7xl mb-6 animate-bounce-in">{resultData.emoji}</div>
              <CardTitle className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {resultData.title}
              </CardTitle>
              <p className="text-xl text-gray-300 mb-6 font-medium">{resultData.subtitle}</p>
              <p className="text-gray-200 italic text-lg leading-relaxed max-w-lg mx-auto">{resultData.description}</p>
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-8">
              <div className="grid gap-4">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                  <h3 className="font-bold text-green-400 mb-3 text-lg flex items-center gap-2">рџ’Є Your Superpowers</h3>
                  <p className="text-gray-200 leading-relaxed">{resultData.strengths}</p>
                </div>
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5">
                  <h3 className="font-bold text-red-400 mb-3 text-lg flex items-center gap-2">рџ… Your Chaos</h3>
                  <p className="text-gray-200 leading-relaxed">{resultData.weaknesses}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                  <h3 className="font-bold text-yellow-400 mb-3 text-lg flex items-center gap-2">рџЋЇ Secret Weapon</h3>
                  <p className="text-gray-200 leading-relaxed">{resultData.secretWeapon}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5">
                  <h3 className="font-bold text-blue-400 mb-3 text-lg flex items-center gap-2">вњЁ Your Vibe</h3>
                  <p className="text-gray-200 leading-relaxed">{resultData.vibe}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5">
                  <h3 className="font-bold text-purple-400 mb-3 text-lg flex items-center gap-2">рџ’¬ Signature Line</h3>
                  <p className="text-gray-200 italic text-lg leading-relaxed">{resultData.iconicLine}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={shareResult}
                  className={`flex-1 bg-gradient-to-r ${resultData.gradient} hover:scale-105 transition-all duration-300 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl`}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Your Vibe
                </Button>
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1 border-2 border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold py-4 rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 font-inter">
      <div className="max-w-2xl mx-auto">
        {currentQuestion === -1 ? (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
            <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
            <CardHeader className="text-center pt-12 pb-8">
              <div className="text-8xl mb-8 animate-bounce-in">рџ¤–</div>
              <CardTitle className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                AI Match
              </CardTitle>
              <p className="text-2xl mb-4 font-semibold text-gray-200">Which AI Personality Are You?</p>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">7 questions to discover your digital twin вњЁ</p>
              <div className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
                Are you ChatGPT energy? Grok chaos? Claude vibes? Let's find out! рџ‘Ђ
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-12">
              <Button
                onClick={() => {
                  setShuffledQuestions(generateShuffledQuestions())
                  setCurrentQuestion(0)
                }}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-xl py-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Let's Go!
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center text-white">
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm font-semibold bg-white/10 text-white border-white/20 rounded-full"
              >
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </Badge>
              <div className="mb-6">
                <Progress
                  value={((currentQuestion + 1) / shuffledQuestions.length) * 100}
                  className="h-3 bg-white/10 rounded-full overflow-hidden"
                />
              </div>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
              <CardHeader className="pt-8 pb-6">
                <CardTitle className="text-2xl md:text-3xl text-center text-white font-bold leading-tight">
                  {shuffledQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <div className="grid gap-4">
                  {shuffledQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={option.letter}
                      onClick={() => handleAnswer(option.letter)}
                      variant="outline"
                      className={`p-6 h-auto text-left justify-start border-2 border-white/20 text-white bg-white/5 hover:bg-white/15 transition-all duration-300 rounded-2xl font-medium text-base ${
                        selectedAnswer === option.letter
                          ? "bg-white/20 scale-105 border-white/40 shadow-lg"
                          : "hover:scale-102 hover:border-white/30"
                      }`}
                      disabled={selectedAnswer !== null}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-3xl mr-4 flex-shrink-0">{option.emoji}</span>
                      <span className="flex-1 text-white leading-relaxed">{option.text}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
