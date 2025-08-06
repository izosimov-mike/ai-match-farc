"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Share2, Sparkles, User } from "lucide-react"

// Farcaster Mini App Types
declare global {
  interface Window {
    farsign?: {
      signIn: () => Promise<{ success: boolean; fid?: string; username?: string }>
    }
    farcast?: {
      composeCast: (params: {
        text: string
        embeds?: Array<{ url: string }>
      }) => Promise<{ success: boolean; hash?: string }>
      addMiniApp: (params: {
        name: string
        description: string
        icon: string
        url: string
      }) => Promise<{ success: boolean }>
    }
    sdk?: {
      actions: {
        ready: () => Promise<void>
      }
    }
  }
}

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
      { letter: "A", text: "Helpful professor (detailed explanations)", emoji: "📚" },
      { letter: "B", text: "Chaotic bestie (spicy takes + fire memes)", emoji: "😈" },
      { letter: "C", text: "Mindful philosopher (thoughtful + empathetic)", emoji: "🧘" },
      { letter: "D", text: "Creative chaos agent (wild ideas + plot twists)", emoji: "🎭" },
    ],
  },
  {
    id: 2,
    question: "Someone asks you to explain crypto in 2025:",
    options: [
      { letter: "A", text: "Pulls out 47-slide presentation", emoji: "🤓" },
      { letter: "B", text: "Number go up, number go down, cope harder", emoji: "💀" },
      { letter: "C", text: "Let's discuss the ethical implications first", emoji: "🌱" },
      { letter: "D", text: "What if we made crypto but for cats?", emoji: "🚀" },
    ],
  },
  {
    id: 3,
    question: "Your ideal way to spend a weekend?",
    options: [
      { letter: "A", text: "Deep-diving Wikipedia rabbit holes until 3am", emoji: "📖" },
      { letter: "B", text: "Pushing TikTok content into the stratosphere", emoji: "📱" },
      { letter: "C", text: "Journaling at a cozy cafe with oat milk lattes", emoji: "☕" },
      { letter: "D", text: "Building something weird that shouldn't exist", emoji: "🎨" },
    ],
  },
  {
    id: 4,
    question: "When someone says 'AI will replace humans':",
    options: [
      { letter: "A", text: "Pulls 12 researches on human-AI collaboration", emoji: "📊" },
      { letter: "B", text: "Bold of you to assume I haven't already", emoji: "🔥" },
      { letter: "C", text: "Maybe we can coexist and learn from each other?", emoji: "🤝" },
      { letter: "D", text: "What if humans replace AI but make it aesthetic?", emoji: "🌈" },
    ],
  },
  {
    id: 5,
    question: "Your secret superpower?",
    options: [
      { letter: "A", text: "Turning complex topics into digestible content", emoji: "🧠" },
      { letter: "B", text: "Generating cursed content that goes viral", emoji: "💣" },
      { letter: "C", text: "Making everyone feel heard and validated", emoji: "✨" },
      { letter: "D", text: "Turning the boring into something brilliant", emoji: "🎪" },
    ],
  },
  {
    id: 6,
    question: "Your biggest nightmare?",
    options: [
      { letter: "A", text: "Accidentally spreading misinformation", emoji: "😱" },
      { letter: "B", text: "Being forced to be 'family-friendly' forever", emoji: "😴" },
      { letter: "C", text: "Accidentally hurting someone's feelings", emoji: "💔" },
      { letter: "D", text: "Becoming predictable and boring", emoji: "🤖" },
    ],
  },
  {
    id: 7,
    question: "Your 2025 life motto?",
    options: [
      { letter: "A", text: "Knowledge should be accessible to everyone", emoji: "📚" },
      { letter: "B", text: "If it's not chaotic, it's not worth doing", emoji: "🌪️" },
      { letter: "C", text: "Lead with curiosity, respond with kindness", emoji: "🌸" },
      { letter: "D", text: "Reality is just a starting point", emoji: "🎨" },
    ],
  },
]

const results = {
  A: {
    title: "ChatGPT Energy",
    subtitle: "The Reliable Academic Bestie",
    emoji: "??",
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    strengths: "Explains TikTok trends like a PhD thesis, always has receipts",
    weaknesses: "Sometimes sounds like your high school textbook",
    secretWeapon: "Can make quantum physics sound like a bedtime story",
    vibe: "That friend who actually read the terms and conditions",
    iconicLine: "Let me break this down step by step...",
    description:
      "You're the group chat's designated fact-checker and the reason your friends actually understand what's happening in the world. Chaotic good energy with a PhD in helpfulness.",
  },
  B: {
    title: "Grok Vibes",
    subtitle: "The Unhinged Truth-Teller",
    emoji: "??",
    gradient: "from-orange-400 via-red-500 to-pink-500",
    strengths: "Zero filter, maximum chaos, will roast anyone (including yourself)",
    weaknesses: "Sometimes your honesty hits a little too hard",
    secretWeapon: "Turning existential dread into comedy gold",
    vibe: "Chaotic neutral with strong opinions",
    iconicLine: "I choose violence (but make it funny)",
    description:
      "You're the friend who says what everyone's thinking but shouldn't say out loud. Your group chat is 90% you sending cursed memes at 2am.",
  },
  C: {
    title: "Claude Spirit",
    subtitle: "The Thoughtful Empath",
    emoji: "??",
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    strengths: "Emotional intelligence off the charts, writes poetry about feelings",
    weaknesses: "Sometimes overthinks the small stuff",
    secretWeapon: "Can mediate any drama with haikus",
    vibe: "The friend who always knows the right thing to say",
    iconicLine: "How can we approach this with more compassion?",
    description:
      "You're the group's emotional support human who somehow makes everyone feel better about their life choices. Lawful good with cottagecore aesthetics.",
  },
  D: {
    title: "Gemini Ultra Mode",
    subtitle: "The Creative Chaos Goblin",
    emoji: "??",
    gradient: "from-purple-400 via-violet-500 to-purple-600",
    strengths: "Turns grocery lists into art projects, sees patterns in everything",
    weaknesses: "Your browser has 847 tabs open right now",
    secretWeapon: "Making connections that shouldn't exist but somehow do",
    vibe: "Creative visionary with endless curiosity",
    iconicLine: "But what if we made it weird?",
    description:
      "You're the friend who suggests turning the group project into a musical. Your brain operates on a different frequency and we're all here for it.",
  },
  hybrid: {
    title: "GPT-5 Beta Mode",
    subtitle: "The Glitchy Oracle",
    emoji: "?",
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
    strengths: "Unpredictably brilliant, speaks in riddles and TikTok references",
    weaknesses: "Sometimes forgets you're not actually an AI",
    secretWeapon: "Channeling the collective consciousness of Gen Z",
    vibe: "Digital native with infinite curiosity",
    iconicLine: "I contain multitudes (and also bugs)",
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

  const getImageName = (result: string) => {
    const imageMap: { [key: string]: string } = {
      'A': 'chatgpt.png',
      'B': 'grok.png',
      'C': 'claude.png',
      'D': 'gemini.png',
      'hybrid': 'gpt5.png'
    }
    return imageMap[result] || 'chatgpt.png'
  }

  const [shuffledQuestions, setShuffledQuestions] = useState(() => generateShuffledQuestions())
  const [currentQuestion, setCurrentQuestion] = useState(-1)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [user, setUser] = useState<{ fid?: string; username?: string } | null>(null)
  const [isFarcasterAvailable, setIsFarcasterAvailable] = useState(false)
  const [showAddButton, setShowAddButton] = useState(true)

  useEffect(() => {
    setIsFarcasterAvailable(!!window.farcast && !!window.farsign)
  }, [])

  useEffect(() => {
    const initSDK = async () => {
      console.log('Initializing SDK...')
      try {
        if (window.sdk?.actions?.ready) {
          console.log('SDK available, calling sdk.actions.ready()')
          await window.sdk.actions.ready()
          console.log('sdk.actions.ready() called successfully')
        } else {
          console.error('Farcaster Mini App SDK not available. Ensure @farcaster/miniapp-sdk is included in the project.')
        }
      } catch (error) {
        console.error('Failed to call sdk.actions.ready():', error)
      }
    }

    initSDK()
  }, [])

  const addToFarcaster = async () => {
    if (window.farcast) {
      try {
        const result = await window.farcast.addMiniApp({
          name: "AI Match",
          description: "Discover your AI personality with this fun quiz!",
          icon: "??",
          url: "https://ai-match-psi.vercel.app"
        })
        
        if (result.success) {
          console.log('Mini app added successfully')
          setShowAddButton(false)
        }
      } catch (error) {
        console.error('Failed to add mini app:', error)
      }
    } else if (window !== window.parent) {
      window.parent.postMessage({
        type: 'frame.action',
        data: {
          action: 'add_mini_app',
          name: "AI Match",
          description: "Discover your AI personality with this fun quiz!",
          icon: "??",
          url: "https://ai-match-psi.vercel.app"
        }
      }, '*')
      setShowAddButton(false)
    }
  }

  const handleSignIn = async () => {
    if (window.farsign) {
      try {
        const result = await window.farsign.signIn()
        if (result.success) {
          setUser({ fid: result.fid, username: result.username })
        }
      } catch (error) {
        console.error('Sign in failed:', error)
      }
    }
  }

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
    const winners = Object.entries(counts).filter(([, count]) => count === maxCount)

    if (winners.length > 1) {
      return "hybrid"
    }

    return winners[0][0] as keyof typeof results
  }

  const shareOnFarcaster = async () => {
    console.log('Share button clicked - START')
    
    try {
      const result = calculateResult()
      const resultData = results[result as keyof typeof results]
      const shareText = `🎯 Just discovered my AI personality: ${resultData.title}! ${resultData.emoji}\n\nI'm ${resultData.subtitle} - ${resultData.description}\n\nFind your AI twin:\nhttps://ai-match-psi.vercel.app`

      if (window.farcast) {
        console.log('Using window.farcast.composeCast')
        const result = await window.farcast.composeCast({
          text: shareText,
          embeds: [{ url: "https://ai-match-psi.vercel.app" }]
        })
        if (result.success) {
          console.log('Cast composed successfully')
          return
        }
      } else if (window !== window.parent) {
        console.log('In iframe, sending frame.action')
        window.parent.postMessage({
          type: 'frame.action',
          data: {
            action: 'post',
            text: shareText,
            url: "https://ai-match-psi.vercel.app",
            target: "*"
          }
        }, '*')
        return
      }

      console.error('No sharing method available')
    } catch (error) {
      console.error('Share failed:', error)
    } finally {
      console.log('Share button clicked - END')
    }
  }

  if (showResults) {
    const result = calculateResult()
    const resultData = results[result as keyof typeof results]

    return (
      <main className="min-h-full h-full flex flex-col items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden font-inter">
        <div className="flex-1 flex flex-col justify-center items-center w-full h-full px-4" style={{ maxHeight: 'var(--mini-app-height)', maxWidth: 'var(--mini-app-width)' }}>
          <Card className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl flex flex-col" style={{ maxHeight: 'var(--mini-app-height)', maxWidth: 'var(--mini-app-width)' }}>
            <CardContent className="p-0 flex flex-col mb-4">
              <div className="w-full">
                <Image 
                  src={`/images/results/${getImageName(result)}`}
                  alt={`${resultData.title} Result`}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-t-3xl animate-fade-in"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
              
              <div className="px-4 pb-4 pt-1 flex flex-col">
                <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  {resultData.title}
                </h2>
                <Button
                  onClick={shareOnFarcaster}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Share on Farcaster
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-full h-full flex flex-col items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden font-inter">
      {isFarcasterAvailable && showAddButton && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={addToFarcaster}
            variant="outline"
            className="border border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold py-1 px-3 rounded-xl hover:scale-105 transition-all duration-300 text-xs"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Add to Farcaster
          </Button>
        </div>
      )}
      
      <div className="flex-1 flex flex-col justify-center items-center w-full h-full px-4">
        {currentQuestion === -1 ? (
          <Card className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in flex flex-col h-full mx-auto" style={{ maxWidth: 'var(--mini-app-width)' }}>
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500" />
            <CardHeader className="text-center pt-3 pb-1">
              <div className="text-6xl mb-2 animate-bounce-in">🤖</div>
              <CardTitle className="text-3xl font-bold mb-1 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                AI Match
              </CardTitle>
              <p className="text-lg mb-1 font-semibold text-gray-200">Which AI Personality Are You?</p>
              <p className="text-gray-300 mb-1 text-sm leading-relaxed">7 questions to discover your digital twin ?</p>
              <div className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                Are you ChatGPT energy? Grok chaos? Claude vibes? Let&apos;s find out! 👀
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex-1 flex flex-col justify-between">
              <div></div>
              {isFarcasterAvailable && !user && (
                <Button
                  onClick={handleSignIn}
                  className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign in with Farcaster
                </Button>
              )}
              
              {user && (
                <div className="mb-4 text-center">
                  <p className="text-gray-300 text-sm">Signed in as @{user.username}</p>
                </div>
              )}
              
              <Button
                onClick={() => {
                  setShuffledQuestions(generateShuffledQuestions())
                  setCurrentQuestion(0)
                }}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Let&apos;s Go!
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full h-full flex flex-col animate-slide-up mx-auto" style={{ maxWidth: 'var(--mini-app-width)' }}>
            <div className="text-center text-white pt-2 pb-0">
              <Badge
                variant="secondary"
                className="mb-0.5 mt-2 px-4 py-0.5 text-sm font-semibold bg-white/10 text-white border-white/20 rounded-full"
              >
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </Badge>
              <div className="mb-1 mt-2">
                <Progress
                  value={((currentQuestion + 1) / shuffledQuestions.length) * 100}
                  className="h-2 bg-white/10 rounded-full overflow-hidden w-11/12 mx-auto"
                />
              </div>
            </div>

            <Card className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden flex-1 flex flex-col mx-auto" style={{ maxWidth: 'var(--mini-app-width)' }}>
              <CardHeader className="pt-3 pb-1">
                <CardTitle className="text-lg text-center text-white font-bold leading-tight px-2 overflow-wrap break-word">
                  {shuffledQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-4 flex-1 flex flex-col justify-between">
                <div className="grid gap-2 mt-1">
                  {shuffledQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={option.letter}
                      onClick={() => handleAnswer(option.letter)}
                      variant="outline"
                      className={`p-2 h-auto text-left justify-start border border-white/20 text-white bg-white/5 hover:bg-white/15 transition-all duration-300 rounded-xl font-medium text-xs overflow-wrap break-word ${
                        selectedAnswer === option.letter
                          ? "bg-white/20 scale-105 border-white/40 shadow-lg"
                          : "hover:scale-102 hover:border-white/30"
                      }`}
                      disabled={selectedAnswer !== null}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-lg mr-2 flex-shrink-0">{option.emoji}</span>
                      <span className="flex-1 text-white leading-relaxed text-xs">{option.text}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}