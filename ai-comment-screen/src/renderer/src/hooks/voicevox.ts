export const callAudioQuery = async (text: string, speakerId: string): Promise<object> => {
  console.log('callAudioQuery', text, speakerId)
  const params = {
    text: text,
    speaker: speakerId
  }
  const query = new URLSearchParams(params)
  const response = await fetch(`http://127.0.0.1:50021/audio_query?${query.toString()}`, {
    method: 'POST',
    body: null
  })
  const data = await response.json()
  return data
}

export const playAudio = async (audioData: ArrayBuffer): Promise<void> => {
  const audioContext = new AudioContext()
  const audioBuffer = await audioContext.decodeAudioData(audioData)
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start()
  source.onended = (): void => {
    console.log('Audio playback ended')
  }
}

export const callSynthesis = async (
  audioQuery: object,
  speakerId: string
): Promise<ArrayBuffer> => {
  console.log('callSynthesis', audioQuery, speakerId)
  const params = {
    speaker: speakerId
  }
  const query = new URLSearchParams(params)
  const response = await fetch(`http://127.0.0.1:50021/synthesis?${query.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(audioQuery)
  })
  return response.arrayBuffer()
}
