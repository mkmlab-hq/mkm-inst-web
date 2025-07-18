'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, BookOpen, Brain, Award } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  correctAnswer: string
  explanation: string
  category: 'basic' | 'diagnosis' | 'prescription' | 'theory'
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "한의쉼터 운영자의 이름은 무엇인가요?",
    correctAnswer: "소요유",
    explanation: "한의쉼터는 소요유 원장님이 운영하고 계시는 한의학 커뮤니티입니다.",
    category: 'basic'
  }
]

interface DoctorQuizProps {
  onComplete: (score: number, passed: boolean) => void
}

export default function DoctorQuiz({ onComplete }: DoctorQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSubmit = () => {
    if (userAnswer.trim() === '') return

    const currentQ = quizQuestions[currentQuestion]
    const isCorrect = userAnswer.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase()
    
    if (isCorrect) {
      setScore(score + 1)
    }
    
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      // 퀴즈 완료
      const passed = score >= 1 // 1문제 중 1문제 맞춰야 통과
      setQuizCompleted(true)
      onComplete(score, passed)
    }
  }

  const currentQ = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const isCorrect = userAnswer.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase()

  if (quizCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8"
      >
        <div className="text-center">
          <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            퀴즈 완료!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            총 {quizQuestions.length}문제 중 {score}문제를 맞추셨습니다.
          </p>
          <div className="text-3xl font-bold text-blue-600 mb-6">
            {Math.round((score / quizQuestions.length) * 100)}점
          </div>
          {score >= 1 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold">
                축하합니다! 한의사 인증 퀴즈를 통과하셨습니다.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-800 font-semibold">
                아쉽게도 통과하지 못했습니다. 다시 도전해주세요.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* 진행률 표시 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            문제 {currentQuestion + 1} / {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 질문 카테고리 */}
      <div className="mb-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <BookOpen className="w-3 h-3 mr-1" />
          기본
        </div>
      </div>

      {/* 질문 */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQ.question}
        </h3>

        {/* 답안 입력 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              답안을 입력해주세요
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={showResult}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              placeholder="답안을 입력하세요..."
            />
          </div>

          {/* 제출 버튼 */}
          {!showResult && (
            <div className="flex justify-end">
              <motion.button
                onClick={handleAnswerSubmit}
                disabled={userAnswer.trim() === ''}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  userAnswer.trim() !== ''
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={userAnswer.trim() !== '' ? { scale: 1.05 } : {}}
                whileTap={userAnswer.trim() !== '' ? { scale: 0.95 } : {}}
              >
                답안 제출
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 rounded-lg"
          >
            {isCorrect ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">정답입니다!</h4>
                </div>
                <p className="text-green-800">{currentQ.explanation}</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-900">틀렸습니다.</h4>
                </div>
                <p className="text-red-800 mb-2">
                  정답: <span className="font-semibold">{currentQ.correctAnswer}</span>
                </p>
                <p className="text-red-800">{currentQ.explanation}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 다음 버튼 */}
      {showResult && (
        <div className="flex justify-end">
          <motion.button
            onClick={handleNextQuestion}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentQuestion < quizQuestions.length - 1 ? '다음 문제' : '퀴즈 완료'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </div>
      )}
    </motion.div>
  )
} 