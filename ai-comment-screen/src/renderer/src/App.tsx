import { generateClient } from 'aws-amplify/data'
import { useEffect, useState } from 'react'
import type { Schema } from '../../../amplify/data/resource'
import icons from './assets/icons.svg'
import Versions from './components/Versions'

function App(): JSX.Element {
  const client = generateClient<Schema>()
  const [comments, setComments] = useState<Array<Schema["Comment"]["type"]>>([])
  useEffect(() => {
    try {
      console.log('client', client)
      console.log('client.models', client?.models)
      if (client?.models?.Comment) {
        client.models.Comment.observeQuery().subscribe({
          next: (data) => setComments([...data.items]),
          error: (error) => console.error('Error observing comments:', error)
        });
      } else {
        console.error('Comment model not initialized');
      }
    } catch (error) {
      console.error('Error setting up comment subscription:', error);
    }
  }, []);
  return (
    <div className="container">
      <Versions></Versions>
      {comments && comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.comment}</p>
          <p>{comment.name}</p>
        </div>
      ))}
      <svg className="hero-logo" viewBox="0 0 900 300">
        <use xlinkHref={`${icons}#electron`} />
      </svg>
      <h2 className="hero-text">
        You{"'"}ve successfully created an Electron project with React and TypeScript
      </h2>
      <p className="hero-tagline">
        Please try pressing <code>F12</code> to open the devTool
      </p>

      <div className="links">
        <div className="link-item">
          <a target="_blank" href="https://electron-vite.org" rel="noopener noreferrer">
            Documentation
          </a>
        </div>
        <div className="link-item link-dot">•</div>
        <div className="link-item">
          <a
            target="_blank"
            href="https://github.com/alex8088/electron-vite"
            rel="noopener noreferrer"
          >
            Getting Help
          </a>
        </div>
        <div className="link-item link-dot">•</div>
        <div className="link-item">
          <a
            target="_blank"
            href="https://github.com/alex8088/quick-start/tree/master/packages/create-electron"
            rel="noopener noreferrer"
          >
            create-electron
          </a>
        </div>
      </div>

      <div className="features">
        <div className="feature-item">
          <article>
            <h2 className="title">Configuring</h2>
            <p className="detail">
              Config with <span>electron.vite.config.ts</span> and refer to the{' '}
              <a target="_blank" href="https://electron-vite.org/config" rel="noopener noreferrer">
                config guide
              </a>
              .
            </p>
          </article>
        </div>
        <div className="feature-item">
          <article>
            <h2 className="title">HMR</h2>
            <p className="detail">
              Edit <span>src/renderer</span> files to test HMR. See{' '}
              <a
                target="_blank"
                href="https://electron-vite.org/guide/hmr.html"
                rel="noopener noreferrer"
              >
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div className="feature-item">
          <article>
            <h2 className="title">Hot Reloading</h2>
            <p className="detail">
              Run{' '}
              <span>
                {"'"}electron-vite dev --watch{"'"}
              </span>{' '}
              to enable. See{' '}
              <a
                target="_blank"
                href="https://electron-vite.org/guide/hot-reloading.html"
                rel="noopener noreferrer"
              >
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div className="feature-item">
          <article>
            <h2 className="title">Debugging</h2>
            <p className="detail">
              Check out <span>.vscode/launch.json</span>. See{' '}
              <a
                target="_blank"
                href="https://electron-vite.org/guide/debugging.html"
                rel="noopener noreferrer"
              >
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div className="feature-item">
          <article>
            <h2 className="title">Source Code Protection</h2>
            <p className="detail">
              Supported via built-in plugin <span>bytecodePlugin</span>. See{' '}
              <a
                target="_blank"
                href="https://electron-vite.org/guide/source-code-protection.html"
                rel="noopener noreferrer"
              >
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div className="feature-item">
          <article>
            <h2 className="title">Packaging</h2>
            <p className="detail">
              Use{' '}
              <a target="_blank" href="https://www.electron.build" rel="noopener noreferrer">
                electron-builder
              </a>{' '}
              and pre-configured to pack your app.
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}

export default App
