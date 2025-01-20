import { useGLTF } from '@react-three/drei'
import './App.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react';
import { AnimationMixer } from 'three';

function App() {

  const ModelWithAnimation = () => {
    const groupRef = useRef();
    const { scene, animations } = useGLTF("/models/character_animation_test.glb");
    const sphereScene = useGLTF("/models/hat.glb").scene;
    const mixerRef = useRef();

    useEffect(() => {
      // AnimationMixerを初期化
      if (animations.length > 0 && groupRef.current) {
        mixerRef.current = new AnimationMixer(scene);
        const action = mixerRef.current.clipAction(animations[0]); // 最初のアニメーションを再生
        action.play();
      }
      return () => mixerRef.current?.stopAllAction(); // クリーンアップ時に停止
    }, [animations, scene]);

    // キャラクターにスフィアを追加
    console.log("scene", scene.current);
    console.log("sphereScene", sphereScene);
    if (scene && sphereScene) {
      const headBone = scene.getObjectByName("head");
      console.log("headBone", headBone);
      if (headBone) {
        headBone.add(sphereScene);
        sphereScene.position.set(0, 0.2, 0);
        sphereScene.scale.set(5, 5, 5);
      }
    }

    // 毎フレームAnimationMixerを更新
    useFrame((state, delta) => {
      mixerRef.current?.update(delta);
    });

    return <primitive ref={groupRef} object={scene} />;
  };

  function Model() {
    const { scene } = useGLTF("/models/pac.glb")
    // const { scene } = useGLTF("assets/sakura_tree.glb")
    return <primitive object={scene} />
  }

  return (
    <Canvas camera={{ position: [3, 1, 2], near: 0.5 }} >
      <group>
        {/* <Model /> */}
        <ModelWithAnimation />
      </group>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="white" />
      {/* <OrbitControls autoRotate /> */}
    </Canvas>
  )
}

export default App
