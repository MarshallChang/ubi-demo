export type TraitProps = {
  text: string
  value: string
}

export default function Trait({ text, value }: TraitProps) {
  return (
    <div className='trait-wrapper'>
      <button className='button' data-text='Awesome'>
        <div className='actual-text'>
          {text}:&nbsp;{value}
        </div>
        <div aria-hidden='true' className='front-text'>
          {text}:&nbsp;{value}
        </div>
      </button>
    </div>
  )
}
