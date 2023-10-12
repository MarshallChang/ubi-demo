import { Canvas } from '@react-three/fiber'
import Home from '@/components/Home'
import {
  CameraControls,
  Center,
  Environment,
  Loader,
  useProgress,
} from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import Rabbit from './components/Rabbit'
import LevelCard from './components/LevelCard'
import Fireworks, { FireworksHandlers } from '@fireworks-js/react'
import Nfts from './components/Nfts'
import iceCreamPng from '@/assets/imgs/ice-cream.png'
import brushPng from '@/assets/imgs/brush.png'
import kungfuPng from '@/assets/imgs/kungfu.png'

import {
  AssetsType,
  TraitType,
  getQueryVariable,
  getTargetAssets,
  getTargetLevel,
  getTargetTraits,
  setTargetAssets,
  setTargetLevel,
  setTargetTraits,
} from './utils/util'

export type AnimationNamesType = 'idle' | 'eat' | 'Kungfu' | 'run' | 'Toilet'

function App() {
  const fireworkRef = useRef<FireworksHandlers>(null)
  const [fireworkSize, setFireworkSize] = useState('0')
  const [assets, setAssets] = useState<AssetsType>({
    iceCream: 10,
    brush: 10,
    Kungfu: 10,
  })
  const [level, setLevel] = useState(1)
  const [traits, setTraits] = useState<TraitType[]>([
    { name: 'Scene', value: 'Home' },
    { name: 'Cloth', value: 'None' },
    { name: 'Food', value: 'None' },
    { name: 'Action', value: 'None' },
  ])

  const [manualAnimation, setManualAnimation] = useState(false)
  const [currentAnimation, setCurrentAnimation] =
    useState<AnimationNamesType>('idle')

  const [currentId, setCurrentId] = useState('default')

  const toggleFirework = () => {
    if (!fireworkRef.current) return
    if (fireworkRef.current.isRunning) {
      setFireworkSize('0')
      fireworkRef.current.stop()
      fireworkRef.current.updateSize({ width: 0, height: 0 })
    } else {
      setFireworkSize('100%')
      fireworkRef.current.start()
      fireworkRef.current.updateSize({ width: 1920, height: 1080 })
    }
  }

  useEffect(() => {
    const id = getQueryVariable('id')
    setCurrentId(id)
    const _assets = getTargetAssets(id)
    setAssets(_assets)
    const _level = getTargetLevel(id)
    setLevel(_level)
    const _traits = getTargetTraits(id)
    setTraits(_traits)
  }, [])

  useEffect(() => {
    if (fireworkRef && fireworkRef.current) {
      setFireworkSize('0')
      fireworkRef.current.stop()
    }
  }, [fireworkRef])

  useEffect(() => {
    if (manualAnimation) {
      setTimeout(() => {
        setManualAnimation(false)
      }, 10000)
    } else {
      const random = Math.random()
      if (random <= 0.5) {
        setCurrentAnimation('idle')
      } else {
        setCurrentAnimation('run')
      }
    }
  }, [manualAnimation])

  const handleLevelUp = () => {
    setLevel(level + 1)
    setTargetLevel(currentId, level + 1)
    toggleFirework()
    setTimeout(() => {
      toggleFirework()
    }, 5000)
  }

  const handleNftUse = (name: 'iceCream' | 'brush' | 'Kungfu') => {
    const _assets = JSON.parse(JSON.stringify(assets)) as AssetsType
    const quantity = _assets[name]
    if (quantity <= 0) {
      return
    }

    let _traits: TraitType[] = []
    switch (name) {
      case 'iceCream':
        _traits = setTargetTraits(currentId, 'Food', 'IceCream')
        setCurrentAnimation('eat')
        break

      case 'brush':
        _traits = setTargetTraits(currentId, 'Action', 'Brush')
        setCurrentAnimation('Toilet')
        break

      case 'Kungfu':
        _traits = setTargetTraits(currentId, 'Action', 'Kungfu')
        setCurrentAnimation('Kungfu')
        break

      default:
        break
    }

    setManualAnimation(true)

    if (_traits.length > 0) {
      setTraits(_traits)
    }

    _assets[name] = quantity - 1

    setAssets(_assets)
    setTargetAssets(currentId, _assets)

    if ((_assets.iceCream + _assets.brush + _assets.Kungfu) % 3 === 0) {
      handleLevelUp()
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <Canvas shadows>
        <ambientLight />
        <Scene
          manualAnimation={manualAnimation}
          currentAnimation={currentAnimation}
        />
        <Environment files={'./envs/lebombo_1k.hdr'} />
      </Canvas>
      <LevelCard level={level} traits={traits} />
      <div className='fixed top-8 right-8'>
        <Nfts
          imgSrc={iceCreamPng}
          name='Ice Cream'
          tokenAddr='0x48389...5f97'
          holdings={assets.iceCream}
          onClick={() => handleNftUse('iceCream')}
        />
        <Nfts
          imgSrc={brushPng}
          name='Toilet Brush'
          tokenAddr='0x5F4D5...42dE'
          holdings={assets.brush}
          onClick={() => handleNftUse('brush')}
        />
        <Nfts
          imgSrc={kungfuPng}
          name='Kungfu'
          tokenAddr='0x3EFA4...729d'
          holdings={assets.Kungfu}
          onClick={() => handleNftUse('Kungfu')}
        />
      </div>
      <Fireworks
        ref={fireworkRef}
        options={{ opacity: 0.5 }}
        style={{
          top: 0,
          left: 0,
          width: fireworkSize,
          height: fireworkSize,
          position: 'fixed',
          background: '#000ff',
        }}
      />
    </Suspense>
  )
}

function Scene({
  manualAnimation,
  currentAnimation,
}: {
  manualAnimation: boolean
  currentAnimation: AnimationNamesType
}) {
  const homeRef = useRef()
  const cameraControlsRef = useRef<CameraControls>(null)
  const { progress } = useProgress()

  useEffect(() => {
    if (progress === 100 && cameraControlsRef.current && homeRef.current) {
      cameraControlsRef.current.fitToBox(homeRef.current, true)
    }
  }, [progress, cameraControlsRef, homeRef])
  return (
    <group>
      <Center>
        <Home ref={homeRef} />
      </Center>
      <Rabbit
        animationName={currentAnimation}
        manualAnimation={manualAnimation}
      />
      <CameraControls
        ref={cameraControlsRef}
        minDistance={0}
        enabled={true}
        verticalDragToForward={false}
        dollyToCursor={false}
        infinityDolly={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 3}
      />
    </group>
  )
}

export default App
