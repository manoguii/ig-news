interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  return (
    <button
      type="button"
      className="mt-10 flex h-14 items-center justify-between rounded-lg bg-yellow-500 px-16 py-8 font-bold text-gray-background transition-colors hover:bg-yellow-400"
    >
      Subscribe now
    </button>
  )
}
