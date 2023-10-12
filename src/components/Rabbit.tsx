import { useAnimations, useGLTF } from '@react-three/drei'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import IceCream from './IceCream'
import Toilet from './Toilet'
import { AnimationNamesType } from '@/App'
import Brush from './Brush'

export type RabbitPropsType = {
  animationName: AnimationNamesType
  manualAnimation: boolean
}

const Rabbit = forwardRef(({ animationName }: RabbitPropsType, ref) => {
  const rabbitRef = useRef<THREE.Group | null>(null)
  const iceCreamRef = useRef<THREE.Group | null>(null)
  const trailRef = useRef<THREE.CatmullRomCurve3 | null>(null)
  const trailObjRef = useRef<THREE.Line | null>(null)
  const brushRef = useRef<THREE.Group | null>(null)

  const progressRef = useRef(0)
  const [canEat, setCanEat] = useState(false)
  const [canToilet, setCanToilet] = useState(false)

  const speed = 0.003

  const originalPoint = new THREE.Vector3(-0.1, -0.2, 0.19)
  const { scene: threeScene } = useThree()

  const { scene, animations } = useGLTF(
    './models/running-rabbit.glb',
    './libs/'
  )

  useMemo(() => {
    scene.children.forEach((mesh) => {
      mesh.castShadow = true
      mesh.receiveShadow = true
    })
    scene.castShadow = true
    scene.receiveShadow = true
  }, [scene])

  const { actions, names } = useAnimations(animations, rabbitRef)

  useEffect(() => {
    makeCurve()
    return () => removeCurve()
  }, [])

  useEffect(() => {
    if (actions && names && animationName) {
      if (animationName === 'eat' || animationName === 'Toilet') {
        actions['run']?.reset().play()
      } else {
        setCanEat(false)
        setCanToilet(false)
        actions[animationName]?.reset().fadeIn(0.5).play()
      }
    }

    return () => {
      if (actions && names && animationName) {
        actions[animationName]?.fadeOut(0.5)
      }
    }
  }, [actions, names, animationName])

  useEffect(() => {
    if (canEat) {
      actions['run']?.fadeOut(0.5)
      actions['eat']?.reset().fadeIn(0.5).play()
    }
    if (canToilet) {
      actions['run']?.fadeOut(0.2)
      actions['Toilet']?.reset().fadeIn(0.2).play()
    }
  }, [actions, canEat, canToilet])

  const makeCurve = () => {
    // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    // Create a closed wavey loop
    trailRef.current = new THREE.CatmullRomCurve3([
      originalPoint,
      new THREE.Vector3(0.08, -0.2, 0.23),
      new THREE.Vector3(-0.1, -0.2, 0.05),
    ])
    trailRef.current.curveType = 'catmullrom'
    trailRef.current.closed = true //设置是否闭环
    trailRef.current.tension = 0.5 //设置线的张力，0为无弧度折线

    // 为曲线添加材质在场景中显示出来，不添加到场景显示也不会影响运动轨迹，相当于一个Helper
    const points = trailRef.current.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0x00000000 })

    // Create the final object to add to the scene
    trailObjRef.current = new THREE.Line(geometry, material)
    threeScene.add(trailObjRef.current)
    const initPoint = trailRef.current.getPointAt(progressRef.current)
    rabbitRef.current?.position.set(initPoint.x, initPoint.y, initPoint.z)
    const targetPoint = trailRef.current.getPointAt(progressRef.current + speed)
    rabbitRef.current?.lookAt(targetPoint.x, targetPoint.y, targetPoint.z)
  }

  const removeCurve = () => {
    if (
      trailRef &&
      trailRef.current &&
      trailObjRef &&
      trailObjRef.current &&
      threeScene
    ) {
      threeScene.remove(trailObjRef.current)
    }
  }

  const moveOnTrail = () => {
    if (trailRef && trailRef.current) {
      if (progressRef.current <= 1 - speed) {
        const trail = trailRef.current
        const point = trail.getPointAt(progressRef.current)
        const targetPoint = trail.getPointAt(progressRef.current + speed)

        if (point && targetPoint && rabbitRef.current) {
          rabbitRef.current.position.set(point.x, point.y, point.z)
          // rabbitRef.current.lookAt(
          //   targetPoint.x,
          //   targetPoint.y,
          //   targetPoint.z
          // ) //因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。

          const offsetAngle = 0 //目标移动时的朝向偏移

          // //以下代码在多段路径时可重复执行
          const mtx = new THREE.Matrix4() //创建一个4维矩阵
          mtx.lookAt(
            targetPoint,
            rabbitRef.current.position,
            rabbitRef.current.up
          ) //设置朝向
          mtx.multiply(
            new THREE.Matrix4().makeRotationFromEuler(
              new THREE.Euler(0, offsetAngle, 0)
            )
          )
          const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx) //计算出需要进行旋转的四元数值
          rabbitRef.current.quaternion.slerp(toRot, 0.2)
        }

        progressRef.current += speed
      } else {
        progressRef.current = 0
      }
    } else {
      return
    }
  }

  useFrame(() => {
    if (animationName === 'run') {
      moveOnTrail()
    }

    if (animationName === 'eat' && canEat === false) {
      if (progressRef.current < 0.97) {
        moveOnTrail()
      } else {
        setCanEat(true)
      }
    }

    if (animationName === 'Toilet' && canToilet === false) {
      if (progressRef.current < 0.1 || progressRef.current > 0.11) {
        moveOnTrail()
      } else {
        setCanToilet(true)
      }
    }

    if (rabbitRef.current && iceCreamRef.current) {
      const hand = rabbitRef.current.getObjectByName('bip_index_0_L')

      const iceCream = iceCreamRef.current
      if (hand && iceCream) {
        const handPosition = new THREE.Vector3()
        hand.getWorldPosition(handPosition)
        iceCream.position.copy(
          handPosition.add(new THREE.Vector3(-0.008, 0.008, 0.0045))
          // handPosition
        )
        iceCream.rotation.copy(hand.rotation)
      }
    }

    if (rabbitRef.current && brushRef.current) {
      const hand = rabbitRef.current.getObjectByName('bip_index_0_L')
      const brush = brushRef.current
      if (hand && brush) {
        const handPosition = new THREE.Vector3()
        hand.getWorldPosition(handPosition)
        brush.position.copy(
          // handPosition.add(new THREE.Vector3(iceX, iceY, iceZ))
          handPosition.add(new THREE.Vector3(0.0014, -0.0115, 0.0154))
        )
        brush.rotation.copy(hand.rotation)
      }
    }
  })

  return (
    <group>
      <group ref={rabbitRef} receiveShadow castShadow>
        <primitive
          // position-y={-0.07}
          ref={ref}
          object={scene}
          receiveShadow
          castShadow
        />
      </group>
      {canEat && <IceCream ref={iceCreamRef} />}
      {canToilet && (
        <group>
          <Toilet position={new THREE.Vector3(-0.03, -0.2, 0.21)} />
          <Brush ref={brushRef} />
        </group>
      )}
    </group>
  )
})

useGLTF.preload('./models/running-rabbit.glb', './libs/')

export default Rabbit
