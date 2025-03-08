import TypingText from '@renderer/components/TypingText'
import { useAITuber } from '@renderer/hooks/aituber'
import { generateClient } from 'aws-amplify/data'
import gsap from 'gsap'
import { useEffect, useState } from 'react'
import type { Schema } from '../../../amplify/data/resource'
import './App.css'
import Versions from './components/Versions'
function App(): JSX.Element {
  const client = generateClient<Schema>()
  const onPlaybackEnd = (): void => {
    setRecentComments([])
  }
  const { isReplying, isSpeaking, speakingText, ReplyComments } = useAITuber(onPlaybackEnd)
  const [count, setCount] = useState(0)
  const [comments, setComments] = useState<Array<Schema["Comment"]["type"]>>([])
  const [recentComments, setRecentComments] = useState<string[]>([])
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    try {
      if (client?.models?.Comment) {
        subscription = client.models.Comment.onCreate().subscribe({
          next: (data) => handleNewComment(data),
          error: (error) => console.error('Error observing comments:', error)
        });
      } else {
        console.error('Comment model not initialized');
      }
    } catch (error) {
      console.error('Error setting up comment subscription:', error);
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleNewComment = (comment: Schema["Comment"]["type"]): void => {
    setComments([...comments, comment])
    setRecentComments([...recentComments, comment.comment ?? ''])
    niconico(comment.comment ?? '')
  }



  // 5 秒経つか 5 個コメントが流れるかしたら、リプライを発火
  useEffect(() => {
    if (recentComments.length === 0) return
    if (isReplying) return

    const processComments = (comments: string[]): void => {
      setRecentComments([])
      ReplyComments(comments)
    }

    if (recentComments.length >= 5) {
      processComments(recentComments)
    }

    const interval = setInterval(() => {
      if (recentComments.length > 0) {  // コメントが存在する場合のみ処理を実行
        processComments(recentComments)
      }
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [recentComments, isReplying])

  const niconico = async (txt: string): Promise<void> => {
    const div_text = document.createElement('div')
    div_text.id = 'text' + count
    setCount(count + 1)
    div_text.style.position = 'fixed'
    div_text.style.whiteSpace = 'nowrap'
    div_text.style.fontSize = '50px'
    div_text.style.fontWeight = 'bold'
    div_text.style.color = 'white'
    div_text.style.webkitTextStroke = '1px black'
    div_text.style.textShadow = '2px 2px 2px black'
    div_text.style.left = `${document.documentElement.clientWidth}px`
    const random = Math.round(Math.random() * document.documentElement.clientHeight)
    div_text.style.top = `${random}px`
    div_text.appendChild(document.createTextNode(`${txt}`))
    document.body.appendChild(div_text)

    await gsap.to(`#${div_text.id}`, {
      duration: 8,
      x: -1 * (document.documentElement.clientWidth + div_text.clientWidth)
    })

    div_text.parentNode?.removeChild(div_text)
  }
  return (
    <div className="window-wrapper">
      <Versions></Versions>
      {comments && comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.comment}</p>
          <p>{comment.name}</p>
        </div>
      ))}
      <div className="yomiage">
        {isSpeaking && <TypingText text={speakingText} />}
        {/* <TypingText text="おは。今日もいい天気だね。今日は何して遊ぶ？" /> */}
      </div>
    </div>
  )
}

export default App
