import { Object3D, Object3DEventMap } from 'three'

export const makeObject3DCastAndReceiveShadow = (
  children: Object3D<Object3DEventMap>[]
) => {
  children.map((child) => {
    child.receiveShadow = true
    child.castShadow = true
    if (child.children && child.children.length > 0) {
      makeObject3DCastAndReceiveShadow(child.children)
    }
  })
  return children
}

export function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return 'default'
}

export type AssetsType = {
  iceCream: number
  brush: number
  Kungfu: number
}

export function getTargetAssets(id: string): AssetsType {
  const assets = window.localStorage.getItem(id)
  if (assets) {
    return JSON.parse(assets) as AssetsType
  }

  const _assets = { iceCream: 10, brush: 10, Kungfu: 10 }
  setTargetAssets(id, _assets)
  return _assets
}

export function setTargetAssets(id: string, assets: AssetsType) {
  window.localStorage.setItem(id, JSON.stringify(assets))
}

export function getTargetLevel(id: string): number {
  const level = window.localStorage.getItem(id + '_level')
  if (level) {
    return Number(level)
  }
  return 1
}

export function setTargetLevel(id: string, level: number) {
  window.localStorage.setItem(id + '_level', level + '')
}

export type TraitType = {
  name: string
  value: string
}

export function getTargetTraits(id: string): TraitType[] {
  const traits = window.localStorage.getItem(id + '_traits')
  if (traits) {
    return JSON.parse(traits) as TraitType[]
  }

  return [
    { name: 'Scene', value: 'Home' },
    { name: 'Cloth', value: 'None' },
    { name: 'Food', value: 'None' },
    { name: 'Action', value: 'None' },
  ]
}

export function setTargetTraits(
  id: string,
  traitName: string,
  traitValue: string
) {
  const traits = getTargetTraits(id)
  traits.map((trait) => {
    if (trait.name === traitName) {
      trait.value = traitValue
    }
  })

  window.localStorage.setItem(id + '_traits', JSON.stringify(traits))
  return traits
}
