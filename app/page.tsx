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
        ready: () => void
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
      { letter: "A", text: "Helpful professor (detailed explanations with sources)", emoji: "📚" },
      { letter: "B", text: "Chaotic bestie (unhinged takes + fire memes)", emoji: "😈" },
      { letter: "C", text: "Mindful philosopher (thoughtful + empathetic)", emoji: "🧘" },
      { letter: "D", text: "Creative chaos agent (wild ideas + plot twists)", emoji: "🎭" },
    ],
  },
  {
    id: 2,
    question: "Someone asks you to explain crypto in 2025:",
    options: [
      { letter: "A", text: "Pulls out 47-slide presentation*", emoji: "🤓" },
      { letter: "B", text: "Number go up, number go down, cope harder", emoji: "💀" },
      { letter: "C", text: "Let's discuss the ethical implications first...", emoji: "🌱" },
      { letter: "D", text: "What if we made crypto but for cats?", emoji: "🚀" },
    ],
  },
  {
    id: 3,
    question: "Your ideal way to spend a weekend?",
    options: [
      { letter: "A", text: "Deep-diving Wikipedia rabbit holes until 3am", emoji: "📖" },
      { letter: "B", text: "Creating the most unhinged TikToks known to humanity", emoji: "📱" },
      { letter: "C", text: "Journaling at a cozy cafe with oat milk lattes", emoji: "☕" },
      { letter: "D", text: "Building something weird that shouldn't exist", emoji: "🎨" },
    ],
  },
  {
    id: 4,
    question: "When someone says 'AI will replace humans':",
    options: [
      { letter: "A", text: "*cites 12 research papers about human-AI collaboration*", emoji: "📊" },
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
      { letter: "D", text: "Turning mundane tasks into creative adventures", emoji: "🎪" },
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
    emoji: "📚",
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
    emoji: "🔥",
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
    emoji: "🌱",
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
    emoji: "🌀",
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
    emoji: "⚡",
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

  useEffect(() => {
    // Check if Farcaster is available
    if (typeof window !== 'undefined') {
      setIsFarcasterAvailable(!!window.farsign && !!window.farcast)
      
      // Call sdk.actions.ready() immediately to remove splash screen
      if (window.sdk?.actions?.ready) {
        window.sdk.actions.ready()
      }
    }
  }, [])

  // Call sdk.actions.ready() immediately on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sdk?.actions?.ready) {
      window.sdk.actions.ready()
    }
  }, [])

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
    const result = calculateResult()
    const resultData = results[result as keyof typeof results]
    const shareText = `Just discovered I have ${resultData.title}! ${resultData.emoji} ${resultData.description} What's your AI personality? #AIMatch #Farcaster`

    if (window.farcast) {
      try {
        const castResult = await window.farcast.composeCast({
          text: shareText,
          embeds: [{ url: window.location.href }]
        })
        
        if (castResult.success) {
          console.log('Cast posted successfully:', castResult.hash)
        }
      } catch (error) {
        console.error('Failed to post cast:', error)
      }
    } else {
      // Fallback to regular share
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
  }

  const addToFarcaster = async () => {
    if (window.farcast) {
      try {
        const result = await window.farcast.addMiniApp({
          name: "AI Match Quiz",
          description: "Discover your AI personality with this fun quiz!",
          icon: "🤖",
          url: window.location.href
        })
        
        if (result.success) {
          console.log('Mini app added successfully')
        }
      } catch (error) {
        console.error('Failed to add mini app:', error)
      }
    }
  }

  if (showResults) {
    const result = calculateResult()
    const resultData = results[result as keyof typeof results]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 font-inter">
        <div className="max-w-sm mx-auto animate-bounce-in">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-0">
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
              
              <div className="px-4 pb-4 pt-4">
                                 <div className="flex gap-2">
                   <Button
                     onClick={shareOnFarcaster}
                     className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                   >
                     <Share2 className="w-4 h-4 mr-2" />
                     Share on Farcaster
                   </Button>
                 </div>
                
                {isFarcasterAvailable && (
                  <div className="mt-3">
                    <Button
                      onClick={addToFarcaster}
                      variant="outline"
                      className="w-full border-2 border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold py-2 rounded-2xl hover:scale-105 transition-all duration-300 text-sm"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Add to Farcaster
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 font-inter flex items-center justify-center">
      <div className="max-w-sm w-full">
        {currentQuestion === -1 ? (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
            <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500" />
            <CardHeader className="text-center pt-6 pb-4">
              <div className="text-5xl mb-4 animate-bounce-in">🤖</div>
              <CardTitle className="text-2xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                AI Match
              </CardTitle>
              <p className="text-base mb-2 font-semibold text-gray-200">Which AI Personality Are You?</p>
              <p className="text-gray-300 mb-3 text-xs leading-relaxed">7 questions to discover your digital twin ✨</p>
              <div className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                Are you ChatGPT energy? Grok chaos? Claude vibes? Let&apos;s find out! 👀
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              {isFarcasterAvailable && !user && (
                <Button
                  onClick={handleSignIn}
                  className="w-full mb-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs py-2 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <User className="w-3 h-3 mr-2" />
                  Sign in with Farcaster
                </Button>
              )}
              
              {user && (
                <div className="mb-3 text-center">
                  <p className="text-gray-300 text-xs">Signed in as @{user.username}</p>
                </div>
              )}
              
              <Button
                onClick={() => {
                  setShuffledQuestions(generateShuffledQuestions())
                  setCurrentQuestion(0)
                }}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-base py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Let&apos;s Go!
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div className="text-center text-white">
              <Badge
                variant="secondary"
                className="mb-4 px-3 py-1 text-xs font-semibold bg-white/10 text-white border-white/20 rounded-full"
              >
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </Badge>
              <div className="mb-4">
                <Progress
                  value={((currentQuestion + 1) / shuffledQuestions.length) * 100}
                  className="h-2 bg-white/10 rounded-full overflow-hidden"
                />
              </div>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500" />
              <CardHeader className="pt-6 pb-4">
                <CardTitle className="text-lg text-center text-white font-bold leading-tight">
                  {shuffledQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-6">
                <div className="grid gap-3">
                  {shuffledQuestions[currentQuestion].options.map((option, index) => (
                                         <Button
                       key={option.letter}
                       onClick={() => handleAnswer(option.letter)}
                       variant="outline"
                       className={`p-2 h-auto text-left justify-start border-2 border-white/20 text-white bg-white/5 hover:bg-white/15 transition-all duration-300 rounded-lg font-medium text-xs ${
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
    </div>
  )
}
