export type NftPropsType = {
  imgSrc: string
  name: string
  tokenAddr: string
  holdings: number
  onClick: () => void
}

export default function Nfts({
  imgSrc,
  name,
  tokenAddr,
  holdings,
  onClick,
}: NftPropsType) {
  return (
    <div className='max-w-[320px] rounded-2xl bg-slate-700 p-4 mb-6'>
      <div className=' flex flex-row items-start gap-4'>
        <div className='h-24 w-24 rounded-lg bg-violet-500'>
          <img className='w-full h-full' src={imgSrc} alt='' />
        </div>
        <div className='h-24 flex-1 flex flex-col justify-between'>
          <div>
            <p className='text-xl font-medium text-white'>{name}</p>
            <p className='text-xs text-gray-400'>{tokenAddr}</p>
          </div>
          <div className='w-full rounded-lg bg-white p-2 flex items-center justify-between text-base text-black'>
            <div className=' text-black'>Total:</div>
            <div className='font-bold text-indigo-700'>{holdings}</div>
          </div>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`mt-4 w-full bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-lg hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ${
          holdings === 0 ? 'pointer-events-none bg-gray-600' : ''
        } `}
      >
        <span className='bg-violet-400 shadow-violet-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]'></span>
        USE
      </button>
    </div>
  )
}
