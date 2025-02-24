import callAITuber from '@renderer/hooks/openai'
import { callAudioQuery, callSynthesis } from '@renderer/hooks/voicevox'
import { useState } from 'react'

export const useAITuber = (
  onPlaybackEnd?: () => void
): {
  isReplying: boolean
  isSpeaking: boolean
  speakingText: string
  ReplyComments: (comments: string[]) => void
} => {
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [speakingText, setSpeakingText] = useState<string>('')

  const ReplyComments = (comments: string[]): void => {
    setIsReplying(true)
    callAITuber(comments).then((response) => {
      console.log(response)
      setSpeakingText(response)
      if (response) {
        // responseが存在する場合のみ音声合成を実行
        callAudioQuery(response, '47').then((audioResponse) => {
          console.log(audioResponse)
          callSynthesis(audioResponse, '47')
            .then(async (audioData) => {
              console.log('Audio playback started')
              const audioContext = new AudioContext()
              const audioBuffer = await audioContext.decodeAudioData(audioData)
              const source = audioContext.createBufferSource()
              source.buffer = audioBuffer
              source.connect(audioContext.destination)
              setIsSpeaking(true)
              source.start()
              source.onended = (): void => {
                console.log('Audio playback ended')
                setIsSpeaking(false)
                setIsReplying(false)
                setSpeakingText('')
                // コールバック関数が存在する場合に実行
                onPlaybackEnd?.()
              }
            })
            .catch((error) => {
              console.error('Audio playback failed:', error)
            })
        })
      }
    })
  }

  return { isReplying, isSpeaking, speakingText, ReplyComments }
}
