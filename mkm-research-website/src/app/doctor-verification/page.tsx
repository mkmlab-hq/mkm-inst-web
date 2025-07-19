'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, FileText, CheckCircle, AlertCircle, GraduationCap, Award } from 'lucide-react'
import DoctorQuiz from '@/components/DoctorVerification/DoctorQuiz'

type VerificationStep = 'intro' | 'quiz' | 'documents' | 'complete'

export default function DoctorVerificationPage() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('intro')
  const [quizScore, setQuizScore] = useState(0)
  const [quizPassed, setQuizPassed] = useState(false)

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizScore(score)
    setQuizPassed(passed)
    if (passed) {
      setCurrentStep('documents')
    }
  }

  const handleDocumentsSubmit = () => {
    setCurrentStep('complete')
  }

  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          한의사 인증 시스템
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          MKM Lab의 전문가 플랫폼을 이용하기 위해 한의사 자격을 인증해주세요.
          안전하고 신뢰할 수 있는 의료 서비스를 제공하기 위한 필수 절차입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">전문 지식 확인</h3>
          <p className="text-gray-600">
            한의학 기초 이론부터 진단법, 처방 원리까지 종합적인 지식을 확인합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">자격 증명서 제출</h3>
          <p className="text-gray-600">
            한의사 면허증과 관련 서류를 업로드하여 자격을 확인합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">인증 완료</h3>
          <p className="text-gray-600">
            모든 절차가 완료되면 전문가 플랫폼의 모든 기능을 이용할 수 있습니다.
          </p>
        </motion.div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">인증 절차 안내</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• 총 10문제의 한의학 전문 지식 퀴즈 (80% 이상 통과 필요)</li>
              <li>• 한의사 면허증 사본 업로드</li>
              <li>• 개인정보 수집 및 이용 동의</li>
              <li>• 인증 완료 후 1-2일 내 승인 처리</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <motion.button
          onClick={() => setCurrentStep('quiz')}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          인증 시작하기
        </motion.button>
      </div>
    </motion.div>
  )

  const renderDocuments = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          퀴즈 통과 완료!
        </h2>
        <p className="text-gray-600">
          축하합니다! 전문 지식 확인을 완료하셨습니다. 이제 자격 증명서를 제출해주세요.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          필수 서류 업로드
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              한의사 면허증 사본 *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                JPG, PNG, PDF 파일 (최대 5MB)
              </p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                파일 선택
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              개인정보 수집 및 이용 동의 *
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                MKM Lab은 한의사 인증을 위해 다음 정보를 수집합니다:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• 성명, 연락처, 면허번호</li>
                <li>• 면허증 사본</li>
                <li>• 전문 분야 및 경력 정보</li>
              </ul>
              <p className="text-sm text-gray-700">
                수집된 정보는 인증 목적으로만 사용되며, 안전하게 보관됩니다.
              </p>
            </div>
            <div className="mt-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">
                  개인정보 수집 및 이용에 동의합니다
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 정보 (선택사항)
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="전문 분야, 주요 치료 경험, 연구 관심사 등을 자유롭게 작성해주세요."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => setCurrentStep('quiz')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            이전 단계
          </button>
          <button
            onClick={handleDocumentsSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            제출하기
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 text-center"
    >
      <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        인증 신청 완료!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        한의사 인증 신청이 성공적으로 제출되었습니다. 
        검토 후 1-2일 내에 결과를 이메일로 안내드리겠습니다.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-green-900 mb-2">다음 단계</h4>
        <ul className="text-green-800 space-y-1 text-left">
          <li>• 제출된 서류 검토 (1-2일 소요)</li>
          <li>• 승인 시 이메일 알림 발송</li>
          <li>• 전문가 플랫폼 접근 권한 부여</li>
          <li>• AI 진료 지원 시스템 이용 가능</li>
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setCurrentStep('intro')}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          홈으로 돌아가기
        </button>
        <p className="text-sm text-gray-500">
          문의사항이 있으시면 moksorinw@no1kmedi.com으로 연락주세요.
        </p>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'quiz' && (
          <DoctorQuiz onComplete={handleQuizComplete} />
        )}
        {currentStep === 'documents' && renderDocuments()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  )
} 