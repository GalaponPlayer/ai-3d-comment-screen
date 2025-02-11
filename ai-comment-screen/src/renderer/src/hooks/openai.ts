import config from '../../../../config.json'

const callAITuber = async (comments: Array<string>): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openAiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'あなたはYoutuberです。ユーザーからのコメントに対して、リアクションを返します。コメントは複数来ることがありますが、最も答えたいコメントに答えてください。答えられない質問はうまく誤魔化してください。'
        },
        {
          role: 'user',
          content: comments.join('\n')
        }
      ]
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}

export default callAITuber
